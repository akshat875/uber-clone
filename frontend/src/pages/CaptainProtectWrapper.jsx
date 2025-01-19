import React, { useEffect, useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate()
  const { captain, setCaptainData } = useContext(CaptainDataContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const captainToken = localStorage.getItem('captainToken')
    if (!captainToken) {
      navigate('/captain-login')
      return
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
      headers: {
        Authorization: `Bearer ${captainToken}`
      }
    }).then((response) => {
      setCaptainData(response.data.captain)
      setIsLoading(false)
    }).catch((error) => {
      console.error('Error fetching captain profile:', error)
      localStorage.removeItem('captainToken')
      navigate('/captain-login')
    })
  }, [navigate, setCaptainData])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-2xl font-bold'>Loading...</div>
      </div>
    )
  }

  return children
}

export default CaptainProtectWrapper 