# Cara Test Fitur Checkout & Link Google Drive

## Test 1: Beli 1 Buku

1. Buka http://localhost:3000
2. Pilih 1 buku, klik "Tambah ke Keranjang"
3. Klik tombol "🛒 Keranjang (1)" di pojok kanan atas
4. Klik "Checkout Sekarang"
5. Isi form:
   - Nama: Test User
   - Email: test@example.com (atau email Anda yang asli)
   - WhatsApp: 08123456789
   - Alamat: Test Address
6. Klik "Kirim Pesanan"

**Yang Harus Terjadi:**
✅ Pop-up muncul dengan judul "✅ Pesanan Berhasil!"
✅ Terlihat 1 buku dengan tombol "📥 Download dari Google Drive"
✅ Klik tombol tersebut akan membuka Google Drive
✅ Keranjang otomatis kosong (angka jadi 0)

## Test 2: Beli 10 Buku Sekaligus

1. Refresh halaman (keranjang sudah kosong)
2. Pilih 10 buku berbeda, klik "Tambah ke Keranjang" pada masing-masing
3. Perhatikan angka di keranjang bertambah: (1), (2), (3)... sampai (10)
4. Klik "🛒 Keranjang (10)"
5. Review 10 buku yang dipilih
6. Klik "Checkout Sekarang"
7. Isi form dengan data Anda
8. Klik "Kirim Pesanan"

**Yang Harus Terjadi:**
✅ Pop-up muncul dengan 10 buku
✅ Setiap buku punya tombol "📥 Download dari Google Drive"
✅ Semua link bisa diklik dan membuka Google Drive
✅ Keranjang otomatis kosong

## Test 3: Cek Admin Panel

1. Buka http://localhost:3000/admin.html
2. Lihat tabel "📦 Pesanan Buku (Orders)"

**Yang Harus Terlihat:**
✅ 2 pesanan (dari test 1 dan test 2)
✅ Nama, email, WhatsApp, alamat pelanggan
✅ Jumlah buku (1 dan 10)
✅ Total harga
✅ Tombol "Lihat Buku" - klik untuk lihat detail

## Test 4: Cek File orders.json

1. Buka file `orders.json` di folder aplikasi
2. Lihat isinya

**Yang Harus Ada:**
✅ Array berisi 2 pesanan
✅ Setiap pesanan punya field `driveLink` di setiap buku
✅ Link Google Drive lengkap (https://drive.google.com/file/d/...)

Contoh struktur:
```json
{
  "books": [
    {
      "id": 1,
      "title": "Nama Buku",
      "driveLink": "https://drive.google.com/file/d/xxxxx/view?usp=drivesdk"
    }
  ]
}
```

## Test 5: Email (Jika Sudah Setup)

Jika sudah setup email di `email-config.js`:

1. Lakukan checkout dengan email Anda yang asli
2. Cek inbox email Anda

**Yang Harus Diterima:**
✅ Email dengan subject "Pesanan Buku Anda - X Buku"
✅ Daftar semua buku yang dibeli
✅ Link Google Drive untuk setiap buku
✅ Total harga

## Troubleshooting

### Link Google Drive tidak muncul?
- Cek console browser (F12) untuk error
- Pastikan server sudah restart setelah update code
- Cek file orders.json apakah ada field driveLink

### Pop-up tidak muncul?
- Cek console browser (F12)
- Pastikan tidak ada error JavaScript
- Coba refresh halaman dan checkout lagi

### Email tidak terkirim?
- Normal jika belum setup email-config.js
- Link tetap muncul di browser
- Lihat console server untuk pesan error

### Keranjang tidak kosong setelah checkout?
- Cek console browser
- Coba clear localStorage: F12 → Application → Local Storage → Clear
- Refresh halaman

## Hasil yang Diharapkan

Setelah semua test berhasil:
- ✅ Pelanggan bisa beli 1 atau banyak buku dengan mudah
- ✅ Link Google Drive langsung muncul setelah checkout
- ✅ Email otomatis terkirim (jika sudah setup)
- ✅ Admin bisa lihat semua pesanan
- ✅ Data tersimpan dengan lengkap di orders.json
