const express = require('express')
const router = express.Router()
const {addSettingData, getSettingData} = require("../Controllers/SettingController")
const upload = require("../Multer/multer")

router.post('/add-setting', upload.fields([
    { name: 'popUpLogoImage', maxCount: 1 },
    { name: 'popUpBackgroundImage', maxCount: 1 },
    { name: 'outerPopUpBackgroundImage', maxCount: 1 }
  ]), addSettingData);

router.get('/get-setting', getSettingData)

module.exports = router