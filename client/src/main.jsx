import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CacheProvider } from './contexts/CacheContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CacheProvider>
        <App />
      </CacheProvider>
    </BrowserRouter>
  </StrictMode>,
)
