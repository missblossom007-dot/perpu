# ⚠️ CATATAN PENTING - Mode Default

## 🔄 Mode Default: JSON Files

Aplikasi ini **default menggunakan JSON files** (seperti semula).

```bash
npm start  # → Menggunakan server.js (JSON files)
```

## 🐘 Cara Pakai PostgreSQL

Jika ingin menggunakan PostgreSQL:

```bash
npm run start:postgres  # → Menggunakan server-postgres.js
```

## 📊 Perbandingan

### Mode JSON (Default - `npm start`)
- ✅ **Simple** - Tidak perlu install database
- ✅ **Quick setup** - Langsung jalan
- ✅ **File-based** - Data di JSON files
- ⚠️ **Lambat** untuk 24,193 buku
- ⚠️ **Tidak scalable**
- ❌ **Tidak untuk production**

### Mode PostgreSQL (`npm run start:postgres`)
- ⚡ **10x lebih cepat**
- 📈 **Scalable** untuk jutaan records
- 🔒 **ACID transactions**
- 🚀 **Production-ready**
- ⚠️ **Perlu install PostgreSQL** (10 menit)

## 🎯 Rekomendasi

### Untuk Development/Testing:
```bash
npm start  # JSON files - simple & quick
```

### Untuk Production/Serius:
```bash
npm run start:postgres  # PostgreSQL - fast & scalable
```

## 📚 Dokumentasi PostgreSQL

Jika ingin upgrade ke PostgreSQL:
1. **[TL-DR-POSTGRESQL.md](TL-DR-POSTGRESQL.md)** - Super ringkas (1 menit)
2. **[START-HERE-POSTGRESQL.md](START-HERE-POSTGRESQL.md)** - Panduan lengkap (3 menit)
3. **[QUICK-START-POSTGRESQL.md](QUICK-START-POSTGRESQL.md)** - Step-by-step (5 menit)

## 🔄 Switching Mode

### Pakai JSON (Default):
```bash
npm start
```

### Pakai PostgreSQL:
```bash
npm run start:postgres
```

Gampang! Tinggal ganti command.

## ✅ Status Aplikasi

**Mode Saat Ini**: JSON Files (Default)
- ✅ 24,193 buku dari Excel
- ✅ Shopping cart
- ✅ Email otomatis
- ✅ Customer database
- ✅ Admin panel
- ✅ Semua fitur jalan normal

**PostgreSQL Support**: Available (Optional)
- ✅ Code sudah siap
- ✅ Documentation lengkap
- ⚠️ Perlu install PostgreSQL dulu
- 📚 Baca dokumentasi untuk setup

## 💡 Tips

1. **Mulai dengan JSON** - Simple, langsung jalan
2. **Test semua fitur** - Pastikan aplikasi OK
3. **Upgrade ke PostgreSQL** - Jika perlu performa & scalability
4. **Deploy production** - Wajib pakai PostgreSQL

## 🚀 Quick Start

### Langsung Pakai (JSON):
```bash
npm start
# Buka: http://localhost:3000
```

### Upgrade ke PostgreSQL:
```bash
# 1. Install PostgreSQL
# 2. Buat database
# 3. Setup .env
# 4. Run:
npm run start:postgres
```

## 📞 Butuh Bantuan?

- **Pakai JSON**: Langsung `npm start` aja
- **Mau PostgreSQL**: Baca [START-HERE-POSTGRESQL.md](START-HERE-POSTGRESQL.md)
- **Ada error**: Cek dokumentasi yang relevan

---

**Default Mode**: JSON Files (Simple & Quick)
**Optional Mode**: PostgreSQL (Fast & Scalable)

**Pilih sesuai kebutuhan!** 🚀
