import express from 'express';
import { createDeal, getBuyerDeals, getDealById, payForDeal, updateBuyerOffer, updateDeal } from '../controllers/dealController.js';
import { verifyUser } from '../middlewares/verifyUser.js';
import { getItemDeals } from '../controllers/dealController.js';


const router = express.Router();

router.post('/create', verifyUser, createDeal);
router.get('/buyer', verifyUser, getBuyerDeals);
router.patch('/:id/pay', verifyUser, payForDeal);

// ✅ FIXED: Make this explicit that it's for item-related deals
router.get('/item/:itemId', verifyUser, getItemDeals);

// ✅ FIXED: get deal by its unique ID
router.get('/deal/:id', verifyUser, getDealById);

router.patch('/:id', verifyUser, updateDeal);
router.patch('/buyer/:id', verifyUser, updateBuyerOffer);



export default router;
