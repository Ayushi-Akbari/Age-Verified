const express = require('express')
const router = express.Router()
const {addShopData, getShopData, getShopId, updateAppStatus} = require("../Controllers/UserController")
const upload = require("../Multer/multer")

router.post('/add-user',  upload.single('image'), addShopData)
router.get('/get-user', getShopData)
router.get('/get-user-id', getShopId)
router.put('/update-app-status', updateAppStatus)

module.exports = router