const products = [
  {
    id:'P001',
    name:'Wireless Headphones',
    price:1999,
    image:'https://www.boat-lifestyle.com/cdn/shop/files/Artboard1_3d51df93-724a-4f08-b491-bd678fb6e8a4.png?v=1728873072'
  },
  {
    id:'P002',
    name:'Smart Watch',
    price:3499,
    image:'https://www.leafstudios.in/cdn/shop/files/1_1099cd20-7237-4bdf-a180-b7126de5ef3d_800x.png?v=1722230645'
  },
  {
    id:'P003',
    name:'Bluetooth Speaker',
    price:1299,
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9cYWSaBNIhOPF2gguIun1olGtIYrHAlOO7w&s'
  }
];

const DB = {
  users: JSON.parse(localStorage.getItem('bk_users')) || [],
  wishlist: JSON.parse(localStorage.getItem('bk_wishlist')) || [],
  orders: JSON.parse(localStorage.getItem('bk_orders')) || [],
  reviews: JSON.parse(localStorage.getItem('bk_reviews')) || [],
  support: JSON.parse(localStorage.getItem('bk_support')) || [],
  reports: JSON.parse(localStorage.getItem('bk_reports')) || []
};

const productGrid = document.getElementById('productGrid');
const toast = document.getElementById('toast');

function saveData(){
  localStorage.setItem('bk_users',JSON.stringify(DB.users));
  localStorage.setItem('bk_wishlist',JSON.stringify(DB.wishlist));
  localStorage.setItem('bk_orders',JSON.stringify(DB.orders));
  localStorage.setItem('bk_reviews',JSON.stringify(DB.reviews));
  localStorage.setItem('bk_support',JSON.stringify(DB.support));
  localStorage.setItem('bk_reports',JSON.stringify(DB.reports));
}

function showToast(message){
  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(()=>{
    toast.classList.remove('show');
  },2500);
}

function renderProducts(data = products){

  productGrid.innerHTML = '';

  data.forEach(product=>{

    const card = document.createElement('div');

    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}">

      <div class="product-top">
        <h3>${product.name}</h3>
        <span>₹${product.price}</span>
      </div>

      <p>Premium quality product with futuristic design and smart performance.</p>

      <div class="product-actions">

        <button class="wishlist-btn" onclick="addWishlist('${product.id}')">
          <i class="fa-solid fa-heart"></i>
        </button>

        <button class="buy-btn" onclick="placeOrder('${product.id}')">
          Buy Now
        </button>

      </div>
    `;

    productGrid.appendChild(card);

  });

}

function addWishlist(id){

  const product = products.find(p=>p.id === id);

  if(DB.wishlist.find(p=>p.id === id)){
    showToast('Already in wishlist');
    return;
  }

  DB.wishlist.push(product);
  saveData();
  renderWishlist();

  showToast('Added to wishlist');

}

function placeOrder(id){

  const product = products.find(p=>p.id === id);

  DB.orders.push({
    ...product,
    status:'Processing',
    date:new Date().toLocaleString()
  });

  saveData();
  renderOrders();

  showToast('Order placed successfully');

}

function renderWishlist(){

  const container = document.getElementById('wishlistList');

  container.innerHTML = '';

  DB.wishlist.forEach(item=>{

    container.innerHTML += `
      <div class="list-card">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
      </div>
    `;

  });

}

function renderOrders(){

  const container = document.getElementById('ordersList');

  container.innerHTML = '';

  DB.orders.forEach(item=>{

    container.innerHTML += `
      <div class="list-card">
        <h4>${item.name}</h4>
        <p>Status : ${item.status}</p>
        <p>${item.date}</p>
      </div>
    `;

  });

}

function renderReviews(){

  const container = document.getElementById('reviewsList');

  container.innerHTML = '';

  DB.reviews.forEach(item=>{

    container.innerHTML += `
      <div class="list-card">
        <h4>${item.product}</h4>
        <p>⭐ ${item.rating}/5</p>
        <p>${item.comment}</p>
      </div>
    `;

  });

}

function renderSupport(){

  const container = document.getElementById('supportList');

  container.innerHTML = '';

  DB.support.forEach(item=>{

    container.innerHTML += `
      <div class="list-card">
        <h4>${item.name}</h4>
        <p>${item.message}</p>
      </div>
    `;

  });

}

function renderReports(){

  const container = document.getElementById('reportList');

  container.innerHTML = '';

  DB.reports.forEach(item=>{

    container.innerHTML += `
      <div class="list-card">
        <h4>${item.product}</h4>
        <p>${item.issue}</p>
        <p>${item.details}</p>
      </div>
    `;

  });

}

function populateSelects(){

  const reviewSelect = document.getElementById('reviewProduct');
  const reportSelect = document.getElementById('reportProduct');

  products.forEach(product=>{

    reviewSelect.innerHTML += `
      <option value="${product.name}">${product.name}</option>
    `;

    reportSelect.innerHTML += `
      <option value="${product.name}">${product.name}</option>
    `;

  });

}

// SEARCH

document.getElementById('searchInput').addEventListener('input',(e)=>{

  const value = e.target.value.toLowerCase();

  const filtered = products.filter(product=>
    product.name.toLowerCase().includes(value)
  );

  renderProducts(filtered);

});

// REVIEW FORM

document.getElementById('reviewForm').addEventListener('submit',(e)=>{

  e.preventDefault();

  DB.reviews.push({
    product:document.getElementById('reviewProduct').value,
    rating:document.getElementById('reviewRating').value,
    comment:document.getElementById('reviewComment').value
  });

  saveData();
  renderReviews();

  e.target.reset();

  showToast('Review submitted');

});

// SUPPORT FORM

document.getElementById('supportForm').addEventListener('submit',(e)=>{

  e.preventDefault();

  DB.support.push({
    name:document.getElementById('supportName').value,
    email:document.getElementById('supportEmail').value,
    message:document.getElementById('supportMessage').value
  });

  saveData();
  renderSupport();

  e.target.reset();

  showToast('Support query submitted');

});

// REPORT FORM

document.getElementById('reportForm').addEventListener('submit',(e)=>{

  e.preventDefault();

  DB.reports.push({
    product:document.getElementById('reportProduct').value,
    issue:document.getElementById('reportIssue').value,
    details:document.getElementById('reportDetails').value
  });

  saveData();
  renderReports();

  e.target.reset();

  showToast('Report submitted');

});

// DASHBOARD TABS

const dashboardButtons = document.querySelectorAll('.dashboard-btn');

const panels = document.querySelectorAll('.section-panel');


dashboardButtons.forEach(button=>{

  button.addEventListener('click',()=>{

    dashboardButtons.forEach(btn=>btn.classList.remove('active-dashboard'));

    button.classList.add('active-dashboard');

    panels.forEach(panel=>panel.classList.add('hidden'));

    document.getElementById(button.dataset.target).classList.remove('hidden');

  });

});

// AUTH MODAL

const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const authName = document.getElementById('authName');
const authPassword2 = document.getElementById('authPassword2');
const authSubmitBtn = document.getElementById('authSubmitBtn');

let isLogin = true;

function openModal(loginMode){

  isLogin = loginMode;

  modalBackdrop.style.display = 'flex';

  if(loginMode){

    modalTitle.innerText = 'Login';
    authSubmitBtn.innerText = 'Login';

    authName.classList.add('hidden');
    authPassword2.classList.add('hidden');

  }else{

    modalTitle.innerText = 'Register';
    authSubmitBtn.innerText = 'Create Account';

    authName.classList.remove('hidden');
    authPassword2.classList.remove('hidden');

  }

}


document.getElementById('openLogin').onclick = ()=>openModal(true);
document.getElementById('openRegister').onclick = ()=>openModal(false);
document.getElementById('closeModal').onclick = ()=>{
  modalBackdrop.style.display = 'none';
};

// AUTH FORM

document.getElementById('authForm').addEventListener('submit',(e)=>{

  e.preventDefault();

  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;

  if(isLogin){

    const user = DB.users.find(user=>
      user.email === email && user.password === password
    );

    if(user){
      showToast('Login successful');
      modalBackdrop.style.display = 'none';
    }else{
      showToast('Invalid credentials');
    }

  }else{

    const user = {
      name:authName.value,
      email,
      password
    };

    DB.users.push(user);

    saveData();

    showToast('Registration successful');

    modalBackdrop.style.display = 'none';

  }

  e.target.reset();

});

// INITIALIZE

renderProducts();
renderWishlist();
renderOrders();
renderReviews();
renderSupport();
renderReports();
populateSelects();