import React, { useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const CaptainRiding = () => {
    const { captainData } = useContext(CaptainDataContext)
    const navigate = useNavigate()
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)

    const handleCompleteRide = () => {
        navigate('/finish-ride')
    }

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16'
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="uber-logo"
                />
                <div className='flex items-center gap-3'>
                    <img
                        className='h-10 w-10 rounded-full object-cover'
                        src="https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnxlbnwwfHwwfHx8MA%3D%3D"
                        alt="captain"
                    />
                    <div>
                        <h4 className='text-lg font-medium capitalize'>
                            {captainData?.firstname} {captainData?.lastname}
                        </h4>
                        <p className='text-sm text-gray-600'>Online</p>
                    </div>
                </div>
            </div>

            <div className='h-3/5'>
                <img
                    className='h-full w-full object-cover'
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt="map"
                />
            </div>

            <div className='h-2/5 p-6'>
                <div className='bg-yellow-400 p-4 rounded-xl'>
                    <div className='flex items-center gap-3 mb-4'>
                        <img
                            className='h-12 w-12 rounded-full object-cover'
                            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                            alt="user"
                        />
                        <div>
                            <h4 className='text-lg font-medium'>John Doe</h4>
                            <p className='text-sm'>4.5 ★ Rating</p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='text-sm font-medium'>Estimated Time</p>
                            <h4 className='text-xl font-semibold'>15 mins</h4>
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Distance</p>
                            <h4 className='text-xl font-semibold'>2.2 KM</h4>
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Fare</p>
                            <h4 className='text-xl font-semibold'>₹150</h4>
                        </div>
                    </div>
                </div>

                <div className='mt-4 space-y-3 '>
                    
                    <div className='flex ml-20 items-center justify-between'>
                       
                        <button 
                            onClick={handleCompleteRide}
                            className='bg-green-500 text-white px-6 py-3 rounded-xl mb-12 hover:bg-green-600 transition-colors'
                        >
                            Complete Ride
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaptainRiding