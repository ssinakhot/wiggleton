package main

import (
	"github.com/joho/godotenv"
	"github.com/urfave/cli/v2"
	"log"
	"os"
	"wiggleton/server"
	"wiggleton/server/common"
)

const title = "Wiggleton Extension Server"

func main() {
	_ = godotenv.Load()

	app := &cli.App{
		Name:  title,
		Usage: "",
		Action: func(c *cli.Context) error {
			log.Println(title)
			server.RunServer()
			return nil
		},
		Flags: common.ConfigFlags,
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
