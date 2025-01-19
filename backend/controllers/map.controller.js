const mapsService = require('../services/maps.service')

module.exports.getCoordinates = async (req, res) => {
    const { address } = req.body
    const coordinates = await mapsService.getAddressCoordinates(address)
    res.json(coordinates)
}