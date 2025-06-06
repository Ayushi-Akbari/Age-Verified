const express = require('express')
const { addMarket, getMarket, deleteMarket, setPrimaryMarket } = require('../Controllers/MarketController')
const router = express.Router()

router.post('/add-market', addMarket)
router.get('/get-market', getMarket)
router.delete('/delete-market', deleteMarket)
router.put('/set-primary-market', setPrimaryMarket)

module.exports = router