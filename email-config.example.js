const nodemailer = require('nodemailer');

// TEMPLATE KONFIGURASI EMAIL
// Copy file ini menjadi 'email-config.js' dan isi dengan kredensial Anda

const emailConfig = {
  service: 'gmail', // atau 'outlook', 'yahoo', dll
  auth: {
    user: 'your-email@gmail.com', // Ganti dengan email Anda
    pass: 'your-app-password'      // Ganti dengan App Password (bukan password biasa)
  }
};

// Cara mendapatkan App Password untuk Gmail:
// 1. Buka https://myaccount.google.com/security
// 2. Aktifkan 2-Step Verification
// 3. Buka https://myaccount.google.com/apppasswords
// 4. Generate App Password untuk "Mail"
// 5. Copy password dan paste di atas

let transporter = null;

function initializeEmailTransporter() {
  try {
    transporter = nodemailer.createTransport(emailConfig);
    console.log('📧 Email transporter initialized');
  } catch (error) {
    console.log('⚠️  Email not configured. Orders will be saved but emails won\'t be sent.');
  }
}

async function sendOrderEmail(customerEmail, customerName, books, total) {
  if (!transporter) {
    console.log('⚠️  Email not configured, skipping email send');
    return { success: false, message: 'Email not configured' };
  }

  const booksList = books.map((book, index) => `
    <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
      <strong>${index + 1}. ${book.title}</strong><br>
      <small style="color: #666;">Penulis: ${book.author}</small><br>
      <small style="color: #666;">Harga: Rp ${book.price.toLocaleString('id-ID')}</small><br>
      <a href="${book.driveLink}" 
         style="display: inline-block; margin-top: 8px; padding: 8px 15px; 
                background: #667eea; color: white; text-decoration: none; 
                border-radius: 5px; font-size: 14px;">
        📥 Download dari Google Drive
      </a>
    </div>
  `).join('');

  const mailOptions = {
    from: emailConfig.auth.user,
    to: customerEmail,
    subject: `Pesanan Buku Anda - ${books.length} Buku`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">✅ Pesanan Berhasil!</h2>
        <p>Halo <strong>${customerName}</strong>,</p>
        <p>Terima kasih telah memesan buku dari kami. Berikut detail pesanan Anda:</p>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Total Buku:</strong> ${books.length}</p>
          <p><strong>Total Harga:</strong> Rp ${total.toLocaleString('id-ID')}</p>
        </div>

        <h3>Link Download Buku:</h3>
        ${booksList}

        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          💡 Simpan email ini untuk akses link download di kemudian hari.<br>
          Jika ada pertanyaan, silakan hubungi kami.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2025 Perpustakaan Digital. Semua hak dilindungi.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${customerEmail}`);
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
