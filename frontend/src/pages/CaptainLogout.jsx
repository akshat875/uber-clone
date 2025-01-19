import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainLogout = () => {
  const navigate = useNavigate()
  const { setCaptainData } = useContext(CaptainDataContext)

  useEffect(() => {
    // Clear captain data from context and localStorage
    localStorage.removeItem('captainToken')
    localStorage.removeItem('captainData')
    setCaptainData(null)
    
    navigate('/captain-login')
  }, [navigate, setCaptainData])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  )
}

export default CaptainLogout 