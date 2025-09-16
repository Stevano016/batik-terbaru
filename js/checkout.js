// Checkout functionality for Batik Nusantara

// Format currency to Indonesian Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Load checkout items and summary
function loadCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutSummaryContainer = document.getElementById('checkout-summary');
    
    if (!checkoutItemsContainer || !checkoutSummaryContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        // Redirect to cart if checkout is empty
        window.location.href = 'cart.html';
        return;
    }
    
    // Display checkout items
    checkoutItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const checkoutItemElement = document.createElement('div');
        checkoutItemElement.className = 'flex py-3 border-b border-gray-200';
        checkoutItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            <div class="ml-3">
                <h4 class="font-medium">${item.name}</h4>
                <div class="flex text-sm text-gray-600">
                    <span>${formatRupiah(item.price)} × ${item.quantity}</span>
                </div>
            </div>
        `;
        
        checkoutItemsContainer.appendChild(checkoutItemElement);
    });
    
    // Update checkout summary
    const { subtotal, shipping, total } = getCartTotal();
    
    checkoutSummaryContainer.innerHTML = `
        <div class="flex justify-between mb-2">
            <span class="text-gray-600">Subtotal</span>
            <span>${formatRupiah(subtotal)}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-gray-600">Pengiriman</span>
            <span>${formatRupiah(shipping)}</span>
        </div>
        <div class="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>${formatRupiah(total)}</span>
        </div>
    `;
}

// Generate order ID
function generateOrderId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `BN-${timestamp}-${random}`;
}

// Handle order submission
function handleOrderSubmission(event) {
    event.preventDefault();
    
    // Validate form
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const province = document.getElementById('province').value;
    const postalCode = document.getElementById('postal-code').value;
    const notes = document.getElementById('notes').value;
    
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const { subtotal, shipping, total } = getCartTotal();
    
    // Create order object
    const order = {
        orderId: generateOrderId(),
        date: new Date().toISOString(),
        customer: {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            province,
            postalCode
        },
        items: cart,
        notes,
        subtotal,
        shipping,
        total,
        status: 'pending'
    };
    
    // In a real application, we would send this to the backend
    // For now, we'll store it in localStorage and redirect to invoice
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Save current order ID for invoice page
    localStorage.setItem('currentOrderId', order.orderId);
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Redirect to invoice page or show confirmation
    showOrderConfirmation(order);
}

// Show order confirmation
function showOrderConfirmation(order) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg p-8 max-w-md w-full';
    modal.innerHTML = `
        <div class="text-center">
            <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
            <h2 class="text-2xl font-bold mb-4">Pesanan Berhasil!</h2>
            <p class="mb-6">Terima kasih atas pesanan Anda. Nomor pesanan Anda adalah: <span class="font-semibold">${order.orderId}</span></p>
            <p class="mb-6">Silakan lakukan pembayaran sebesar ${formatRupiah(order.total)} ke rekening berikut:</p>
            <div class="bg-gray-100 p-4 rounded-lg mb-6 text-left">
                <p><span class="font-semibold">Bank:</span> Bank Mandiri</p>
                <p><span class="font-semibold">No. Rekening:</span> 1234567890</p>
                <p><span class="font-semibold">Atas Nama:</span> PT Batik Nusantara</p>
            </div>
            <p class="mb-6">Setelah melakukan pembayaran, silakan konfirmasi melalui WhatsApp ke nomor <a href="https://wa.me/6281234567890?text=Konfirmasi%20pembayaran%20untuk%20pesanan%20${order.orderId}" class="text-amber-800 font-semibold">+62 812-3456-7890</a></p>
            <div class="flex justify-center space-x-4">
                <button id="view-invoice-btn" class="btn-primary">Lihat Invoice</button>
                <button id="back-to-home-btn" class="btn-secondary">Kembali ke Beranda</button>
            </div>
        </div>
    `;
    
    // Append modal to overlay
    overlay.appendChild(modal);
    
    // Append overlay to body
    document.body.appendChild(overlay);
    
    // Add event listeners to buttons
    document.getElementById('view-invoice-btn').addEventListener('click', function() {
        window.location.href = 'invoice.html';
    });
    
    document.getElementById('back-to-home-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    // Load checkout summary
    loadCheckoutSummary();
    
    // Add event listener to place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handleOrderSubmission);
    }
});