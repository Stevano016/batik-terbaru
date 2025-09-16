require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'batik_nusantara',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, webp)'));
    }
  }
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data produk' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data produk' });
  }
});

// Create new product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category, discount } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, discount, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, discount || 0, image]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      description,
      price,
      stock,
      category,
      discount: discount || 0,
      image
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat produk baru' });
  }
});

// Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category, discount } = req.body;
    const productId = req.params.id;
    
    // Check if product exists
    const [existingProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    let image = existingProduct[0].image;
    
    // If new image uploaded, update image path
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      
      // Delete old image if exists
      if (existingProduct[0].image && !existingProduct[0].image.includes('placeholder')) {
        const oldImagePath = path.join(__dirname, existingProduct[0].image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, discount = ?, image = ?, updated_at = NOW() WHERE id = ?',
      [name, description, price, stock, category, discount || 0, image, productId]
    );
    
    res.json({ 
      id: productId,
      name,
      description,
      price,
      stock,
      category,
      discount: discount || 0,
      image
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui produk' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists and get image path
    const [existingProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    
    // Delete image file if exists
    if (existingProduct[0].image && !existingProduct[0].image.includes('placeholder')) {
      const imagePath = path.join(__dirname, existingProduct[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus produk' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { 
      name, email, phone, address, city, postalCode, 
      items, subtotal, shipping, total, paymentMethod, notes 
    } = req.body;
    
    // Generate order ID
    const orderId = 'INV-' + Date.now().toString().slice(-8);
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert order
      const [orderResult] = await connection.query(
        `INSERT INTO orders 
        (order_id, name, email, phone, address, city, postal_code, subtotal, shipping, total, payment_method, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, name, email, phone, address, city, postalCode, subtotal, shipping, total, paymentMethod, notes]
      );
      
      const orderId2 = orderResult.insertId;
      
      // Insert order items
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items 
          (order_id, product_id, product_name, price, quantity, subtotal) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId2, item.id, item.name, item.price, item.quantity, item.price * item.quantity]
        );
      }
      
      await connection.commit();
      
      res.status(201).json({ 
        message: 'Pesanan berhasil dibuat',
        orderId,
        orderDate: new Date()
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat pesanan' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan' });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ? OR order_id = ?', [req.params.id, req.params.id]);
    
    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    
    const order = orderRows[0];
    
    // Get order items
    const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    
    res.json({
      ...order,
      items: itemRows
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan' });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    // Check if order exists
    const [existingOrder] = await pool.query('SELECT * FROM orders WHERE id = ? OR order_id = ?', [orderId, orderId]);
    
    if (existingOrder.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    
    await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ? OR order_id = ?',
      [status, orderId, orderId]
    );
    
    res.json({ 
      message: 'Status pesanan berhasil diperbarui',
      status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status pesanan' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});