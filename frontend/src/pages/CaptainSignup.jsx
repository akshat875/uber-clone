import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainSignup = () => {
  const navigate = useNavigate()
  const { captainData, setCaptainData } = useContext(CaptainDataContext)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    vehicle: {
      vehicleColor: '',
      vehiclePlate: '',
      vehicleCapacity: '',
      vehicleType: ''
    }
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('vehicle')) {
      setFormData({
        ...formData,
        vehicle: {
          ...formData.vehicle,
          [name]: value
        }
      })
      setErrors({
        ...errors,
        vehicle: {
          ...errors.vehicle,
          [name]: ''
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    
    const newCaptain = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      vehicle: {
        color: formData.vehicle.vehicleColor,
        plate: formData.vehicle.vehiclePlate,
        capacity: formData.vehicle.vehicleCapacity,
        vehicleType: formData.vehicle.vehicleType.toLowerCase()
      }
    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptain)
      if (response.status === 201) {
        const data = response.data
        setCaptainData(data.captain)
        localStorage.setItem('captainToken', data.token)
        navigate('/captain-dashboard')
      }
    } catch (error) {
      console.log('Full error response:', error.response?.data)
      console.log('Validation errors:', error.response?.data?.errors)
      
      let serverErrors = {}
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          console.log('Processing error:', err)
          if (err.path.startsWith('vehicle.')) {
            const vehicleField = err.path.split('.')[1]
            const fieldMapping = {
              color: 'vehicleColor',
              plate: 'vehiclePlate',
              capacity: 'vehicleCapacity',
              vehicleType: 'vehicleType'
            }
            serverErrors.vehicle = {
              ...serverErrors.vehicle,
              [fieldMapping[vehicleField] || vehicleField]: err.msg
            }
          } else {
            serverErrors[err.path] = err.msg
          }
        })
        setErrors(serverErrors)
      } else {
        serverErrors = { general: 'An error occurred during signup. Please try again.' }
        setErrors(serverErrors)
      }
      console.error('Final processed errors:', serverErrors)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">SignUp as Captain</h2>
        
        {errors.general && (
          <div className="mb-4 p-2 text-red-500 bg-red-50 rounded border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                  errors.firstname ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                  errors.lastname ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                errors.email ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleColor">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicle.vehicleColor}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                    errors.vehicle?.vehicleColor ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.vehicle?.vehicleColor && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicle.vehicleColor}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehiclePlate">
                  Vehicle Plate
                </label>
                <input
                  type="text"
                  name="vehiclePlate"
                  value={formData.vehicle.vehiclePlate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                    errors.vehicle?.vehiclePlate ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.vehicle?.vehiclePlate && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicle.vehiclePlate}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleCapacity">
                  Vehicle Capacity
                </label>
                <input
                  type="number"
                  name="vehicleCapacity"
                  value={formData.vehicle.vehicleCapacity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                    errors.vehicle?.vehicleCapacity ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.vehicle?.vehicleCapacity && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicle.vehicleCapacity}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleType">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicle.vehicleType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black ${
                    errors.vehicle?.vehicleType ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="auto">Auto</option>
                </select>
                {errors.vehicle?.vehicleType && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicle.vehicleType}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/captain-login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup