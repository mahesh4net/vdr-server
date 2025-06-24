import Payment from '../models/Payment.js';

export const getBuyerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ buyer: req.userId })
      .populate('item', 'title imageUrl')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your buy history' });
  }
};

export const getSellerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ seller: req.userId })
      .populate('item', 'title')
      .populate('buyer', 'fullname email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your purchases' });
  }
};


export const getItemPurchases = async (req, res) => {
  try {
    const payments = await Payment.find({
      item: req.params.itemId,
      seller: req.userId
    })
      .populate('buyer', 'fullname email')
      .populate('deal', 'buyerOfferPrice')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error('Failed to get item purchases:', err);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
};