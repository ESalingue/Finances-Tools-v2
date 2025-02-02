// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  description: { type: String },
  date: { type: Date, required: true },
  currency: { type: String, default: 'EUR' },
  location: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

