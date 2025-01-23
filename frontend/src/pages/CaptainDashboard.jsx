import React, { useRef, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { gsap } from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'




const CaptainDashboard = () => {
    const navigate = useNavigate()
    const { captainData, setCaptainData } = useContext(CaptainDataContext)
    const { socket, isConnected } = useContext(SocketContext)
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const ridePopupPanelRef = useRef(null)
    const [ride, setRide] = useState(null)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

    const { captain} = useContext(CaptainDataContext)

    useEffect(() => {
        socket.emit('join', {
            userId: captainData._id,
            userType: 'captain'
        })
    })
    


    const handleLogout = () => {
        localStorage.removeItem('captainToken')
        localStorage.removeItem('captainData')
        setCaptainData(null)
        navigate('/captain-login', { replace: true })
    }

    useEffect(() => {
        if (!captainData) {
            navigate('/captain-login')
            return
        }

        if (socket && isConnected) {
            socket.emit('join', {
                userId: captainData._id,
                userType: 'captain'
            })
        }
    }, [captainData, navigate, socket, isConnected])

    useEffect(() => {
        if (socket) {
            socket.on('new_ride_request', (rideData) => {
                setRide(rideData)
                setRidePopupPanel(true)
                gsap.to(ridePopupPanelRef.current, {
                    y: '0%',
                    duration: 0.5,
                    ease: 'power3.out'
                })
            })
        }
    }, [socket])

    return (
        <div className="relative">
            <div className='h-screen'>
                <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                    <img className='w-16' 
                        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
                        alt="uber-logo" 
                    />
                    <button
                        onClick={handleLogout}
                        className='h-10 w-10 bg-white flex items-center justify-center rounded-full'
                    >
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </button>
                </div>
                <div className='h-3/5'>
                    <img 
                        className='h-full w-full object-cover' 
                        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
                        alt="map" 
                    />
                </div>
                <div className='h-2/5 p-6'>
                    <CaptainDetails />
                </div>
            </div>

            <div 
                ref={ridePopupPanelRef} 
                className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-2xl shadow-lg'
            >
                {ride && !confirmRidePopupPanel && (
                    <RidePopUp
                        ride={ride}
                        setRidePopupPanel={setRidePopupPanel}
                        ridePopupPanelRef={ridePopupPanelRef}
                        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                        confirmRide={() => {
                            // Handle ride confirmation logic here
                            console.log('Ride confirmed')
                        }}
                    />
                )}
                {ride && confirmRidePopupPanel && (
                    <ConfirmRidePopUp
                        ride={ride}
                        setRidePopupPanel={setRidePopupPanel}
                        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                        ridePopupPanelRef={ridePopupPanelRef}
                    />
                )}
            </div>
        </div>
    )
}

export default CaptainDashboard