import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { store } from '../src/store/store.js';
import { Provider } from 'react-redux';
import { ViewProvider } from './Components/Context/ViewProvider.jsx';
import { SocketProvider } from './Socketcontext.jsx';

ReactDOM.render(
  <Provider store={store}>
    <ViewProvider>
      <SocketProvider>
      <App />
      </SocketProvider>
      </ViewProvider>
  </Provider>,
  document.getElementById('root')
);
