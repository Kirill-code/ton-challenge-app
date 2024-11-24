/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import '@fontsource/inter'; // Defaults to weight 400

const manifestUrl = 'https://storage.yandexcloud.net/start-image/manifest.json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>

      <App />
    </TonConnectUIProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
