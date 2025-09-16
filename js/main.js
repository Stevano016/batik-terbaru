// Format currency to Indonesian Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

// Sample products data (in real app, this would come from an API)
const products = [
    {
        id: 1,
        name: "Batik Parang",
        price: 250000,
        image: "https://picsum.photos/400/500?random=1",
        description: "Batik Parang merupakan salah satu motif batik tertua di Indonesia. Motif ini melambangkan kesatuan, kekuatan, dan pertumbuhan.",
        category: "Klasik",
        stock: 15
    },
    {
        id: 2,
        name: "Batik Mega Mendung",
        price: 300000,
        image: "https://picsum.photos/400/500?random=2",
        description: "Batik Mega Mendung berasal dari Cirebon dengan motif awan yang khas. Motif ini melambangkan pembawa kesuburan dan kehidupan.",
        category: "Pesisir",
        stock: 10
    },
    {
        id: 3,
        name: "Batik Sekar Jagad",
        price: 275000,
        image: "https://picsum.photos/400/500?random=3",
        description: "Batik Sekar Jagad berarti 'bunga dunia' dengan motif yang menggambarkan keindahan dan keberagaman dunia.",
        category: "Modern",
        stock: 8
    },
    {
        id: 4,
        name: "Batik Kawung",
        price: 225000,
        image: "https://picsum.photos/400/500?random=4",
        description: "Batik Kawung adalah motif kuno berbentuk lingkaran yang melambangkan empat arah mata angin dan sumber energi.",
        category: "Klasik",
        stock: 12
    },
    {
        id: 5,
        name: "Batik Sogan",
        price: 350000,
        image: "https://picsum.photos/400/500?random=5",
        description: "Batik Sogan memiliki warna dominan coklat kekuningan yang dihasilkan dari pewarna alami dari pohon soga.",
        category: "Klasik",
        stock: 7
    },
    {
        id: 6,
        name: "Batik Pekalongan",
        price: 320000,
        image: "https://picsum.photos/400/500?random=6",
        description: "Batik Pekalongan terkenal dengan warnanya yang cerah dan motif yang dipengaruhi berbagai budaya.",
        category: "Pesisir",
        stock: 9
    },
    {
        id: 7,
        name: "Batik Tujuh Rupa",
        price: 400000,
        image: "https://picsum.photos/400/500?random=7",
        description: "Batik Tujuh Rupa dari Pekalongan menggunakan tujuh warna berbeda yang melambangkan keberagaman.",
        category: "Pesisir",
        stock: 5
    },
    {
        id: 8,
        name: "Batik Lasem",
        price: 375000,
        image: "https://picsum.photos/400/500?random=8",
        description: "Batik Lasem dikenal dengan warna merah yang khas dan pengaruh budaya Tionghoa dalam motifnya.",
        category: "Pesisir",
        stock: 6
    }
];

// Save products to localStorage for demo purposes
localStorage.setItem('products', JSON.stringify(products));

// Global variables for pagination and filtering
let currentPage = 1;
const itemsPerPage = 8;
let filteredProducts = [];



// Function to load products on homepage with filtering, sorting and pagination
function loadProducts() {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    
    // Show loading animation
    productContainer.innerHTML = `
        <div class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>`;
        
    // Get filter values
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-products');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryValue = categoryFilter ? categoryFilter.value : '';
    const sortValue = sortSelect ? sortSelect.value : 'newest';
    
    // Filter products
    filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm);
            
        // Category filter
        const matchesCategory = !categoryValue || product.category === categoryValue;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default: // newest
            filteredProducts.sort((a, b) => b.id - a.id);
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    
    // Clear loading animation
    productContainer.innerHTML = '';
    
    // Display message if no products found
    if (paginatedProducts.length === 0) {
        productContainer.innerHTML = `
            <div class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-8">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500 text-lg">Tidak ada produk yang ditemukan.</p>
                <button id="reset-filters" class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                    Reset Filter
                </button>
            </div>
        `;
        
        document.getElementById('reset-filters').addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (sortSelect) sortSelect.value = 'newest';
            currentPage = 1;
            loadProducts();
        });
        
        updatePagination(totalPages);
        return;
    }
    
    // Render products
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1';
        
        const discountBadge = product.discount ? 
            `<div class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-semibold">
                -${product.discount}%
            </div>` : '';
            
        const discountedPrice = product.discount ? 
            product.price - (product.price * product.discount / 100) : product.price;
        
        const priceDisplay = product.discount ? 
            `<p class="text-gray-800 font-bold">
                ${formatRupiah(discountedPrice)}
                <span class="text-gray-500 line-through text-sm ml-2">${formatRupiah(product.price)}</span>
            </p>` : 
            `<p class="text-gray-800 font-bold">${formatRupiah(product.price)}</p>`;
            
        const stockBadge = product.stock < 5 ? 
            `<span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Stok terbatas</span>` : '';
        
        const productHtml = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                ${discountBadge}
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-amber-600 font-bold mt-1">${formatRupiah(product.price)}</p>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-sm text-gray-500">${product.category}</span>
                    <span class="text-sm text-gray-500">Stok: ${product.stock}</span>
                </div>
            </div>
            <div class="px-4 pb-4">
                <a href="product-detail.html?id=${product.id}" class="block w-full bg-amber-600 text-white text-center py-2 rounded-md mb-2 hover:bg-amber-700 transition-colors">
                    <i class="fas fa-eye mr-2"></i>Detail
                </a>
                <button class="add-to-cart w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors" data-id="${product.id}">
                    <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                </button>
            </div>
        `;
        
        productCard.innerHTML = productHtml;
        productContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product.id, product.name, product.price, product.image, 1);
            }
        });
    });
    
    // Update pagination
    updatePagination(totalPages);
}

// Add event listeners for search and filter
function setupFilterListeners() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-products');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                currentPage = 1;
                loadProducts();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentPage = 1;
            loadProducts();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentPage = 1;
            loadProducts();
        });
    }
}

// Function to update pagination controls
function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const pageNumbers = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        // Only show pagination if there are products and more than 1 page
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        } else {
            paginationContainer.style.display = 'flex';
        }
        
        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add first page button if not starting from page 1
        if (startPage > 1) {
            const pageButton = document.createElement('button');
            pageButton.className = 'px-3 py-1 rounded-md hover:bg-amber-200';
            pageButton.textContent = '1';
            pageButton.addEventListener('click', () => {
                currentPage = 1;
                loadProducts();
            });
            pageNumbers.appendChild(pageButton);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-1';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
        }
        
        // Add page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = i === currentPage 
                ? 'px-3 py-1 rounded-md bg-amber-600 text-white' 
                : 'px-3 py-1 rounded-md hover:bg-amber-200';
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                loadProducts();
            });
            pageNumbers.appendChild(pageButton);
        }
        
        // Add last page button if not ending at the last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-1';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
            
            const pageButton = document.createElement('button');
            pageButton.className = 'px-3 py-1 rounded-md hover:bg-amber-200';
            pageButton.textContent = totalPages;
            pageButton.addEventListener('click', () => {
                currentPage = totalPages;
                loadProducts();
            });
            pageNumbers.appendChild(pageButton);
        }
    }
    
    // Update prev/next buttons
    if (prevButton) {
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadProducts();
            }
        });
    }
    
    if (nextButton) {
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadProducts();
            }
        });
    }
}

// Function to add product to cart
function addToCart(productId, name, price, image, quantity) {
    // Get existing cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product already in cart
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: quantity
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showNotification('Produk ditambahkan ke keranjang!');
}

// Function to update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Function to show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Function to load product detail
function loadProductDetail() {
    const productDetailContainer = document.getElementById('product-detail');
    if (!productDetailContainer) return;
    
    // Show loading animation
    productDetailContainer.innerHTML = `
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    `;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        productDetailContainer.innerHTML = `
            <div class="text-center py-8">
                <h2 class="text-2xl font-bold text-red-600">Produk tidak ditemukan</h2>
                <p class="mt-2">Maaf, produk yang Anda cari tidak tersedia.</p>
                <a href="index.html" class="inline-block mt-4 bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600">
                    Kembali ke Beranda
                </a>
            </div>
        `;
        return;
    }
    
    // Find product by ID
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        productDetailContainer.innerHTML = `
            <div class="text-center py-8">
                <h2 class="text-2xl font-bold text-red-600">Produk tidak ditemukan</h2>
                <p class="mt-2">Maaf, produk yang Anda cari tidak tersedia.</p>
                <a href="index.html" class="inline-block mt-4 bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600">
                    Kembali ke Beranda
                </a>
            </div>
        `;
        return;
    }
    
    // Simulate API delay
    setTimeout(() => {
        // Create product detail HTML
        const productDetailHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Product Image -->
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-auto object-cover rounded-md">
                </div>
                
                <!-- Product Info -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h1 class="text-2xl font-bold text-gray-800">${product.name}</h1>
                    <p class="text-xl font-bold text-amber-600 mt-2">${formatRupiah(product.price)}</p>
                    
                    <div class="flex items-center mt-4">
                        <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">${product.category}</span>
                        <span class="ml-4 text-gray-600">Stok: ${product.stock}</span>
                    </div>
                    
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold text-gray-800">Deskripsi</h3>
                        <p class="mt-2 text-gray-600">${product.description}</p>
                    </div>
                    
                    <div class="mt-8">
                        <div class="flex items-center mb-4">
                            <label for="product-quantity" class="mr-4 text-gray-700">Jumlah:</label>
                            <div class="flex items-center">
                                <button id="decrease-quantity" class="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300">-</button>
                                <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}" class="w-16 text-center py-1 border-y border-gray-300">
                                <button id="increase-quantity" class="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300">+</button>
                            </div>
                        </div>
                        
                        <button id="add-to-cart-detail" class="w-full bg-amber-500 text-white py-3 rounded-md hover:bg-amber-600 transition-colors">
                            <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                        </button>
                        
                        <a href="index.html" class="block text-center w-full mt-4 border border-amber-500 text-amber-500 py-3 rounded-md hover:bg-amber-50 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Set product detail HTML
        productDetailContainer.innerHTML = productDetailHTML;
        
        // Add event listeners for quantity buttons
        const quantityInput = document.getElementById('product-quantity');
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < product.stock) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        // Add to cart button
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(product.id, product.name, product.price, product.image, quantity);
        });
    }, 800);
}

// Function to load featured products on homepage
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    // Clear loading animation
    featuredContainer.innerHTML = '';
    
    // Get 4 random products for featured section
    const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Render featured products
    randomProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1';
        
        const productHtml = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-amber-600 font-bold mt-1">${formatRupiah(product.price)}</p>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-sm text-gray-500">${product.category}</span>
                    <span class="text-sm text-gray-500">Stok: ${product.stock}</span>
                </div>
            </div>
            <div class="px-4 pb-4">
                <a href="product-detail.html?id=${product.id}" class="block w-full bg-amber-600 text-white text-center py-2 rounded-md mb-2 hover:bg-amber-700 transition-colors">
                    <i class="fas fa-eye mr-2"></i>Detail
                </a>
                <button class="add-to-cart w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors" data-id="${product.id}">
                    <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                </button>
            </div>
        `;
        
        productCard.innerHTML = productHtml;
        featuredContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product.id, product.name, product.price, product.image, 1);
            }
        });
    });
}

// Function to load related products
function loadRelatedProducts(currentProductId) {
    const relatedContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-4');
    if (!relatedContainer) return;
    
    // Clear container
    relatedContainer.innerHTML = '';
    
    // Use products array directly instead of localStorage
    // Filter out current product and get random related products
    const filteredProducts = products.filter(p => p.id !== currentProductId);
    const relatedProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Render related products
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1';
        
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-amber-600 font-bold mt-1">${formatRupiah(product.price)}</p>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-sm text-gray-500">${product.category}</span>
                </div>
            </div>
            <div class="px-4 pb-4">
                <a href="product-detail.html?id=${product.id}" class="block w-full bg-amber-600 text-white text-center py-2 rounded-md mb-2 hover:bg-amber-700 transition-colors">
                    <i class="fas fa-eye mr-2"></i>Detail
                </a>
                <button class="add-to-cart w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors" data-id="${product.id}">
                    <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                </button>
            </div>
        `;
        
        relatedContainer.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                addToCart(product.id, product.name, product.price, product.image, 1);
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Load featured products if on homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    
    // Load products if on products page
    if (document.getElementById('product-container')) {
        loadProducts();
        setupFilterListeners();
    }
    
    // Load product detail if on product detail page
    if (document.getElementById('product-detail')) {
        loadProductDetail();
        
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        // Load related products
        setTimeout(() => {
            loadRelatedProducts(productId);
        }, 1000);
    }
});