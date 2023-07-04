import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'

import './index.css';
import App from './App';
import {updateSettings, updateAccessToken, updateApiReady} from "./redux/settings";

const onBeforeLift = () => {
  store.dispatch(updateApiReady(false))
  fetch('/config')
    .then(response => response.json())
    .then(data => store.dispatch(updateSettings(data)))

  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substr(1))
    const accessToken = params.get('access_token')
    if (accessToken) {
      store.dispatch(updateAccessToken(accessToken))
      window.location.hash = ''
    }
  }
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      onBeforeLift={onBeforeLift}
      persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
