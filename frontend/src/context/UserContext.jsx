import React, { createContext, useState } from 'react'

// Export both context and provider
export const UserContext = createContext(null)

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState({
    email: '',
    fullName: {
      firstName: '',
      lastName: ''
    }
  })

  return (
    <UserContext.Provider value={{ user, setUser, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider