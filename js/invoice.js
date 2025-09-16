// Format currency to Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number).replace(/\s/g, '');
}

// Get order data from localStorage
function getOrderData() {
    const orderData = localStorage.getItem('orderData');
    if (orderData) {
        return JSON.parse(orderData);
    }
    // If no order data, redirect to home
    window.location.href = 'index.html';
    return null;
}

// Load invoice details
function loadInvoiceDetails() {
    const orderData = getOrderData();
    if (!orderData) return;

    // Set invoice ID
    document.getElementById('invoice-id').textContent = orderData.orderId;

    // Set customer details
    document.getElementById('customer-name').textContent = orderData.name;
    document.getElementById('customer-address').textContent = orderData.address;
    document.getElementById('customer-city').textContent = `${orderData.city}, ${orderData.postalCode}`;
    document.getElementById('customer-email').textContent = orderData.email;

    // Set order date
    const orderDate = new Date(orderData.orderDate);
    document.getElementById('order-date').textContent = orderDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Load invoice items
    loadInvoiceItems(orderData.items);

    // Set totals
    document.getElementById('subtotal').textContent = formatRupiah(orderData.subtotal);
    document.getElementById('shipping').textContent = formatRupiah(orderData.shipping);
    document.getElementById('total').textContent = formatRupiah(orderData.total);
}

// Load invoice items
function loadInvoiceItems(items) {
    const invoiceItemsContainer = document.getElementById('invoice-items');
    invoiceItemsContainer.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-t';
        
        const itemTotal = item.price * item.quantity;
        
        row.innerHTML = `
            <td class="py-3 px-4">
                <div class="flex items-center">
                    <div class="w-12 h-12 flex-shrink-0 mr-3 bg-gray-100 rounded overflow-hidden">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <p class="font-medium">${item.name}</p>
                        <p class="text-sm text-gray-600">${item.size || 'Standard'}</p>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4 text-center">${item.quantity}</td>
            <td class="py-3 px-4 text-right">${formatRupiah(item.price)}</td>
            <td class="py-3 px-4 text-right">${formatRupiah(itemTotal)}</td>
        `;
        
        invoiceItemsContainer.appendChild(row);
    });
}

// Generate WhatsApp message for payment confirmation
function generateWhatsAppMessage() {
    const orderData = getOrderData();
    if (!orderData) return '';

    let message = `Halo, saya ingin konfirmasi pembayaran untuk pesanan *${orderData.orderId}*\n\n`;
    message += `Nama: ${orderData.name}\n`;
    message += `Email: ${orderData.email}\n`;
    message += `Total Pembayaran: ${formatRupiah(orderData.total)}\n`;
    message += `Tanggal Transfer: ${new Date().toLocaleDateString('id-ID')}\n`;
    message += `Bank Pengirim: \n`;
    message += `Atas Nama: \n\n`;
    message += `Terima kasih.`;

    return encodeURIComponent(message);
}

// Update WhatsApp link with dynamic message
function updateWhatsAppLink() {
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    const message = generateWhatsAppMessage();
    
    whatsappLinks.forEach(link => {
        const baseUrl = link.href.split('?')[0];
        link.href = `${baseUrl}?text=${message}`;
    });
}

// Initialize invoice page
document.addEventListener('DOMContentLoaded', function() {
    loadInvoiceDetails();
    updateWhatsAppLink();
    
    // Update cart count
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Mobile menu toggle
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
});