import React, { useEffect, useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken')
      if (!token) {
        console.log('No token found, redirecting to login')
        setIsLoading(false)
        navigate('/user-login')
        return
      }

      try {
        // If we already have user data, no need to verify
        if (user && user._id) {
          console.log('User already in context:', user)
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        console.log('Verifying token...')
        const response = await axios.get('http://localhost:4000/api/users/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        })

        if (response.data && response.data.user) {
          console.log('Token verified, user:', response.data.user)
          setUser(response.data.user)
          setIsAuthenticated(true)
        } else {
          console.error('No user data in verify response')
          throw new Error('Invalid response from server')
        }
      } catch (error) {
        console.error('Auth error:', error)
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
        setUser(null)
        navigate('/user-login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate, setUser, user])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-2xl font-bold'>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}

export default UserProtectWrapper