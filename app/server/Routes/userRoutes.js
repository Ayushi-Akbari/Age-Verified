const express = require('express')
const router = express.Router()
const {addShopData, getShopData, getStoreId} = require("../Controller/userController")
const upload = require("../Multer/multer")

router.post('/add-shop',  upload.single('image'), addShopData)
router.get('/get-shop', getShopData)
router.get('/get-store-id', getStoreId)

module.exports = router