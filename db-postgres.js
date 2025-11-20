const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/perpustakaan_digital',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create books table
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT,
        category TEXT,
        price INTEGER DEFAULT 0,
        description TEXT,
        cover TEXT,
        drive_link TEXT,
        slug TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create customers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        first_purchase TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_purchase TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_orders INTEGER DEFAULT 0,
        total_books INTEGER DEFAULT 0,
        total_spent INTEGER DEFAULT 0
      )
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        customer_address TEXT,
        total INTEGER NOT NULL,
        book_count INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table (many-to-many relationship)
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        book_id INTEGER,
        book_title TEXT NOT NULL,
        book_author TEXT,
        book_price INTEGER,
        drive_link TEXT
      )
    `);

    // Create requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        book_title TEXT NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ PostgreSQL tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Books operations
async function getAllBooks(filters = {}) {
  const { search, category, page = 1, limit = 20 } = filters;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];
  let paramCount = 1;

  if (search) {
    query += ` AND (LOWER(title) LIKE $${paramCount} OR LOWER(author) LIKE $${paramCount})`;
    params.push(`%${search.toLowerCase()}%`);
    paramCount++;
  }

  if (category && category !== 'all') {
    query += ` AND category = $${paramCount}`;
    params.push(category);
    paramCount++;
  }

  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].count);

  // Get paginated results
  query += ` ORDER BY id LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  
  return {
    books: result.rows,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit)
  };
}

async function getBookById(id) {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  return result.rows[0];
}

async function getCategories() {
  const result = await pool.query('SELECT DISTINCT category FROM books ORDER BY category');
  return result.rows.map(row => row.category);
}

async function insertBook(book) {
  const result = await pool.query(
    `INSERT INTO books (title, author, category, price, description, cover, drive_link, slug)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [book.title, book.author, book.category, book.price, book.description, book.cover, book.driveLink, book.slug]
  );
  return result.rows[0];
}

// Customer operations
async function saveCustomer(customerData) {
  const { name, email, phone, bookCount, total } = customerData;
  
  // Check if customer exists
  const existing = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
  
  if (existing.rows.length > 0) {
    // Update existing customer
    const result = await pool.query(
      `UPDATE customers 
       SET name = $1, phone = $2, last_purchase = CURRENT_TIMESTAMP,
           total_orders = total_orders + 1, total_books = total_books + $3,
           total_spent = total_spent + $4
       WHERE email = $5 RETURNING *`,
      [name, phone, bookCount, total, email]
    );
    return result.rows[0];
  } else {
    // Insert new customer
    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, total_orders, total_books, total_spent)
       VALUES ($1, $2, $3, 1, $4, $5) RETURNING *`,
      [name, email, phone, bookCount, total]
    );
    return result.rows[0];
  }
}

async function getAllCustomers() {
  const result = await pool.query('SELECT * FROM customers ORDER BY last_purchase DESC');
  return result.rows;
}

// Order operations
async function createOrder(orderData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { name, email, phone, address, books, total, bookCount } = orderData;

    // Save/update customer
    const customer = await saveCustomer({ name, email, phone, bookCount, total });

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, customer_address, total, book_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [customer.id, name, email, phone, address, total, bookCount]
    );
    const order = orderResult.rows[0];

    // Insert order items
    for (const book of books) {
      await client.query(
        `INSERT INTO order_items (order_id, book_id, book_title, book_author, book_price, drive_link)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, book.id, book.title, book.author, book.price, book.driveLink]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getAllOrders() {
  const result = await pool.query(`
    SELECT o.*, 
           json_agg(json_build_object(
             'id', oi.book_id,
             'title', oi.book_title,
             'author', oi.book_author,
             'price', oi.book_price,
             'driveLink', oi.drive_link
           )) as books
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);
  return result.rows;
}

// Request operations
async function createRequest(requestData) {
  const { name, email, bookTitle, message } = requestData;
  const result = await pool.query(
    `INSERT INTO requests (name, email, book_title, message)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, bookTitle, message]
  );
  return result.rows[0];
}

async function getAllRequests() {
  const result = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
  return result.rows;
}

module.exports = {
  pool,
  initializeDatabase,
  getAllBooks,
  getBookById,
  getCategories,
  insertBook,
  saveCustomer,
  getAllCustomers,
  createOrder,
  getAllOrders,
  createRequest,
  getAllRequests
};
