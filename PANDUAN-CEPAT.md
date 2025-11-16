# 📖 Panduan Cepat - Aplikasi Perpustakaan Digital

## 🚀 Quick Start

### Jalankan Aplikasi
```bash
npm start
```

Buka browser: **http://localhost:3000**

## 🎯 Fitur Utama

### 1️⃣ Beli Buku (Pelanggan)
1. Cari buku → Klik "Tambah ke Keranjang"
2. Klik "🛒 Keranjang" → Review buku
3. Klik "Checkout" → Isi data
4. **Langsung dapat link Google Drive!** 📥

### 2️⃣ Database Pelanggan (Admin)
1. Buka **http://localhost:3000/admin.html**
2. Klik tab **"👥 Pelanggan"**
3. Lihat semua data pelanggan
4. Klik **"📥 Export ke CSV"** untuk marketing

### 3️⃣ Lihat Pesanan (Admin)
1. Admin panel → Tab **"📦 Pesanan"**
2. Lihat semua order dengan detail lengkap
3. Klik "Lihat Buku" untuk detail

## 💾 Data yang Tersimpan Otomatis

### Setiap Checkout:
✅ **orders.json** - Detail pesanan + link Google Drive
✅ **customers.json** - Data pelanggan untuk reselling

### Data Pelanggan Meliputi:
- Nama, Email, WhatsApp
- Total pesanan & total belanja
- Tanggal pertama & terakhir beli
- Pelanggan VIP (≥ Rp 500.000) 👑

## 📊 Untuk Marketing & Reselling

### Export Data Pelanggan:
1. Admin → Tab "Pelanggan"
2. Klik "Export ke CSV"
3. Buka di Excel/Google Sheets
4. Gunakan untuk:
   - Email marketing
   - WhatsApp broadcast
   - Program loyalitas
   - Analisis pelanggan

### Segmentasi Pelanggan:
- **VIP** → Diskon eksklusif
- **Aktif** → Rekomendasi buku
- **Tidak Aktif** → Win-back campaign

## 📧 Setup Email (Opsional)

Jika ingin email otomatis terkirim:
1. Baca **SETUP-EMAIL.md**
2. Edit `email-config.js`
3. Masukkan email & App Password
4. Restart server

**Tanpa setup email:**
- Link tetap muncul di browser ✅
- Data tetap tersimpan ✅
- Hanya email yang tidak terkirim

## 📁 File Penting

```
aplikasi-buku/
├── server.js              ← Backend
├── REKAP BUKU.xlsx        ← 24,148 buku
├── orders.json            ← Pesanan (auto)
├── customers.json         ← Pelanggan (auto)
├── requests.json          ← Request (auto)
└── public/                ← Frontend
```

## 🔧 Commands

```bash
# Jalankan aplikasi
npm start

# Import pelanggan dari orders lama
npm run import-customers
```

## 📖 Dokumentasi Lengkap

- **FITUR-LENGKAP.md** - Semua fitur detail
- **DATABASE-PELANGGAN.md** - Panduan reselling
- **TEST-CHECKOUT.md** - Cara test aplikasi
- **SETUP-EMAIL.md** - Setup email otomatis

## ✅ Checklist Setelah Install

- [x] Aplikasi berjalan di http://localhost:3000
- [x] Data buku (24,148) sudah loaded
- [x] Keranjang belanja berfungsi
- [x] Link Google Drive muncul setelah checkout
- [x] Database pelanggan tersimpan otomatis
- [x] Admin panel bisa diakses
- [x] Export CSV berfungsi

## 🎯 Use Case Harian

### Pagi:
- Cek pesanan baru di admin panel
- Follow-up pelanggan via WhatsApp
- Kirim link Google Drive (jika ada masalah)

### Siang:
- Cek request buku baru
- Update katalog jika ada buku baru

### Malam:
- Export data pelanggan
- Analisis penjualan
- Siapkan campaign marketing

## 💡 Tips

1. **Backup data** secara berkala:
   - `orders.json`
   - `customers.json`
   - `REKAP BUKU.xlsx`

2. **Jangan share** file sensitif:
   - `customers.json` (data pribadi)
   - `email-config.js` (password)

3. **Marketing rutin**:
   - Email newsletter mingguan
   - WhatsApp promo bulanan
   - Follow-up pelanggan tidak aktif

## 🆘 Troubleshooting

### Aplikasi tidak jalan?
```bash
npm install
npm start
```

### Link Google Drive tidak muncul?
- Cek console browser (F12)
- Pastikan server sudah restart
- Test dengan checkout baru

### Data pelanggan kosong?
```bash
npm run import-customers
```

### Email tidak terkirim?
- Normal jika belum setup `email-config.js`
- Link tetap muncul di browser
- Lihat **SETUP-EMAIL.md**

## 📞 Support

Aplikasi sudah lengkap dan siap digunakan!

**Akses:**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin.html

Selamat berjualan! 🎉
