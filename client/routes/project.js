const express = require('express');
const router = express.Router();
const { getAllProjects } = require('../controllers/Project');

router.get('/', getAllProjects);

module.exports = router;
