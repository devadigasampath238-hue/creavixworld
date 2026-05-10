const express = require('express');
const router = express.Router();
const { createProject, getMyProjects, getProject } = require('../controllers/projectController');
const { protect, verifiedOnly } = require('../middleware/auth');
const { projectValidation } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.post('/', protect, verifiedOnly, upload.array('files', 5), projectValidation, createProject);
router.get('/my', protect, getMyProjects);
router.get('/:id', protect, getProject);

module.exports = router;
