-- database.sql - Skema & data awal Tugas 3 Pemrograman Web (Katalog Buku)
-- Cara impor: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS pemweb_tugas3
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pemweb_tugas3;

-- ===== DDL =====
DROP TABLE IF EXISTS buku;
DROP TABLE IF EXISTS kategori;

CREATE TABLE kategori (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama VARCHAR(50)  NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE buku (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  judul       VARCHAR(150) NOT NULL,
  penulis     VARCHAR(100) NOT NULL,
  tahun       SMALLINT     NOT NULL,
  kategori_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_buku_kategori
    FOREIGN KEY (kategori_id) REFERENCES kategori (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ===== DML (data sampel) =====
INSERT INTO kategori (nama) VALUES
  ('Pemrograman'),
  ('Basis Data'),
  ('Jaringan'),
  ('Novel'),
  ('Sains');

INSERT INTO buku (judul, penulis, tahun, kategori_id) VALUES
  ('Belajar JavaScript Dasar',        'Andi Pratama',      2020, 1),
  ('Pemrograman Web dengan Express',  'Budi Santoso',      2022, 1),
  ('Dasar-Dasar Algoritma',           'Citra Lestari',     2019, 1),
  ('Mahir MySQL',                     'Dewi Anggraini',    2021, 2),
  ('Desain Basis Data Relasional',    'Eko Prasetyo',      2018, 2),
  ('Jaringan Komputer Modern',        'Fajar Nugroho',     2023, 3),
  ('Keamanan Jaringan',               'Gita Permata',      2020, 3),
  ('Laskar Pelangi',                  'Andrea Hirata',     2005, 4),
  ('Bumi Manusia',                    'Pramoedya A. Toer', 1980, 4),
  ('Pengantar Fisika',                'Hadi Wijaya',       2017, 5),
  ('Dasar Kimia Umum',                'Indah Sari',        2016, 5),
  ('Struktur Data dan Algoritma',     'Joko Susilo',       2021, 1);
