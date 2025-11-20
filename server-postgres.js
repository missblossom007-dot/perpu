const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const { initializeEmailTransporter, sendOrderEmail } = require('./email-config');
const db = require('./db-postgres');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize email
initializeEmailTransporter();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database and load books from Excel
async function initializeApp() {
  try {
    // Initialize PostgreSQL tables
    await db.initializeDatabase();
    
    // Check if books already loaded
    const existingBooks = await db.getAllBooks({ limit: 1 });
    if (existingBooks.total > 0) {
      console.log(`✅ Database already has ${existingBooks.total} books`);
      return;
    }

    // Load books from Excel
    console.log('📚 Loading books from Excel...');
    const workbook = XLSX.readFile('REKAP BUKU.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);
    
    // Insert books into database
    let count = 0;
    for (const book of rawData) {
      await db.insertBook({
        title: book['File Name'] || '',
        author: book['Unnamed: 15'] || 'Unknown',
        category: book['Unnamed: 13'] || 'Uncategorized',
        price: book['Unnamed: 14'] || 0,
        description: book['deskripsi'] || '',
        cover: book['Unnamed: 10'] || book['cover'] || '',
        driveLink: book['Link'] || '',
        slug: book['slug'] || ''
      });
      count++;
      if (count % 1000 === 0) {
        console.log(`  Loaded ${count} books...`);
      }
    }
    
    console.log(`✅ Loaded ${count} books into PostgreSQL`);
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// API Routes
app.get('/api/books', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const result = await db.getAllBooks({ search, category, page, limit });
    res.json(result);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await db.getBookById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Request buku dari pelanggan
app.post('/api/request', async (req, res) => {
  try {
    const { name, email, bookTitle, message } = req.body;
    await db.createRequest({ name, email, bookTitle, message });
    res.json({ success: true, message: 'Request berhasil dikirim!' });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await db.getAllRequests();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Order buku (checkout)
app.post('/api/order', async (req, res) => {
  try {
    const { name, email, phone, address, books, total, bookCount } = req.body;
    
    // Ensure all books have drive links
    const booksWithLinks = await Promise.all(books.map(async (cartBook) => {
      if (!cartBook.driveLink) {
        const fullBook = await db.getBookById(cartBook.id);
        return {
          ...cartBook,
          driveLink: fullBook ? fullBook.drive_link : ''
        };
      }
      return cartBook;
    }));
    
    // Create order in database
    const order = await db.createOrder({
      name,
      email,
      phone,
      address,
      books: booksWithLinks,
      total,
      bookCount
    });
    
    console.log(`✅ Order saved: ${bookCount} books for ${name} (${email})`);
    
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
    
    res.json({ 
      success: true, 
      message: 'Order berhasil!',
      books: booksWithLinks
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Export customers to CSV
app.get('/api/customers/export', async (req, res) => {
  try {
    const customers = await db.getAllCustomers();
    
    if (customers.length === 0) {
      res.status(404).send('No customers found');
      return;
    }
    
    // Create CSV
    let csv = 'Nama,Email,WhatsApp,Total Pesanan,Total Buku,Total Belanja,Pertama Beli,Terakhir Beli\n';
    customers.forEach(c => {
      csv += `"${c.name}","${c.email}","${c.phone}",${c.total_orders},${c.total_books},"Rp ${c.total_spent.toLocaleString('id-ID')}","${new Date(c.first_purchase).toLocaleString('id-ID')}","${new Date(c.last_purchase).toLocaleString('id-ID')}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting customers:', error);
    res.status(500).json({ error: 'Failed to export customers' });
  }
});

// Start server
initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🐘 Using PostgreSQL database`);
  });
});
