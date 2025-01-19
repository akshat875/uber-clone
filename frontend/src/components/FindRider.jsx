import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import 'remixicon/fonts/remixicon.css'
import ConfirmRide from './ConfirmRide'

const FindRider = ({ onClose }) => {
    const vehiclePanelRef = useRef(null)
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    useEffect(() => {
        if (vehiclePanelRef.current) {
            gsap.fromTo(vehiclePanelRef.current,
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
    }, [selectedVehicle])

    const handleClose = () => {
        gsap.to(vehiclePanelRef.current, {
            y: '100%',
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                onClose && onClose()
            }
        })
    }

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle)
    }

    const handleBackFromConfirm = () => {
        setSelectedVehicle(null)
    }

    const vehicles = [
        {
            name: 'UberGo',
            image: 'https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png',
            description: 'Affordable, compact rides',
            status: 'Rider is on the way',
            capacity: 4,
            price: '10.00'
        },
        {
            name: 'UberMoto',
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png',
            description: 'Quick bike rides',
            status: 'Available nearby',
            capacity: 1,
            price: '5.00'
        },
        {
            name: 'UberXL',
            image: 'https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png',
            description: 'Spacious rides for groups',
            status: 'Multiple cars available',
            capacity: 6,
            price: '15.00'
        }
    ]

    if (selectedVehicle) {
        return <ConfirmRide vehicle={selectedVehicle} onBack={handleBackFromConfirm} />
    }

    return (
        <div 
            ref={vehiclePanelRef} 
            className="fixed w-full left-0 bottom-0 bg-white px-3 py-6 shadow-lg rounded-t-2xl z-50"
            style={{ transform: 'translateY(100%)' }}
        >
            <div className="flex justify-between items-center mb-5">
                <h3 className='text-2xl font-semibold'>Choose a vehicle</h3>
                <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>
            
            {vehicles.map((vehicle, index) => (
                <div 
                    key={index} 
                    onClick={() => handleVehicleSelect(vehicle)}
                    className='flex border-2 mb-2 active:border-black rounded-xl w-full p-3 cursor-pointer hover:border-black transition-colors'
                >
                    <img className='h-12 object-contain' src={vehicle.image} alt={vehicle.name}/>
                    <div className="ml-2 w-1/2">
                        <h2 className='text-base font-semibold'>
                            {vehicle.name} <span><i className="ri-user-fill"></i>{vehicle.capacity}</span>
                        </h2>
                        <h4 className='text-sm font-medium'>{vehicle.status}</h4>
                        <p className='text-xs text-grey-500'>{vehicle.description}</p>
                    </div>
                    <h2 className='text-xl font-semibold'>${vehicle.price}</h2>
                </div>
            ))}
        </div>
    )
}

export default FindRider