// Cart functionality for Batik Nusantara

// Add item to cart
function addToCart(id, name, price, image, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id,
            name,
            price,
            image,
            quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

// Remove item from cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI and count
    updateCartCount();
    loadCartItems();
}

// Update item quantity
function updateCartItemQuantity(id, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI and totals
        loadCartItems();
    }
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Format currency to Indonesian Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Load cart items on cart page
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        // Cart is empty
        cartItemsContainer.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Keranjang Belanja Kosong</h3>
                <p class="text-gray-500 mb-6">Anda belum menambahkan produk ke keranjang belanja.</p>
                <a href="index.html" class="btn-primary">Mulai Belanja</a>
            </div>
        `;
        
        if (cartSummaryContainer) {
            cartSummaryContainer.classList.add('hidden');
        }
        
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="font-semibold">${item.name}</h3>
                <p class="text-amber-800">${formatRupiah(item.price)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-selector mr-4">
                    <button class="quantity-btn" onclick="decrementCartItem(${item.id})">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" 
                           onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="incrementCartItem(${item.id})">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update cart summary
    if (cartSummaryContainer) {
        cartSummaryContainer.classList.remove('hidden');
        
        const subtotal = totalPrice;
        const shipping = 20000; // Fixed shipping cost
        const total = subtotal + shipping;
        
        cartSummaryContainer.innerHTML = `
            <h3 class="text-lg font-bold mb-4">Ringkasan Belanja</h3>
            <div class="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${formatRupiah(subtotal)}</span>
            </div>
            <div class="flex justify-between mb-2">
                <span>Pengiriman</span>
                <span>${formatRupiah(shipping)}</span>
            </div>
            <div class="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${formatRupiah(total)}</span>
            </div>
            <button onclick="window.location.href='checkout.html'" class="btn-primary w-full mt-4">
                Lanjut ke Pembayaran
            </button>
        `;
    }
}

// Increment cart item quantity
function incrementCartItem(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

// Decrement cart item quantity
function decrementCartItem(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1 && cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
}

// Clear cart
function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    loadCartItems();
}

// Get cart total
function getCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 20000 : 0; // Fixed shipping cost
    return {
        subtotal,
        shipping,
        total: subtotal + shipping
    };
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load cart items if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
    
    // Load checkout summary if on checkout page
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutSummary();
    }
});