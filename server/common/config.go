package common

import "github.com/urfave/cli/v2"

type AppConfig struct {
	Port                string
	ClientId            string
	ClientSecret        string
	RedirectUrl         string
	RedemptionDirectory string
	DisgordToken        string
	BotChannelId        string
	OpenAIToken         string
}

func (*AppConfig) Init() {

}

var Config = AppConfig{}

var ConfigFlags = []cli.Flag{
	&cli.StringFlag{
		Name:        "port",
		Aliases:     []string{"p"},
		EnvVars:     []string{"SERVER_PORT"},
		Required:    true,
		Destination: &Config.Port,
	},
	&cli.StringFlag{
		Name:        "client-id",
		EnvVars:     []string{"CLIENT_ID"},
		Required:    true,
		Destination: &Config.ClientId,
	},
	&cli.StringFlag{
		Name:        "client-secret",
		EnvVars:     []string{"CLIENT_SECRET"},
		Required:    true,
		Destination: &Config.ClientSecret,
	},
	&cli.StringFlag{
		Name:        "redirect-url",
		EnvVars:     []string{"REDIRECT_URL"},
		Required:    true,
		Destination: &Config.RedirectUrl,
	},
	&cli.StringFlag{
		Name:        "redemption-directory",
		EnvVars:     []string{"REDEMPTION_DIRECTORY"},
		Required:    true,
		Destination: &Config.RedemptionDirectory,
	},
	&cli.StringFlag{
		Name:        "disgord-token",
		EnvVars:     []string{"DISGORD_TOKEN"},
		Required:    true,
		Destination: &Config.DisgordToken,
	},
	&cli.StringFlag{
		Name:        "bot-channel-id",
		EnvVars:     []string{"BOT_CHANNEL_ID"},
		Required:    true,
		Destination: &Config.BotChannelId,
	},
	&cli.StringFlag{
		Name:        "openai-token",
		EnvVars:     []string{"OPENAI_TOKEN"},
		Required:    true,
		Destination: &Config.OpenAIToken,
	},
}
