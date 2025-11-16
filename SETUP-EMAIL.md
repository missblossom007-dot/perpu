# Setup Email Otomatis

Aplikasi sudah bisa mengirim email otomatis ke pelanggan berisi link download buku setelah checkout.

## Cara Setup Email (Gmail)

### 1. Aktifkan 2-Step Verification
1. Buka https://myaccount.google.com/security
2. Cari "2-Step Verification"
3. Klik dan ikuti petunjuk untuk mengaktifkannya

### 2. Generate App Password
1. Buka https://myaccount.google.com/apppasswords
2. Pilih "Mail" sebagai app
3. Pilih "Windows Computer" atau "Other" sebagai device
4. Klik "Generate"
5. Copy password 16 digit yang muncul (contoh: `abcd efgh ijkl mnop`)

### 3. Edit File email-config.js
Buka file `email-config.js` dan ganti:

```javascript
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',     // Ganti dengan email Anda
    pass: 'your-app-password'          // Ganti dengan App Password dari step 2
  }
};
```

Contoh:
```javascript
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'tokobuku@gmail.com',
    pass: 'abcd efgh ijkl mnop'  // Tanpa spasi: abcdefghijklmnop
  }
};
```

### 4. Restart Server
```
Ctrl+C (stop server)
npm start (start lagi)
```

## Menggunakan Email Lain

### Outlook/Hotmail
```javascript
const emailConfig = {
  service: 'outlook',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password'
  }
};
```

### Yahoo
```javascript
const emailConfig = {
  service: 'yahoo',
  auth: {
    user: 'your-email@yahoo.com',
    pass: 'your-app-password'  // Yahoo juga butuh App Password
  }
};
```

### Custom SMTP
```javascript
const emailConfig = {
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
};
```

## Apa yang Terjadi Setelah Setup?

Setelah pelanggan checkout:
1. ✅ Link download langsung muncul di browser
2. ✅ Email otomatis terkirim ke pelanggan berisi:
   - Daftar semua buku yang dibeli
   - Link Google Drive untuk setiap buku
   - Total harga
3. ✅ Data pesanan tersimpan di `orders.json`

## Troubleshooting

### Email tidak terkirim?
- Cek apakah App Password sudah benar (tanpa spasi)
- Pastikan 2-Step Verification sudah aktif
- Cek console/terminal untuk error message
- Aplikasi tetap berfungsi normal, hanya email yang tidak terkirim

### "Less secure app access"?
- Gmail sudah tidak support ini lagi
- Harus pakai App Password (lihat step 2)

## Catatan Penting

⚠️ **Jangan share App Password ke orang lain!**
⚠️ **Jangan commit file email-config.js ke Git jika sudah ada password asli**

Untuk keamanan, tambahkan ke `.gitignore`:
```
email-config.js
```

Dan buat file `email-config.example.js` sebagai template.
