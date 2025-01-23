import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import Start from './pages/Start'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import { UserContext } from './context/userContext'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainDashboard from './pages/CaptainDashboard'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import FinishRidePage from './pages/FinishRide'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/riding" element={<Riding />} />
      <Route path="/captain-riding" element={<CaptainRiding />} />
      <Route path="/home" element={
        <UserProtectWrapper>
          <Home />
        </UserProtectWrapper>
      } />
      <Route path="/user/logout" element={<UserLogout />} />
      <Route path="/captain-dashboard" element={
        <CaptainProtectWrapper>
          <CaptainDashboard />
        </CaptainProtectWrapper>
      } />
      <Route path="/captain/logout" element={<CaptainLogout />} />
      <Route path="/finish-ride" element={<FinishRidePage />} />
    </Routes>
  )
}

export default App