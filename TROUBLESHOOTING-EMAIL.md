# 🔧 Troubleshooting Email Tidak Terkirim

## ❌ Error yang Anda Alami

```
Error sending email: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Penyebab:** Kredensial email belum diisi atau salah.

## ✅ Solusi Cepat

### Opsi 1: Gunakan Setup Wizard (RECOMMENDED)

```bash
node setup-email-wizard.js
```

Wizard akan memandu Anda step-by-step untuk setup email.

### Opsi 2: Edit Manual

Edit file `email-config.js`:

```javascript
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'tokobuku@gmail.com',        // ← Ganti dengan email Anda
    pass: 'abcd efgh ijkl mnop'        // ← Ganti dengan App Password
  }
};
```

## 📧 Cara Mendapatkan App Password

### Untuk Gmail:

1. **Aktifkan 2-Step Verification**
   - Buka: https://myaccount.google.com/security
   - Cari "2-Step Verification"
   - Klik dan ikuti petunjuk

2. **Generate App Password**
   - Buka: https://myaccount.google.com/apppasswords
   - Pilih "Mail" sebagai app
   - Pilih "Windows Computer" atau "Other"
   - Klik "Generate"
   - Copy password 16 digit (contoh: `abcd efgh ijkl mnop`)

3. **Paste ke email-config.js**
   ```javascript
   pass: 'abcdefghijklmnop'  // Tanpa spasi!
   ```

### Untuk Outlook/Hotmail:

```javascript
const emailConfig = {
  service: 'outlook',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'  // Password biasa bisa dipakai
  }
};
```

### Untuk Yahoo:

1. Buka: https://login.yahoo.com/account/security
2. Generate "App Password"
3. Copy password

```javascript
const emailConfig = {
  service: 'yahoo',
  auth: {
    user: 'your-email@yahoo.com',
    pass: 'app-password-dari-yahoo'
  }
};
```

## 🔍 Cek Status Email

### 1. Cek Log Server

Setelah checkout, lihat terminal/console:

**✅ Berhasil:**
```
✅ Email sent to customer@email.com
```

**❌ Gagal:**
```
❌ Error sending email: [error message]
⚠️  Email not sent: [error message]
```

### 2. Test Email Secara Manual

Buat file `test-email.js`:

```javascript
const { initializeEmailTransporter, sendOrderEmail } = require('./email-config');

initializeEmailTransporter();

const testBooks = [
  {
    title: 'Test Book',
    author: 'Test Author',
    price: 50000,
    driveLink: 'https://drive.google.com/file/d/test/view'
  }
];

sendOrderEmail('your-email@gmail.com', 'Test User', testBooks, 50000)
  .then(result => {
    console.log('Result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Jalankan:
```bash
node test-email.js
```

## 🐛 Error Umum & Solusi

### Error: "Invalid login"
**Penyebab:** Email atau password salah
**Solusi:** 
- Pastikan email benar
- Gunakan App Password, bukan password biasa (untuk Gmail/Yahoo)
- Hapus spasi di password

### Error: "Less secure app access"
**Penyebab:** Gmail tidak support lagi
**Solusi:** Harus pakai App Password (lihat cara di atas)

### Error: "Connection timeout"
**Penyebab:** Firewall atau internet
**Solusi:**
- Cek koneksi internet
- Cek firewall
- Coba provider email lain

### Error: "Self signed certificate"
**Penyebab:** SSL certificate issue
**Solusi:** Tambahkan di config:
```javascript
const emailConfig = {
  service: 'gmail',
  auth: { ... },
  tls: {
    rejectUnauthorized: false
  }
};
```

### Email masuk ke Spam
**Solusi:**
- Verifikasi domain email Anda
- Tambahkan SPF/DKIM records
- Minta pelanggan whitelist email Anda

## 🎯 Checklist Setup Email

- [ ] File `email-config.js` sudah diedit
- [ ] Email sudah diganti (bukan `your-email@gmail.com`)
- [ ] Password sudah diganti (bukan `your-app-password`)
- [ ] Untuk Gmail: 2-Step Verification sudah aktif
- [ ] Untuk Gmail: App Password sudah digenerate
- [ ] Password tidak ada spasi
- [ ] Server sudah direstart
- [ ] Test checkout sudah dilakukan
- [ ] Cek log server untuk error

## 💡 Alternatif Jika Email Tidak Bisa

### Opsi 1: Kirim Manual via WhatsApp
1. Lihat pesanan di admin panel
2. Copy link Google Drive
3. Kirim via WhatsApp ke pelanggan

### Opsi 2: Nonaktifkan Email
Edit `email-config.js`:
```javascript
function initializeEmailTransporter() {
  transporter = null; // Nonaktifkan email
  console.log('⚠️  Email disabled');
}
```

**Catatan:** Link Google Drive tetap muncul di browser setelah checkout!

## 📞 Masih Bermasalah?

### Cek Log Detail:

1. Buka terminal tempat server berjalan
2. Lakukan checkout
3. Copy semua error message
4. Cari solusi berdasarkan error message

### Informasi yang Dibutuhkan:

- Provider email (Gmail/Outlook/Yahoo)
- Error message lengkap dari terminal
- Apakah 2-Step Verification sudah aktif?
- Apakah App Password sudah digenerate?

## 🔒 Keamanan

⚠️ **JANGAN:**
- Share App Password ke orang lain
- Commit `email-config.js` ke Git public
- Gunakan password utama (harus App Password)

✅ **LAKUKAN:**
- Backup `email-config.js`
- Tambahkan ke `.gitignore`
- Generate App Password baru jika bocor
- Revoke App Password yang tidak dipakai

## 📝 Catatan Penting

1. **Tanpa email, aplikasi tetap berfungsi normal:**
   - Link Google Drive tetap muncul di browser
   - Data tetap tersimpan
   - Hanya email yang tidak terkirim

2. **Email adalah fitur opsional:**
   - Bisa diaktifkan kapan saja
   - Tidak mempengaruhi fitur lain

3. **Restart server setelah edit config:**
   ```bash
   Ctrl+C
   npm start
   ```

## ✅ Verifikasi Email Berhasil

Setelah setup, test dengan:
1. Checkout dengan email Anda sendiri
2. Cek inbox (dan folder spam)
3. Email harus berisi:
   - Daftar buku yang dibeli
   - Link Google Drive setiap buku
   - Total harga

Jika email masuk, setup berhasil! 🎉
