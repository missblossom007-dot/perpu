# ✅ Checklist Deploy Vercel - Lengkap

## 🎯 Ikuti Checklist Ini Step-by-Step

### 1️⃣ MongoDB Setup

- [ ] Buka https://www.mongodb.com/cloud/atlas/register
- [ ] Sign up (gratis)
- [ ] Buat cluster FREE (M0)
- [ ] Pilih region: Singapore
- [ ] Buat user database:
  - Username: `admin`
  - Password: (buat & simpan!)
- [ ] Whitelist IP: 0.0.0.0/0 (Allow Access from Anywhere)
- [ ] Klik "Connect" → "Connect your application"
- [ ] Copy connection string:
  ```
  mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/perpustakaan
  ```
- [ ] Ganti `PASSWORD` dengan password Anda

### 2️⃣ Vercel Project Setup

- [ ] Buka https://vercel.com/new
- [ ] Login dengan GitHub
- [ ] Import repository: `missblossom007-dot/perpu`
- [ ] Klik "Import"

### 3️⃣ Environment Variables (PENTING!)

Di halaman import, sebelum deploy, tambahkan 3 variables:

**Variable 1:**
- [ ] Name: `MONGODB_URI`
- [ ] Value: (paste connection string dari step 1)
- [ ] Centang: Production, Preview, Development

**Variable 2:**
- [ ] Name: `EMAIL_USER`
- [ ] Value: `digimetateam@gmail.com`
- [ ] Centang: Production, Preview, Development

**Variable 3:**
- [ ] Name: `EMAIL_PASS`
- [ ] Value: `rzxfnvxzgugcxdir`
- [ ] Centang: Production, Preview, Development

### 4️⃣ Deploy

- [ ] Klik "Deploy"
- [ ] Tunggu 2-3 menit
- [ ] Status harus: ✅ Ready

### 5️⃣ Test Aplikasi

- [ ] Buka URL Vercel (contoh: https://perpu.vercel.app)
- [ ] Halaman utama muncul?
- [ ] Buku-buku terlihat?
- [ ] Bisa search?
- [ ] Bisa tambah ke keranjang?

### 6️⃣ Test Checkout

- [ ] Pilih beberapa buku
- [ ] Tambah ke keranjang
- [ ] Checkout dengan email Anda
- [ ] Pop-up link Google Drive muncul?
- [ ] Cek inbox email (dan spam)
- [ ] Email masuk dengan link buku?

### 7️⃣ Test Admin Panel

- [ ] Buka: https://perpu.vercel.app/admin.html
- [ ] Tab Pesanan - Ada data?
- [ ] Tab Pelanggan - Ada data?
- [ ] Export CSV - Berfungsi?

---

## 🐛 Jika Ada Error

### Error: "Cannot GET /"

**Solusi:**
- [ ] Tunggu 5 menit (deploy butuh waktu)
- [ ] Hard refresh: Ctrl+F5
- [ ] Clear cache browser
- [ ] Cek Vercel deployment status

### Error: "500 Internal Server Error"

**Solusi:**
- [ ] Cek MongoDB connection string
- [ ] Pastikan password benar
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Cek Function Logs di Vercel

### Error: Email tidak terkirim

**Solusi:**
- [ ] Cek Environment Variables di Vercel
- [ ] Pastikan EMAIL_USER dan EMAIL_PASS sudah diset
- [ ] Redeploy setelah tambah env vars
- [ ] Cek Function Logs untuk error message

### Error: Buku tidak muncul

**Solusi:**
- [ ] Pastikan file "REKAP BUKU.xlsx" ada di GitHub
- [ ] Cek Function Logs
- [ ] Redeploy

---

## 📊 Status Check

### Vercel Dashboard

Buka: https://vercel.com/dashboard

**Harus terlihat:**
- Project: perpu
- Status: ✅ Ready
- Domains: perpu.vercel.app (atau custom)
- Last deployed: (baru-baru ini)

### Environment Variables

Settings → Environment Variables

**Harus ada 3:**
1. MONGODB_URI
2. EMAIL_USER
3. EMAIL_PASS

### Function Logs

Deployments → [latest] → Function Logs

**Setelah checkout, harus muncul:**
```
✅ Order saved: X books for Name (email)
💾 Customer data saved: email
📧 Email transporter initialized
✅ Email sent to email
```

---

## 🎯 Hasil Akhir

Setelah semua checklist ✅:

**Aplikasi live di:**
- URL: https://perpu.vercel.app (atau custom domain)
- Status: 🟢 Online 24/7
- Database: MongoDB Atlas (cloud)
- Email: Otomatis terkirim

**Fitur yang berfungsi:**
- ✅ Katalog 24,148 buku
- ✅ Search & filter
- ✅ Keranjang belanja
- ✅ Checkout
- ✅ Link Google Drive otomatis
- ✅ Email otomatis
- ✅ Database pelanggan
- ✅ Admin panel
- ✅ Export CSV

---

## 📞 Butuh Bantuan?

Jika ada yang tidak berfungsi:

1. **Cek checklist** - Pastikan semua ✅
2. **Cek logs** - Function Logs di Vercel
3. **Screenshot** - Error message
4. **Beritahu saya** - Saya akan bantu!

---

**Ikuti checklist ini step-by-step untuk deploy yang sukses!** 🚀
