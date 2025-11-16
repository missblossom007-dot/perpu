const fs = require('fs');
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Schemas (sama dengan db.js)
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

async function importData() {
  console.log('\n===========================================');
  console.log('📦 IMPORT DATA KE MONGODB');
  console.log('===========================================\n');

  // Get MongoDB URI
  const mongoUri = await question('Masukkan MongoDB URI Anda:\n(contoh: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/perpustakaan)\n\n> ');

  if (!mongoUri || mongoUri.trim() === '') {
    console.log('\n❌ MongoDB URI tidak boleh kosong!');
    rl.close();
    return;
  }

  try {
    // Connect to MongoDB
    console.log('\n🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri.trim());
    console.log('✅ Connected to MongoDB!\n');

    // Create models
    const Order = mongoose.model('Order', OrderSchema);
    const Customer = mongoose.model('Customer', CustomerSchema);
    const Request = mongoose.model('Request', RequestSchema);

    let totalImported = 0;

    // Import Orders
    if (fs.existsSync('orders.json')) {
      console.log('📦 Importing orders...');
      const ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
      
      for (const order of ordersData) {
        try {
          await Order.create(order);
          console.log(`  ✅ Order: ${order.name} (${order.email})`);
          totalImported++;
        } catch (error) {
          console.log(`  ⚠️  Skip duplicate: ${order.email}`);
        }
      }
      console.log(`✅ Imported ${ordersData.length} orders\n`);
    }

    // Import Customers
    if (fs.existsSync('customers.json')) {
      console.log('👥 Importing customers...');
      const customersData = JSON.parse(fs.readFileSync('customers.json', 'utf8'));
      
      for (const customer of customersData) {
        try {
          await Customer.create(customer);
          console.log(`  ✅ Customer: ${customer.name} (${customer.email})`);
          totalImported++;
        } catch (error) {
          console.log(`  ⚠️  Skip duplicate: ${customer.email}`);
        }
      }
      console.log(`✅ Imported ${customersData.length} customers\n`);
    }

    // Import Requests
    if (fs.existsSync('requests.json')) {
      console.log('📝 Importing requests...');
      const requestsData = JSON.parse(fs.readFileSync('requests.json', 'utf8'));
      
      for (const request of requestsData) {
        try {
          await Request.create(request);
          console.log(`  ✅ Request: ${request.bookTitle} by ${request.name}`);
          totalImported++;
        } catch (error) {
          console.log(`  ⚠️  Error: ${error.message}`);
        }
      }
      console.log(`✅ Imported ${requestsData.length} requests\n`);
    }

    console.log('===========================================');
    console.log(`🎉 IMPORT SELESAI!`);
    console.log(`📊 Total data imported: ${totalImported}`);
    console.log('===========================================\n');

    console.log('💡 Langkah selanjutnya:');
    console.log('1. Buka Vercel Dashboard');
    console.log('2. Settings → Environment Variables');
    console.log('3. Tambahkan MONGODB_URI dengan value yang sama');
    console.log('4. Redeploy aplikasi');
    console.log('5. Data akan muncul di aplikasi Vercel!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('- Pastikan MongoDB URI benar');
    console.log('- Pastikan password tidak ada karakter khusus');
    console.log('- Pastikan IP sudah di-whitelist (0.0.0.0/0)');
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

importData();
