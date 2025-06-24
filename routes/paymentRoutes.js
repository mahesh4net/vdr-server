import express from 'express';
import { verifyUser } from '../middlewares/verifyUser.js';
import { getBuyerPayments, getItemPurchases, getSellerPayments } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/buyer', verifyUser, getBuyerPayments);
router.get('/seller', verifyUser, getSellerPayments);
router.get('/item/:itemId', verifyUser, getItemPurchases);

export default router;
