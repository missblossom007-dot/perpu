# 🐘 Install PostgreSQL di Windows - Panduan Lengkap

## Metode 1: Download Installer (Recommended)

### Step 1: Download PostgreSQL
1. Buka browser, kunjungi: https://www.postgresql.org/download/windows/
2. Klik "Download the installer"
3. Pilih versi terbaru (PostgreSQL 16.x)
4. Download untuk Windows x86-64

### Step 2: Install PostgreSQL
1. Jalankan file installer yang sudah didownload
2. Klik "Next" pada welcome screen
3. **Installation Directory**: Biarkan default `C:\Program Files\PostgreSQL\16`
4. **Select Components**: Centang semua (PostgreSQL Server, pgAdmin 4, Command Line Tools)
5. **Data Directory**: Biarkan default
6. **Password**: 
   - Masukkan password untuk superuser `postgres`
   - **PENTING**: Catat password ini! Anda akan butuh nanti
   - Contoh: `admin123` atau `postgres123`
7. **Port**: Biarkan default `5432`
8. **Locale**: Pilih "Default locale"
9. Klik "Next" dan tunggu instalasi selesai (5-10 menit)

### Step 3: Verifikasi Instalasi
Buka Command Prompt atau PowerShell:

```bash
psql --version
```

Jika muncul error "command not found", tambahkan ke PATH:
1. Buka "Environment Variables"
2. Edit "Path" di System Variables
3. Tambahkan: `C:\Program Files\PostgreSQL\16\bin`
4. Restart Command Prompt

## Metode 2: Via Chocolatey (Untuk Advanced Users)

```bash
# Install Chocolatey dulu jika belum ada
# Buka PowerShell as Administrator, jalankan:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install PostgreSQL
choco install postgresql
```

## Step 4: Buat Database

### Via Command Line:
```bash
# Login ke PostgreSQL
psql -U postgres

# Masukkan password yang Anda buat saat install

# Buat database
CREATE DATABASE perpustakaan_digital;

# Cek database
\l

# Keluar
\q
```

### Via pgAdmin 4 (GUI):
1. Buka pgAdmin 4 dari Start Menu
2. Masukkan master password (buat baru jika pertama kali)
3. Klik kanan "Databases" > "Create" > "Database"
4. Nama: `perpustakaan_digital`
5. Klik "Save"

## Step 5: Setup Environment Variable

Buat file `.env` di folder project Anda:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/perpustakaan_digital
NODE_ENV=development
```

**Ganti `YOUR_PASSWORD`** dengan password PostgreSQL Anda!

Contoh:
```env
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/perpustakaan_digital
NODE_ENV=development
```

## Step 6: Test Koneksi

Jalankan script test:

```bash
node -e "const {Pool} = require('pg'); const pool = new Pool({connectionString: 'postgresql://postgres:YOUR_PASSWORD@localhost:5432/perpustakaan_digital'}); pool.query('SELECT NOW()', (err, res) => { console.log(err ? 'Error: ' + err : 'Connected! Time: ' + res.rows[0].now); pool.end(); });"
```

Jika berhasil, akan muncul waktu sekarang.

## Step 7: Jalankan Aplikasi

```bash
# Migrasi data dari JSON (opsional)
npm run migrate

# Jalankan server dengan PostgreSQL
npm start
```

Server akan:
1. ✅ Membuat tabel otomatis
2. ✅ Import 24,193 buku dari Excel (pertama kali)
3. ✅ Siap di http://localhost:3000

## 🔧 Troubleshooting

### Error: "psql is not recognized"
**Solusi**: Tambahkan PostgreSQL ke PATH
1. Cari folder: `C:\Program Files\PostgreSQL\16\bin`
2. Copy path tersebut
3. Windows Search > "Environment Variables"
4. Edit "Path" > New > Paste path
5. OK > Restart Command Prompt

### Error: "password authentication failed"
**Solusi**: 
- Cek password di file `.env`
- Pastikan sama dengan password saat install
- Atau reset password:
  ```bash
  psql -U postgres
  ALTER USER postgres PASSWORD 'newpassword';
  ```

### Error: "database does not exist"
**Solusi**:
```bash
createdb -U postgres perpustakaan_digital
```

### Error: "port 5432 already in use"
**Solusi**:
1. Buka Services (`services.msc`)
2. Cari "postgresql-x64-16"
3. Restart service
4. Atau ganti port di connection string

### PostgreSQL Service tidak jalan
**Solusi**:
1. Windows Search > "Services"
2. Cari "postgresql-x64-16"
3. Klik kanan > Start
4. Set "Startup type" ke "Automatic"

## 📊 Cek Status PostgreSQL

### Via Command Line:
```bash
# Cek service status
sc query postgresql-x64-16

# Login dan cek databases
psql -U postgres -l
```

### Via pgAdmin 4:
1. Buka pgAdmin 4
2. Expand "Servers" > "PostgreSQL 16"
3. Lihat semua databases

## 🎯 Next Steps

Setelah PostgreSQL terinstall:

1. ✅ Buat database `perpustakaan_digital`
2. ✅ Setup file `.env`
3. ✅ Jalankan `npm start`
4. ✅ Test di browser: http://localhost:3000
5. ✅ Cek admin panel: http://localhost:3000/admin.html

## 💡 Tips

- **Backup Database**: 
  ```bash
  pg_dump -U postgres perpustakaan_digital > backup.sql
  ```

- **Restore Database**:
  ```bash
  psql -U postgres perpustakaan_digital < backup.sql
  ```

- **Lihat semua tables**:
  ```bash
  psql -U postgres -d perpustakaan_digital
  \dt
  ```

- **Query manual**:
  ```bash
  psql -U postgres -d perpustakaan_digital
  SELECT COUNT(*) FROM books;
  SELECT * FROM customers LIMIT 5;
  ```

## 🚀 Deploy ke Production

Untuk production, gunakan cloud PostgreSQL:

1. **Neon** (Gratis): https://neon.tech
2. **Supabase** (Gratis): https://supabase.com
3. **Railway** (Gratis tier): https://railway.app
4. **Heroku Postgres**: https://heroku.com

Tinggal copy connection string dan set di Vercel environment variables!
