import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
