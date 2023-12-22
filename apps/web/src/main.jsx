import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import globalState from './redux/index.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wahyu Widiantoro */}
    <Provider store={globalState}>
      <App />
    </Provider>
    {/* Wahyu Widiantoro */}
  </React.StrictMode>,
);
