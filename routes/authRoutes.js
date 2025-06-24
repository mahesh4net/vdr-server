import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/authenticate', authenticate);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
