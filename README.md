# Tugas 3 Pemrograman Web - CRUD Katalog Buku

Aplikasi web CRUD (Create, Read, Update, Delete) sederhana dengan tema **Katalog Buku Perpustakaan**,
dibangun memakai Express, EJS, dan MySQL (driver `mysql2` dengan Connection Pool berbasis Promise).

- Nama   : Yohanes Risky Putra Helben Mbira
- NIM    : 42530014

## Video Penjelasan (YouTube, Public)
https://youtu.be/4wh7a9A4DbE

## Fitur

- Create, Read (dengan pencarian & paginasi), Update, Delete data buku
- Relasi tabel `buku` -> `kategori` (foreign key)
- MySQL Connection Pool (`mysql2/promise`)
- Seluruh query memakai prepared statements (`?`), tanpa konkatenasi string
- Kredensial database di `.env` (tidak diunggah ke GitHub)
- Pola Post-Redirect-Get pada semua mutasi data

## Cara Menjalankan

1. Pastikan Node.js dan MySQL sudah terpasang dan MySQL berjalan.
2. Clone repositori lalu masuk ke foldernya, kemudian pasang dependensi:
   ```bash
   npm install
   ```
3. Impor skema dan data awal:
   ```bash
   mysql -u root -p < database.sql
   ```
4. Salin `.env.example` menjadi `.env`, lalu isi password MySQL Anda:
   ```bash
   cp .env.example .env
   ```
5. Jalankan aplikasi:
   ```bash
   npm start
   ```
6. Buka http://localhost:3000

## Struktur Proyek

```
.
├── database.sql
├── db.js
├── server.js
├── views/
│   ├── index.ejs
│   └── form.ejs
├── public/style.css
├── .env.example
└── .gitignore
```
