import React, { createContext, useState, useEffect } from 'react'

export const CaptainDataContext = createContext(null)

const CaptainContextProvider = ({ children }) => {
  const [captainData, setCaptainData] = useState(() => {
    const savedData = localStorage.getItem('captainData')
    return savedData ? JSON.parse(savedData) : null
  })

  useEffect(() => {
    if (captainData) {
      localStorage.setItem('captainData', JSON.stringify(captainData))
    }
  }, [captainData])

  return (
    <CaptainDataContext.Provider value={{ 
      captainData, 
      setCaptainData 
    }}>
      {children}
    </CaptainDataContext.Provider>
  )
}

export default CaptainContextProvider

