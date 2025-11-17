// --- BASE DE DATOS (Imágenes Corregidas por Usuario) ---
const sportDB = [
    { 
        id: 1, 
        title: "Balón Oficial Pro League", 
        price: 29.99, 
        category: "futbol", 
        image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=400&q=80" 
    },
    { 
        id: 2, 
        title: "Botines X Speedportal", 
        price: 89.50, 
        category: "futbol", 
        image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/43cd81b709e145e28406af730070d692_9366/Botines_X_Speedportal.1_Terreno_Firme_Rosa_GZ5108_22_model.jpg" 
    },
    { 
        id: 3, 
        title: "Camiseta Entrenamiento Dry", 
        price: 24.99, 
        category: "gym", 
        image: "https://m.media-amazon.com/images/I/71ppz185TZL._AC_UY1000_.jpg" 
    },
    { 
        id: 4, 
        title: "Zapatillas Running Air", 
        price: 110.00, 
        category: "running", 
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" 
    },
    { 
        id: 5, 
        title: "Mancuernas 10kg (Par)", 
        price: 45.00, 
        category: "gym", 
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80" 
    },
    { 
        id: 6, 
        title: "Reloj Deportivo Smart", 
        price: 150.00, 
        category: "running", 
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80" 
    },
    { 
        id: 7, 
        title: "Guantes de Portero Elite", 
        price: 35.00, 
        category: "futbol", 
        image: "https://golero.com.mx/wp-content/uploads/2024/08/guantes-de-portero-elite-revoluction-combi-aqua-golero-sport-0-min-scaled.jpg" 
    },
    { 
        id: 8, 
        title: "Botella Hidratación Nature", 
        price: 12.50, 
        category: "gym", 
        image: "https://www.argentinaextrema.com/images/turismo-aventura-paquetes/botella-naturehike.jpg" 
    }
];

let cart = JSON.parse(localStorage.getItem('sportEctCart')) || [];
let currentProduct = {};

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(sportDB);
    updateCartUI();
    setupSearch();
    setupTheme(); // Inicializar tema
});

// --- 1. GESTIÓN DE TEMA (DARK MODE) ---
function setupTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('i');
    
    // Leer preferencia guardada
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme, icon);

    toggleBtn.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme, icon);
    });
}

function updateIcon(theme, iconElement) {
    if (theme === 'dark') {
        iconElement.classList.remove('fa-moon');
        iconElement.classList.add('fa-sun');
    } else {
        iconElement.classList.remove('fa-sun');
        iconElement.classList.add('fa-moon');
    }
}

// --- 2. RENDERIZADO ---
function renderProducts(products) {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5 opacity-50"><h3>😕 Sin resultados.</h3></div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card product-card h-100 shadow-sm" onclick="openProductModal(${product.id})">
                <div class="card-img-wrapper">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                </div>
                <div class="card-body text-center">
                    <small class="text-uppercase fw-bold text-warning" style="font-size: 0.7rem;">${product.category}</small>
                    <h5 class="card-title mt-1 text-truncate brand-font">${product.title}</h5>
                    <p class="price-tag mb-0">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCategory(category, btnElement) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    if (category === 'all') {
        renderProducts(sportDB);
    } else {
        const filtered = sportDB.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function setupSearch() {
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = sportDB.filter(p => p.title.toLowerCase().includes(term));
        renderProducts(filtered);
    };
    const searchInput = document.getElementById('search-input');
    const searchInputMobile = document.getElementById('search-input-mobile');

    if(searchInput) searchInput.addEventListener('keyup', handleSearch);
    if(searchInputMobile) searchInputMobile.addEventListener('keyup', handleSearch);
}

// --- 3. MODAL Y CARRITO ---
function openProductModal(id) {
    const product = sportDB.find(p => p.id === id);
    if (!product) return;
    
    currentProduct = product;

    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-category').innerText = product.category.toUpperCase();
    document.getElementById('modal-desc').innerText = "Equipamiento de alto rendimiento. Calidad garantizada para tu entrenamiento.";
    document.getElementById('modal-price').innerText = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-qty').value = 1;
    document.getElementById('modal-size').value = 'M'; 

    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function addToCartFromModal() {
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    const size = document.getElementById('modal-size').value; 

    const existingIndex = cart.findIndex(item => item.id === currentProduct.id && item.size === size);

    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({ ...currentProduct, qty, size });
    }

    saveAndUpdate();
    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    alert("✅ Agregado al carrito");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndUpdate();
}

function clearCart() {
    cart = [];
    saveAndUpdate();
}

function saveAndUpdate() {
    localStorage.setItem('sportEctCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countBadge = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    countBadge.innerText = totalQty;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="text-center py-4 opacity-50"><i class="fas fa-running fa-3x mb-3"></i><p>Tu equipo está vacío</p></div>';
        cartTotal.innerText = '0.00';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        return `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" style="width: 50px; height: 50px; object-fit: contain; background: white;" class="me-3 rounded border p-1">
                    <div>
                        <h6 class="mb-0 fw-bold">${item.title}</h6>
                        <span class="badge bg-secondary my-1">Talla: ${item.size}</span>
                        <div class="small opacity-75">$${item.price} x ${item.qty}</div>
                    </div>
                </div>
                <div class="text-end">
                    <span class="fw-bold d-block">$${subtotal.toFixed(2)}</span>
                    <button class="btn btn-sm text-danger p-0" onclick="removeFromCart(${index})"><small>Eliminar</small></button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.innerText = total.toFixed(2);
}

// --- 4. CHECKOUT Y PDF ---
function openCheckout() {
    if (cart.length === 0) return alert('El carrito está vacío.');
    bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

function processPayment() {
    const name = document.getElementById('card-name').value;
    if (!name) return alert("Ingresa el nombre del titular.");

    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESANDO...';
    btn.disabled = true;

    setTimeout(() => {
        generatePDF(name);
        clearCart();
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        btn.innerText = originalText;
        btn.disabled = false;
        document.getElementById('payment-form').reset();
        alert("¡Victoria! 🏆 Compra realizada.");
    }, 2000);
}

function generatePDF(customerName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait', unit: 'mm', format: [80, 200]
    });

    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    let y = 10;
    
    doc.setFontSize(14); doc.setFont("courier", "bold");
    doc.text("SPORTECT STORE", 40, y, { align: "center" });
    y += 5;
    doc.setFontSize(9); doc.setFont("courier", "normal");
    doc.text("Equipamiento Profesional", 40, y, { align: "center" });
    y += 10;

    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 5, y);
    y += 5;
    doc.text(`Cliente: ${customerName}`, 5, y);
    y += 5;
    doc.text("--------------------------------", 40, y, { align: "center" });
    y += 5;

    doc.setFontSize(8);
    doc.text("CANT  PROD (TALLA)      TOTAL", 5, y);
    y += 5;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        const name = item.title.substring(0, 10);
        const line = `${item.qty} x  ${name} (${item.size})   $${subtotal.toFixed(0)}`;
        doc.text(line, 5, y);
        y += 5;
    });

    doc.text("--------------------------------", 40, y, { align: "center" });
    y += 5;

    doc.setFontSize(12); doc.setFont("courier", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 75, y, { align: "right" });
    
    doc.save(`Ticket_SportEct_${Date.now()}.pdf`);
}
