# Database Pelanggan untuk Reselling

## Fitur Baru: Simpan Data Pelanggan Otomatis

Setiap kali pelanggan checkout, sistem otomatis menyimpan:
- ✅ Nama lengkap
- ✅ Email
- ✅ Nomor WhatsApp
- ✅ Total pesanan
- ✅ Total buku yang dibeli
- ✅ Total uang yang dibelanjakan
- ✅ Tanggal pertama beli
- ✅ Tanggal terakhir beli

## Cara Melihat Database Pelanggan

1. Buka http://localhost:3000/admin.html
2. Klik tab **"👥 Pelanggan"**
3. Lihat semua data pelanggan yang sudah pernah beli

### Fitur Khusus:
- **Pelanggan VIP** (belanja ≥ Rp 500.000) ditandai dengan 👑 dan highlight kuning
- **Klik nomor WhatsApp** untuk langsung chat via WhatsApp Web
- **Urutan otomatis** dari yang paling banyak belanja

## Export Data untuk Marketing

### Export ke CSV
1. Di halaman admin, tab "👥 Pelanggan"
2. Klik tombol **"📥 Export ke CSV"**
3. File `customers.csv` akan terdownload
4. Buka dengan Excel atau Google Sheets

### Isi File CSV:
- Nama
- Email
- WhatsApp
- Total Pesanan
- Total Buku
- Total Belanja
- Pertama Beli
- Terakhir Beli

## Cara Menggunakan Data untuk Reselling

### 1. Email Marketing
```
Gunakan email pelanggan untuk:
- Newsletter buku baru
- Promo diskon
- Rekomendasi buku sesuai kategori yang pernah dibeli
```

### 2. WhatsApp Broadcast
```
Gunakan nomor WhatsApp untuk:
- Broadcast promo khusus
- Follow-up pelanggan yang sudah lama tidak beli
- Program loyalitas
```

### 3. Segmentasi Pelanggan

**Pelanggan VIP (≥ Rp 500.000)**
- Berikan diskon khusus
- Akses early bird untuk buku baru
- Program referral

**Pelanggan Aktif (beli dalam 30 hari terakhir)**
- Rekomendasi buku serupa
- Cross-selling

**Pelanggan Tidak Aktif (> 90 hari tidak beli)**
- Win-back campaign
- Diskon comeback

### 4. Program Loyalitas
```
Contoh:
- Beli 10 buku → Gratis 1 buku
- Total belanja Rp 1 juta → Member VIP
- Referral program → Diskon untuk yang mereferensikan
```

## Contoh Template Marketing

### Email Marketing
```
Subject: Hai [Nama], Ada Buku Baru Nih! 📚

Halo [Nama],

Terima kasih sudah menjadi pelanggan setia kami!
Kami punya koleksi buku baru yang mungkin Anda suka:

[Daftar buku baru]

Khusus untuk Anda, diskon 15% dengan kode: LOYAL15

Salam,
Tim Perpustakaan Digital
```

### WhatsApp Broadcast
```
Halo [Nama]! 👋

Kami rindu Anda! 😊
Sudah lama tidak belanja buku ya?

Khusus hari ini, kami kasih diskon 20% untuk semua buku!
Buruan cek koleksi terbaru kami: [link]

Terima kasih! 📚
```

## File yang Tersimpan

### customers.json
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789",
    "firstPurchase": "2025-11-16T10:00:00.000Z",
    "lastPurchase": "2025-11-16T15:30:00.000Z",
    "totalOrders": 3,
    "totalBooks": 15,
    "totalSpent": 750000
  }
]
```

## Import Data Pelanggan yang Sudah Ada

Jika Anda sudah punya pesanan sebelumnya di `orders.json`:

```bash
node import-existing-customers.js
```

Script ini akan:
- Membaca semua pesanan dari orders.json
- Membuat database pelanggan dari pesanan tersebut
- Menggabungkan data jika pelanggan yang sama pernah beli berkali-kali

## Tips Keamanan Data

⚠️ **PENTING:**
- Jangan share file `customers.json` ke publik
- Backup file secara berkala
- Patuhi regulasi privasi data (GDPR, dll)
- Minta izin pelanggan sebelum kirim marketing

## Tambahkan ke .gitignore

Jika menggunakan Git, pastikan file ini tidak ter-commit:
```
customers.json
orders.json
```

## Analisis Data Pelanggan

### Metrik Penting:
1. **Customer Lifetime Value (CLV)** = Total Spent
2. **Average Order Value** = Total Spent / Total Orders
3. **Repeat Purchase Rate** = Pelanggan dengan >1 order / Total pelanggan
4. **Churn Rate** = Pelanggan tidak aktif >90 hari

### Cara Hitung di Excel:
1. Export data ke CSV
2. Buka di Excel
3. Gunakan formula:
   - `=SUM(F:F)` untuk total revenue
   - `=AVERAGE(F:F)` untuk rata-rata belanja per pelanggan
   - `=COUNTIF(D:D,">1")` untuk pelanggan repeat

## Integrasi dengan Tools Marketing

### Mailchimp
1. Export CSV
2. Import ke Mailchimp
3. Buat campaign

### WhatsApp Business API
1. Export nomor WhatsApp
2. Upload ke WhatsApp Business
3. Kirim broadcast

### Google Sheets
1. Export CSV
2. Import ke Google Sheets
3. Buat dashboard analytics

## Support

Untuk pertanyaan atau custom feature, hubungi developer.
