import React from 'react'
import {useGSAP} from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState } from 'react'
import LocationSearchPanel from '../components/LocationSearchPanel'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [vehicleFoundRef] = useState(useRef(null))
    const [showLookingForDriver, setShowLookingForDriver] = useState(false)
    const [showWaitingForDriver, setShowWaitingForDriver] = useState(false)
    const formContainerRef = useRef(null)
    const searchPanelRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const [waitingForDriver, setWaitingForDriver] = useState(false)

    useGSAP(() => {
        if(panelOpen) {
            gsap.to(formContainerRef.current, {
                y: '0%',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                backgroundColor: 'white',
                zIndex: 40,
                padding: '20px',
                duration: 0.6,
                ease: 'power3.inOut',
                onComplete: () => {
                    gsap.to(searchPanelRef.current, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.3
                    })
                }
            })
        } else {
            if (!vehiclePanel && searchPanelRef.current && formContainerRef.current) {
                gsap.to(searchPanelRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3
                })

                gsap.to(formContainerRef.current, {
                    y: '100%',
                    duration: 0.6,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        gsap.set(formContainerRef.current, {
                            position: 'relative',
                            height: '30%',
                            width: '100%',
                            y: '0%',
                            clearProps: 'backgroundColor,zIndex,padding'
                        })
                    }
                })
            }
        }
    }, [panelOpen, vehiclePanel])
    useGSAP(() => {
        if(waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                y: '0%',
                duration: 0.5,
                ease: 'power3.inOut'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                y: '100%',
                duration: 0.5,
                ease: 'power3.inOut'
            })
        }
    }, [waitingForDriver])

    const handleInputClick = () => {
        if (!panelOpen) {
            setPanelOpen(true)
        }
    }

    const togglePanel = () => {
        if (!vehiclePanel) {
            setPanelOpen(false)
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute top-5 left-5 z-10' 
                src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png" 
                alt="uber-logo" 
            />
            
            <div className='absolute inset-0 z-0'>
                <img 
                    className='w-full h-full object-cover' 
                    src="https://simonpan.com/wp-content/themes/sp_portfolio/assets/uber-challenge.jpg" 
                    alt="background"
                />
            </div>

            <div className='absolute bottom-0 left-0 right-0 w-full p-5 z-10'>
                {!vehiclePanel && (
                    <div ref={formContainerRef} className='form-container h-[30%] p-5 bg-white rounded-t-lg shadow-lg transform'>
                        <div className="flex justify-between items-center mb-5">
                            <h4 className='text-2xl font-semibold'>Find a trip</h4>
                            <button 
                                onClick={togglePanel}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg 
                                    className="arrow-icon w-6 h-6 transform transition-transform"
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 15l7-7 7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className='line absolute h-16 w-1 top-[110px] left-10 bg-black rounded-full'></div>
                            <input
                                onClick={handleInputClick}
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                className='bg-[#eee] px-16 py-2 p-2 rounded-md w-full mt-4'
                                type="text"
                                placeholder='Enter pickup location'
                            />
                            <input
                                onClick={handleInputClick}
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className='bg-[#eee] px-16 py-2 p-2 rounded-md w-full mt-3'
                                type="text"
                                placeholder='Enter drop location'
                            />
                        </form>
                        
                        <div ref={searchPanelRef} className='search-panel h-0 opacity-0 overflow-hidden mt-4'>
                            <LocationSearchPanel vehiclePanel={vehiclePanel} setVehiclePanel={setVehiclePanel} />
                        </div>
                    </div>
                )}
                {vehiclePanel && (
                    <LocationSearchPanel vehiclePanel={vehiclePanel} setVehiclePanel={setVehiclePanel} />
                )}
            </div>
            
            {showLookingForDriver && (
                <div 
                    ref={vehicleFoundRef} 
                    className='fixed w-full z-50 bottom-0 bg-white px-3 py-6 pt-12 rounded-t-2xl shadow-lg transform translate-y-full'
                >
                    <LookingForDriver 
                        setVehicleFound={setShowLookingForDriver}
                        onDriverFound={() => {
                            setShowLookingForDriver(false)
                            setShowWaitingForDriver(true)
                        }} 
                    />
                </div>
            )}

            {showWaitingForDriver && (
                <div 
                ref={waitingForDriver}
                    className='fixed w-full z-50 bottom-0 bg-white px-3 py-6 pt-12 rounded-t-2xl shadow-lg'
                >
                    <WaitingForDriver waitingForDriver={waitingForDriver} />
                </div>
            )}
        </div>
    )
}

export default Home
