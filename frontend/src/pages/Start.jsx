import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div 
        className='h-screen pt-8 flex justify-between flex-col w-full bg-cover bg-center'
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1554260570-83dc2f46ef79?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
      >
        <img 
          className='w-16 ml-8' 
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png" 
          alt="uber-logo" 
        />
        <div className="bg-white py-4 px-4 pb-7">
          <h2 className="text-2xl font-bold mb-4">Get Started with uber</h2>
          <Link 
            to="/user-login" 
            className="flex items-center justify-center w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-5"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start