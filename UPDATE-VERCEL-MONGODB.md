# 🔄 Update Vercel dengan MongoDB & Data Terbaru

## 📋 Yang Akan Dilakukan

1. ✅ Setup MongoDB Atlas (database cloud)
2. ✅ Import data lokal (orders, customers) ke MongoDB
3. ✅ Setup environment variables di Vercel
4. ✅ Deploy aplikasi ke Vercel
5. ✅ Verifikasi data muncul di aplikasi

---

## 🚀 Langkah 1: Setup MongoDB Atlas (5 menit)

### 1.1 Buat Account & Cluster

1. Buka: https://www.mongodb.com/cloud/atlas/register
2. Sign up dengan Google (gratis)
3. Klik "Build a Database"
4. Pilih **FREE** (M0 Sandbox)
5. Provider: **AWS**
6. Region: **Singapore** (ap-southeast-1)
7. Cluster Name: `Cluster0` (default)
8. Klik "Create"

### 1.2 Buat Database User

1. Tunggu cluster selesai dibuat (2-3 menit)
2. Popup "Security Quickstart" muncul
3. **Authentication Method:** Username and Password
4. Username: `admin`
5. Password: Klik "Autogenerate Secure Password" atau buat sendiri
6. **SIMPAN PASSWORD INI!** (Anda akan butuh nanti)
7. Klik "Create User"

### 1.3 Whitelist IP Address

1. Masih di popup yang sama
2. **Where would you like to connect from?**
3. Pilih "My Local Environment"
4. Klik "Add My Current IP Address"
5. **ATAU** klik "Add a Different IP Address"
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all`
6. Klik "Add Entry"
7. Klik "Finish and Close"

### 1.4 Get Connection String

1. Klik "Connect" pada cluster Anda
2. Pilih "Connect your application"
3. Driver: **Node.js**
4. Version: **5.5 or later**
5. Copy connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Ganti `<password>` dengan password Anda!**
7. **Tambahkan nama database** di akhir:
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/perpustakaan?retryWrites=true&w=majority
   ```

**Contoh final:**
```
mongodb+srv://admin:MyP@ssw0rd123@cluster0.abc123.mongodb.net/perpustakaan?retryWrites=true&w=majority
```

**⚠️ PENTING:** Jika password ada karakter khusus (@, #, $, dll), encode dulu:
- Buka: https://www.urlencoder.org/
- Paste password
- Copy hasil encode
- Gunakan di connection string

---

## 🚀 Langkah 2: Import Data ke MongoDB (3 menit)

### 2.1 Jalankan Script Import

Di terminal/command prompt:

```bash
npm run import-mongodb
```

### 2.2 Masukkan MongoDB URI

Script akan tanya:
```
Masukkan MongoDB URI Anda:
(contoh: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/perpustakaan)

>
```

Paste connection string dari Langkah 1.4, lalu Enter.

### 2.3 Tunggu Import Selesai

Script akan import:
- ✅ Orders (pesanan)
- ✅ Customers (pelanggan)
- ✅ Requests (jika ada)

Output:
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB!

📦 Importing orders...
  ✅ Order: arum (indri.kartikasari007@gmail.com)
✅ Imported 2 orders

👥 Importing customers...
  ✅ Customer: arum (indri.kartikasari007@gmail.com)
✅ Imported 1 customers

🎉 IMPORT SELESAI!
📊 Total data imported: 3
```

---

## 🚀 Langkah 3: Setup Environment Variables di Vercel (3 menit)

### 3.1 Buka Vercel Dashboard

1. Buka: https://vercel.com/dashboard
2. Login dengan GitHub
3. Pilih project **"perpu"**

### 3.2 Tambahkan Environment Variables

1. Klik tab **"Settings"**
2. Scroll ke **"Environment Variables"**
3. Tambahkan 3 variables:

#### Variable 1: MONGODB_URI

- **Name:** `MONGODB_URI`
- **Value:** (paste connection string dari Langkah 1.4)
  ```
  mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/perpustakaan?retryWrites=true&w=majority
  ```
- **Environment:** Centang **Production**, **Preview**, **Development**
- Klik **"Save"**

#### Variable 2: EMAIL_USER

- **Name:** `EMAIL_USER`
- **Value:** `digimetateam@gmail.com`
- **Environment:** Centang **Production**, **Preview**, **Development**
- Klik **"Save"**

#### Variable 3: EMAIL_PASS

- **Name:** `EMAIL_PASS`
- **Value:** `rzxfnvxzgugcxdir`
- **Environment:** Centang **Production**, **Preview**, **Development**
- Klik **"Save"**

---

## 🚀 Langkah 4: Deploy/Redeploy ke Vercel (2 menit)

### 4.1 Redeploy

1. Klik tab **"Deployments"**
2. Pilih deployment terakhir
3. Klik **"..."** (titik tiga)
4. Klik **"Redeploy"**
5. Tunggu 2-3 menit

### 4.2 Tunggu Deploy Selesai

Status akan berubah:
- 🟡 Building...
- 🟡 Deploying...
- ✅ Ready

---

## 🚀 Langkah 5: Verifikasi (2 menit)

### 5.1 Buka Aplikasi

Buka URL Vercel Anda (contoh: https://perpu.vercel.app)

### 5.2 Test Fitur

**Halaman Utama:**
- ✅ Buku-buku muncul (24,148 buku)
- ✅ Search berfungsi
- ✅ Filter kategori berfungsi

**Checkout:**
- ✅ Tambah ke keranjang
- ✅ Checkout
- ✅ Pop-up link Google Drive muncul
- ✅ Email terkirim

**Admin Panel:**
- Buka: https://perpu.vercel.app/admin.html
- ✅ Tab Pesanan - Data muncul!
- ✅ Tab Pelanggan - Data muncul!
- ✅ Export CSV berfungsi

### 5.3 Cek Data di MongoDB

1. Buka MongoDB Atlas: https://cloud.mongodb.com/
2. Klik "Browse Collections"
3. Database: `perpustakaan`
4. Collections:
   - `orders` - Ada data pesanan
   - `customers` - Ada data pelanggan
   - `requests` - Ada data request (jika ada)

---

## 📊 Hasil Akhir

Setelah semua langkah selesai:

**✅ Aplikasi live di Vercel:**
- URL: https://perpu.vercel.app
- Database: MongoDB Atlas (cloud)
- Data: Sudah ter-import dari local

**✅ Fitur yang berfungsi:**
- Katalog 24,148 buku
- Search & filter
- Keranjang belanja
- Checkout
- Link Google Drive otomatis
- Email otomatis
- Database pelanggan (dari local + baru)
- Admin panel dengan data lengkap
- Export CSV

**✅ Data tersinkronisasi:**
- Orders dari local → MongoDB
- Customers dari local → MongoDB
- Order baru → Langsung ke MongoDB
- Customer baru → Langsung ke MongoDB

---

## 🐛 Troubleshooting

### Error: "Authentication failed"

**Solusi:**
- Cek password di connection string
- Pastikan tidak ada karakter khusus yang belum di-encode
- Cek username benar (default: `admin`)

### Error: "IP not whitelisted"

**Solusi:**
1. MongoDB Atlas → Network Access
2. Klik "Add IP Address"
3. Pilih "Allow Access from Anywhere" (0.0.0.0/0)
4. Klik "Confirm"

### Data tidak muncul di Vercel

**Solusi:**
1. Cek MongoDB - Data sudah ada?
2. Cek Environment Variables - MONGODB_URI benar?
3. Redeploy aplikasi
4. Cek Function Logs di Vercel

### Email tidak terkirim

**Solusi:**
1. Cek Environment Variables - EMAIL_USER dan EMAIL_PASS ada?
2. Redeploy setelah tambah env vars
3. Test checkout
4. Cek Function Logs

---

## 📋 Checklist Lengkap

- [ ] MongoDB cluster created
- [ ] Database user created & password saved
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Data imported ke MongoDB (npm run import-mongodb)
- [ ] Environment variables added di Vercel (3 variables)
- [ ] Aplikasi di-redeploy
- [ ] URL dibuka, aplikasi jalan
- [ ] Data muncul di admin panel
- [ ] Test checkout berhasil
- [ ] Email terkirim

---

## 💡 Tips

### Backup Data

Sebelum import, backup data lokal:
```bash
copy orders.json orders.backup.json
copy customers.json customers.backup.json
```

### Monitor Database

MongoDB Atlas → Metrics
- Lihat connection count
- Lihat operations per second
- Lihat storage usage

### Update Data

Jika ada data baru di local:
```bash
npm run import-mongodb
```

Data akan di-merge (tidak duplicate karena email unique).

---

**Setelah semua langkah, aplikasi Anda akan live di Vercel dengan database MongoDB!** 🎉

Data lokal sudah ter-import dan aplikasi siap digunakan 24/7.
