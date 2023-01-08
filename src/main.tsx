import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-wrap-balancer'

import App from './App'
import './global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
)
