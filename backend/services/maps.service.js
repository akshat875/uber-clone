const axios = require('axios');

module.exports.getAddressCoordinates = async (address) => {
    try {
        if (!process.env.GOOGLE_MAPS_API_KEY) {
            throw new Error('Google Maps API key is not configured');
        }

        console.log('Using API Key:', process.env.GOOGLE_MAPS_API_KEY); // For debugging

        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        console.log('Google Maps API Response:', response.data); // For debugging

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Google Maps API Error: ${response.data.status} - ${response.data.error_message || 'No additional error message'}`);
        }
    } catch (error) {
        console.error('Full error details:', error.response?.data || error.message);
        throw new Error(`Error getting coordinates: ${error.message}`);
    }
}

