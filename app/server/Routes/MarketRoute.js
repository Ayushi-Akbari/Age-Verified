const express = require('express')
const { addMarket, getMarket, deleteMarket } = require('../Controllers/MarketController')
const router = express.Router()

router.post('/add-market', addMarket)
router.get('/get-market', getMarket)
router.delete('/delete-market', deleteMarket)

module.exports = router