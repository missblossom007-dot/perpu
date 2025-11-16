const fs = require('fs');

// Script untuk import pelanggan dari orders.json yang sudah ada
// Jalankan sekali saja: node import-existing-customers.js

console.log('🔄 Importing existing customers from orders.json...\n');

if (!fs.existsSync('orders.json')) {
  console.log('❌ File orders.json tidak ditemukan');
  process.exit(1);
}

const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
let customers = [];

if (fs.existsSync('customers.json')) {
  customers = JSON.parse(fs.readFileSync('customers.json', 'utf8'));
  console.log(`📋 Found ${customers.length} existing customers\n`);
}

let imported = 0;
let updated = 0;

orders.forEach(order => {
  const { name, email, phone, bookCount, total, date } = order;
  
  const existingCustomer = customers.find(c => c.email === email);
  
  if (existingCustomer) {
    // Update existing customer
    existingCustomer.totalOrders += 1;
    existingCustomer.totalBooks += bookCount;
    existingCustomer.totalSpent += total;
    if (new Date(date) < new Date(existingCustomer.firstPurchase)) {
      existingCustomer.firstPurchase = date;
    }
    if (new Date(date) > new Date(existingCustomer.lastPurchase)) {
      existingCustomer.lastPurchase = date;
    }
    existingCustomer.phone = phone;
    existingCustomer.name = name;
    updated++;
    console.log(`✅ Updated: ${name} (${email})`);
  } else {
    // Add new customer
    customers.push({
      name,
      email,
      phone,
      firstPurchase: date,
      lastPurchase: date,
      totalOrders: 1,
      totalBooks: bookCount,
      totalSpent: total
    });
    imported++;
    console.log(`➕ Added: ${name} (${email})`);
  }
});

fs.writeFileSync('customers.json', JSON.stringify(customers, null, 2));

console.log('\n✅ Import completed!');
console.log(`📊 Summary:`);
console.log(`   - New customers: ${imported}`);
console.log(`   - Updated customers: ${updated}`);
console.log(`   - Total customers: ${customers.length}`);
console.log('\n💡 Buka http://localhost:3000/admin.html untuk melihat data pelanggan');
