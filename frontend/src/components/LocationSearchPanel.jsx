import React from 'react'
import 'remixicon/fonts/remixicon.css'
import FindRider from './FindRider'

const LocationSearchPanel = ({ 
    suggestions, 
    onSuggestionSelect, 
    activeField, 
    vehiclePanel, 
    setVehiclePanel,
    fares,
    pickup,
    destination
}) => {
    console.log('LocationSearchPanel props:', { fares, pickup, destination, vehiclePanel });

    const handleLocationClick = (suggestion) => {
        onSuggestionSelect(suggestion);
    };

    const handleVehiclePanelClose = () => {
        setVehiclePanel(false);
    };

    return (
        <div className='bg-white rounded-lg p-4'>
            {!vehiclePanel ? (
                <div className='suggestions-container'>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.place_id || index}
                            className='suggestion-item p-2 hover:bg-gray-100 cursor-pointer rounded-md flex items-center gap-3'
                            onClick={() => handleLocationClick(suggestion)}
                        >
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <i className="ri-map-pin-line text-lg"></i>
                            </div>
                            <div>
                                <p className="font-medium">{suggestion.structured_formatting?.main_text}</p>
                                <p className="text-sm text-gray-500">{suggestion.structured_formatting?.secondary_text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className='vehicle-options'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-lg font-semibold'>Choose a ride</h3>
                            <button 
                                onClick={handleVehiclePanelClose} 
                                className='text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors'
                            >
                                <i className="ri-arrow-left-line text-xl"></i>
                            </button>
                        </div>
                        
                        {console.log('Current fares in LocationSearchPanel:', fares)}
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                                <div className='flex items-center gap-4'>
                                    <i className="ri-car-line text-2xl"></i>
                                    <div>
                                        <h4 className='font-medium'>Car</h4>
                                        <p className='text-sm text-gray-500'>Comfy, economical cars</p>
                                    </div>
                                </div>
                                <span className='font-semibold'>₹{fares?.car || '--'}</span>
                            </div>
                            
                            <div className='flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                                <div className='flex items-center gap-4'>
                                    <i className="ri-e-bike-2-line text-2xl"></i>
                                    <div>
                                        <h4 className='font-medium'>Bike</h4>
                                        <p className='text-sm text-gray-500'>Quick bike rides</p>
                                    </div>
                                </div>
                                <span className='font-semibold'>₹{fares?.bike || '--'}</span>
                            </div>
                            
                            <div className='flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'>
                                <div className='flex items-center gap-4'>
                                    <i className="ri-taxi-line text-2xl"></i>
                                    <div>
                                        <h4 className='font-medium'>Auto</h4>
                                        <p className='text-sm text-gray-500'>Auto rickshaw</p>
                                    </div>
                                </div>
                                <span className='font-semibold'>₹{fares?.auto || '--'}</span>
                            </div>
                        </div>
                    </div>
                    {fares && (
                        <FindRider 
                            onClose={handleVehiclePanelClose} 
                            fares={fares}
                            pickup={pickup}
                            destination={destination}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default LocationSearchPanel