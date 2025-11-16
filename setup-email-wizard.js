const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n===========================================');
console.log('📧 SETUP EMAIL WIZARD');
console.log('===========================================\n');

console.log('Email akan digunakan untuk mengirim link Google Drive ke pelanggan setelah checkout.\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('Pilih provider email:');
  console.log('1. Gmail');
  console.log('2. Outlook/Hotmail');
  console.log('3. Yahoo');
  console.log('4. Custom SMTP\n');
  
  const choice = await question('Pilihan (1-4): ');
  
  let service = 'gmail';
  if (choice === '2') service = 'outlook';
  else if (choice === '3') service = 'yahoo';
  else if (choice === '4') service = 'custom';
  
  console.log('\n');
  const email = await question('Masukkan email Anda: ');
  
  if (service === 'gmail') {
    console.log('\n⚠️  PENTING untuk Gmail:');
    console.log('1. Buka: https://myaccount.google.com/security');
    console.log('2. Aktifkan "2-Step Verification"');
    console.log('3. Buka: https://myaccount.google.com/apppasswords');
    console.log('4. Generate "App Password" untuk Mail');
    console.log('5. Copy password 16 digit (contoh: abcd efgh ijkl mnop)\n');
  } else if (service === 'yahoo') {
    console.log('\n⚠️  PENTING untuk Yahoo:');
    console.log('1. Buka: https://login.yahoo.com/account/security');
    console.log('2. Generate "App Password"');
    console.log('3. Copy password yang digenerate\n');
  }
  
  const password = await question('Masukkan password/App Password: ');
  
  let configContent;
  
  if (service === 'custom') {
    const host = await question('SMTP Host (contoh: smtp.example.com): ');
    const port = await question('SMTP Port (contoh: 587): ');
    
    configContent = `const nodemailer = require('nodemailer');

const emailConfig = {
  host: '${host}',
  port: ${port},
  secure: false,
  auth: {
    user: '${email}',
    pass: '${password}'
  }
};

let transporter = null;

function initializeEmailTransporter() {
  try {
    transporter = nodemailer.createTransport(emailConfig);
    console.log('📧 Email transporter initialized');
  } catch (error) {
    console.log('⚠️  Email not configured. Orders will be saved but emails won\\'t be sent.');
  }
}

async function sendOrderEmail(customerEmail, customerName, books, total) {
  if (!transporter) {
    console.log('⚠️  Email not configured, skipping email send');
    return { success: false, message: 'Email not configured' };
  }

  const booksList = books.map((book, index) => \`
    <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
      <strong>\${index + 1}. \${book.title}</strong><br>
      <small style="color: #666;">Penulis: \${book.author}</small><br>
      <small style="color: #666;">Harga: Rp \${book.price.toLocaleString('id-ID')}</small><br>
      <a href="\${book.driveLink}" 
         style="display: inline-block; margin-top: 8px; padding: 8px 15px; 
                background: #667eea; color: white; text-decoration: none; 
                border-radius: 5px; font-size: 14px;">
        📥 Download dari Google Drive
      </a>
    </div>
  \`).join('');

  const mailOptions = {
    from: emailConfig.auth.user,
    to: customerEmail,
    subject: \`Pesanan Buku Anda - \${books.length} Buku\`,
    html: \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">✅ Pesanan Berhasil!</h2>
        <p>Halo <strong>\${customerName}</strong>,</p>
        <p>Terima kasih telah memesan buku dari kami. Berikut detail pesanan Anda:</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Total Buku:</strong> \${books.length}</p>
          <p><strong>Total Harga:</strong> Rp \${total.toLocaleString('id-ID')}</p>
        </div>

        <h3>Link Download Buku:</h3>
        \${booksList}

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          💡 Simpan email ini untuk akses link download di kemudian hari.<br>
          Jika ada pertanyaan, silakan hubungi kami.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2025 Perpustakaan Digital. Semua hak dilindungi.
        </p>
      </div>
    \`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(\`✅ Email sent to \${customerEmail}\`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, message: error.message };
  }
}

module.exports = {
  initializeEmailTransporter,
  sendOrderEmail
};
`;
  } else {
    configContent = `const nodemailer = require('nodemailer');

const emailConfig = {
  service: '${service}',
  auth: {
    user: '${email}',
    pass: '${password}'
  }
};

let transporter = null;

function initializeEmailTransporter() {
  try {
    transporter = nodemailer.createTransport(emailConfig);
    console.log('📧 Email transporter initialized');
  } catch (error) {
    console.log('⚠️  Email not configured. Orders will be saved but emails won\\'t be sent.');
  }
}

async function sendOrderEmail(customerEmail, customerName, books, total) {
  if (!transporter) {
    console.log('⚠️  Email not configured, skipping email send');
    return { success: false, message: 'Email not configured' };
  }

  const booksList = books.map((book, index) => \`
    <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
      <strong>\${index + 1}. \${book.title}</strong><br>
      <small style="color: #666;">Penulis: \${book.author}</small><br>
      <small style="color: #666;">Harga: Rp \${book.price.toLocaleString('id-ID')}</small><br>
      <a href="\${book.driveLink}" 
         style="display: inline-block; margin-top: 8px; padding: 8px 15px; 
                background: #667eea; color: white; text-decoration: none; 
                border-radius: 5px; font-size: 14px;">
        📥 Download dari Google Drive
      </a>
    </div>
  \`).join('');

  const mailOptions = {
    from: emailConfig.auth.user,
    to: customerEmail,
    subject: \`Pesanan Buku Anda - \${books.length} Buku\`,
    html: \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">✅ Pesanan Berhasil!</h2>
        <p>Halo <strong>\${customerName}</strong>,</p>
        <p>Terima kasih telah memesan buku dari kami. Berikut detail pesanan Anda:</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Total Buku:</strong> \${books.length}</p>
          <p><strong>Total Harga:</strong> Rp \${total.toLocaleString('id-ID')}</p>
        </div>

        <h3>Link Download Buku:</h3>
        \${booksList}

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          💡 Simpan email ini untuk akses link download di kemudian hari.<br>
          Jika ada pertanyaan, silakan hubungi kami.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2025 Perpustakaan Digital. Semua hak dilindungi.
        </p>
      </div>
    \`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(\`✅ Email sent to \${customerEmail}\`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, message: error.message };
  }
}

module.exports = {
  initializeEmailTransporter,
  sendOrderEmail
};
`;
  }
  
  // Backup old config
  if (fs.existsSync('email-config.js')) {
    fs.copyFileSync('email-config.js', 'email-config.backup.js');
    console.log('\n✅ Backup file lama: email-config.backup.js');
  }
  
  // Write new config
  fs.writeFileSync('email-config.js', configContent);
  
  console.log('\n✅ File email-config.js berhasil dibuat!');
  console.log('\n📝 Langkah selanjutnya:');
  console.log('1. Restart server (Ctrl+C lalu npm start)');
  console.log('2. Test dengan checkout buku');
  console.log('3. Cek email pelanggan\n');
  
  rl.close();
}

setup().catch(err => {
  console.error('Error:', err);
  rl.close();
});
