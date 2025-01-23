import React from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import LocationSearchPanel from '../components/LocationSearchPanel'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { UserContext } from '../context/userContext'

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true
});

function Home() {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null) // 'pickup' or 'destination'
    const [panelOpen, setPanelOpen] = useState(false)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [vehicleFoundRef] = useState(useRef(null))
    const [showLookingForDriver, setShowLookingForDriver] = useState(false)
    const [showWaitingForDriver, setShowWaitingForDriver] = useState(false)
    const formContainerRef = useRef(null)
    const searchPanelRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [fares, setFares] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { socket, isConnected, sendMessage } = useContext(SocketContext)
    const { user } = useContext(UserContext)

    // Log component mount and user data
    useEffect(() => {
        console.log('Home component mounted, current user:', user);
    }, []);

    // Handle socket connection and user joining
    useEffect(() => {
        if (!socket || !isConnected) {
            console.log('Waiting for socket connection...');
            return;
        }

        if (!user || !user._id) {
            console.log('Waiting for user data...', user);
            return;
        }

        console.log('Attempting to join socket with user:', {
            userId: user._id,
            userType: 'user'
        });

        // Join the socket room
        sendMessage('join', {
            userId: user._id,
            userType: 'user'
        });

        // Listen for successful join
        const handleJoined = (data) => {
            console.log('Successfully joined socket:', data);
        };

        // Listen for errors
        const handleError = (error) => {
            console.error('Socket error:', error);
        };

        socket.on('joined', handleJoined);
        socket.on('error', handleError);

        return () => {
            socket.off('joined', handleJoined);
            socket.off('error', handleError);
        };
    }, [socket, isConnected, user, sendMessage]);

    // Debounce function to limit API calls
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Function to fetch location suggestions
    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await api.get(`/maps/get-suggestions?input=${encodeURIComponent(query)}`);
            if (response.data.success) {
                setSuggestions(response.data.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            if (error.response?.status === 401) {
                // Handle unauthorized error - maybe redirect to login
                console.log('Please login to continue');
            }
            setSuggestions([]);
        }
    };

    // Debounced version of fetchSuggestions
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    // Handle input change
    const handleInputChange = (field, value) => {
        if (field === 'pickup') {
            setPickup(value);
        } else {
            setDestination(value);
        }
        setActiveField(field);
        debouncedFetchSuggestions(value);
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion) => {
        const description = suggestion.structured_formatting.main_text;
        if (activeField === 'pickup') {
            setPickup(description);
        } else {
            setDestination(description);
        }
        setSuggestions([]);
        setActiveField(null);
    };

    const getFares = async () => {
        try {
            setFares(null); // Reset fares before new calculation
            const token = localStorage.getItem('token');
            console.log('Getting fares for locations:', { pickup, destination });
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/rides/get-fare`, {
                params: {
                    pickup,
                    destination
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log('Fare API Response:', response.data);
            if (response.data.success) {
                console.log('Setting fares in state:', response.data.data);
                setFares(response.data.data);
                setVehiclePanel(true); // Only show vehicle panel after fares are set
            } else {
                console.error('Failed to get fares:', response.data);
                setFares(null);
            }
        } catch (error) {
            console.error('Error getting fares:', error.response?.data || error.message);
            setFares(null);
        }
    };

    const handleFindTrip = async () => {
        try {
            setIsLoading(true);
            console.log('Find Trip clicked. Current state:', { pickup, destination, fares });
            setPanelOpen(false);
            setVehiclePanel(false);
            await getFares();
        } catch (error) {
            console.error('Error in handleFindTrip:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToDestination = () => {
        setVehiclePanel(false);
        setPanelOpen(true);
        setActiveField('destination');
        setFares(null); // Reset fares when going back
    };

    // Reset fares when pickup or destination changes
    useEffect(() => {
        setFares(null);
    }, [pickup, destination]);

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
            }
        }
    }, [panelOpen])

    return (
        <div className="h-screen w-full">
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
                                onClick={() => {
                                    setPanelOpen(false);
                                    if (formContainerRef.current) {
                                        gsap.to(formContainerRef.current, {
                                            y: '0%',
                                            position: 'relative',
                                            top: 'auto',
                                            left: 'auto',
                                            width: '100%',
                                            height: '30%',
                                            backgroundColor: 'white',
                                            zIndex: 10,
                                            padding: '20px',
                                            duration: 0.6,
                                            ease: 'power3.inOut'
                                        });
                                    }
                                }}
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
                            <div className='line absolute h-14 w-1 top-[112px] left-7 bg-black rounded-full'></div>
                            <div 
                                className="flex items-center gap-4 border p-2 rounded-lg"
                                onClick={() => {
                                    setPanelOpen(true);
                                    setActiveField('pickup');
                                }}
                            >
                                <div className="bg-[#eee] rounded-full h-10 w-12 flex items-center justify-center">
                                    <i className="ri-map-pin-fill"></i>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Enter pickup location"
                                    className="w-full outline-none"
                                    value={pickup}
                                    onChange={(e) => handleInputChange('pickup', e.target.value)}
                                />
                            </div>
                            <div 
                                className="flex items-center gap-4 border p-2 rounded-lg"
                                onClick={() => {
                                    setPanelOpen(true);
                                    setActiveField('destination');
                                }}
                            >
                                <div className="bg-[#eee] rounded-full h-10 w-12 flex items-center justify-center">
                                    <i className="ri-map-pin-fill"></i>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Enter destination"
                                    className="w-full outline-none"
                                    value={destination}
                                    onChange={(e) => handleInputChange('destination', e.target.value)}
                                />
                            </div>
                        </form>
                        {pickup && destination ? (
                            <button 
                                onClick={handleFindTrip}
                                disabled={isLoading}
                                className={`mt-4 w-full py-2 rounded-lg transition-all duration-300 ${
                                    isLoading 
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800' 
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                        <span>Calculating Fare...</span>
                                    </div>
                                ) : (
                                    'Find Trip'
                                )}
                            </button>
                        ) : null}
                        
                        <div ref={searchPanelRef} className='search-panel h-0 opacity-0 overflow-hidden mt-4'>
                            <LocationSearchPanel 
                                suggestions={suggestions}
                                onSuggestionSelect={handleSuggestionSelect}
                                activeField={activeField}
                                vehiclePanel={vehiclePanel}
                                setVehiclePanel={setVehiclePanel}
                                fares={fares}
                                pickup={pickup}
                                destination={destination}
                            />
                        </div>
                    </div>
                )}
                {vehiclePanel && (
                    <LocationSearchPanel 
                        suggestions={suggestions}
                        onSuggestionSelect={handleSuggestionSelect}
                        activeField={activeField}
                        vehiclePanel={vehiclePanel}
                        setVehiclePanel={setVehiclePanel}
                        fares={fares}
                        pickup={pickup}
                        destination={destination}
                        selectedLocations={{ pickup, destination }}
                    />
                )}
            </div>
            
            {showLookingForDriver && (
                <div 
                    ref={vehicleFoundRef} 
                    className='fixed w-full z-50 bottom-0 bg-white px-3 py-6 pt-12 rounded-t-2xl shadow-lg transform translate-y-full'
                >
                    <LookingForDriver 
                        setShowLookingForDriver={setShowLookingForDriver}
                        setShowWaitingForDriver={setShowWaitingForDriver}
                    />
                </div>
            )}

            {showWaitingForDriver && (
                <div 
                ref={waitingForDriverRef}
                    className='fixed w-full z-50 bottom-0 bg-white px-3 py-6 pt-12 rounded-t-2xl shadow-lg'
                >
                    <WaitingForDriver 
                        setShowWaitingForDriver={setShowWaitingForDriver}
                        waitingForDriverRef={waitingForDriverRef}
                    />
                </div>
            )}
        </div>
    )
}

export default Home
