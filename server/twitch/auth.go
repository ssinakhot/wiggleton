package twitch

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"wiggleton/server/common"
)

type TwitchToken struct {
	AccessToken  string   `json:"access_token"`
	RefreshToken string   `json:"refresh_token"`
	ExpiresIn    int      `json:"expires_in"`
	Scope        []string `json:"scope"`
	TokenType    string   `json:"token_type"`
}

type TwitchUser struct {

}

func (helix *Helix) GetTwitchToken(code string) (*TwitchToken, error) {
	url := fmt.Sprintf("https://id.twitch.tv/oauth2/token?client_id=%s&client_secret=%s&code=%s&grant_type=authorization_code&redirect_uri=%s", common.Config.ClientId, common.Config.ClientSecret, code, common.Config.RedirectUrl)
	resp, err := http.PostForm(url, map[string][]string{})
	if err != nil {
		return nil, errors.New("Failed to request token:\n" + err.Error())
	}

	body, err := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		return nil, errors.New("Failed to read body stream:\n" + err.Error())
	}

	var twitchToken TwitchToken
	err = json.Unmarshal(body, &twitchToken)
	if err != nil {
		return nil, errors.New("Failed to read body stream:\n" + err.Error())
	}
	helix.BearerToken = twitchToken.AccessToken
	return &twitchToken, nil
}
