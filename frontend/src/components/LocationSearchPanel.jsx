import React, { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import FindRider from './FindRider'

const LocationSearchPanel = ({ vehiclePanel, setVehiclePanel }) => {
  const [showLocations, setShowLocations] = useState(true)
  
  const locations = [
    "24b, near rana youth hostel",
    "24b, near rana youth hostel",
    "24b, near rana youth hostel",
    "24b, near rana youth hostel",
    "24b, near rana youth hostel",
  ]

  const handleLocationClick = () => {
    setShowLocations(false)
    setVehiclePanel(true)
  }

  const handleVehiclePanelClose = () => {
    setVehiclePanel(false)
    setShowLocations(true)
  }

  return (
    <>
      {showLocations && !vehiclePanel && (
        <div className="mb-4">
          {locations.map((elem, index) => (
            <div 
              key={index}
              onClick={handleLocationClick}
              className='flex items-center gap-2 my-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg'
            >
              <h2 className='bg-[#eee] rounded-full h-10 w-12 flex items-center justify-center'>
                <i className="ri-map-pin-fill"></i>
              </h2>
              <h4 className='font-medium'>{elem}</h4>
            </div>
          ))}
        </div>
      )}
      {vehiclePanel && (
        <FindRider onClose={handleVehiclePanelClose} />
      )}
    </>
  )
}

export default LocationSearchPanel