// Check authentication
function checkAuth() {
    const adminAuth = JSON.parse(localStorage.getItem('adminAuth'));
    if (!adminAuth || !adminAuth.isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Check if login session is still valid (24 hours)
    const currentTime = new Date().getTime();
    const loginTime = adminAuth.loginTime;
    const hoursSinceLogin = (currentTime - loginTime) / (1000 * 60 * 60);
    
    if (hoursSinceLogin >= 24) {
        localStorage.removeItem('adminAuth');
        window.location.href = 'login.html?expired=true';
        return false;
    }
    
    // Check if session token exists
    if (!adminAuth.sessionToken) {
        localStorage.removeItem('adminAuth');
        window.location.href = 'login.html?invalid=true';
        return false;
    }
    
    // Extend session on activity (sliding expiration)
    adminAuth.loginTime = currentTime;
    localStorage.setItem('adminAuth', JSON.stringify(adminAuth));
    
    // Set admin info
    document.getElementById('admin-username').textContent = adminAuth.username;
    
    return true;
}

// Format currency to Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number).replace(/\s/g, '');
}

// Secure logout function
function secureLogout() {
    // Clear all authentication data
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutUntil');
    
    // Redirect to login page with logout parameter
    window.location.href = 'login.html?logout=true';
}

// Show alert notification
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
        type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`;
    
    alertDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
        <span>${message}</span>
        <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Load products from API
async function loadProducts() {
    try {
        // For demo purposes, use sample data
        // In production, use: const response = await fetch('http://localhost:3000/api/products');
        const products = [
            {
                id: 1,
                name: 'Batik Parang',
                description: 'Batik Parang adalah salah satu motif batik tertua di Indonesia. Motif ini memiliki makna keberanian dan kekuatan.',
                price: 350000,
                stock: 15,
                category: 'Klasik',
                discount: 10,
                image: '/uploads/placeholder-1.jpg',
                created_at: '2023-01-15T08:30:00Z'
            },
            {
                id: 2,
                name: 'Batik Megamendung',
                description: 'Batik Megamendung adalah motif batik khas Cirebon yang terinspirasi dari bentuk awan. Melambangkan pembawa kesuburan dan kehidupan.',
                price: 450000,
                stock: 10,
                category: 'Pesisir',
                discount: 0,
                image: '/uploads/placeholder-2.jpg',
                created_at: '2023-01-20T10:15:00Z'
            },
            {
                id: 3,
                name: 'Batik Kawung',
                description: 'Batik Kawung adalah motif batik berbentuk lingkaran yang saling bersinggungan. Melambangkan harapan dan kesempurnaan hidup.',
                price: 375000,
                stock: 20,
                category: 'Klasik',
                discount: 15,
                image: '/uploads/placeholder-3.jpg',
                created_at: '2023-01-25T14:45:00Z'
            },
            {
                id: 4,
                name: 'Batik Sekar Jagad',
                description: 'Batik Sekar Jagad memiliki motif yang beragam dalam satu kain. Melambangkan keberagaman dunia yang indah.',
                price: 500000,
                stock: 8,
                category: 'Modern',
                discount: 0,
                image: '/uploads/placeholder-4.jpg',
                created_at: '2023-02-05T09:20:00Z'
            },
            {
                id: 5,
                name: 'Batik Tujuh Rupa',
                description: 'Batik Tujuh Rupa adalah batik khas Pekalongan dengan tujuh warna berbeda. Sangat cerah dan berwarna-warni.',
                price: 425000,
                stock: 12,
                category: 'Pesisir',
                discount: 5,
                image: '/uploads/placeholder-5.jpg',
                created_at: '2023-02-10T11:30:00Z'
            },
            {
                id: 6,
                name: 'Batik Sogan',
                description: 'Batik Sogan adalah batik dengan warna dominan coklat kekuningan. Batik ini memiliki kesan elegan dan klasik.',
                price: 400000,
                stock: 15,
                category: 'Klasik',
                discount: 0,
                image: '/uploads/placeholder-6.jpg',
                created_at: '2023-02-15T13:45:00Z'
            }
        ];
        
        // Update stats
        document.getElementById('total-products').textContent = products.length;
        
        // Count low stock products (less than 10)
        const lowStockCount = products.filter(product => product.stock < 10).length;
        document.getElementById('low-stock').textContent = lowStockCount;
        
        // For demo purposes, set new orders to 3
        document.getElementById('new-orders').textContent = 3;
        
        // Render products table
        renderProductsTable(products);
        
        // Setup pagination
        setupPagination(products.length);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Gagal memuat data produk', 'error');
    }
}

// Render products table
function renderProductsTable(products) {
    const tableBody = document.getElementById('products-table-body');
    
    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    Tidak ada produk yang ditemukan
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Format price with discount
        const discountedPrice = product.discount > 0 
            ? product.price - (product.price * product.discount / 100) 
            : product.price;
        
        // Stock status
        const stockStatus = product.stock < 10 
            ? '<span class="text-red-600 font-medium">Menipis</span>' 
            : '<span class="text-green-600">Tersedia</span>';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 mr-3">
                        <img class="h-10 w-10 rounded-md object-cover" src="${product.image}" alt="${product.name}">
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${product.name}</div>
                        <div class="text-sm text-gray-500">${product.description.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                    ${product.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${product.discount > 0 ? 
                    `<div class="text-sm text-gray-900">${formatRupiah(discountedPrice)}</div>
                     <div class="text-xs text-gray-500 line-through">${formatRupiah(product.price)}</div>` :
                    `<div class="text-sm text-gray-900">${formatRupiah(product.price)}</div>`
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${product.stock} unit</div>
                <div class="text-xs">${stockStatus}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${product.discount > 0 ? 
                    `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        ${product.discount}%
                    </span>` :
                    `<span class="text-sm text-gray-500">-</span>`
                }
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-amber-600 hover:text-amber-900 mr-3 edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-product" data-id="${product.id}" data-name="${product.name}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            openEditProductModal(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            openDeleteModal(productId, productName);
        });
    });
}

// Setup pagination
function setupPagination(totalProducts) {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const paginationNumbers = document.getElementById('pagination-numbers');
    
    // Update pagination text
    document.getElementById('pagination-start').textContent = totalProducts > 0 ? 1 : 0;
    document.getElementById('pagination-end').textContent = Math.min(itemsPerPage, totalProducts);
    document.getElementById('pagination-total').textContent = totalProducts;
    
    // Generate pagination numbers
    paginationNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `relative inline-flex items-center px-4 py-2 border ${
            i === 1 ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-300 bg-white text-gray-700'
        } text-sm font-medium`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            // Handle page change (in a real app, this would load the specific page of products)
            console.log(`Changing to page ${i}`);
            
            // Update active page styling
            document.querySelectorAll('#pagination-numbers button').forEach(btn => {
                btn.classList.remove('border-amber-500', 'bg-amber-50', 'text-amber-600');
                btn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
            });
            
            pageButton.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
            pageButton.classList.add('border-amber-500', 'bg-amber-50', 'text-amber-600');
            
            // Update pagination text
            const start = (i - 1) * itemsPerPage + 1;
            const end = Math.min(i * itemsPerPage, totalProducts);
            document.getElementById('pagination-start').textContent = start;
            document.getElementById('pagination-end').textContent = end;
        });
        
        paginationNumbers.appendChild(pageButton);
    }
    
    // Disable prev/next buttons if needed
    document.getElementById('prev-page').disabled = totalPages <= 1;
    document.getElementById('next-page').disabled = totalPages <= 1;
    
    // Add event listeners to prev/next buttons
    document.getElementById('prev-page').addEventListener('click', () => {
        // Find current active page
        const activePage = document.querySelector('#pagination-numbers button.border-amber-500');
        const currentPage = parseInt(activePage.textContent);
        
        if (currentPage > 1) {
            // Click the previous page button
            document.querySelector(`#pagination-numbers button:nth-child(${currentPage - 1})`).click();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        // Find current active page
        const activePage = document.querySelector('#pagination-numbers button.border-amber-500');
        const currentPage = parseInt(activePage.textContent);
        
        if (currentPage < totalPages) {
            // Click the next page button
            document.querySelector(`#pagination-numbers button:nth-child(${currentPage + 1})`).click();
        }
    });
}

// Open add product modal
function openAddProductModal() {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    const submitButton = document.querySelector('#product-form button[type="submit"]');
    
    // Reset form
    form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').innerHTML = '<i class="fas fa-image text-gray-400 text-2xl"></i>';
    
    // Update modal title and submit button
    modalTitle.textContent = 'Tambah Produk Baru';
    document.getElementById('submit-text').textContent = 'Simpan Produk';
    
    // Show modal
    modal.classList.remove('hidden');
}

// Open edit product modal
function openEditProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    // Reset form
    form.reset();
    
    // For demo purposes, find product in our sample data
    // In production, use: const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const products = [
        {
            id: 1,
            name: 'Batik Parang',
            description: 'Batik Parang adalah salah satu motif batik tertua di Indonesia. Motif ini memiliki makna keberanian dan kekuatan.',
            price: 350000,
            stock: 15,
            category: 'Klasik',
            discount: 10,
            image: '/uploads/placeholder-1.jpg'
        },
        {
            id: 2,
            name: 'Batik Megamendung',
            description: 'Batik Megamendung adalah motif batik khas Cirebon yang terinspirasi dari bentuk awan. Melambangkan pembawa kesuburan dan kehidupan.',
            price: 450000,
            stock: 10,
            category: 'Pesisir',
            discount: 0,
            image: '/uploads/placeholder-2.jpg'
        }
    ];
    
    const product = products.find(p => p.id == productId) || products[0];
    
    // Fill form with product data
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-discount').value = product.discount;
    document.getElementById('product-category').value = product.category;
    
    // Update image preview
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover rounded-md">`;
    
    // Update modal title and submit button
    modalTitle.textContent = 'Edit Produk';
    document.getElementById('submit-text').textContent = 'Perbarui Produk';
    
    // Show modal
    modal.classList.remove('hidden');
}

// Open delete confirmation modal
function openDeleteModal(productId, productName) {
    const modal = document.getElementById('delete-modal');
    document.getElementById('delete-product-name').textContent = productName;
    
    // Store product ID for delete confirmation
    document.getElementById('confirm-delete').setAttribute('data-id', productId);
    
    // Show modal
    modal.classList.remove('hidden');
}

// Handle product form submission
async function handleProductFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const productId = document.getElementById('product-id').value;
    const isEdit = productId !== '';
    
    // Show loading state
    document.getElementById('submit-text').classList.add('hidden');
    document.getElementById('submit-loading').classList.remove('hidden');
    
    try {
        // Get form data
        const formData = new FormData(form);
        
        // For demo purposes, just simulate API call
        // In production, use:
        // const url = isEdit ? `http://localhost:3000/api/products/${productId}` : 'http://localhost:3000/api/products';
        // const method = isEdit ? 'PUT' : 'POST';
        // const response = await fetch(url, { method, body: formData });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Close modal
        document.getElementById('product-modal').classList.add('hidden');
        
        // Show success message
        showAlert(isEdit ? 'Produk berhasil diperbarui' : 'Produk baru berhasil ditambahkan');
        
        // Reload products
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Gagal menyimpan produk', 'error');
    } finally {
        // Reset loading state
        document.getElementById('submit-text').classList.remove('hidden');
        document.getElementById('submit-loading').classList.add('hidden');
    }
}

// Handle product deletion
async function handleProductDelete(productId) {
    // Show loading state
    document.getElementById('delete-text').classList.add('hidden');
    document.getElementById('delete-loading').classList.remove('hidden');
    
    try {
        // For demo purposes, just simulate API call
        // In production, use:
        // const response = await fetch(`http://localhost:3000/api/products/${productId}`, { method: 'DELETE' });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Close modal
        document.getElementById('delete-modal').classList.add('hidden');
        
        // Show success message
        showAlert('Produk berhasil dihapus');
        
        // Reload products
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Gagal menghapus produk', 'error');
    } finally {
        // Reset loading state
        document.getElementById('delete-text').classList.remove('hidden');
        document.getElementById('delete-loading').classList.add('hidden');
    }
}

// Handle image preview
function handleImagePreview(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('image-preview');
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="w-full h-full object-cover rounded-md">`;
        };
        
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '<i class="fas fa-image text-gray-400 text-2xl"></i>';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('adminAuth');
    window.location.href = 'login.html';
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Initialize sidebar toggle
    initSidebar();
    
    // Initialize navigation
    initNavigation();
    
    // Load products
    loadProducts();
    
    // Load orders
    loadOrders();
    
    // Initialize product form
    initProductForm();
    
    // Initialize event listeners
    initEventListeners();
});

// Initialize sidebar
function initSidebar() {
    document.getElementById('toggle-sidebar').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.add('open');
    });
    
    document.getElementById('close-sidebar').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.remove('open');
    });
}

// Initialize navigation
function initNavigation() {
    // Handle navigation between tabs
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show target section
            document.getElementById(target).classList.remove('hidden');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Initialize product form and related event listeners
function initProductForm() {
    // Add product button
    document.getElementById('add-product-btn').addEventListener('click', openAddProductModal);
    
    // Close modal buttons
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('product-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-form').addEventListener('click', function() {
        document.getElementById('product-modal').classList.add('hidden');
    });
    
    document.getElementById('close-delete-modal').addEventListener('click', function() {
        document.getElementById('delete-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-delete').addEventListener('click', function() {
        document.getElementById('delete-modal').classList.add('hidden');
    });
    
    // Product form submission
    document.getElementById('product-form').addEventListener('submit', handleProductFormSubmit);
    
    // Delete confirmation
    document.getElementById('confirm-delete').addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        handleProductDelete(productId);
    });
    
    // Image preview
    document.getElementById('product-image').addEventListener('change', handleImagePreview);
}

// Initialize other event listeners
function initEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', secureLogout);
    
    // Filter and search functionality
    document.getElementById('category-filter').addEventListener('change', function() {
        // In a real app, this would filter products by category
        console.log('Filter by category:', this.value);
    });
    
    document.getElementById('sort-by').addEventListener('change', function() {
        // In a real app, this would sort products
        console.log('Sort by:', this.value);
    });
    
    document.getElementById('search-products').addEventListener('input', function() {
        // In a real app, this would search products
        console.log('Search:', this.value);
    });
}

// Load orders from API
async function loadOrders() {
    try {
        // For demo purposes, use sample data
        // In production, use: const response = await fetch('http://localhost:3000/api/orders');
        const orders = [
            {
                id: 1,
                customer_name: 'Budi Santoso',
                products: [
                    { name: 'Batik Parang', quantity: 2, price: 315000 },
                    { name: 'Batik Kawung', quantity: 1, price: 318750 }
                ],
                total: 948750,
                status: 'pending',
                date: '2023-05-15T08:30:00Z'
            },
            {
                id: 2,
                customer_name: 'Siti Rahayu',
                products: [
                    { name: 'Batik Megamendung', quantity: 1, price: 450000 }
                ],
                total: 450000,
                status: 'processing',
                date: '2023-05-14T14:45:00Z'
            },
            {
                id: 3,
                customer_name: 'Agus Wijaya',
                products: [
                    { name: 'Batik Sekar Jagad', quantity: 1, price: 500000 },
                    { name: 'Batik Tujuh Rupa', quantity: 1, price: 403750 }
                ],
                total: 903750,
                status: 'completed',
                date: '2023-05-13T10:15:00Z'
            }
        ];
        
        // Update stats
        document.getElementById('new-orders').textContent = orders.filter(order => order.status === 'pending').length;
        
        // Render orders table
        renderOrdersTable(orders);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showAlert('Gagal memuat data pesanan', 'error');
    }
}

// Render orders table
function renderOrdersTable(orders) {
    const tableBody = document.getElementById('orders-table-body');
    
    if (!tableBody) return;
    
    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                    Tidak ada pesanan yang ditemukan
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Status badge class
        let statusClass = '';
        switch(order.status) {
            case 'pending':
                statusClass = 'bg-yellow-100 text-yellow-800';
                break;
            case 'processing':
                statusClass = 'bg-blue-100 text-blue-800';
                break;
            case 'completed':
                statusClass = 'bg-green-100 text-green-800';
                break;
            case 'cancelled':
                statusClass = 'bg-red-100 text-red-800';
                break;
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#${order.id}</div>
                <div class="text-sm text-gray-500">${formattedDate}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${order.customer_name}</div>
                <div class="text-sm text-gray-500">${order.products.length} produk</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">${formatRupiah(order.total)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${order.status === 'pending' ? 'Menunggu' : 
                      order.status === 'processing' ? 'Diproses' : 
                      order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-amber-600 hover:text-amber-900 view-order" data-id="${order.id}">
                    Detail
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to view order buttons
    document.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-id');
            viewOrderDetails(orderId, orders);
        });
    });
}

// View order details
function viewOrderDetails(orderId, orders) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-detail-modal');
    if (!modal) return;
    
    // Fill order details
    document.getElementById('order-id').textContent = `#${order.id}`;
    document.getElementById('order-customer').textContent = order.customer_name;
    document.getElementById('order-date').textContent = new Date(order.date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('order-status').textContent = 
        order.status === 'pending' ? 'Menunggu' : 
        order.status === 'processing' ? 'Diproses' : 
        order.status === 'completed' ? 'Selesai' : 'Dibatalkan';
    
    // Fill products table
    const productsTable = document.getElementById('order-products');
    productsTable.innerHTML = '';
    
    order.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 border-b">${product.name}</td>
            <td class="px-4 py-2 border-b text-center">${product.quantity}</td>
            <td class="px-4 py-2 border-b text-right">${formatRupiah(product.price)}</td>
            <td class="px-4 py-2 border-b text-right">${formatRupiah(product.price * product.quantity)}</td>
        `;
        productsTable.appendChild(row);
    });
    
    // Set total
    document.getElementById('order-total').textContent = formatRupiah(order.total);
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Add close event listener
    document.getElementById('close-order-modal').addEventListener('click', function() {
        modal.classList.add('hidden');
    });
}