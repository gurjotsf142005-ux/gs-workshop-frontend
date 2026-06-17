const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/authMiddleware');
const { getAllProjects, createProject, updateProject, deleteProject } = require('../controllers/Project');
const { getSiteSettings, updateSiteSettings } = require('../controllers/siteSettingsController');

router.use(adminAuth);

router.get('/projects',     getAllProjects);
router.post('/projects',    createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.get('/settings', getSiteSettings);   // ← was missing, caused 404
router.put('/settings', updateSiteSettings);

module.exports = router;
