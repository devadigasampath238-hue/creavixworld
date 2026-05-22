const express = require('express');
const router = express.Router();
const {
  getAllProjects, getAllUsers, updateProjectStatus, updateUser, getAnalytics,
} = require('../controllers/adminController');
const {
  getAllPortfolio, createPortfolio, updatePortfolio, deletePortfolio,
} = require('../controllers/portfolioController'); // ← NEW
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/projects', getAllProjects);
router.put('/projects/:id/status', updateProjectStatus);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/analytics', getAnalytics);

// Portfolio CRUD ← NEW
router.get('/portfolio', getAllPortfolio);
router.post('/portfolio', createPortfolio);
router.put('/portfolio/:id', updatePortfolio);
router.delete('/portfolio/:id', deletePortfolio);

module.exports = router;