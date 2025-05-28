const express = require('express');
const router = express.Router();
const {addAnalytics, getAnalytics} = require('../Controllers/AnalyticsController');

router.post('/add-analytics', addAnalytics);
router.get('/get-analytics', getAnalytics);

module.exports = router;