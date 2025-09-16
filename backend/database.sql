-- Membuat database
CREATE DATABASE IF NOT EXISTS batik_nusantara;
USE batik_nusantara;

-- Tabel produk
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category VARCHAR(100),
  discount INT DEFAULT 0,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel pesanan
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'transfer',
  status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel item pesanan
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabel admin
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Masukkan data sampel produk
INSERT INTO products (name, description, price, stock, category, discount, image) VALUES
('Batik Parang', 'Batik Parang adalah salah satu motif batik tertua di Indonesia. Motif ini memiliki makna keberanian dan kekuatan.', 350000, 15, 'Klasik', 10, '/uploads/placeholder-1.jpg'),
('Batik Megamendung', 'Batik Megamendung adalah motif batik khas Cirebon yang terinspirasi dari bentuk awan. Melambangkan pembawa kesuburan dan kehidupan.', 450000, 10, 'Pesisir', 0, '/uploads/placeholder-2.jpg'),
('Batik Kawung', 'Batik Kawung adalah motif batik berbentuk lingkaran yang saling bersinggungan. Melambangkan harapan dan kesempurnaan hidup.', 375000, 20, 'Klasik', 15, '/uploads/placeholder-3.jpg'),
('Batik Sekar Jagad', 'Batik Sekar Jagad memiliki motif yang beragam dalam satu kain. Melambangkan keberagaman dunia yang indah.', 500000, 8, 'Modern', 0, '/uploads/placeholder-4.jpg'),
('Batik Tujuh Rupa', 'Batik Tujuh Rupa adalah batik khas Pekalongan dengan tujuh warna berbeda. Sangat cerah dan berwarna-warni.', 425000, 12, 'Pesisir', 5, '/uploads/placeholder-5.jpg'),
('Batik Sogan', 'Batik Sogan adalah batik dengan warna dominan coklat kekuningan. Batik ini memiliki kesan elegan dan klasik.', 400000, 15, 'Klasik', 0, '/uploads/placeholder-6.jpg');

-- Masukkan data admin default
INSERT INTO admins (username, password, name) VALUES
('admin', '$2a$10$XFAMxYMwQQz.KPTFTm1vAeRxmIzk66S8.ck/QQI.3ZdS5TDyAzJHi', 'Administrator');
-- Password: admin123 (gunakan bcrypt untuk enkripsi password di aplikasi)