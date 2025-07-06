import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/index.css'

import { Provider } from "react-redux";
import store from "./store.js";
import { AuthProvider } from './contexts/authContext.jsx';
import ThemeConfig from './styles/ThemeConfig.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ThemeConfig>
          <App />
        </ThemeConfig>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
