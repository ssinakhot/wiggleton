import api from "../twitch.api";

export const ADD_GAME = 'CHANNEL_REWARDS/ADD_GAME'
export const REMOVE_GAME = 'CHANNEL_REWARDS/REMOVE_GAME'
export const SET_ACTIVE_GAME = 'CHANNEL_REWARDS/SET_ACTIVE_GAME'
export const ADD_REWARD = 'CHANNEL_REWARDS/ADD_REWARD'
export const EDIT_REWARD = 'CHANNEL_REWARDS/EDIT_REWARD'
export const UPDATE_REWARD_TWITCH_ID = 'CHANNEL_REWARDS/UPDATE_REWARD_TWITCH_ID'
export const DELETE_REWARD = 'CHANNEL_REWARDS/DELETE_REWARD'
export const ENABLE_ON_TWITCH = 'CHANNEL_REWARDS/ENABLE_ON_TWITCH'
export const DISABLE_ON_TWITCH = 'CHANNEL_REWARDS/DISABLE_ON_TWITCH'

const initialState = {
  games: { },
  activeGame: null,
}

export const addGame = (game) => ({ type: ADD_GAME, payload: { game }})
export const removeGame = (game) => ({ type: REMOVE_GAME, payload: { game }})
export const setActiveGame = (game) => ({ type: SET_ACTIVE_GAME, payload: { game }})
export const addReward = (game, title, prompt, cost, backgroundColor, cooldown, command) => ({ type: ADD_REWARD, payload: { game, title, prompt, cost, backgroundColor, cooldown, command }})
export const editReward = (game, id, title, prompt, cost, backgroundColor, cooldown, command) => ({ type: EDIT_REWARD, payload: { game, id, title, prompt, cost, backgroundColor, cooldown, command }})
export const updateRewardTwitchId = (game, id, twitchId) => ({ type: UPDATE_REWARD_TWITCH_ID, payload: { game, id, twitchId }})
export const deleteReward = (game, id) => ({ type: DELETE_REWARD, payload: { game, id }})
export const enableOnTwitch = (game, updateRewardTwitchId) => ({ type: ENABLE_ON_TWITCH, payload: { game, updateRewardTwitchId }})
export const disableOnTwitch = (game, updateRewardTwitchId) => ({ type: DISABLE_ON_TWITCH, payload: { game,updateRewardTwitchId }})

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_GAME: {
      const {game} = action.payload
      return {
        ...state,
        activeGame: game,
        games: {
          ...state.games,
          [game]: [],
        }
      }
    }
    case REMOVE_GAME: {
      const {game} = action.payload
      const games = {...state.games};
      delete games[game]
      return {
        ...state,
        activeGame: null,
        games
      }
    }
    case SET_ACTIVE_GAME: {
      const {game} = action.payload
      return {
        ...state,
        activeGame: game
      }
    }
    case ADD_REWARD: {
      const {game, title, prompt, cost, backgroundColor, cooldown, command} = action.payload
      return {
        ...state,
        games: {
          ...state.games,
          [game]: [
            ...state.games[game],
            {id: state.games[game] ? state.games[game].length + 1 : 1, title, prompt, cost, backgroundColor, cooldown, command}
          ]
        }
      }
    }
    case EDIT_REWARD: {
      const {game, id, title, prompt, cost, backgroundColor, cooldown, command} = action.payload
      const gameList = state.games[game]
      for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].id === id) {
          gameList[i].title = title
          gameList[i].prompt = prompt
          gameList[i].cost = cost
          gameList[i].backgroundColor = backgroundColor
          gameList[i].cooldown = cooldown
          gameList[i].command = command
          break
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: gameList
        }
      }
    }
    case DELETE_REWARD: {
      const {game, id} = action.payload
      const gameList = state.games[game]
      const newRewardList = []
      let newRewardListIndex = 1
      for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].id === id) {
          continue
        }
        gameList[i].id = newRewardListIndex++
        newRewardList.push(gameList[i])
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: newRewardList
        }
      }
    }
    case UPDATE_REWARD_TWITCH_ID: {
      const {game, id, twitchId} = action.payload
      const gameList = state.games[game]
      for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].id === id) {
          gameList[i].twitchId = twitchId
          break
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: gameList
        }
      }
    }
    case ENABLE_ON_TWITCH: {
      const {game, updateRewardTwitchId} = action.payload
      const rewardList = state.games[game]
      for (let i = 0; i < rewardList.length; i++) {
        const reward = rewardList[i]
        rewardList[i].enabled = true
        if (reward.twitchId) {
          api.updateCustomRewards(reward.twitchId, reward.title, reward.prompt, reward.cost, reward.backgroundColor, reward.cooldown, true)
        } else {
          api.createCustomRewards(reward.title, reward.prompt, reward.cost, reward.backgroundColor, reward.cooldown, true)
            .then((data) => {
              updateRewardTwitchId(game, reward.id, data.id)
            })
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: rewardList
        }
      }
    }
    case DISABLE_ON_TWITCH: {
      const {game, updateRewardTwitchId} = action.payload
      const rewardList = state.games[game]
      for (let i = 0; i < rewardList.length; i++) {
        const reward = rewardList[i]
        rewardList[i].enabled = false
        if (reward.twitchId) {
          api.updateCustomRewards(reward.twitchId, reward.title, reward.prompt, reward.cost, reward.backgroundColor, reward.cooldown, false)
        } else {
          api.createCustomRewards(reward.title, reward.prompt, reward.cost, reward.backgroundColor, reward.cooldown, false)
            .then((data) => {
              updateRewardTwitchId(game, reward.id, data.id)
            })
        }
      }
      return {
        ...state,
        games: {
          ...state.games,
          [game]: rewardList
        }
      }
    }
    default: {
      return state
    }
  }
}