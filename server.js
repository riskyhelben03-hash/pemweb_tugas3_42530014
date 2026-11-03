// server.js - Aplikasi CRUD Katalog Buku (Express + MySQL2 Pool + Prepared Statements)
require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PER_PAGE = 5;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false })); // membaca data formulir POST
app.use(express.static(path.join(__dirname, 'public')));

// Pesan notifikasi (kunci tetap, bukan input mentah pengguna)
const PESAN = {
  ditambah: 'Data buku berhasil ditambahkan.',
  diubah: 'Data buku berhasil diubah.',
  dihapus: 'Data buku berhasil dihapus.',
};

// Validasi input formulir; mengembalikan { data, errors }
function validasi(body) {
  const data = {
    judul: (body.judul || '').trim(),
    penulis: (body.penulis || '').trim(),
    tahun: Number.parseInt(body.tahun, 10),
    kategori_id: Number.parseInt(body.kategori_id, 10),
  };
  const errors = [];
  if (!data.judul) errors.push('Judul wajib diisi.');
  if (!data.penulis) errors.push('Penulis wajib diisi.');
  if (!Number.isInteger(data.tahun) || data.tahun < 1000 || data.tahun > 2100) {
    errors.push('Tahun terbit harus berupa angka 1000-2100.');
  }
  if (!Number.isInteger(data.kategori_id)) errors.push('Kategori wajib dipilih.');
  return { data, errors };
}

async function ambilKategori() {
  const [rows] = await pool.execute('SELECT id, nama FROM kategori ORDER BY nama');
  return rows;
}

app.get('/', (req, res) => res.redirect('/buku'));

// ===== READ: daftar buku + pencarian + paginasi =====
app.get('/buku', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const halaman = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const cari = '%' + q + '%'; // nilai LIKE dikirim sebagai parameter, bukan digabung ke SQL

    const [hitung] = await pool.execute(
      'SELECT COUNT(*) AS total FROM buku WHERE judul LIKE ? OR penulis LIKE ?',
      [cari, cari]
    );
    const total = hitung[0].total;
    const totalHalaman = Math.max(Math.ceil(total / PER_PAGE), 1);
    const aktif = Math.min(halaman, totalHalaman);
    const offset = (aktif - 1) * PER_PAGE;

    // LIMIT/OFFSET dikirim sebagai string agar kompatibel dengan execute() di MySQL 8
    const [buku] = await pool.execute(
      `SELECT b.id, b.judul, b.penulis, b.tahun, k.nama AS kategori
       FROM buku b
       JOIN kategori k ON k.id = b.kategori_id
       WHERE b.judul LIKE ? OR b.penulis LIKE ?
       ORDER BY b.id DESC
       LIMIT ? OFFSET ?`,
      [cari, cari, String(PER_PAGE), String(offset)]
    );

    res.render('index', {
      buku,
      q,
      halaman: aktif,
      totalHalaman,
      total,
      pesan: PESAN[req.query.pesan] || null,
    });
  } catch (err) {
    next(err);
  }
});

// ===== CREATE =====
app.get('/buku/tambah', async (req, res, next) => {
  try {
    res.render('form', {
      judulHalaman: 'Tambah Buku',
      aksi: '/buku/tambah',
      buku: { judul: '', penulis: '', tahun: '', kategori_id: '' },
      kategori: await ambilKategori(),
      errors: [],
    });
  } catch (err) {
    next(err);
  }
});

app.post('/buku/tambah', async (req, res, next) => {
  try {
    const { data, errors } = validasi(req.body);
    if (errors.length) {
      return res.status(400).render('form', {
        judulHalaman: 'Tambah Buku',
        aksi: '/buku/tambah',
        buku: data,
        kategori: await ambilKategori(),
        errors,
      });
    }
    await pool.execute(
      'INSERT INTO buku (judul, penulis, tahun, kategori_id) VALUES (?, ?, ?, ?)',
      [data.judul, data.penulis, data.tahun, data.kategori_id]
    );
    res.redirect('/buku?pesan=ditambah'); // PRG
  } catch (err) {
    next(err);
  }
});

// ===== UPDATE =====
app.get('/buku/:id/edit', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, judul, penulis, tahun, kategori_id FROM buku WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).send('Data buku tidak ditemukan.');
    res.render('form', {
      judulHalaman: 'Edit Buku',
      aksi: '/buku/' + rows[0].id + '/edit',
      buku: rows[0],
      kategori: await ambilKategori(),
      errors: [],
    });
  } catch (err) {
    next(err);
  }
});

app.post('/buku/:id/edit', async (req, res, next) => {
  try {
    const { data, errors } = validasi(req.body);
    if (errors.length) {
      return res.status(400).render('form', {
        judulHalaman: 'Edit Buku',
        aksi: '/buku/' + req.params.id + '/edit',
        buku: data,
        kategori: await ambilKategori(),
        errors,
      });
    }
    await pool.execute(
      'UPDATE buku SET judul = ?, penulis = ?, tahun = ?, kategori_id = ? WHERE id = ?',
      [data.judul, data.penulis, data.tahun, data.kategori_id, req.params.id]
    );
    res.redirect('/buku?pesan=diubah'); // PRG
  } catch (err) {
    next(err);
  }
});

// ===== DELETE =====
app.post('/buku/:id/hapus', async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM buku WHERE id = ?', [req.params.id]);
    res.redirect('/buku?pesan=dihapus'); // PRG
  } catch (err) {
    next(err);
  }
});

// Penanganan galat umum
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Terjadi kesalahan pada server.');
});

app.listen(PORT, () => {
  console.log('Server berjalan di http://localhost:' + PORT);
});
