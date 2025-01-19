const mapsService = require('../services/maps.service');

module.exports.getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Address is required'
            });
        }

        const coordinates = await mapsService.getAddressCoordinates(address);
        res.status(200).json({
            success: true,
            coordinates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 