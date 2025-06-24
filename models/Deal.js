import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerOfferPrice: {
    type: Number,
    required: true,
  },
  sellerOfferPrice: {
    type: Number,
    default: null, // can be set later by seller
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Deal', dealSchema);
