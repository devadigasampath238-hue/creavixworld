const express = require('express');
const router = express.Router();
const {
  getAllProjects, getAllUsers, updateProjectStatus, updateUser, getAnalytics,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/projects', getAllProjects);
router.put('/projects/:id/status', updateProjectStatus);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/analytics', getAnalytics);

module.exports = router;
