import React, { createContext, useState, useEffect } from 'react'

// Export both context and provider
export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      const token = localStorage.getItem('userToken')
      const savedUser = localStorage.getItem('userData')
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        } catch (error) {
          console.error('Error parsing saved user data:', error)
          localStorage.removeItem('userData')
          localStorage.removeItem('userToken')
        }
      }
    }

    loadUserData()
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user))
    } else {
      localStorage.removeItem('userData')
    }
  }, [user])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider