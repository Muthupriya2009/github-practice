const PRODUCTS = [
  {
    id: 1,
    name: "Classic Saddle Leather Loop",
    category: "leather",
    price: 18.00,
    icon: "🏷️",
    desc: "Full-grain vegetable-tanned leather with antique brass rivet."
  },
  {
    id: 2,
    name: "Solid Brass Hotel Key Tag",
    category: "metal",
    price: 24.00,
    icon: "🔑",
    desc: "Hefty die-cast brass tag with room number engraving."
  },
  {
    id: 3,
    name: "Lucky Koi Acrylic Charm",
    category: "acrylic",
    price: 12.00,
    icon: "🐟",
    desc: "Double-sided holographic acrylic with a gold star clasp."
  },
  {
    id: 4,
    name: "Minimalist Titanium Carabiner",
    category: "metal",
    price: 28.00,
    icon: "🧲",
    desc: "Ultra-lightweight grade-5 titanium quick-release clip."
  },
  {
    id: 5,
    name: "Braided Cord & Leather Keeper",
    category: "leather",
    price: 16.50,
    icon: "🪢",
    desc: "Climbing-grade paracord woven into oiled pull-up leather."
  },
  {
    id: 6,
    name: "Pixel Mushroom Charm",
    category: "acrylic",
    price: 11.00,
    icon: "🍄",
    desc: "Nostalgic retro pixel art with scratch-resistant gloss coating."
  }
];

let cart = [];

const productsGrid = document.getElementById("products-grid");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const filterPills = document.querySelectorAll(".filter-pill");
const checkoutBtn = document.getElementById("checkout-btn");

function renderProducts(filter = "all") {
  productsGrid.innerHTML = "";
  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-preview">${p.icon}</div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-bottom">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" data-id="${p.id}">Add to Bag</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalCount;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your bag is currently empty.</p>';
    cartTotal.textContent = "$0.00";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item, index) => {
    const sub = item.price * item.qty;
    total += sub;
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-sub">$${item.price.toFixed(2)} &times; ${item.qty}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight:700;">$${sub.toFixed(2)}</div>
          <button class="cart-remove-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  openDrawer();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function openDrawer() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

// Event Listeners
document.addEventListener("click", e => {
  if (e.target.matches(".add-btn")) {
    addToCart(e.target.dataset.id);
  }
  if (e.target.matches(".cart-remove-btn")) {
    removeFromCart(Number(e.target.dataset.index));
  }
});

filterPills.forEach(pill => {
  pill.addEventListener("click", () => {
    filterPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    renderProducts(pill.dataset.category);
  });
});

cartBtn.addEventListener("click", openDrawer);
closeCartBtn.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your bag is empty!");
    return;
  }
  alert("Thank you for your order! Your keychains will be handcrafted with care.");
  cart = [];
  updateCartUI();
  closeDrawer();
});

// Initialize
renderProducts();
updateCartUI();
