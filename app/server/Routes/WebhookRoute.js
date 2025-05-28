const express = require('express');
const router = express.Router();
const { appUninstall } = require('../Controllers/webhookController');

router.post('/app-uninstalled', appUninstall);


module.exports = router;