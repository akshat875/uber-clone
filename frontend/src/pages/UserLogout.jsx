import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const UserLogout = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  useEffect(() => {
    
    localStorage.removeItem('token')
    setUser(null)
    
    navigate('/user-login')
  }, [navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  )
}

export default UserLogout