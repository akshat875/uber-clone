import React, { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext()

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      path: '/socket.io'
    })

    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      if (newSocket) {
        console.log('Cleaning up socket connection')
        newSocket.disconnect()
      }
    }
  }, [])

  const sendMessage = (event, data) => {
    if (socket && isConnected) {
      console.log('Sending message:', event, data)
      socket.emit(event, data)
    } else {
      console.error('Socket not connected')
    }
  }

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContextProvider