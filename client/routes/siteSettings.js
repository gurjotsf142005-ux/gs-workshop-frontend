const express = require('express');
const router = express.Router();
const { getSiteSettings, updateSiteSettings } = require('../controllers/siteSettingsController');
const { adminAuth } = require('../middleware/authMiddleware');

router.get('/', getSiteSettings);
router.put('/', adminAuth, updateSiteSettings);

module.exports = router;
