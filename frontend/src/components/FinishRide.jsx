import React from 'react'
import { useNavigate } from 'react-router-dom'

const FinishRide = () => {
    const navigate = useNavigate()

    const handleFinish = () => {
        navigate('/captain-dashboard')
    }

    return (
        <div className='h-screen flex flex-col items-center justify-center p-6'>
            <img 
                src="https://png.pngtree.com/png-vector/20240824/ourmid/pngtree-3d-happy-business-man-giving-a-thumbs-up-png-image_13603715.png" 
                alt="success" 
                className="w-32 h-32 mb-8"
            />
            <h2 className='text-2xl font-bold mb-4'>Ride Completed Successfully!</h2>
            <div className='bg-yellow-400 w-full p-6 rounded-xl mb-6'>
                <div className='flex justify-between mb-4'>
                    <span className='text-lg'>Fare</span>
                    <span className='text-xl font-bold'>₹150</span>
                </div>
            </div>
            <button
                onClick={handleFinish}
                className='w-full bg-green-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-600 transition-colors'
            >
                Back to Dashboard
            </button>
        </div>
    )
}

export default FinishRide