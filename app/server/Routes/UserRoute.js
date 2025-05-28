const express = require('express')
const router = express.Router()
const {addShopData, getShopData, getShopId} = require("../Controllers/UserController")
const upload = require("../Multer/multer")

router.post('/add-shop',  upload.single('image'), addShopData)
router.get('/get-shop', getShopData)
router.get('/get-shop-id', getShopId)

module.exports = router