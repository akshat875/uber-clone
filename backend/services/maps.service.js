require('dotenv').config();
const axios = require('axios');

const MAPS_API_KEY = process.env.MAPS_API_KEY;

if (!MAPS_API_KEY) {
    console.error('WARNING: Maps API key is not configured. Please set MAPS_API_KEY in .env file');
}

const mapsService = {
    validateApiKey: () => {
        if (!MAPS_API_KEY) {
            throw new Error('Maps API key is required. Please configure MAPS_API_KEY in environment variables.');
        }
    },

    
    getAddressCoordinates: async (address) => {
        mapsService.validateApiKey();
        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodedAddress}&key=${MAPS_API_KEY}`;

            

            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            const { status, results } = response.data;

            if (status === 'OK' && Array.isArray(results) && results.length > 0) {
                const { location } = results[0].geometry;
                const formattedAddress = results[0].formatted_address || 'Address not available';

                if (location?.lat != null && location?.lng != null) {
                    return {
                        success: true,
                        data: {
                            latitude: location.lat,
                            longitude: location.lng,
                            formattedAddress,
                        },
                    };
                }
            }

            throw new Error(`Unexpected response format or error: ${status}`);
        } catch (error) {
            console.error('Error fetching coordinates:', error.message);
            throw new Error(error.response?.data?.error_message || error.message || 'Failed to fetch coordinates');
        }
    },

    getDistanceAndTime: async (origin, destination) => {
        mapsService.validateApiKey();
        try {
            const encodedOrigin = encodeURIComponent(origin);
            const encodedDestination = encodeURIComponent(destination);

            
            const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&key=${MAPS_API_KEY}&mode=driving&units=metric&language=en`;
            
            

            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === 'REQUEST_DENIED') {
                console.error('API Error:', response.data.error_message);
                throw new Error(`API request denied: ${response.data.error_message}`);
            }

            const { status, rows } = response.data;
            const element = rows?.[0]?.elements?.[0];

            if (status === 'OK' && element?.status === 'OK') {
                return {
                    success: true,
                    data: {
                        distance: element.distance.text,
                        duration: element.duration.text,
                        distanceValue: element.distance.value,
                        durationValue: element.duration.value
                    }
                };
            }

            throw new Error(`API Error: ${status} - ${response.data.error_message || 'Unknown error'}`);
        } catch (error) {
            console.error('Distance Matrix API error:', error.message);
            throw new Error(error.message || 'Unable to fetch distance and time');
        }
    },

    getAutoCompleteSuggestions: async (input) => {
        mapsService.validateApiKey();
        try {
            const encodedInput = encodeURIComponent(input);
            const url = `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${encodedInput}&key=${MAPS_API_KEY}`;

            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === 'REQUEST_DENIED') {
                console.error('API Error:', response.data.error_message);
                throw new Error(`API request denied: ${response.data.error_message}`);
            }

            return {
                success: true,
                data: response.data.predictions || []
            };
        } catch (error) {
            console.error('Autocomplete API error:', error.message);
            throw new Error(error.message || 'Unable to fetch suggestions');
        }
    }
};

module.exports = mapsService;
