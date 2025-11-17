// Estado global del carrito
let cart = JSON.parse(localStorage.getItem('sportEctCart')) || [];
let currentProduct = {};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
});

// 1. Consumir API FakeStore
async function fetchProducts() {
    const container = document.getElementById('products-container');
    try {
        // Obtenemos todos los productos (podríamos filtrar por categoría si quisiéramos)
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        
        container.innerHTML = ''; // Limpiar loader

        products.forEach(product => {
            // Tarjeta HTML
            const card = `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="card product-card h-100 shadow-sm">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <div class="card-body text-center">
                            <h5 class="card-title" title="${product.title}">${product.title}</h5>
                            <p class="price-tag">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-outline-primary w-100" onclick="openProductModal(${product.id})">
                                Ver más <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        container.innerHTML = '<p class="text-danger text-center">Error al cargar productos. Intente más tarde.</p>';
        console.error(error);
    }
}

// 2. Abrir Modal de Producto
async function openProductModal(id) {
    // Pequeño fetch individual para asegurar datos frescos
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    
    currentProduct = product;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-category').innerText = product.category.toUpperCase();
    document.getElementById('modal-desc').innerText = product.description.substring(0, 150) + '...';
    document.getElementById('modal-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-qty').value = 1;

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// 3. Lógica del Carrito
function addToCartFromModal() {
    const qty = parseInt(document.getElementById('modal-qty').value);
    const existingItem = cart.find(item => item.id === currentProduct.id);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ ...currentProduct, qty });
    }

    saveCart();
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    alert('✅ Producto agregado al carrito');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeFromCart(id);
        else saveCart();
    }
}

function clearCart() {
    cart = [];
    saveCart();
}

function saveCart() {
    localStorage.setItem('sportEctCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countBadge = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Actualizar contador
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    countBadge.innerText = totalQty;

    // Renderizar lista
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío 😔</p>';
        cartTotal.innerText = '0.00';
        return;
    }

    let html = '<ul class="list-group mb-3">';
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" style="width: 40px; height: 40px; object-fit: contain; margin-right: 10px;">
                    <div>
                        <h6 class="my-0 text-truncate" style="max-width: 150px;">${item.title}</h6>
                        <small class="text-muted">$${item.price} x ${item.qty}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="text-success fw-bold me-3">$${subtotal.toFixed(2)}</span>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary" onclick="updateQty(${item.id}, -1)">-</button>
                        <button class="btn btn-outline-secondary" onclick="updateQty(${item.id}, 1)">+</button>
                        <button class="btn btn-outline-danger" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </li>
        `;
    });

    html += '</ul>';
    cartItemsContainer.innerHTML = html;
    cartTotal.innerText = total.toFixed(2);
}

// 4. Pasarela y Ticket
function openCheckout() {
    if (cart.length === 0) return alert('El carrito está vacío');
    bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

function processPayment() {
    const form = document.getElementById('payment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const customerName = document.getElementById('card-name').value;
    generatePDF(customerName);
    
    // Simular éxito
    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
    clearCart();
    alert('🎉 ¡Pago realizado con éxito! Tu ticket se está descargando.');
}

// 5. Generar Ticket Térmico con jsPDF
function generatePDF(customerName) {
    const { jsPDF } = window.jspdf;
    // Configurar para 80mm de ancho (aprox 226 puntos)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Ancho 80mm, largo variable (ajustable)
    });

    // Configuración de fuente monoespaciada
    doc.setFont("Courier", "normal");
    doc.setFontSize(10);

    let y = 10; // Posición vertical inicial

    // Encabezado
    doc.setFontSize(14);
    doc.setFont("Courier", "bold");
    doc.text("SportEct Store", 40, y, { align: "center" });
    y += 6;
    doc.setFontSize(10);
    doc.setFont("Courier", "normal");
    doc.text("Barahona, Rep. Dom.", 40, y, { align: "center" });
    y += 5;
    doc.text("RNC: 101-55555-9", 40, y, { align: "center" });
    y += 5;
    doc.text("--------------------------------", 40, y, { align: "center" });
    y += 5;

    // Datos Cliente
    const date = new Date().toLocaleString();
    doc.setFontSize(9);
    doc.text(`Fecha: ${date}`, 5, y);
    y += 4;
    doc.text(`Cliente: ${customerName}`, 5, y);
    y += 5;
    doc.text("--------------------------------", 40, y, { align: "center" });
    y += 5;

    // Productos
    doc.text("CANT  DESC            PRECIO", 5, y);
    y += 4;
    
    let total = 0;
    cart.forEach(item => {
        const title = item.title.substring(0, 12); // Truncar nombre
        const subtotal = item.price * item.qty;
        total += subtotal;
        
        // Formato: 1   Camiseta Nike   50.00
        const row = `${item.qty} x  ${title.padEnd(12)} $${subtotal.toFixed(2)}`;
        doc.text(row, 5, y);
        y += 4;
    });

    y += 2;
    doc.text("--------------------------------", 40, y, { align: "center" });
    y += 5;

    // Total
    doc.setFontSize(12);
    doc.setFont("Courier", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 75, y, { align: "right" });
    y += 10;

    // Pie
    doc.setFontSize(9);
    doc.setFont("Courier", "normal");
    doc.text("¡Gracias por su compra!", 40, y, { align: "center" });
    y += 5;
    doc.text("No se aceptan devoluciones", 40, y, { align: "center" });
    y += 5;
    doc.text("después de 30 días.", 40, y, { align: "center" });

    // Guardar
    doc.save(`ticket_sportect_${Date.now()}.pdf`);
}