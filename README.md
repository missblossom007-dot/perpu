# 📚 Aplikasi Perpustakaan Digital

Aplikasi web untuk mengelola dan menjual koleksi 24,193 buku PDF dengan shopping cart, email otomatis, dan database pelanggan.

## 🆕 PostgreSQL Support (Optional)

Aplikasi sekarang support **PostgreSQL** untuk performa dan skalabilitas lebih baik!

- ⚡ **10x lebih cepat** untuk 24,193 buku
- 🔒 **ACID transactions** untuk data integrity
- 📈 **Scalable** untuk jutaan records
- 🚀 **Production-ready** untuk deployment serius

**Default**: Aplikasi menggunakan JSON files (simple & quick)

**Upgrade**: Baca [START-HERE-POSTGRESQL.md](START-HERE-POSTGRESQL.md) untuk setup PostgreSQL

**Quick Start**: [QUICK-START-POSTGRESQL.md](QUICK-START-POSTGRESQL.md) (5 menit)

## Fitur

✅ **Pencarian Buku** - Cari berdasarkan judul atau penulis
✅ **Filter Kategori** - Filter buku berdasarkan kategori
✅ **Detail Buku** - Lihat informasi lengkap buku dengan cover
✅ **Keranjang Belanja** - Tambahkan banyak buku sekaligus ke keranjang
✅ **Checkout Cepat** - Beli 10 buku atau lebih dalam satu transaksi
✅ **Link Google Drive Otomatis** - Langsung muncul setelah checkout
✅ **Database Pelanggan** - Simpan data pelanggan untuk reselling
✅ **Export Data** - Export pelanggan ke CSV untuk marketing
✅ **Request Buku** - Pelanggan bisa request buku yang belum tersedia
✅ **Admin Panel** - Lihat pesanan, pelanggan, dan request
✅ **Pagination** - Navigasi halaman untuk banyak data

## 🚀 Cara Menjalankan

### Quick Start (JSON Files - Default)

```bash
npm start
```

Buka: http://localhost:3000

**Simple, langsung jalan!** Tidak perlu install database.

### Upgrade ke PostgreSQL (Optional)

Untuk performa 10x lebih cepat dan production-ready:

```bash
npm run start:postgres
```

**Perlu setup dulu**: Baca [QUICK-START-POSTGRESQL.md](QUICK-START-POSTGRESQL.md) (5 menit)

**Catatan**: Lihat [CATATAN-PENTING.md](CATATAN-PENTING.md) untuk detail mode default

## 📁 Struktur File

```
aplikasi-buku/
├── server.js                      # Backend server (JSON)
├── server-postgres.js             # Backend server (PostgreSQL) ⭐
├── db-postgres.js                 # PostgreSQL database layer ⭐
├── migrate-to-postgres.js         # Migration script ⭐
├── REKAP BUKU.xlsx                # Database buku (24,193 buku)
├── email-config.js                # Email configuration
├── .env                           # Environment variables
├── requests.json                  # Data request (JSON mode)
├── orders.json                    # Data pesanan (JSON mode)
├── customers.json                 # Database pelanggan (JSON mode)
├── public/
│   ├── index.html                 # Halaman utama
│   ├── admin.html                 # Admin panel
│   ├── style.css                  # Styling
│   └── script.js                  # Frontend logic
├── QUICK-START-POSTGRESQL.md      # Quick start PostgreSQL ⭐
├── INSTALL-POSTGRESQL-WINDOWS.md  # Install guide ⭐
├── SETUP-POSTGRESQL.md            # Setup guide ⭐
├── MIGRASI-POSTGRESQL.md          # Migration summary ⭐
└── package.json
```

## Akses Aplikasi

- **Halaman Utama**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

## 📊 Data Buku

Total: **24,193 buku** dari file REKAP BUKU.xlsx

Data yang digunakan:
- Judul buku (File Name)
- Penulis (Unnamed: 15)
- Kategori (Unnamed: 13)
- Harga (Unnamed: 14)
- Deskripsi
- Cover image
- Link Google Drive (auto-convert ke direct download)

### Database Options:

**PostgreSQL** (Recommended):
- ⚡ Fast queries dengan indexing
- 🔗 Relational data (orders → customers)
- 📈 Scalable untuk production
- 🔒 ACID transactions

**JSON Files** (Simple):
- 📄 File-based storage
- 🚀 Quick setup, no database needed
- ⚠️ Limited scalability

## Fitur Email Otomatis

Setelah checkout, pelanggan akan:
1. ✅ Langsung melihat semua link Google Drive di browser
2. ✅ Menerima email berisi link download semua buku

**Setup Email:** Lihat panduan lengkap di [SETUP-EMAIL.md](SETUP-EMAIL.md)

## 🛠️ NPM Scripts

```bash
npm start              # Jalankan dengan JSON files (default)
npm run start:postgres # Jalankan dengan PostgreSQL (optional)
npm run migrate        # Migrasi data JSON → PostgreSQL
npm run setup-email    # Setup email wizard
npm run check-excel    # Check Excel data
```

## 🌐 Deploy ke Production

### Vercel + Neon PostgreSQL (Gratis)

1. **Setup Neon**:
   - Buat account: https://neon.tech
   - Buat database baru
   - Copy connection string

2. **Deploy ke Vercel**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   ```
   DATABASE_URL=postgresql://...@neon.tech/...
   NODE_ENV=production
   ```

4. **Done!** Aplikasi live dengan PostgreSQL cloud

Alternatif: Supabase, Railway, Heroku Postgres

## 📚 Dokumentasi

- **[QUICK-START-POSTGRESQL.md](QUICK-START-POSTGRESQL.md)** - Quick start PostgreSQL (5 menit)
- **[INSTALL-POSTGRESQL-WINDOWS.md](INSTALL-POSTGRESQL-WINDOWS.md)** - Install PostgreSQL lengkap
- **[SETUP-POSTGRESQL.md](SETUP-POSTGRESQL.md)** - Setup dan konfigurasi
- **[MIGRASI-POSTGRESQL.md](MIGRASI-POSTGRESQL.md)** - Migration summary
- **[SETUP-EMAIL.md](SETUP-EMAIL.md)** - Setup email otomatis
- **[CARA-PENGGUNAAN.md](CARA-PENGGUNAAN.md)** - Cara menggunakan aplikasi

## 🔧 Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL / JSON files
- **Frontend**: Vanilla JavaScript
- **Email**: Nodemailer (Gmail)
- **Excel**: XLSX library
- **Deploy**: Vercel + Neon/Supabase

## ✅ Features Checklist

- [x] 24,193 buku dari Excel
- [x] Search & filter
- [x] Shopping cart (bulk purchase)
- [x] Email otomatis dengan Google Drive links
- [x] Customer database untuk marketing
- [x] Admin panel
- [x] Export customers to CSV
- [x] PostgreSQL support
- [x] Production-ready deployment

## 💡 Tips

- Gunakan **PostgreSQL** untuk production
- Setup **email** untuk customer experience lebih baik
- **Backup database** secara berkala
- Monitor **customer data** untuk marketing
- Export **customers.csv** untuk email campaigns

## 🆘 Troubleshooting

### PostgreSQL Issues
Lihat: [INSTALL-POSTGRESQL-WINDOWS.md](INSTALL-POSTGRESQL-WINDOWS.md) - Section Troubleshooting

### Email Issues
Lihat: [TROUBLESHOOTING-EMAIL.md](TROUBLESHOOTING-EMAIL.md)

### General Issues
- Pastikan Node.js terinstall
- Pastikan port 3000 tidak digunakan
- Check `.env` file untuk credentials
- Restart server jika ada perubahan config

## 📞 Support

Jika ada masalah, cek dokumentasi di folder project atau baca file markdown yang relevan.
