import api from "../twitch.api";
export const UPDATE_SETTINGS = 'SETTINGS/UPDATE_SETTINGS'
export const UPDATE_ACCESS_TOKEN = 'SETTINGS/UPDATE_ACCESS_TOKEN'
export const UPDATE_BROADCASTER_ID = 'SETTINGS/UPDATE_BROADCASTER_ID'
export const UPDATE_API_READY = 'SETTINGS/UPDATE_API_READY'

const initialState = {
  clientId: null,
  oauthUrl: null,
  accessToken: null,
  broadcasterId: null,
  apiReady: false
}

export const updateSettings = settings => ({ type: UPDATE_SETTINGS, payload: settings})
export const updateAccessToken = (accessToken) => ({ type: UPDATE_ACCESS_TOKEN, payload: {accessToken}})
export const updateBroadcasterId = broadcasterId => ({ type: UPDATE_BROADCASTER_ID, payload: broadcasterId})
export const updateApiReady = ready =>({type: UPDATE_API_READY, payload: ready})

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const {clientId, oauthUrl} = action.payload
      const newState = {
        ...state,
        clientId,
        oauthUrl
      }
      api.setSettings(newState)
      return newState
    }
    case UPDATE_ACCESS_TOKEN: {
      const {accessToken} = action.payload
      const newState = {
        ...state,
        accessToken
      }
      api.setSettings(newState)
      return newState
    }
    case UPDATE_BROADCASTER_ID: {
      const broadcasterId = action.payload
      api.setBroadcasterId(broadcasterId)
      return {
        ...state,
        broadcasterId
      }
    }
    case UPDATE_API_READY: {
      const ready = action.payload
      return {
        ...state,
        apiReady: ready
      }
    }
    default:
      return state
  }
}