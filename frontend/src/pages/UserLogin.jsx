import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import axios from 'axios'

const UserLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { setUser } = useContext(UserContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const baseUrl = 'http://localhost:4000'
      const loginUrl = `${baseUrl}/api/users/login`
      console.log('Attempting login with URL:', loginUrl)
      
      const response = await axios.post(loginUrl, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      
      if (response.status === 200 && response.data) {
        console.log('Login successful:', response.data)
        localStorage.setItem('userToken', response.data.token)
        setUser(response.data.user)
        
        // Small delay to ensure context is updated
        setTimeout(() => {
          navigate('/home', { replace: true })
        }, 100)
      } else {
        setError('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
          <form onSubmit={handleSubmit}>
            <h3 className='text-lg mb-2 font-medium'>What's your email?</h3>
            <input
              className='border-2 mb-4 border-gray-300 rounded-md px-4 py-2 bg-gray-50 w-full text-lg placeholder:text-sm'
              required 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            
            <h3 className='text-lg mb-2 font-medium'>Enter your password</h3>
            <input
              className='border-2 mb-4 border-gray-300 rounded-md px-4 py-2 bg-gray-50 w-full text-lg placeholder:text-sm'
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}

            <button 
              type="submit"
              className='bg-black text-white w-full py-3 rounded-lg text-lg font-medium hover:bg-gray-800'
            >
              Next
            </button>
          </form>

          <div className='mt-4 text-center'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <Link to="/user-signup" className='text-black font-medium'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin