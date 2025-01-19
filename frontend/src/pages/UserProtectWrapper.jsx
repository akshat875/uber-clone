import React, { useEffect, useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/user-login')
      return
    }

    // Fetch user profile if token exists but no user in context
    if (!user) {
      axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUser(response.data.user)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error fetching user profile:', error)
          localStorage.removeItem('token')
          navigate('/user-login')
        })
    } else {
      setIsLoading(false)
    }
  }, [user, navigate, setUser])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-2xl font-bold'>Loading...</div>
      </div>
    )
  }

  return children
}

export default UserProtectWrapper