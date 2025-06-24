import express from 'express';
import { createItem, getAllItems, getSellerItems, getItemById } from '../controllers/itemController.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createItem);
router.get('/all', getAllItems);
router.get('/mine', verifyUser, getSellerItems);
router.get('/:id', verifyUser, getItemById);


export default router;
