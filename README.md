# Website Penjualan Batik

Aplikasi website penjualan batik dengan frontend statis dan backend minimal.

## Fitur Utama

### Frontend (HTML, Tailwind CSS, JavaScript Vanilla)
- **Home**: Menampilkan daftar produk batik
- **Detail Produk**: Menampilkan informasi detail produk berdasarkan ID
- **Cart**: Menyimpan data keranjang belanja menggunakan localStorage
- **Checkout**: Form pemesanan dengan opsi pengiriman ke WhatsApp
- **Invoice**: Halaman invoice setelah checkout dengan instruksi pembayaran

### Backend (Node.js, Express, MySQL)
- **Admin Panel**: Halaman admin untuk mengelola produk (tambah/edit/hapus)
- **API Produk**: Endpoint untuk mengelola data produk
- **API Pesanan**: Endpoint untuk menyimpan dan mengelola pesanan
- **Pembayaran**: Sistem pembayaran manual via transfer bank

## Cara Menjalankan Aplikasi

### Frontend
1. Buka file `index.html` di browser untuk mengakses halaman utama
2. Navigasi ke halaman lain melalui menu atau tombol yang tersedia

### Backend
1. Masuk ke direktori backend: `cd backend`
2. Install dependencies: `npm install`
3. Import struktur database dari file `database.sql` ke MySQL
4. Sesuaikan konfigurasi database di file `.env`
5. Jalankan server: `npm run dev` atau `npm start`

### Admin Panel
1. Akses halaman admin di `admin/login.html`
2. Login dengan kredensial default:
   - Username: admin
   - Password: admin123

## Alur Penggunaan
1. Pelanggan melihat produk di halaman Home
2. Memilih produk untuk melihat detail
3. Menambahkan produk ke keranjang
4. Checkout dan mengisi form pemesanan
5. Menerima invoice dan instruksi pembayaran
6. Konfirmasi pembayaran via WhatsApp

## Teknologi yang Digunakan
- HTML5
- Tailwind CSS
- JavaScript (Vanilla)
- Node.js
- Express.js
- MySQL
- Font Awesome (untuk ikon)
- WhatsApp API (untuk konfirmasi)