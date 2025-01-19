const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const mapsController = require('../controllers/maps.controller')
const { check } = require('express-validator')
const { validationResult } = require('express-validator')

const { getAddressCoordinates } = require('../services/maps.service')

router.get('/get-coordinates', mapsController.getCoordinates)

module.exports = router