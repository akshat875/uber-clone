const mapsService = require('../services/maps.service')

module.exports.getCoordinates = async (req, res) => {
    const { address } = req.body
    try {
        const coordinates = await mapsService.getAddressCoordinates(address)
        res.json({ success: true, coordinates })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}