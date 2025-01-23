import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import 'remixicon/fonts/remixicon.css'

const LookingForDriver = ({ vehicle, onBack, pickup, destination }) => {
    const confirmPanelRef = useRef(null)

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
    }, [])

    const handleBack = () => {
        gsap.to(confirmPanelRef.current, {
            y: '100%',
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                onBack && onBack()
            }
        })
    }

    return (
        <div
            ref={confirmPanelRef}
            className="fixed w-full left-0 bottom-0 bg-white px-3 py-6 shadow-lg rounded-t-2xl z-50"
            style={{ transform: 'translateY(100%)' }}
        >
            <div className="flex justify-between items-center mb-5">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <h3 className='text-2xl font-semibold'>Looking For Driver</h3>
                <div className="w-10"></div>
            </div>

            <div className="p-4 border rounded-lg mb-4">
                <img 
                    src={
                        vehicle?.type === 'car' 
                            ? 'https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png'
                            : vehicle?.type === 'bike'
                            ? 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png'
                            : 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
                    }
                    alt={vehicle?.type}
                    className="w-full h-40 object-contain mb-4"
                />
                <div className="flex items-center space-x-3 mb-3">
                    <i className="ri-map-pin-range-fill text-xl text-gray-600"></i>
                    <div>
                        <h3 className="font-medium text-gray-900">{pickup}</h3>
                    </div>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                    <i className="ri-map-pin-2-fill text-xl text-gray-600"></i>
                    <div>
                        <h3 className="font-medium text-gray-900">{destination}</h3>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                        <i className="ri-price-tag-3-fill text-xl text-gray-600"></i>
                        <span className="font-medium ml-2">Fare</span>
                    </div>
                    <span className="text-xl font-semibold">${vehicle?.price}</span>
                </div>
                <p className="text-sm text-gray-500">{vehicle?.description}</p>
            </div>
        </div>
    )
}

export default LookingForDriver