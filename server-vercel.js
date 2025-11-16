const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const { connectDB, Order, Customer, Request } = require('./db');
const { initializeEmailTransporter, sendOrderEmail } = require('./email-config');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize email
initializeEmailTransporter();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load data dari Excel
let booksData = [];

function loadBooksData() {
  try {
    const workbook = XLSX.readFile('REKAP BUKU.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    booksData = rawData.map((book, index) => ({
      id: index + 1,
      title: book['File Name'] || '',
      author: book['Unnamed: 15'] || 'Unknown',
      category: book['Unnamed: 13'] || 'Uncategorized',
      price: book['Unnamed: 14'] || 0,
      description: book['deskripsi'] || '',
      cover: book['Unnamed: 10'] || book['cover'] || '',
      driveLink: book['Link'] || '',
      slug: book['slug'] || ''
    }));
    
    console.log(`✅ Loaded ${booksData.length} books`);
  } catch (error) {
    console.error('Error loading books:', error);
  }
}

loadBooksData();

// Connect to MongoDB
connectDB();

// API Routes
app.get('/api/books', (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  
  let filtered = [...booksData];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower)
    );
  }
  
  if (category && category !== 'all') {
    filtered = filtered.filter(book => book.category === category);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedBooks = filtered.slice(startIndex, endIndex);
  
  res.json({
    books: paginatedBooks,
    total: filtered.length,
    page: parseInt(page),
    totalPages: Math.ceil(filtered.length / limit)
  });
});

app.get('/api/books/:id', (req, res) => {
  const book = booksData.find(b => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(booksData.map(b => b.category))].sort();
  res.json(categories);
});

// Request buku
app.post('/api/request', async (req, res) => {
  try {
    const { name, email, bookTitle, message } = req.body;
    
    const request = new Request({
      name,
      email,
      bookTitle,
      message
    });
    
    await request.save();
    res.json({ success: true, message: 'Request berhasil dikirim!' });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ success: false, message: 'Error saving request' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().sort({ date: -1 });
    res.json(requests);
  } catch (error) {
    res.json([]);
  }
});

// Order buku
app.post('/api/order', async (req, res) => {
  try {
    const { name, email, phone, address, books, total, bookCount } = req.body;
    
    const booksWithLinks = books.map(cartBook => {
      if (!cartBook.driveLink) {
        const fullBook = booksData.find(b => b.id === cartBook.id);
        return {
          ...cartBook,
          driveLink: fullBook ? fullBook.driveLink : ''
        };
      }
      return cartBook;
    });
    
    // Save order
    const order = new Order({
      name,
      email,
      phone,
      address,
      books: booksWithLinks,
      total,
      bookCount
    });
    
    await order.save();
    console.log(`✅ Order saved: ${bookCount} books for ${name} (${email})`);
    
    // Save/update customer
    await saveCustomerData(name, email, phone, bookCount, total);
    
    // Send email
    sendOrderEmail(email, name, booksWithLinks, total)
      .then(result => {
        if (result.success) {
          console.log(`📧 Email sent to ${email}`);
        }
      })
      .catch(err => console.error('Email error:', err));
    
    res.json({ 
      success: true, 
      message: 'Order berhasil!',
      books: booksWithLinks
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Error saving order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.json([]);
  }
});

// Customer functions
async function saveCustomerData(name, email, phone, bookCount, total) {
  try {
    const existingCustomer = await Customer.findOne({ email });
    
    if (existingCustomer) {
      existingCustomer.lastPurchase = new Date();
      existingCustomer.totalOrders += 1;
      existingCustomer.totalBooks += bookCount;
      existingCustomer.totalSpent += total;
      existingCustomer.phone = phone;
      existingCustomer.name = name;
      await existingCustomer.save();
    } else {
      const customer = new Customer({
        name,
        email,
        phone,
        totalOrders: 1,
        totalBooks: bookCount,
        totalSpent: total
      });
      await customer.save();
    }
    
    console.log(`💾 Customer data saved: ${email}`);
  } catch (error) {
    console.error('Error saving customer:', error);
  }
}

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalSpent: -1 });
    res.json(customers);
  } catch (error) {
    res.json([]);
  }
});

app.get('/api/customers/export', async (req, res) => {
  try {
    const customers = await Customer.find();
    
    let csv = 'Nama,Email,WhatsApp,Total Pesanan,Total Buku,Total Belanja,Pertama Beli,Terakhir Beli\n';
    customers.forEach(c => {
      csv += `"${c.name}","${c.email}","${c.phone}",${c.totalOrders},${c.totalBooks},"Rp ${c.totalSpent.toLocaleString('id-ID')}","${new Date(c.firstPurchase).toLocaleString('id-ID')}","${new Date(c.lastPurchase).toLocaleString('id-ID')}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).send('Error exporting customers');
  }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Total books: ${booksData.length}`);
  });
}

module.exports = app;
