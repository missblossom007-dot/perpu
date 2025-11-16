# 🚨 FIX EMAIL TIDAK TERKIRIM - PANDUAN CEPAT

## ❌ Masalah Saat Ini

Email tidak terkirim karena kredensial belum diisi di `email-config.js`

Error: `Invalid login: Username and Password not accepted`

## ✅ SOLUSI TERCEPAT (5 Menit)

### Langkah 1: Jalankan Setup Wizard

```bash
npm run setup-email
```

atau

```bash
node setup-email-wizard.js
```

### Langkah 2: Ikuti Petunjuk

Wizard akan tanya:
1. **Provider email** (pilih Gmail/Outlook/Yahoo)
2. **Email Anda** (contoh: tokobuku@gmail.com)
3. **Password/App Password**

### Langkah 3: Untuk Gmail - Dapatkan App Password

**PENTING:** Gmail butuh App Password, bukan password biasa!

1. Buka: https://myaccount.google.com/security
2. Aktifkan **"2-Step Verification"** (jika belum)
3. Buka: https://myaccount.google.com/apppasswords
4. Pilih **"Mail"** → **"Windows Computer"**
5. Klik **"Generate"**
6. Copy password 16 digit (contoh: `abcd efgh ijkl mnop`)
7. Paste ke wizard (tanpa spasi: `abcdefghijklmnop`)

### Langkah 4: Restart Server

```bash
Ctrl+C
npm start
```

### Langkah 5: Test

1. Buka http://localhost:3000
2. Checkout dengan email Anda sendiri
3. Cek inbox (dan folder spam)

## 📧 Contoh Setup Gmail

File `email-config.js` setelah setup:

```javascript
const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'tokobuku@gmail.com',           // Email Anda
    pass: 'abcdefghijklmnop'              // App Password (16 digit, tanpa spasi)
  }
};
```

## 🔍 Cek Apakah Berhasil

Setelah checkout, lihat terminal:

**✅ BERHASIL:**
```
✅ Order saved: 2 books for John (john@email.com)
💾 Customer data saved: john@email.com
✅ Email sent to john@email.com
```

**❌ GAGAL:**
```
❌ Error sending email: Invalid login...
⚠️  Email not sent: Invalid login...
```

## 💡 Tips

### Jika Pakai Gmail:
- **HARUS** pakai App Password
- **HARUS** aktifkan 2-Step Verification dulu
- Password biasa **TIDAK AKAN BERFUNGSI**

### Jika Pakai Outlook:
- Password biasa bisa dipakai
- Tidak perlu App Password

### Jika Pakai Yahoo:
- Butuh App Password
- Generate di: https://login.yahoo.com/account/security

## 🆘 Masih Error?

Baca panduan lengkap: **TROUBLESHOOTING-EMAIL.md**

Atau edit manual file `email-config.js`:
1. Buka file `email-config.js`
2. Ganti `'your-email@gmail.com'` dengan email Anda
3. Ganti `'your-app-password'` dengan App Password
4. Save file
5. Restart server

## ⚠️ PENTING

**Tanpa email, aplikasi tetap berfungsi normal:**
- ✅ Link Google Drive tetap muncul di browser setelah checkout
- ✅ Data pelanggan tetap tersimpan
- ✅ Admin panel tetap bisa diakses
- ❌ Hanya email yang tidak terkirim

Email adalah fitur **OPSIONAL** untuk kenyamanan pelanggan.

## 📞 Quick Reference

| Provider | Service | App Password? |
|----------|---------|---------------|
| Gmail | `gmail` | ✅ Ya (wajib) |
| Outlook | `outlook` | ❌ Tidak |
| Yahoo | `yahoo` | ✅ Ya (wajib) |

## ✅ Checklist

- [ ] Jalankan `npm run setup-email`
- [ ] Masukkan email yang benar
- [ ] Untuk Gmail: Generate App Password
- [ ] Paste App Password (tanpa spasi)
- [ ] Restart server
- [ ] Test checkout dengan email sendiri
- [ ] Cek inbox/spam
- [ ] Lihat log server untuk konfirmasi

Setelah semua checklist ✅, email akan terkirim otomatis! 🎉
