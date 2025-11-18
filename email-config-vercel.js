const nodemailer = require('nodemailer');

// Email configuration for Vercel (uses environment variables)
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'digimetateam@gmail.com',
    pass: process.env.EMAIL_PASS || 'rzxfnvxzgugcxdir'
  }
};

let transporter = null;

function initializeEmailTransporter() {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Email credentials not found in environment variables');
      return;
    }
    
    transporter = nodemailer.createTransport(emailConfig);
    console.log('📧 Email transporter initialized');
  } catch (error) {
    console.log('⚠️ Email not configured:', error.message);
  }
}

// Convert Google Drive link to direct download format
function convertDriveLinkForEmail(link) {
  if (!link) return '';
  
  const patterns = [
    /\/file\/d\/([^\/]+)/,
    /id=([^&]+)/,
    /\/d\/([^\/]+)/
  ];
  
  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  
  return link;
}

async function sendOrderEmail(customerEmail, customerName, books, total) {
  if (!transporter) {
    console.log('⚠️ Email not configured, skipping email send');
    return { success: false, message: 'Email not configured' };
  }

  const booksList = books.map((book, index) => {
    const directLink = convertDriveLinkForEmail(book.driveLink);
    return `
    <div style="margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
      <strong>${index + 1}. ${book.title}</strong><br>
      <small style="color: #666;">Penulis: ${book.author}</small><br>
      <small style="color: #666;">Harga: Rp ${book.price.toLocaleString('id-ID')}</small><br>
      <a href="${directLink}" 
         style="display: inline-block; margin-top: 8px; padding: 8px 15px; 
                background: #667eea; color: white; text-decoration: none; 
                border-radius: 5px; font-size: 14px;">
        📥 Download dari Google Drive
      </a>
    </div>
  `}).join('');

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
