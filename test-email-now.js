const { initializeEmailTransporter, sendOrderEmail } = require('./email-config');

console.log('🧪 Testing email configuration...\n');

initializeEmailTransporter();

const testBooks = [
  {
    title: 'Test Book - Panduan Aplikasi',
    author: 'Admin',
    price: 50000,
    driveLink: 'https://drive.google.com/file/d/1fm1fFWMkP8mBvbDMU0mGc5R4QAfpU7q4/view?usp=drivesdk'
  }
];

console.log('📧 Sending test email to: digimetateam@gmail.com\n');

sendOrderEmail('digimetateam@gmail.com', 'Test User', testBooks, 50000)
  .then(result => {
    console.log('\n✅ Test Result:', result);
    if (result.success) {
      console.log('\n🎉 EMAIL BERHASIL TERKIRIM!');
      console.log('📬 Cek inbox email Anda: digimetateam@gmail.com');
      console.log('💡 Jika tidak ada di inbox, cek folder Spam/Junk');
    } else {
      console.log('\n❌ EMAIL GAGAL:', result.message);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  });
