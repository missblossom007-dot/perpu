# Aplikasi Perpustakaan Digital

Aplikasi web sederhana untuk mengelola dan mencari koleksi buku PDF.

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

## Cara Menjalankan

1. Pastikan Node.js sudah terinstall
2. Buka terminal/command prompt di folder ini
3. Jalankan perintah:
   ```
   npm start
   ```
4. Buka browser dan akses: http://localhost:3000

## Struktur File

```
aplikasi-buku/
├── server.js              # Backend server
├── REKAP BUKU.xlsx        # Database buku (Excel)
├── requests.json          # Data request pelanggan
├── orders.json            # Data pesanan pelanggan
├── customers.json         # Database pelanggan (auto-generated)
├── public/
│   ├── index.html         # Halaman utama
│   ├── admin.html         # Admin panel
│   ├── style.css          # Styling
│   └── script.js          # Frontend logic
└── package.json
```

## Akses Aplikasi

- **Halaman Utama**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

## Data Buku

Total: 24,148 buku dari file REKAP BUKU.xlsx

Data yang digunakan:
- Judul buku (File Name)
- Penulis (Unnamed: 15)
- Kategori (Unnamed: 13)
- Harga (Unnamed: 14)
- Deskripsi
- Cover image
- Link Google Drive

## Fitur Email Otomatis

Setelah checkout, pelanggan akan:
1. ✅ Langsung melihat semua link Google Drive di browser
2. ✅ Menerima email berisi link download semua buku

**Setup Email:** Lihat panduan lengkap di [SETUP-EMAIL.md](SETUP-EMAIL.md)

## Catatan

- Aplikasi ini menggunakan data dari file Excel yang sudah ada
- Request pelanggan disimpan di file `requests.json`
- Pesanan disimpan di file `orders.json`
- Email otomatis (opsional, perlu konfigurasi - lihat SETUP-EMAIL.md)
- Untuk production, disarankan menggunakan database seperti MongoDB atau PostgreSQL
