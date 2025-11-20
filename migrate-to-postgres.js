const fs = require('fs');
const db = require('./db-postgres');

async function migrateData() {
  console.log('🔄 Starting migration to PostgreSQL...\n');

  try {
    // Initialize database
    await db.initializeDatabase();

    // Migrate customers
    if (fs.existsSync('customers.json')) {
      const customers = JSON.parse(fs.readFileSync('customers.json', 'utf8'));
      console.log(`📊 Migrating ${customers.length} customers...`);
      
      for (const customer of customers) {
        await db.saveCustomer({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          bookCount: customer.totalBooks || 0,
          total: customer.totalSpent || 0
        });
      }
      console.log('✅ Customers migrated\n');
    }

    // Migrate requests
    if (fs.existsSync('requests.json')) {
      const requests = JSON.parse(fs.readFileSync('requests.json', 'utf8'));
      console.log(`📊 Migrating ${requests.length} requests...`);
      
      for (const request of requests) {
        await db.createRequest({
          name: request.name,
          email: request.email,
          bookTitle: request.bookTitle,
          message: request.message
        });
      }
      console.log('✅ Requests migrated\n');
    }

    // Note: Orders migration is more complex due to relationships
    // We'll skip it for now as new orders will be created in PostgreSQL
    if (fs.existsSync('orders.json')) {
      const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
      console.log(`⚠️  Found ${orders.length} orders in JSON`);
      console.log('   Orders will be created fresh in PostgreSQL going forward\n');
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure PostgreSQL is installed and running');
    console.log('2. Create database: createdb perpustakaan_digital');
    console.log('3. Run: node server-postgres.js');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
