/* ==========================================================================
   BlitzKrieg Spatial UI Engine & Interaction Controller
   ========================================================================== */

const products = [
  {
    id: 'P001',
    name: 'Wireless Headphones',
    price: 1999,
    image: 'https://www.boat-lifestyle.com/cdn/shop/files/Artboard1_3d51df93-724a-4f08-b491-bd678fb6e8a4.png?v=1728873072',
    description: 'High-fidelity spatial audio with active noise cancellation and ergonomic glass design.'
  },
  {
    id: 'P002',
    name: 'Smart Watch',
    price: 3499,
    image: 'https://www.leafstudios.in/cdn/shop/files/1_1099cd20-7237-4bdf-a180-b7126de5ef3d_800x.png?v=1722230645',
    description: 'Futuristic OLED display with real-time health telemetry and metallic spatial strap.'
  },
  {
    id: 'P003',
    name: 'Bluetooth Speaker',
    price: 1299,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9cYWSaBNIhOPF2gguIun1olGtIYrHAlOO7w&s',
    description: '360° surround acoustic engine with dynamic aura lighting and deep bass.'
  },
  {
    id: 'P004',
    name: 'Cyber Glass Goggles',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    description: 'Next-gen spatial computing eyewear with augmented reality display capabilities.'
  },
  {
    id: 'P005',
    name: 'Tactile Mechanical Board',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    description: 'Ultra-responsive switches with custom RGB backlight and frosted glass baseplate.'
  },
  {
    id: 'P006',
    name: 'Holographic Ambient Lamp',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    description: 'Floating LED levitation lamp creating soothing aurora gradients in your workspace.'
  }
];

// Persistent Local Database
const DB = {
  wishlist: JSON.parse(localStorage.getItem('bk_wishlist')) || [],
  orders: JSON.parse(localStorage.getItem('bk_orders')) || [],
  reviews: JSON.parse(localStorage.getItem('bk_reviews')) || [],
  support: JSON.parse(localStorage.getItem('bk_support')) || [],
  reports: JSON.parse(localStorage.getItem('bk_reports')) || []
};

// DOM References
const productGrid = document.getElementById('productGrid');
const toast = document.getElementById('toast');

// Save data to localStorage
function saveData() {
  localStorage.setItem('bk_wishlist', JSON.stringify(DB.wishlist));
  localStorage.setItem('bk_orders', JSON.stringify(DB.orders));
  localStorage.setItem('bk_reviews', JSON.stringify(DB.reviews));
  localStorage.setItem('bk_support', JSON.stringify(DB.support));
  localStorage.setItem('bk_reports', JSON.stringify(DB.reports));
}

// Spatial Toast System
function showToast(message, icon = 'fa-check-circle') {
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--primary);"></i> ${message}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Render Products Grid
function renderProducts(data = products) {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  if (data.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 16px; color: var(--primary);"></i>
        <h3>No products found matching your search</h3>
      </div>
    `;
    return;
  }

  data.forEach(product => {
    const isWishlisted = DB.wishlist.some(p => p.id === product.id);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-top">
          <h3>${product.name}</h3>
          <span>₹${product.price.toLocaleString()}</span>
        </div>
        <p>${product.description || 'Premium quality product with futuristic design and smart performance.'}</p>
      </div>

      <div class="product-actions">
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
          <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart" style="${isWishlisted ? 'color: var(--primary);' : ''}"></i>
        </button>
        <button class="buy-btn" onclick="placeOrder('${product.id}')">
          Buy Now
        </button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// Toggle Wishlist
function toggleWishlist(id) {
  const product = products.find(p => p.id === id);
  const index = DB.wishlist.findIndex(p => p.id === id);

  if (index > -1) {
    DB.wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'fa-heart-crack');
  } else {
    DB.wishlist.push(product);
    showToast('Added to wishlist', 'fa-heart');
  }

  saveData();
  renderProducts();
  renderWishlist();
}

// Place Order
function placeOrder(id) {
  const product = products.find(p => p.id === id);

  DB.orders.push({
    ...product,
    status: 'Processing',
    date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  });

  saveData();
  renderOrders();
  showToast(`Order placed for ${product.name}`, 'fa-bag-shopping');
}

// Render Wishlist Panel
function renderWishlist() {
  const container = document.getElementById('wishlistList');
  if (!container) return;

  container.innerHTML = '';

  if (DB.wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p>Your wishlist is currently empty.</p>
      </div>
    `;
    return;
  }

  DB.wishlist.forEach(item => {
    container.innerHTML += `
      <div class="list-card" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4>${item.name}</h4>
          <p>Price: <span style="color: var(--primary); font-weight: 700;">₹${item.price.toLocaleString()}</span></p>
        </div>
        <button class="primary-btn" style="padding: 10px 20px; font-size: 0.88rem;" onclick="placeOrder('${item.id}')">
          Buy Now
        </button>
      </div>
    `;
  });
}

// Render Orders Panel
function renderOrders() {
  const container = document.getElementById('ordersList');
  if (!container) return;

  container.innerHTML = '';

  if (DB.orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p>No orders placed yet.</p>
      </div>
    `;
    return;
  }

  DB.orders.forEach(item => {
    container.innerHTML += `
      <div class="list-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4>${item.name}</h4>
          <span style="background: rgba(0, 242, 254, 0.12); color: var(--accent-cyan); border: 1px solid rgba(0, 242, 254, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">
            ${item.status}
          </span>
        </div>
        <p>Amount: ₹${item.price.toLocaleString()}</p>
        <p style="font-size: 0.82rem; color: var(--text-subtle); margin-top: 4px;"><i class="fa-regular fa-clock"></i> ${item.date}</p>
      </div>
    `;
  });
}

// Render Reviews Panel
function renderReviews() {
  const container = document.getElementById('reviewsList');
  if (!container) return;

  container.innerHTML = '';

  if (DB.reviews.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p>No reviews submitted yet.</p>
      </div>
    `;
    return;
  }

  DB.reviews.forEach(item => {
    container.innerHTML += `
      <div class="list-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4>${item.product}</h4>
          <span style="color: #ffb020; font-weight: 700;">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</span>
        </div>
        <p>${item.comment}</p>
      </div>
    `;
  });
}

// Render Support Panel
function renderSupport() {
  const container = document.getElementById('supportList');
  if (!container) return;

  container.innerHTML = '';

  if (DB.support.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p>No support queries submitted yet.</p>
      </div>
    `;
    return;
  }

  DB.support.forEach(item => {
    container.innerHTML += `
      <div class="list-card">
        <h4>Query from ${item.name} (${item.email})</h4>
        <p>${item.message}</p>
      </div>
    `;
  });
}

// Render Reports Panel
function renderReports() {
  const container = document.getElementById('reportList');
  if (!container) return;

  container.innerHTML = '';

  if (DB.reports.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p>No product reports filed yet.</p>
      </div>
    `;
    return;
  }

  DB.reports.forEach(item => {
    container.innerHTML += `
      <div class="list-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4>${item.product}</h4>
          <span style="background: rgba(255, 46, 99, 0.15); color: var(--primary-hover); border: 1px solid rgba(255, 46, 99, 0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">
            ${item.issue}
          </span>
        </div>
        <p>${item.details}</p>
      </div>
    `;
  });
}

/* ==========================================================================
   SPECIFIC REQUIREMENT 3: Custom Glass Dropdowns Engine
   ========================================================================== */

function setupCustomGlassDropdowns() {
  // Populate Product options into Custom Selects
  const reviewMenu = document.getElementById('reviewProductOptions');
  const reportMenu = document.getElementById('reportProductOptions');

  if (reviewMenu && reportMenu) {
    reviewMenu.innerHTML = '';
    reportMenu.innerHTML = '';

    products.forEach((product, index) => {
      const isFirst = index === 0;

      // Review Option
      const revOpt = document.createElement('div');
      revOpt.className = `glass-select-option ${isFirst ? 'selected' : ''}`;
      revOpt.dataset.value = product.name;
      revOpt.innerText = product.name;
      reviewMenu.appendChild(revOpt);

      // Report Option
      const repOpt = document.createElement('div');
      repOpt.className = `glass-select-option ${isFirst ? 'selected' : ''}`;
      repOpt.dataset.value = product.name;
      repOpt.innerText = product.name;
      reportMenu.appendChild(repOpt);

      if (isFirst) {
        document.getElementById('reviewProduct').value = product.name;
        document.getElementById('reviewProductWrapper').querySelector('.selected-text').innerText = product.name;

        document.getElementById('reportProduct').value = product.name;
        document.getElementById('reportProductWrapper').querySelector('.selected-text').innerText = product.name;
      }
    });
  }

  // Attach click listener logic to all glass dropdown wrappers
  const wrappers = document.querySelectorAll('.glass-select-wrapper');

  wrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.glass-select-trigger');
    const menu = wrapper.querySelector('.glass-select-menu');
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');
    const selectedText = wrapper.querySelector('.selected-text');

    if (!trigger || !menu) return;

    // Toggle menu
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();

      // Close other open menus
      document.querySelectorAll('.glass-select-menu.show').forEach(m => {
        if (m !== menu) {
          m.classList.remove('show');
          m.parentElement.querySelector('.glass-select-trigger').classList.remove('active');
        }
      });

      menu.classList.toggle('show');
      trigger.classList.toggle('active');
    });

    // Handle Option Selection
    menu.addEventListener('click', (e) => {
      const option = e.target.closest('.glass-select-option');
      if (!option) return;

      const val = option.dataset.value;

      // Update active state
      menu.querySelectorAll('.glass-select-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      // Update label and hidden input
      if (selectedText) selectedText.innerText = val;
      if (hiddenInput) hiddenInput.value = val;

      // Close menu
      menu.classList.remove('show');
      trigger.classList.remove('active');
    });
  });

  // Close menus when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.glass-select-menu.show').forEach(menu => {
      menu.classList.remove('show');
      menu.parentElement.querySelector('.glass-select-trigger').classList.remove('active');
    });
  });
}

/* ==========================================================================
   EVENT LISTENERS & DASHBOARD NAVIGATION
   ========================================================================== */

// Search Filter Input
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase().trim();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value) ||
      product.description.toLowerCase().includes(value)
    );
    renderProducts(filtered);
  });
}

// Dashboard Tabs Switcher
const dashboardButtons = document.querySelectorAll('.dashboard-btn');
const panels = document.querySelectorAll('.section-panel');

dashboardButtons.forEach(button => {
  button.addEventListener('click', () => {
    dashboardButtons.forEach(btn => btn.classList.remove('active-dashboard'));
    button.classList.add('active-dashboard');

    panels.forEach(panel => panel.classList.add('hidden'));
    const targetPanel = document.getElementById(button.dataset.target);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
    }
  });
});

// Review Form Submit
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productVal = document.getElementById('reviewProduct').value;
    const ratingVal = parseInt(document.getElementById('reviewRating').value, 10);
    const commentVal = document.getElementById('reviewComment').value;

    if (!productVal) {
      showToast('Please select a product', 'fa-triangle-exclamation');
      return;
    }

    DB.reviews.push({
      product: productVal,
      rating: ratingVal,
      comment: commentVal
    });

    saveData();
    renderReviews();
    reviewForm.reset();
    
    // Reset custom select label
    if (products.length > 0) {
      document.getElementById('reviewProduct').value = products[0].name;
      document.getElementById('reviewProductWrapper').querySelector('.selected-text').innerText = products[0].name;
    }

    showToast('Review submitted successfully!', 'fa-star');
  });
}

// Support Form Submit
const supportForm = document.getElementById('supportForm');
if (supportForm) {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    DB.support.push({
      name: document.getElementById('supportName').value,
      email: document.getElementById('supportEmail').value,
      message: document.getElementById('supportMessage').value
    });

    saveData();
    renderSupport();
    supportForm.reset();

    showToast('Support query sent successfully!', 'fa-paper-plane');
  });
}

// Report Form Submit
const reportForm = document.getElementById('reportForm');
if (reportForm) {
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    DB.reports.push({
      product: document.getElementById('reportProduct').value,
      issue: document.getElementById('reportIssue').value,
      details: document.getElementById('reportDetails').value
    });

    saveData();
    renderReports();
    reportForm.reset();

    showToast('Report submitted', 'fa-shield-cat');
  });
}

/* ==========================================================================
   SPATIAL 3D PARALLAX EFFECT FOR HERO SHOWCASE
   ========================================================================== */

function setupHeroParallax() {
  const heroSection = document.getElementById('home');
  const showcase = document.getElementById('heroShowcase');

  if (!heroSection || !showcase) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPos = (clientX / innerWidth - 0.5) * 20;
    const yPos = (clientY / innerHeight - 0.5) * 20;

    showcase.style.transform = `rotateY(${xPos}deg) rotateX(${-yPos}deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    showcase.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/* ==========================================================================
   AMBIENT BACKGROUND, PARALLAX & SCROLL REVEAL
   ========================================================================== */

function setupAmbientExperience() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ambient = document.getElementById('ambientBackground');
  const animatedNodes = document.querySelectorAll('.bg-blur, .particle-field i, .floating-card, .flash-sale, .main-product');

  const setAnimationState = () => {
    const playState = document.hidden || reducedMotion.matches ? 'paused' : 'running';
    animatedNodes.forEach(node => { node.style.animationPlayState = playState; });
  };
  document.addEventListener('visibilitychange', setAnimationState);
  reducedMotion.addEventListener?.('change', setAnimationState);
  setAnimationState();

  const revealSelector = '.hero-content, .hero-visual, .section-title, .stat-card, .feature-card, .product-card, .dashboard-buttons, .dashboard-card, .about-card, footer';
  const reveal = (scope = document) => {
    scope.querySelectorAll(revealSelector).forEach(element => element.classList.add('reveal-item'));
  };
  reveal();

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    document.querySelectorAll('.reveal-item').forEach(element => observer.observe(element));

    const gridObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches('.product-card')) {
          node.classList.add('reveal-item');
          observer.observe(node);
        }
      }));
    });
    ['productGrid', 'ordersList', 'wishlistList', 'reviewsList', 'supportList', 'reportList'].forEach(id => {
      const target = document.getElementById(id);
      if (target) gridObserver.observe(target, { childList: true });
    });
  } else {
    document.querySelectorAll('.reveal-item').forEach(element => element.classList.add('is-visible'));
  }

  if (!ambient || reducedMotion.matches) return;
  let framePending = false;
  const applyScrollDepth = () => {
    ambient.style.setProperty('--parallax-y', `${Math.min(window.scrollY * -0.025, 42)}px`);
    framePending = false;
  };
  window.addEventListener('scroll', () => {
    if (!framePending) { framePending = true; requestAnimationFrame(applyScrollDepth); }
  }, { passive: true });
  applyScrollDepth();

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - .5) * 12;
      const y = (event.clientY / window.innerHeight - .5) * 10;
      ambient.style.setProperty('--parallax-x', `${x}px`);
      ambient.style.setProperty('--parallax-y', `${y + Math.min(window.scrollY * -0.025, 42)}px`);
    }, { passive: true });
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderWishlist();
  renderOrders();
  renderReviews();
  renderSupport();
  renderReports();
  setupCustomGlassDropdowns();
  setupHeroParallax();
  setupAmbientExperience();
});
