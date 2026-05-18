// State
let cart = [];
let products = [];
let orders = [];
let wishlist = [];
let appliedDiscount = 0;
let isCouponApplied = false;

// Default Products (Fallback if local storage is empty)
const defaultProducts = [
    { id: '1', name: 'Aethel Flaed Diamond Ring', category: 'Rings', price: 4500, img: 'assets/ring.png', status: 'in_stock' },
    { id: '2', name: 'Lumina Rose Pendant', category: 'Necklaces', price: 2850, img: 'assets/necklace.png', status: 'in_stock' },
    { id: '3', name: 'Stellar Drop Earrings', category: 'Earrings', price: 6200, img: 'assets/earrings.png', status: 'in_stock' }
];

// DOM Elements - General
const header = document.getElementById('header');
const productGridContainer = document.getElementById('product-grid-container');

// DOM Elements - Cart
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElements = document.querySelectorAll('.cart-count:not(#wishlist-count-badge)');
const cartTotalPrice = document.getElementById('cart-total-price');
const openCheckoutBtn = document.getElementById('open-checkout-btn');

// DOM Elements - Wishlist
const wishlistBtn = document.getElementById('wishlist-btn');
const closeWishlistBtn = document.getElementById('close-wishlist-btn');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const wishlistOverlay = document.getElementById('wishlist-overlay');
const wishlistItemsContainer = document.getElementById('wishlist-items');
const wishlistCountBadge = document.getElementById('wishlist-count-badge');

// DOM Elements - Login
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const loginOverlay = document.getElementById('login-modal-overlay');
const closeLoginBtn = document.getElementById('close-login-btn');
const loginForm = document.getElementById('login-form');
const loginPasswordInput = document.getElementById('password');

// DOM Elements - Checkout Transaction
const checkoutModal = document.getElementById('checkout-modal');
const checkoutOverlay = document.getElementById('checkout-modal-overlay');
const closeCheckoutBtn = document.getElementById('close-checkout-btn');
const checkoutForm = document.getElementById('checkout-form');
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const couponInput = document.getElementById('coupon-code');
const couponMessage = document.getElementById('coupon-message');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutDiscountRow = document.getElementById('checkout-discount-row');
const checkoutDiscountAmount = document.getElementById('checkout-discount-amount');
const checkoutFinalTotal = document.getElementById('checkout-final-total');
const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
const ccFields = document.getElementById('credit-card-fields');
const ccNumber = document.getElementById('cc-number');
const ccExpiry = document.getElementById('cc-expiry');
const ccCvv = document.getElementById('cc-cvv');

// DOM Elements - Admin
const adminDashboard = document.getElementById('admin-dashboard');
const adminLogoutBtn = document.getElementById('admin-logout');
const adminProductList = document.getElementById('admin-product-list');
const addNewBtn = document.getElementById('add-new-btn');
const addProductPanel = document.getElementById('add-product-panel');
const cancelAddBtn = document.getElementById('cancel-add-btn');
const addProductForm = document.getElementById('add-product-form');

// Admin Tabs & Sections
const navProductsLi = document.getElementById('nav-products-li');
const navOrdersLi = document.getElementById('nav-orders-li');
const navProductsBtn = document.getElementById('nav-products');
const navOrdersBtn = document.getElementById('nav-orders');
const adminProductsSection = document.getElementById('admin-products-section');
const adminOrdersSection = document.getElementById('admin-orders-section');
const adminOrdersList = document.getElementById('admin-orders-list');

// Initialization
function init() {
    // Load products
    const storedProducts = localStorage.getItem('kavya_products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [...defaultProducts];
        saveProducts();
    }
    
    // Load orders
    const storedOrders = localStorage.getItem('kavya_orders');
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
    
    // Load wishlist
    const storedWishlist = localStorage.getItem('kavya_wishlist');
    if (storedWishlist) {
        wishlist = JSON.parse(storedWishlist);
    }
    
    renderProducts();
    handleScroll();
    updateCartUI();
    updateWishlistUI();
}

function saveProducts() {
    localStorage.setItem('kavya_products', JSON.stringify(products));
}

function saveOrders() {
    localStorage.setItem('kavya_orders', JSON.stringify(orders));
}

function saveWishlist() {
    localStorage.setItem('kavya_wishlist', JSON.stringify(wishlist));
}

// Event Listeners - General
window.addEventListener('scroll', handleScroll);

// Event Listeners - Cart & Checkout
cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

openCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    toggleCart(); // close cart
    updateCheckoutTotals(); // ensure totals are fresh
    toggleCheckout(); // open checkout modal
});

closeCheckoutBtn.addEventListener('click', toggleCheckout);
checkoutOverlay.addEventListener('click', toggleCheckout);

if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

// Event Listeners - Wishlist
wishlistBtn.addEventListener('click', toggleWishlistSidebar);
closeWishlistBtn.addEventListener('click', toggleWishlistSidebar);
wishlistOverlay.addEventListener('click', toggleWishlistSidebar);


// Event Listeners - Transaction Features (Coupons & Payments)
applyCouponBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (code === 'KAVYA20') {
        isCouponApplied = true;
        appliedDiscount = 0.20; // 20% off
        couponMessage.textContent = 'Coupon applied successfully!';
        couponMessage.style.color = '#2ecc71';
        couponMessage.style.display = 'block';
    } else {
        isCouponApplied = false;
        appliedDiscount = 0;
        couponMessage.textContent = 'Invalid coupon code.';
        couponMessage.style.color = '#e74c3c';
        couponMessage.style.display = 'block';
    }
    updateCheckoutTotals();
});

paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'CreditCard') {
            ccFields.style.display = 'flex';
            ccNumber.required = true;
            ccExpiry.required = true;
            ccCvv.required = true;
        } else {
            ccFields.style.display = 'none';
            ccNumber.required = false;
            ccExpiry.required = false;
            ccCvv.required = false;
        }
    });
});

// Event Listeners - Login
loginBtn.addEventListener('click', toggleLogin);
closeLoginBtn.addEventListener('click', toggleLogin);
loginOverlay.addEventListener('click', toggleLogin);

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = loginPasswordInput.value;
        
        if (password === 'ADMIN_999') {
            toggleLogin(); 
            openAdminDashboard();
        } else {
            alert('Login successful (Demo User)');
            toggleLogin();
        }
        loginForm.reset();
    });
}

// Event Listeners - Admin Tab Switching
navProductsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navProductsLi.classList.add('active');
    navOrdersLi.classList.remove('active');
    adminProductsSection.style.display = 'block';
    adminOrdersSection.style.display = 'none';
});

navOrdersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navOrdersLi.classList.add('active');
    navProductsLi.classList.remove('active');
    adminOrdersSection.style.display = 'block';
    adminProductsSection.style.display = 'none';
    renderAdminOrders(); // re-render when switching tabs
});

// Event Listeners - Admin General
adminLogoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminDashboard.classList.remove('open');
    document.body.style.overflow = '';
});

addNewBtn.addEventListener('click', () => {
    addProductPanel.style.display = 'block';
});

cancelAddBtn.addEventListener('click', () => {
    addProductPanel.style.display = 'none';
    addProductForm.reset();
});

if (addProductForm) {
    addProductForm.addEventListener('submit', handleAddProductSubmit);
}

// Logic - Checkout
function updateCheckoutTotals() {
    const rawTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutSubtotal.textContent = formatCurrency(rawTotal);
    
    let discountVal = 0;
    if (isCouponApplied) {
        discountVal = rawTotal * appliedDiscount;
        checkoutDiscountRow.style.display = 'flex';
        checkoutDiscountAmount.textContent = '-' + formatCurrency(discountVal);
    } else {
        checkoutDiscountRow.style.display = 'none';
    }
    
    const finalTotal = rawTotal - discountVal;
    checkoutFinalTotal.textContent = formatCurrency(finalTotal);
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const address = document.getElementById('checkout-address').value;
    
    let selectedPayment = 'COD';
    paymentRadios.forEach(radio => {
        if (radio.checked) selectedPayment = radio.value;
    });
    
    const rawTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountVal = isCouponApplied ? (rawTotal * appliedDiscount) : 0;
    const finalTotal = rawTotal - discountVal;
    
    const newOrder = {
        id: 'ORD-' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        customerName: name,
        customerEmail: email,
        customerAddress: address,
        items: [...cart],
        subtotal: rawTotal,
        discount: discountVal,
        totalPrice: finalTotal,
        paymentMethod: selectedPayment,
        couponApplied: isCouponApplied ? couponInput.value.toUpperCase() : null
    };
    
    orders.unshift(newOrder); // add to beginning
    saveOrders();
    
    // Reset cart and transaction state
    cart = [];
    isCouponApplied = false;
    appliedDiscount = 0;
    couponMessage.style.display = 'none';
    couponInput.value = '';
    
    // Reset payment to COD
    document.querySelector('input[name="payment_method"][value="COD"]').checked = true;
    ccFields.style.display = 'none';
    ccNumber.required = false;
    ccExpiry.required = false;
    ccCvv.required = false;
    
    updateCartUI();
    
    alert(`Order ${newOrder.id} placed successfully! Thank you for your purchase.`);
    toggleCheckout();
    checkoutForm.reset();
}

// Logic - Admin
function handleAddProductSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('add-name').value;
    const category = document.getElementById('add-category').value;
    const price = parseFloat(document.getElementById('add-price').value);
    const status = document.getElementById('add-status').value;
    const imageFile = document.getElementById('add-image').files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgDataUrl = event.target.result;
            
            const newProduct = {
                id: Date.now().toString(),
                name,
                category,
                price,
                status,
                img: imgDataUrl
            };
            
            products.push(newProduct);
            saveProducts();
            renderProducts();
            renderAdminProducts();
            
            addProductForm.reset();
            addProductPanel.style.display = 'none';
        };
        reader.readAsDataURL(imageFile);
    }
}

function openAdminDashboard() {
    adminDashboard.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Default tab is products
    navProductsBtn.click();
    
    renderAdminProducts();
}

function renderAdminProducts() {
    adminProductList.innerHTML = '';
    
    products.forEach(p => {
        const tr = document.createElement('tr');
        const formattedPrice = formatCurrency(p.price);
        const statusText = p.status === 'in_stock' ? 'In Stock' : 'Out of Stock';
        
        tr.innerHTML = `
            <td><img src="${p.img}" alt="${p.name}"></td>
            <td>${p.name}<br><small style="color:var(--text-secondary)">${p.category}</small></td>
            <td>${formattedPrice}</td>
            <td><span class="status-badge ${p.status}">${statusText}</span></td>
            <td>
                <button class="action-link" onclick="toggleProductStatus('${p.id}')">
                    Toggle Status
                </button>
            </td>
        `;
        adminProductList.appendChild(tr);
    });
}

function renderAdminOrders() {
    adminOrdersList.innerHTML = '';
    
    if (orders.length === 0) {
        adminOrdersList.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No orders found.</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const tr = document.createElement('tr');
        
        // Build items HTML string
        const itemsListHTML = order.items.map(i => `${i.quantity}x ${i.name}`).join('<br>');
        
        // Payment and Discount labels
        let paymentBadgeColor = order.paymentMethod === 'COD' ? '#e67e22' : '#3498db';
        let paymentLabel = `<span style="background-color:${paymentBadgeColor}20; color:${paymentBadgeColor}; padding:0.15rem 0.4rem; border-radius:4px; font-size:0.75rem;">${order.paymentMethod}</span>`;
        
        let discountLabel = order.discount > 0 ? `<br><small style="color:#2ecc71;">Discount: -${formatCurrency(order.discount)}</small>` : '';

        tr.innerHTML = `
            <td>
                <strong>${order.id}</strong><br>
                <small style="color:var(--text-secondary)">${order.date}</small>
            </td>
            <td>
                ${order.customerName}<br>
                <small style="color:var(--text-secondary)">${order.customerEmail}</small><br>
                ${paymentLabel}
            </td>
            <td>
                <small style="color:var(--text-secondary)">${itemsListHTML}</small>
            </td>
            <td>
                <strong>${formatCurrency(order.totalPrice)}</strong>
                ${discountLabel}
            </td>
        `;
        adminOrdersList.appendChild(tr);
    });
}

window.toggleProductStatus = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.status = product.status === 'in_stock' ? 'out_of_stock' : 'in_stock';
        saveProducts();
        renderProducts();
        renderAdminProducts();
    }
}

// Logic - Main UI (Products & Wishlist)
function renderProducts() {
    if (!productGridContainer) return;
    
    productGridContainer.innerHTML = '';
    
    products.forEach(p => {
        const isOutOfStock = p.status === 'out_of_stock';
        const inWishlist = wishlist.some(w => w.id === p.id);
        
        const card = document.createElement('div');
        card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''}`;
        
        card.innerHTML = `
            <div class="product-image-wrap">
                ${isOutOfStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
                
                <button class="wishlist-btn-card ${inWishlist ? 'active' : ''}" data-id="${p.id}" aria-label="Toggle Wishlist">
                    <i class="ph ${inWishlist ? 'ph-fill' : ''} ph-heart"></i>
                </button>
                
                <img src="${p.img}" alt="${p.name}" class="product-image">
                <div class="product-overlay">
                    <button class="btn-primary add-to-cart" ${isOutOfStock ? 'disabled' : ''} data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">
                        ${isOutOfStock ? 'Notify Me' : 'Add to Cart'}
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">${formatCurrency(p.price)}</div>
            </div>
        `;
        
        productGridContainer.appendChild(card);
    });
    
    // Add to cart listeners
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const img = e.target.dataset.img;
            
            addToCart({ id, name, price, img });
            toggleCart();
        });
    });
    
    // Wishlist listeners
    document.querySelectorAll('.wishlist-btn-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Need to get data-id from either button or icon if clicked
            const id = e.currentTarget.dataset.id; 
            toggleWishlistItem(id);
        });
    });
}

function toggleWishlistItem(id) {
    const existingIndex = wishlist.findIndex(w => w.id === id);
    
    if (existingIndex >= 0) {
        // Remove it
        wishlist.splice(existingIndex, 1);
    } else {
        // Find product and add it
        const product = products.find(p => p.id === id);
        if (product) {
            wishlist.push({...product});
        }
    }
    
    saveWishlist();
    updateWishlistUI();
    renderProducts(); // re-render to update heart states
}

function toggleWishlistSidebar() {
    wishlistSidebar.classList.toggle('open');
    wishlistOverlay.classList.toggle('open');
    
    // Close other sidebar if open
    if (wishlistSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        if (cartSidebar.classList.contains('open')) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    } else {
        document.body.style.overflow = '';
    }
}

function updateWishlistUI() {
    wishlistCountBadge.textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<div class="empty-cart-msg">Your wishlist is currently empty.</div>';
        return;
    }
    
    wishlistItemsContainer.innerHTML = '';
    wishlist.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item'; // Reusing cart item style
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                
                <div style="display:flex; gap:0.5rem;">
                    <button class="wishlist-action-btn" onclick="moveToCartFromWishlist('${item.id}')">Move to Cart</button>
                    <button class="cart-item-remove" style="margin-top:0.25rem;" onclick="toggleWishlistItem('${item.id}')">Remove</button>
                </div>
            </div>
        `;
        wishlistItemsContainer.appendChild(itemEl);
    });
}

window.moveToCartFromWishlist = function(id) {
    const item = wishlist.find(w => w.id === id);
    if (item && item.status !== 'out_of_stock') {
        addToCart({ id: item.id, name: item.name, price: item.price, img: item.img });
        toggleWishlistItem(item.id); // Removes from wishlist
        
        // Open cart to show it was added
        if (wishlistSidebar.classList.contains('open')) {
            toggleWishlistSidebar();
        }
        toggleCart();
    } else {
        alert("This item is currently out of stock and cannot be added to cart.");
    }
}

// Utilities
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        if (wishlistSidebar.classList.contains('open')) {
            wishlistSidebar.classList.remove('open');
            wishlistOverlay.classList.remove('open');
        }
    } else {
        document.body.style.overflow = '';
    }
}

function toggleLogin() {
    loginModal.classList.toggle('open');
    loginOverlay.classList.toggle('open');
    document.body.style.overflow = loginModal.classList.contains('open') ? 'hidden' : '';
}

function toggleCheckout() {
    checkoutModal.classList.toggle('open');
    checkoutOverlay.classList.toggle('open');
    document.body.style.overflow = checkoutModal.classList.contains('open') ? 'hidden' : '';
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Be careful to only update actual cart counts, not the wishlist count
    document.querySelectorAll('.cart-count:not(#wishlist-count-badge)').forEach(el => el.textContent = totalCount);
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = formatCurrency(totalPrice);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is currently empty.</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatCurrency(item.price)} ${item.quantity > 1 ? `(x${item.quantity})` : ''}</div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
}

// Start
init();
