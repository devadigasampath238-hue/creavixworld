const express = require('express');
const router = express.Router();
const { getPortfolio } = require('../controllers/portfolioController');

// Public route
router.get('/', getPortfolio);

module.exports = router;