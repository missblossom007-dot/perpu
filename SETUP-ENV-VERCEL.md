# 🔐 Setup Environment Variables di Vercel

## ❌ Masalah: Email Tidak Terkirim

**Penyebab:** Environment variables belum diset di Vercel.

Email butuh 2 environment variables:
- `EMAIL_USER` - Email pengirim
- `EMAIL_PASS` - App Password Gmail

## ✅ Cara Setup (5 Menit)

### Langkah 1: Buka Vercel Dashboard

1. Buka: https://vercel.com/dashboard
2. Login dengan GitHub
3. Pilih project **"perpu"**

### Langkah 2: Buka Settings

1. Klik tab **"Settings"** (di menu atas)
2. Scroll ke bawah, klik **"Environment Variables"**

### Langkah 3: Tambahkan 3 Variables

#### Variable 1: MONGODB_URI

**Name:**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/perpustakaan
```

**Ganti:**
- `username` dengan username MongoDB Anda
- `password` dengan password MongoDB Anda
- `cluster0.xxxxx` dengan cluster Anda

**Environment:** Pilih **Production**, **Preview**, dan **Development** (centang semua)

Klik **"Save"**

---

#### Variable 2: EMAIL_USER

**Name:**
```
EMAIL_USER
```

**Value:**
```
digimetateam@gmail.com
```

**Environment:** Pilih **Production**, **Preview**, dan **Development** (centang semua)

Klik **"Save"**

---

#### Variable 3: EMAIL_PASS

**Name:**
```
EMAIL_PASS
```

**Value:**
```
rzxfnvxzgugcxdir
```

**Environment:** Pilih **Production**, **Preview**, dan **Development** (centang semua)

Klik **"Save"**

---

### Langkah 4: Redeploy

Setelah menambahkan environment variables:

1. Klik tab **"Deployments"**
2. Pilih deployment terakhir
3. Klik **"..."** (titik tiga)
4. Klik **"Redeploy"**
5. Tunggu 2-3 menit

### Langkah 5: Test Email

1. Buka aplikasi Vercel Anda
2. Checkout dengan email Anda sendiri
3. Cek inbox (dan folder spam)

---

## 📸 Screenshot Panduan

### Tampilan Environment Variables

Setelah setup, Anda akan melihat:

```
Environment Variables (3)

MONGODB_URI
  Production, Preview, Development
  mongodb+srv://***@cluster0.xxxxx.mongodb.net/perpustakaan

EMAIL_USER
  Production, Preview, Development
  digimetateam@gmail.com

EMAIL_PASS
  Production, Preview, Development
  ****************
```

---

## 🔍 Cara Cek Apakah Sudah Benar

### 1. Via Vercel Dashboard

Settings → Environment Variables → Harus ada 3 variables

### 2. Via Function Logs

1. Deployments → [latest deployment]
2. Klik "View Function Logs"
3. Setelah checkout, lihat log:

**✅ Berhasil:**
```
📧 Email transporter initialized
✅ Email sent to customer@email.com
```

**❌ Gagal:**
```
⚠️ Email credentials not found in environment variables
⚠️ Email not configured, skipping email send
```

### 3. Via Email

Cek inbox email pelanggan:
- Subject: "Pesanan Buku Anda - X Buku"
- Isi: Link Google Drive semua buku

---

## 🐛 Troubleshooting

### Email masih tidak terkirim?

**Cek 1: Environment Variables**
- Vercel Dashboard → Settings → Environment Variables
- Pastikan ada 3 variables
- Pastikan tidak ada typo di nama variable

**Cek 2: Redeploy**
- Setelah tambah env vars, HARUS redeploy
- Vercel tidak otomatis apply env vars ke deployment lama

**Cek 3: App Password**
- Pastikan App Password masih valid
- Test di local: `node test-email-now.js`
- Jika local berhasil tapi Vercel gagal = env vars belum diset

**Cek 4: Function Logs**
- Lihat error message di logs
- Screenshot dan beritahu saya

---

## 💡 Tips

### Keamanan

- ❌ JANGAN commit env vars ke Git
- ❌ JANGAN share App Password
- ✅ Gunakan environment variables
- ✅ Revoke App Password jika bocor

### Testing

Test di local dulu:
```bash
# Set env vars di terminal
set EMAIL_USER=digimetateam@gmail.com
set EMAIL_PASS=rzxfnvxzgugcxdir

# Test
node test-email-now.js
```

Jika local berhasil, berarti code OK. Tinggal set di Vercel.

### Multiple Environments

Vercel punya 3 environments:
- **Production** - URL utama (perpu.vercel.app)
- **Preview** - Branch preview
- **Development** - Local development

Centang semua agar env vars tersedia di semua environment.

---

## 📋 Checklist

- [ ] Buka Vercel Dashboard
- [ ] Pilih project "perpu"
- [ ] Klik Settings → Environment Variables
- [ ] Tambahkan MONGODB_URI
- [ ] Tambahkan EMAIL_USER
- [ ] Tambahkan EMAIL_PASS
- [ ] Centang Production, Preview, Development untuk semua
- [ ] Klik Save untuk setiap variable
- [ ] Redeploy aplikasi
- [ ] Tunggu 2-3 menit
- [ ] Test checkout
- [ ] Cek email masuk

---

## 🎯 Verifikasi Berhasil

Setelah setup dan redeploy:

1. **Checkout di aplikasi**
2. **Cek Function Logs:**
   ```
   ✅ Order saved: 2 books for John (john@email.com)
   💾 Customer data saved: john@email.com
   📧 Email transporter initialized
   ✅ Email sent to john@email.com
   ```
3. **Cek inbox email** - Email harus masuk!

---

## 📞 Masih Bermasalah?

Jika setelah setup masih tidak terkirim:

1. Screenshot Environment Variables (hide password!)
2. Screenshot Function Logs
3. Beritahu saya error message

Saya akan bantu debug!

---

**Environment variables adalah kunci agar email berfungsi di Vercel!**

Tanpa env vars, email tidak akan terkirim meskipun code sudah benar.
