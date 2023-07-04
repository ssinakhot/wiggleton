import {createStore} from 'redux'
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import rootReducer from './index'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['settings']
}

export const store = createStore(
  persistReducer(persistConfig, rootReducer),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export const persistor = persistStore(store)