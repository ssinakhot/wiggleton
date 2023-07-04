import React from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import api from '../../twitch.api'
import {PubSubRedemptionMessage} from "twitch-pubsub-client";

const mapStateToProps = (state, props) => {
  return {
    games: state.channelRewards.games,
  }
}

const mapDispatchToProps = {
}

function runRedemption(redemptionId, rewardId, gameName, command) {
  return fetch("/redemption?id=" + encodeURIComponent(redemptionId) + "&game=" + encodeURIComponent(gameName) + "&command=" + encodeURIComponent(command))
    .then((response) => {
      if (response.status === 200) {
        api.updateCustomRewardsRedemptionStatus(redemptionId, rewardId, api.REDEMPTION_STATUS_FULFILLED)
        return true
      }
      api.updateCustomRewardsRedemptionStatus(redemptionId, rewardId, api.REDEMPTION_STATUS_CANCELED)
      return false
    })
    .catch((error) => {
      console.error(error)
      api.updateCustomRewardsRedemptionStatus(redemptionId, rewardId, api.REDEMPTION_STATUS_CANCELED)
      return false
    })
}


function Redemption({games}) {
  const [redemptionHistory, setRedemptionHistory] = React.useState([])

  React.useEffect(() => {
    let listener = null
    const setup = async () => {
      listener = await api.apiPubSubClient.onRedemption(api.apiPubSubClientUserId, async (message: PubSubRedemptionMessage) => {
        const newRedemption = {
          message: message,
          reward: null,
        }
        for (const gameName in games) {
          const rewards = games[gameName]
          for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i]
            if (reward.twitchId === message.rewardId) {
              const runRedemptionSuccessful = await runRedemption(message.id, message.rewardId, gameName, reward.command)
              newRedemption.reward = reward
              newRedemption.runRedemptionSuccessful = runRedemptionSuccessful
              break
            }
          }
        }
        const newRedemptionHistory = [newRedemption, ...redemptionHistory]
        setRedemptionHistory(newRedemptionHistory)
      })
    }
    setup()

    return () => {
      if (listener) {
        listener.remove()
      }
    }
  });

  return <div>
    <div style={{margin:"10px"}}>
      <Button variant="outlined" onClick={() => setRedemptionHistory([])}>Clear</Button>
      <br/><br/>
      {
        redemptionHistory.map(redemption => {
          return <div key={redemption.message.id} style={
            { backgroundColor: redemption.reward ? (redemption.runRedemptionSuccessful ? "lightblue" : "lightpink") : "", padding:"10px"}
          }>
            {redemption.message.redemptionDate.toLocaleString()} | {redemption.message.userDisplayName} redeemed {redemption.message.rewardName}
          </div>
        })
      }
    </div>
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(Redemption)