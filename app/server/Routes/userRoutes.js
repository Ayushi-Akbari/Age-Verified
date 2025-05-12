const express = require('express')
const router = express.Router()
const {addSetting, getSetting} = require("../Controller/userController")
const upload = require("../Multer/multer")

router.post('/add-setting',  upload.single('image'), addSetting)
router.get('/get-setting', getSetting)

module.exports = router