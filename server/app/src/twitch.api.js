import axios from 'axios'
import { ApiClient } from 'twitch'
import { StaticAuthProvider } from 'twitch-auth'
import { PubSubClient } from 'twitch-pubsub-client'
import { store } from './redux/store'
import {updateApiReady, updateBroadcasterId} from "./redux/settings";

const api = {
  REDEMPTION_STATUS_FULFILLED: 'FULFILLED',
  REDEMPTION_STATUS_UNFULFILLED: 'UNFULFILLED',
  REDEMPTION_STATUS_CANCELED: 'CANCELED',
  clientId: '',
  accessToken: '',
  broadcasterId: '',
  axios: null,
  apiClient: null,
  apiPubSubClient: null,
  setSettings: ({clientId, accessToken}) => {
    api.clientId = clientId
    api.accessToken = accessToken
    setTimeout(() => {
      api.createTwitchAxios()
    })
  },
  setBroadcasterId: (broadcasterId) => {
    api.broadcasterId = broadcasterId
  },
  createTwitchAxios: async () => {
    if (api.clientId && api.accessToken) {
      api.axios = axios.create({
        baseURL: 'https://api.twitch.tv/',
        headers: {
          common: {
            'Client-Id': api.clientId,
            'Authorization': 'Bearer ' + api.accessToken,
          }
        }
      })
      await api.getBroadcasterId()
        .then((data) => {
          store.dispatch(updateBroadcasterId(data.id))
        })
      const authProvider = new StaticAuthProvider(api.clientId, api.accessToken)
      api.apiClient = new ApiClient({authProvider})
      api.apiPubSubClient = new PubSubClient()
      api.apiPubSubClientUserId = await api.apiPubSubClient.registerUserListener(api.apiClient)
      store.dispatch(updateApiReady(true))
    } else {
      api.axios = null
      store.dispatch(updateApiReady(false))
    }
  },
  getBroadcasterId: () => {
    return api.axios.get('/helix/users')
      .then((response) => {
        return response.data.data[0]
      })
  },
  getCustomRewards: () => {
    return api.axios.get('/helix/channel_points/custom_rewards?only_manageable_rewards=true&broadcaster_id=' + api.broadcasterId)
      .then((response) => {
        return response.data.data
      })
  },
  createCustomRewards: (title, prompt, cost, background_color, cooldown, is_enabled) => {
    return api.axios.post('/helix/channel_points/custom_rewards?broadcaster_id=' + api.broadcasterId, {
      title,
      prompt,
      cost,
      background_color,
      is_global_cooldown_enabled: cooldown ? true : false,
      global_cooldown_seconds: cooldown ? cooldown : 0,
      is_enabled
    })
      .then((response) => {
        return response.data.data[0]
      })
  },
  updateCustomRewards: (id, title, prompt, cost, background_color, cooldown, is_enabled) => {
    return api.axios.patch('/helix/channel_points/custom_rewards?id=' + id + '&broadcaster_id=' + api.broadcasterId, {
      title,
      prompt,
      cost,
      background_color,
      is_global_cooldown_enabled: cooldown ? true : false,
      global_cooldown_seconds: cooldown ? cooldown : 0,
      is_enabled
    })
  },
  getCustomRewardsRedemption: (rewardId) => {
    return api.axios.get('/helix/channel_points/custom_rewards/redemptions?status=' + api.REDEMPTION_STATUS_UNFULFILLED + '&reward_id=' + rewardId + '&broadcaster_id=' + api.broadcasterId)
      .then((response) => {
        return response.data.data
      })
  },
  updateCustomRewardsRedemptionStatus: (id, rewardId, status) => {
    return api.axios.patch('/helix/channel_points/custom_rewards/redemptions?id=' + id + '&reward_id=' + rewardId + '&broadcaster_id=' + api.broadcasterId, {
      status
    })
  },
}

export default api