import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ConfigProvider } from 'antd';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        // hashed: true,
        token: {
          colorPrimary: '#425f6d',
          fontFamily: 'Outfit, sans-serif',
        },
        components: {
          Button: {
            boxShadow: 'none',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
