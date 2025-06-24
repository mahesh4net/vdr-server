import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  renderAdminLogin,
  handleAdminLogin,
  getAdminDashboard,
  logoutAdmin,
  getAdminStats
} from '../controllers/adminController.js';
import { verifyAdminSession } from '../middlewares/verifyAdmin.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static assets (Chart.js, CSS, etc)
router.use('/static', express.static(path.join(__dirname, '../public')));

// Routes
router.get('/login', renderAdminLogin);
router.post('/login', handleAdminLogin);
router.get('/logout', logoutAdmin);
router.get('/', verifyAdminSession, getAdminDashboard);
router.get('/stats', verifyAdminSession, getAdminStats);
export default router;
