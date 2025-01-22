const { validationResult } = require('express-validator');
const mapsService = require('../services/maps.service');

const mapsController = {
  
  getCoordinates: async (req, res) => {
    try {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { address } = req.query;

      
      if (!address) {
        return res.status(400).json({
          success: false,
          message: 'Address query parameter is required',
        });
      }

      
      const result = await mapsService.getAddressCoordinates(address);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error getting coordinates:', { error, query: req.query });
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while fetching coordinates',
      });
    }
  },

 
  getDistanceTime: async (req, res) => {
    try {
     
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { origin, destination } = req.query;

      
      if (!origin || !destination) {
        return res.status(400).json({
          success: false,
          message: 'Both origin and destination query parameters are required',
        });
      }

      
      const result = await mapsService.getDistanceAndTime(origin, destination);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error calculating distance and time:', { error, query: req.query });
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while calculating distance and time',
      });
    }
  },

  getAutoCompleteSuggestions: async (req, res) => {

    try {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { input } = req.query;

      
      if (!input) {
        return res.status(400).json({
          success: false,
          message: 'Input query parameter is required',
        });
      }

      
      const result = await mapsService.getAutoCompleteSuggestions(input);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', { error, query: req.query });
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while fetching autocomplete suggestions',
      });
    }

  },
};

module.exports = mapsController;
