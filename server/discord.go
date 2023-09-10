package server

import (
	"context"
	"fmt"
	"github.com/andersfylling/disgord"
	"github.com/andersfylling/disgord/std"
	"github.com/sashabaranov/go-openai"
	"github.com/sirupsen/logrus"
	"os"
	"strings"
	"wiggleton/server/common"
)

var log = &logrus.Logger{
	Out:       os.Stderr,
	Formatter: new(logrus.TextFormatter),
	Hooks:     make(logrus.LevelHooks),
	Level:     logrus.InfoLevel,
}

var aiClient *openai.Client

func startDisgordBot() {
	aiClient = openai.NewClient(common.Config.OpenAIToken)

	client := disgord.New(disgord.Config{
		BotToken: common.Config.DisgordToken,
		Logger:   log,
		Intents:  disgord.IntentGuildMessages,
	})
	client.Gateway().Connect()
	err := client.UpdateStatus(&disgord.UpdateStatusPayload{
		Game: &disgord.Activity{
			Name: "Bringing GPT 4 to you...",
		},
	})
	checkErr(err, "UpdateStatus")

	logFilter, _ := std.NewLogFilter(client)
	filter, _ := std.NewMsgFilter(context.Background(), client)

	// create a handler and bind it to new message events
	// thing about the middlewares are whitelists or passthrough functions.
	client.Gateway().WithMiddleware(
		filter.NotByBot, // ignore bot messages
		filter.HasBotMentionPrefix,
		logFilter.LogMsg, // log command message
	).MessageCreate(handleMsg)

	// create a handler and bind it to the bot init
	// dummy log print
	client.Gateway().BotReady(func() {
		log.Info("Bot is ready!")
	})
}

// handleMsg is a basic command handler
func handleMsg(s disgord.Session, data *disgord.MessageCreate) {
	msg := data.Message
	if data.Message.ChannelID.String() != common.Config.BotChannelId {
		log.Info("Skipping handler because wrong channel id (" + data.Message.ChannelID.String() + ")")
		return
	}

	usr, _ := s.CurrentUser().WithContext(context.Background()).Get()
	mentionTypeA := "<@" + usr.ID.String() + ">"
	mentionTypeB := "<@!" + usr.ID.String() + ">"
	msg.Content = strings.ReplaceAll(msg.Content, mentionTypeA, "")
	msg.Content = strings.ReplaceAll(msg.Content, mentionTypeB, "")
	msg.Content = strings.Trim(msg.Content, " ")

	switch msg.Content {
	case "ping": // whenever the message written is "ping", the bot replies "pong"
		_, err := msg.Reply(context.Background(), s, "pong")
		checkErr(err, "ping command")
	default:
		resp, err := aiClient.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model: openai.GPT4,
				Messages: []openai.ChatCompletionMessage{
					{
						Role:    openai.ChatMessageRoleSystem,
						Content: "You are a discord bot named Wiggleton. You are the greatest entertainer in the world.",
					},
					{
						Role:    openai.ChatMessageRoleUser,
						Content: msg.Member.Nick + " says the following message\n" + msg.Content + "",
					},
				},
			},
		)
		if err != nil {
			log.Error("ChatCompletion error: %v\n", err)
			return
		}

		log.Info("ChatCompletion Content: " + resp.Choices[0].Message.Content)
		log.Info("ChatCompletion Role: " + resp.Choices[0].Message.Role)
		log.Info("ChatCompletion Usage:" + fmt.Sprintf("%+v", resp.Usage))
		_, err = msg.Reply(context.Background(), s, resp.Choices[0].Message.Content)
		checkErr(err, "ChatCompletion command")
		return
	}
}

// checkErr logs errors if not nil, along with a user-specified trace
func checkErr(err error, trace string) {
	if err != nil {
		log.WithFields(logrus.Fields{
			"trace": trace,
		}).Error(err)
	}
}
