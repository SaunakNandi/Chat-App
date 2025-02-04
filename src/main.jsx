import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {CssBaseline} from '@mui/material'
import {HelmetProvider} from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <CssBaseline />
        {/* now on the whole app you can't do a right click. Right click only respond when you click on the ChatItem as you have used onContextMenu */}
        <div onContextMenu={e=>e.preventDefault()}>
          <App />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
)
