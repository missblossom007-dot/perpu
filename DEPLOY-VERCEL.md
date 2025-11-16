# 🚀 Deploy ke Vercel - Panduan Lengkap

## 📋 Persiapan

### 1. Buat MongoDB Database (Gratis)

1. Buka: https://www.mongodb.com/cloud/atlas/register
2. Sign up (gratis)
3. Buat cluster baru (pilih FREE tier)
4. Tunggu cluster selesai dibuat (2-3 menit)
5. Klik "Connect" → "Connect your application"
6. Copy connection string, contoh:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/perpustakaan
   ```

### 2. Setup Vercel

1. Buka: https://vercel.com/signup
2. Sign up dengan GitHub
3. Install Vercel CLI (opsional):
   ```bash
   npm install -g vercel
   ```

## 🔧 Konfigurasi Aplikasi

### 1. Ganti server.js

Rename file:
```bash
# Backup server lama
mv server.js server-local.js

# Gunakan server vercel
mv server-vercel.js server.js
```

Atau edit `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server-vercel.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server-vercel.js"
    }
  ]
}
```

### 2. Buat file .env

Buat file `.env` (jangan di-commit!):
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/perpustakaan
EMAIL_USER=digimetateam@gmail.com
EMAIL_PASS=rzxfnvxzgugcxdir
```

### 3. Update .gitignore

Pastikan `.env` ada di `.gitignore`:
```
.env
.env.local
```

## 🚀 Deploy ke Vercel

### Opsi 1: Via Vercel Dashboard (MUDAH)

1. Push code ke GitHub:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. Buka: https://vercel.com/new
3. Import repository: `missblossom007-dot/perpu`
4. Klik "Import"
5. Tambahkan Environment Variables:
   - `MONGODB_URI`: (connection string dari MongoDB)
   - `EMAIL_USER`: `digimetateam@gmail.com`
   - `EMAIL_PASS`: `rzxfnvxzgugcxdir`
6. Klik "Deploy"
7. Tunggu 2-3 menit
8. Aplikasi live! 🎉

### Opsi 2: Via Vercel CLI

```bash
# Login
vercel login

# Deploy
vercel

# Tambah environment variables
vercel env add MONGODB_URI
vercel env add EMAIL_USER
vercel env add EMAIL_PASS

# Deploy production
vercel --prod
```

## 🔐 Environment Variables di Vercel

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `EMAIL_USER` | `digimetateam@gmail.com` |
| `EMAIL_PASS` | `rzxfnvxzgugcxdir` |

## ✅ Verifikasi Deployment

Setelah deploy berhasil:

1. **Buka URL Vercel** (contoh: `https://perpu.vercel.app`)
2. **Test fitur:**
   - ✅ Browse buku
   - ✅ Tambah ke keranjang
   - ✅ Checkout
   - ✅ Cek email
   - ✅ Admin panel

## 🐛 Troubleshooting

### Error: "Cannot find module 'mongoose'"
**Solusi:** Pastikan `package.json` sudah include mongoose:
```bash
npm install mongoose
git add package.json package-lock.json
git commit -m "Add mongoose"
git push
```

### Error: "MongoServerError: Authentication failed"
**Solusi:** 
- Cek MONGODB_URI di environment variables
- Pastikan username & password benar
- Whitelist IP di MongoDB Atlas (0.0.0.0/0 untuk allow all)

### Error: "Email not sent"
**Solusi:**
- Cek EMAIL_USER dan EMAIL_PASS di environment variables
- Pastikan App Password masih valid

### File REKAP BUKU.xlsx tidak terbaca
**Solusi:** File Excel harus di-commit ke Git:
```bash
git add "REKAP BUKU.xlsx"
git commit -m "Add Excel database"
git push
```

## 📊 Monitoring

### Logs
Lihat logs di Vercel Dashboard → Deployments → [deployment] → Logs

### Database
Lihat data di MongoDB Atlas → Collections

## 🔄 Update Aplikasi

Setiap kali ada perubahan:
```bash
git add .
git commit -m "Update: deskripsi"
git push
```

Vercel otomatis deploy ulang!

## 💡 Tips

1. **Custom Domain:**
   - Vercel Dashboard → Settings → Domains
   - Tambahkan domain Anda (gratis SSL)

2. **Backup Database:**
   - MongoDB Atlas → Clusters → Backup
   - Schedule automatic backups

3. **Performance:**
   - Vercel otomatis optimize
   - CDN global included
   - Serverless functions

## 🎯 Checklist Deploy

- [ ] MongoDB cluster created
- [ ] Connection string copied
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Test checkout
- [ ] Test email
- [ ] Test admin panel

## 📞 Support

Jika ada masalah:
1. Cek Vercel logs
2. Cek MongoDB Atlas logs
3. Test di local dulu dengan MongoDB

---

**Setelah deploy, aplikasi akan live 24/7 di internet! 🌍**
