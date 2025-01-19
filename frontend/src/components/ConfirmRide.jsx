import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LookingForDriver from './LookingForDriver'

const ConfirmRide = ({ vehicle, onBack }) => {
    const confirmPanelRef = useRef(null)
    const [showLookingForDriver, setShowLookingForDriver] = useState(false)

    useEffect(() => {
        if (confirmPanelRef.current) {
            gsap.fromTo(confirmPanelRef.current,
                {
                    y: '100%',
                },
                {
                    y: '0%',
                    duration: 0.5,
                    ease: 'power3.out'
                }
            )
        }
    }, [showLookingForDriver])

    const handleConfirmRide = () => {
        gsap.to(confirmPanelRef.current, {
            y: '100%',
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                setShowLookingForDriver(true)
            }
        })
    }

    const handleLookingForDriverBack = () => {
        setShowLookingForDriver(false)
    }

    if (showLookingForDriver) {
        return <LookingForDriver vehicle={vehicle} onBack={handleLookingForDriverBack} />
    }

    return (
        <div 
            ref={confirmPanelRef}
            className="fixed w-full left-0 bottom-0 bg-white px-3 py-6 shadow-lg rounded-t-2xl z-50"
            style={{ transform: 'translateY(100%)' }}
        >
            <div className="flex justify-between items-center mb-5">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h3 className='text-2xl font-semibold'>Confirm {vehicle?.name}</h3>
                <div className="w-10"></div>
            </div>

            <div className="p-4 border rounded-lg mb-4">
                <img src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
                <div className="flex items-center space-x-3">
                    <i class="ri-map-pin-range-fill"></i>
                    <div>
                        <h3>h63/11-4</h3>
                        <p> rana youth hostel </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <i class="ri-map-pin-2-fill"></i>
                    <div>
                        <h3>h63/11-4</h3>
                        <p> rana youth hostel </p>
                    </div>

                </div>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <i className="ri-price-tag-3-fill text-xl"></i>
                        <span className="font-medium ml-2">Fare</span>
                    </div>
                    <span className="text-xl font-semibold">${vehicle?.price}</span>
                </div>
                <p className="text-sm text-gray-500">{vehicle?.description}</p>
                <div>
                
                </div>
            </div>
            

            <button 
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
                onClick={handleConfirmRide}
            >
                Confirm Ride
            </button>
        </div>
    )
}

export default ConfirmRide