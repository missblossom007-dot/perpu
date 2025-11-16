const mongoose = require('mongoose');

// MongoDB Connection
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/perpustakaan';
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

// Schemas
const OrderSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  name: String,
  email: String,
  phone: String,
  address: String,
  books: [{
    id: Number,
    title: String,
    author: String,
    price: Number,
    cover: String,
    driveLink: String
  }],
  total: Number,
  bookCount: Number
});

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  firstPurchase: { type: Date, default: Date.now },
  lastPurchase: { type: Date, default: Date.now },
  totalOrders: { type: Number, default: 0 },
  totalBooks: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 }
});

const RequestSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  name: String,
  email: String,
  bookTitle: String,
  message: String
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);

module.exports = {
  connectDB,
  Order,
  Customer,
  Request
};
