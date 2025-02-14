import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainLogin = () => {
  const navigate = useNavigate()
  const { setCaptainData } = useContext(CaptainDataContext)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      // Using direct URL for debugging
      const baseUrl = 'http://localhost:4000';
      const loginUrl = `${baseUrl}/api/captains/login`;
      console.log('Attempting login with URL:', loginUrl);
      
      const response = await axios.post(loginUrl, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      if (response.status === 200) {
        const data = response.data
        localStorage.setItem('captainToken', data.token)
        setCaptainData(data.captain)
        
        setTimeout(() => {
          navigate('/captain-dashboard', { replace: true })
        }, 100)
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className='h-screen bg-gray-50 p-7 justify-between flex flex-col w-full'>
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-md'>
        <div className='p-6'>
          <img 
            className='w-16 mb-10 cursor-pointer' 
            src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png" 
            alt="uber-logo"
            onClick={() => navigate('/')}
          />
          {error && (
            <div className="mb-4 p-2 text-red-500 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <h3 className='text-lg mb-2 font-medium'>Captain Email</h3>
            <input
              className='border-2 mb-4 border-gray-300 rounded-md px-4 py-2 bg-gray-50 w-full text-lg placeholder:text-sm'
              required 
              type="email" 
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <h3 className='text-lg font-medium'>Enter Password</h3>
            <input
              className='border-2 mb-4 border-gray-300 rounded-md px-4 py-2 bg-gray-50 w-full text-lg placeholder:text-sm'
              required 
              type="password" 
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              className='bg-black mb-4 text-white w-full px-4 py-2 rounded hover:bg-gray-800 mt-5 transition-colors duration-300'
              type="submit"
            >
              Login
            </button>
            <p className='text-center text-gray-600'>
              New Here? <Link to="/captain-signup" className='text-blue-600 hover:text-blue-800'>Create new account for captain</Link>
            </p>
          </form>
        </div>
        <div className='px-6 pb-6'>
          <Link
            to="/user-login"
            className='bg-[#10b461] flex justify-center items-center text-white w-full px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300'
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin