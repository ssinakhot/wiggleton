package server

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"wiggleton/server/common"
)

func RunServer() {
	e := echo.New()
	e.HideBanner = true

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Skipper: nil,
		Root:    "./server/app/build",
		Index:   "index.html",
		HTML5:   true,
		Browse:  false,
	}))

	setupRoutes(e)

	e.Logger.Fatal(e.Start(":" + common.Config.Port))
}

func setupRoutes(e *echo.Echo) {
	e.GET("/config", getConfig)
	e.GET("/redemption", createRedemption)
}

func getConfig(c echo.Context) error {
	const scope = "channel:manage:redemptions bits:read channel:read:redemptions"
	href := fmt.Sprintf("https://id.twitch.tv/oauth2/authorize?client_id=%s&redirect_uri=%s&response_type=token&scope=%s", common.Config.ClientId, common.Config.RedirectUrl, url.PathEscape(scope))
	return c.JSON(http.StatusOK, map[string]interface{}{"oauthUrl": href, "clientId": common.Config.ClientId})
}

func createRedemption(c echo.Context) error {
	redemptionId := c.QueryParam("id")
	game := c.QueryParam("game")
	command := c.QueryParam("command")
	redemptionDirectories := strings.Split(common.Config.RedemptionDirectory, "|")
	for _, directory := range redemptionDirectories {
		os.MkdirAll(directory+game, 0777)
		fileName := directory + game + "\\" + redemptionId
		err := ioutil.WriteFile(fileName+".txt.lock", []byte(command), 0777)
		os.Rename(fileName+".txt.lock", fileName+".txt")
		if err != nil {
			log.Println("error createRedemption:", err)
			return c.NoContent(http.StatusInternalServerError)
		}
	}
	return c.NoContent(http.StatusOK)
}
