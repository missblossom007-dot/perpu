const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { initializeEmailTransporter, sendOrderEmail } = require('./email-config');

const app = express();
const PORT = 3000;

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
    
    // Transform data ke format yang lebih mudah digunakan
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

// API Routes
app.get('/api/books', (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  
  let filtered = [...booksData];
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(book => book.category === category);
  }
  
  // Pagination
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

// Request buku dari pelanggan
app.post('/api/request', (req, res) => {
  const { name, email, bookTitle, message } = req.body;
  
  // Simpan request ke file
  const request = {
    date: new Date().toISOString(),
    name,
    email,
    bookTitle,
    message
  };
  
  const requestsFile = 'requests.json';
  let requests = [];
  
  if (fs.existsSync(requestsFile)) {
    requests = JSON.parse(fs.readFileSync(requestsFile, 'utf8'));
  }
  
  requests.push(request);
  fs.writeFileSync(requestsFile, JSON.stringify(requests, null, 2));
  
  res.json({ success: true, message: 'Request berhasil dikirim!' });
});

app.get('/api/requests', (req, res) => {
  const requestsFile = 'requests.json';
  if (fs.existsSync(requestsFile)) {
    const requests = JSON.parse(fs.readFileSync(requestsFile, 'utf8'));
    res.json(requests);
  } else {
    res.json([]);
  }
});

// Order buku (checkout)
app.post('/api/order', (req, res) => {
  const { name, email, phone, address, books, total, bookCount } = req.body;
  
  // Books already have driveLink from cart, but ensure it's there
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
  
  const order = {
    date: new Date().toISOString(),
    name,
    email,
    phone,
    address,
    books: booksWithLinks,
    total,
    bookCount
  };
  
  const ordersFile = 'orders.json';
  let orders = [];
  
  if (fs.existsSync(ordersFile)) {
    orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  }
  
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  
  console.log(`✅ Order saved: ${bookCount} books for ${name} (${email})`);
  
  // Save customer data for reselling
  saveCustomerData(name, email, phone, bookCount, total);
  
  // Send email with download links
  sendOrderEmail(email, name, booksWithLinks, total)
    .then(result => {
      if (result.success) {
        console.log(`📧 Email sent to ${email}`);
      } else {
        console.log(`⚠️  Email not sent: ${result.message}`);
      }
    })
    .catch(err => console.error('Email error:', err));
  
  // Send back books with drive links
  res.json({ 
    success: true, 
    message: 'Order berhasil!',
    books: booksWithLinks
  });
});

app.get('/api/orders', (req, res) => {
  const ordersFile = 'orders.json';
  if (fs.existsSync(ordersFile)) {
    const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    res.json(orders);
  } else {
    res.json([]);
  }
});

// Save customer data for reselling
function saveCustomerData(name, email, phone, bookCount, total) {
  const customersFile = 'customers.json';
  let customers = [];
  
  if (fs.existsSync(customersFile)) {
    customers = JSON.parse(fs.readFileSync(customersFile, 'utf8'));
  }
  
  // Check if customer already exists
  const existingCustomer = customers.find(c => c.email === email);
  
  if (existingCustomer) {
    // Update existing customer
    existingCustomer.lastPurchase = new Date().toISOString();
    existingCustomer.totalOrders += 1;
    existingCustomer.totalBooks += bookCount;
    existingCustomer.totalSpent += total;
    existingCustomer.phone = phone; // Update phone in case it changed
    existingCustomer.name = name; // Update name in case it changed
  } else {
    // Add new customer
    customers.push({
      name,
      email,
      phone,
      firstPurchase: new Date().toISOString(),
      lastPurchase: new Date().toISOString(),
      totalOrders: 1,
      totalBooks: bookCount,
      totalSpent: total
    });
  }
  
  fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));
  console.log(`💾 Customer data saved: ${email}`);
}

// Get all customers
app.get('/api/customers', (req, res) => {
  const customersFile = 'customers.json';
  if (fs.existsSync(customersFile)) {
    const customers = JSON.parse(fs.readFileSync(customersFile, 'utf8'));
    res.json(customers);
  } else {
    res.json([]);
  }
});

// Export customers to CSV
app.get('/api/customers/export', (req, res) => {
  const customersFile = 'customers.json';
  if (!fs.existsSync(customersFile)) {
    res.status(404).send('No customers found');
    return;
  }
  
  const customers = JSON.parse(fs.readFileSync(customersFile, 'utf8'));
  
  // Create CSV
  let csv = 'Nama,Email,WhatsApp,Total Pesanan,Total Buku,Total Belanja,Pertama Beli,Terakhir Beli\n';
  customers.forEach(c => {
    csv += `"${c.name}","${c.email}","${c.phone}",${c.totalOrders},${c.totalBooks},"Rp ${c.totalSpent.toLocaleString('id-ID')}","${new Date(c.firstPurchase).toLocaleString('id-ID')}","${new Date(c.lastPurchase).toLocaleString('id-ID')}"\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
  res.send(csv);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Total books: ${booksData.length}`);
});
