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

// Function to load products on homepage
function loadProducts() {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    
    // Show loading animation
    productContainer.innerHTML = `
        <div class="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        productContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1';
            productCard.innerHTML = `
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-amber-600 font-bold mt-1">${formatRupiah(product.price)}</p>
                        <div class="flex justify-between items-center mt-3">
                            <span class="text-sm text-gray-500">${product.category}</span>
                            <span class="text-sm text-gray-500">Stok: ${product.stock}</span>
                        </div>
                    </div>
                </a>
                <div class="px-4 pb-4">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}', 1)" 
                            class="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors">
                        <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                    </button>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
    }, 800);
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
    
    // Find product in localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    const product = storedProducts.find(p => p.id === productId);
    
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
        productDetailContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="overflow-hidden rounded-lg">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-auto object-cover rounded-lg">
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">${product.name}</h1>
                    <p class="text-2xl font-bold text-amber-600 mt-2">${formatRupiah(product.price)}</p>
                    
                    <div class="flex items-center mt-4">
                        <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">${product.category}</span>
                        <span class="ml-3 text-gray-600">Stok: ${product.stock}</span>
                    </div>
                    
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold">Deskripsi</h3>
                        <p class="mt-2 text-gray-600 leading-relaxed">${product.description}</p>
                    </div>
                    
                    <div class="mt-8">
                        <div class="flex items-center">
                            <span class="mr-3 text-gray-700">Jumlah:</span>
                            <div class="custom-number-input h-10 w-32">
                                <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                                    <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full w-20 rounded-l cursor-pointer">
                                        <span class="m-auto text-xl font-bold">−</span>
                                    </button>
                                    <input type="number" id="product-quantity" class="outline-none focus:outline-none text-center w-full bg-gray-100 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700" name="custom-input-number" value="1" min="1" max="${product.stock}">
                                    <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="bg-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-300 h-full w-20 rounded-r cursor-pointer">
                                        <span class="m-auto text-xl font-bold">+</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6 grid grid-cols-2 gap-4">
                            <button onclick="addToCartFromDetail(${product.id}, '${product.name}', ${product.price}, '${product.image}')" class="bg-amber-500 text-white py-3 px-6 rounded-md hover:bg-amber-600 transition-colors flex items-center justify-center">
                                <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                            </button>
                            <a href="cart.html" class="bg-gray-800 text-white py-3 px-6 rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center">
                                <i class="fas fa-credit-card mr-2"></i>Beli Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }, 800);
    
    // Load related products
    loadRelatedProducts(productId);
}

// Function to load related products
function loadRelatedProducts(currentProductId) {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    // Show loading animation
    relatedContainer.innerHTML = `
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    `;
    
    // Get products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    
    // Filter out current product and get random related products
    const filteredProducts = storedProducts.filter(p => p.id !== currentProductId);
    const relatedProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Simulate API delay
    setTimeout(() => {
        relatedContainer.innerHTML = '';
        
        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1';
            productCard.innerHTML = `
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                        <p class="text-amber-600 font-bold mt-1">${formatRupiah(product.price)}</p>
                    </div>
                </a>
                <div class="px-4 pb-4">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}', 1)" 
                            class="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors">
                        <i class="fas fa-shopping-cart mr-2"></i>Tambah ke Keranjang
                    </button>
                </div>
            `;
            relatedContainer.appendChild(productCard);
        });
    }, 1000);
}

// Function to add product to cart from detail page
function addToCartFromDetail(productId, productName, productPrice, productImage) {
    const quantity = parseInt(document.getElementById('product-quantity').value);
    addToCart(productId, productName, productPrice, productImage, quantity);
}

// Initialize page based on current URL
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not exists
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Load products on homepage
    loadProducts();
    
    // Load product detail if on detail page
    loadProductDetail();
    
    // Update cart count in header
    updateCartCount();
});

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = itemCount;
    
    // Show/hide based on count
    if (itemCount > 0) {
        cartCountElement.classList.remove('hidden');
    } else {
        cartCountElement.classList.add('hidden');
    }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transition-opacity duration-300 flex items-center`;
    
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Fade out and remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}