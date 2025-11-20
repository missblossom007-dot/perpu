# 🐘 Setup PostgreSQL untuk Aplikasi Perpustakaan Digital

## 1️⃣ Install PostgreSQL

### Windows:
1. Download PostgreSQL dari: https://www.postgresql.org/download/windows/
2. Jalankan installer dan ikuti wizard
3. Catat password untuk user `postgres` yang Anda buat
4. Default port: 5432

### Via Chocolatey (Windows):
```bash
choco install postgresql
```

### Verifikasi Instalasi:
```bash
psql --version
```

## 2️⃣ Buat Database

Buka Command Prompt atau PowerShell:

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE perpustakaan_digital;

# Keluar
\q
```

Atau langsung:
```bash
createdb -U postgres perpustakaan_digital
```

## 3️⃣ Konfigurasi Environment

Buat file `.env` di root project:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/perpustakaan_digital
NODE_ENV=development
```

Ganti `YOUR_PASSWORD` dengan password PostgreSQL Anda.

## 4️⃣ Migrasi Data (Opsional)

Jika Anda punya data dari JSON files:

```bash
node migrate-to-postgres.js
```

Ini akan memindahkan:
- ✅ Customers dari `customers.json`
- ✅ Requests dari `requests.json`

## 5️⃣ Jalankan Server

```bash
node server-postgres.js
```

Server akan:
1. Membuat tabel-tabel database otomatis
2. Import 24,193 buku dari Excel (pertama kali saja)
3. Siap menerima request di http://localhost:3000

## 6️⃣ Struktur Database

### Tabel yang dibuat otomatis:

**books**
- id, title, author, category, price
- description, cover, drive_link, slug

**customers**
- id, name, email, phone
- first_purchase, last_purchase
- total_orders, total_books, total_spent

**orders**
- id, customer_id, customer_name, customer_email
- customer_phone, customer_address
- total, book_count, created_at

**order_items**
- id, order_id, book_id
- book_title, book_author, book_price, drive_link

**requests**
- id, name, email, book_title, message, created_at

## 7️⃣ Update package.json

Tambahkan script baru:

```json
"scripts": {
  "start": "node server-postgres.js",
  "start:json": "node server.js",
  "migrate": "node migrate-to-postgres.js"
}
```

## 8️⃣ Deploy ke Production

### Vercel dengan Neon PostgreSQL (Gratis):

1. Buat akcount di https://neon.tech
2. Buat database baru
3. Copy connection string
4. Di Vercel, tambahkan environment variable:
   ```
   DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname
   NODE_ENV=production
   ```

### Atau gunakan Supabase PostgreSQL:

1. Buat project di https://supabase.com
2. Ambil connection string dari Settings > Database
3. Set di Vercel environment variables

## 🔧 Troubleshooting

### Error: "password authentication failed"
- Cek password PostgreSQL Anda
- Update file `.env` dengan password yang benar

### Error: "database does not exist"
```bash
createdb -U postgres perpustakaan_digital
```

### Error: "psql command not found"
- Tambahkan PostgreSQL ke PATH
- Lokasi default: `C:\Program Files\PostgreSQL\16\bin`

### Port 5432 sudah digunakan
- Cek service PostgreSQL: `services.msc`
- Atau ganti port di connection string

## 📊 Keuntungan PostgreSQL vs JSON

✅ **Performance**: Query lebih cepat untuk 24,193 buku
✅ **Scalability**: Bisa handle jutaan records
✅ **Relationships**: Foreign keys & joins
✅ **Transactions**: ACID compliance
✅ **Concurrent Access**: Multiple users bersamaan
✅ **Production Ready**: Untuk deployment serius

## 🎯 Next Steps

Setelah setup berhasil:
1. Test aplikasi di http://localhost:3000
2. Coba checkout beberapa buku
3. Cek admin panel untuk data customers
4. Deploy ke Vercel dengan Neon/Supabase PostgreSQL
