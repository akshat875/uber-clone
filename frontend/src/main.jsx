import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/UserContext'
import CaptainContextProvider from './context/CaptainContext'
import SocketContextProvider from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketContextProvider>
      <CaptainContextProvider>
        <UserContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContextProvider>
      </CaptainContextProvider>
    </SocketContextProvider>
  </StrictMode>
)
