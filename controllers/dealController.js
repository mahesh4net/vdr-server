import Deal from "../models/Deal.js";
import Item from "../models/Item.js";
import Payment from "../models/Payment.js";

export const createDeal = async (req, res) => {
  try {
    const { itemId, buyerOfferPrice } = req.body;
    const buyerId = req.userId;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const sellerId = item.seller;

    const deal = await Deal.create({
      item: itemId,
      buyer: buyerId,
      seller: sellerId,
      buyerOfferPrice,
      sellerOfferPrice: item.price, // ✅ default seller price initially
      status: "pending",
    });

    res.status(201).json(deal);
  } catch (err) {
    console.error("Create deal error:", err.message);
    res.status(500).json({ message: "Could not create deal" });
  }
};

export const getItemDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ item: req.params.itemId }).populate(
      "buyer",
      "fullname email"
    );
    res.json(deals);
  } catch (err) {
    console.error("Error fetching item deals:", err.message);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
};

export const updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // e.g., { status: "accepted" } or { sellerOfferPrice: 500 }

    const updated = await Deal.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update deal" });
  }
};

// controllers/dealController.js
export const getBuyerDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ buyer: req.userId })
      .populate("item", "title imageUrl price seller")
      .sort({ createdAt: -1 });

    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch buyer deals" });
  }
};

export const payForDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, address, mobile } = req.body;

    if (!quantity || quantity < 1 || !address || !mobile) {
      return res
        .status(400)
        .json({ message: "Missing or invalid payment details" });
    }

    const deal = await Deal.findById(id).populate("item");

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    if (deal.status !== "accepted") {
      return res.status(400).json({ message: "Deal is not accepted yet" });
    }

    if (deal.buyer.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const total = quantity * deal.buyerOfferPrice;

    // Save payment record
    await Payment.create({
      deal: deal._id,
      item: deal.item._id,
      buyer: deal.buyer,
      seller: deal.item.seller,
      quantity,
      totalAmount: total,
      address,
      mobile,
    });
    deal.status = "completed";
    await deal.save();

    res.status(200).json({
      message: "Payment completed",
      item: deal.item.title,
      quantity,
      total,
      address,
      mobile,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
};

export const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate("item", "title description price imageUrl")
      .populate("buyer", "fullname email")
      .populate("seller", "fullname email");

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deal" });
  }
};



export const updateBuyerOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerOfferPrice } = req.body;

    if (!buyerOfferPrice || buyerOfferPrice <= 0) {
      return res.status(400).json({ message: 'Invalid offer price' });
    }

    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    if (deal.buyer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (deal.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update offer after acceptance/rejection' });
    }

    deal.buyerOfferPrice = buyerOfferPrice;
    await deal.save();

    res.status(200).json({ message: 'Offer updated', deal });
  } catch (err) {
    console.error('Error updating buyer offer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
