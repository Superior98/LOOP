// ── DATA ──
const GAMES = [
  { id:1, name:'Void Protocol', genre:'action', genreLabel:'Action', desc:'Cyberpunk hack-and-slash through a fractured city grid.', price:29.99, image:'assets/void-protocol-thumbnail.png' },
  { id:2, name:'Crimson Epoch', genre:'rpg', genreLabel:'RPG', desc:'An epic dark fantasy with 80+ hours of lore.', price:49.99, image:'assets/crimson-epoch-thumbnail.png' },
  { id:3, name:'Verdant Protocol', genre:'strategy', genreLabel:'Strategy', desc:'Ecosystem warfare. Build, evolve, dominate.', price:24.99, image:'assets/verdant-protocol-thumbnail.png' },
  { id:4, name:'Solar Drift', genre:'shooter', genreLabel:'Shooter', desc:'Zero-gravity arena combat. No cover, pure skill.', price:19.99, image:'assets/solar-drift-thumbnail.png' },
  { id:5, name:'Neon Abyss II', genre:'action', genreLabel:'Action', desc:'Rogue-lite dungeon runs with procedural chaos.', price:34.99, image:'assets/neon-abyss-ii-thumbnail.png' },
  { id:6, name:'Elden Rift', genre:'rpg', genreLabel:'RPG', desc:'Open-world soulslike with brutal precision combat.', price:59.99, image:'assets/elden-rift-thumbnail.png' },
  { id:7, name:'Hive Mind', genre:'strategy', genreLabel:'Strategy', desc:'Swarm intelligence RTS. Billions of decisions per second.', price:22.99, image:'assets/hive-mind-thumbnail.png' },
  { id:8, name:'Pulse Runner', genre:'adventure', genreLabel:'Adventure', desc:'Rhythm-driven platformer with a banger soundtrack.', price:16.99, image:'assets/pulse-runner-thumbnail.png' },
  { id:9, name:'Arctic Zero', genre:'shooter', genreLabel:'Shooter', desc:'Tactical frost warfare in a collapsing ice shelf.', price:39.99, image:'assets/arctic-zero-thumbnail.png' },
];

let cart = [];
let searchQuery = '';

function gameMatchesSearch(game, query) {
  if (!query) return true;
  const haystack = `${game.name} ${game.genre} ${game.genreLabel} ${game.desc}`.toLowerCase();
  return haystack.includes(query);
}

function getVisibleGames(filter = currentFilter) {
  const query = searchQuery.trim().toLowerCase();
  return GAMES.filter(game => {
    const matchesFilter = filter === 'all' || game.genre === filter;
    return matchesFilter && gameMatchesSearch(game, query);
  });
}

// ── RENDER FEATURED ──
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  const featured = (searchQuery ? getVisibleGames('all') : GAMES).slice(0,5);
  if (featured.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <strong>No featured matches</strong>
        <span>Try a different title, genre, or keyword.</span>
      </div>
    `;
    return;
  }
  grid.innerHTML = featured.map((g,i) => `
    <div class="game-card">
      <img class="game-card-image" src="${g.image}" alt="${g.name} thumbnail" loading="lazy">
      <div class="game-card-overlay"></div>
      <div class="game-card-info">
        <div class="game-genre">${g.genreLabel}</div>
        <div class="game-name">${g.name}</div>
        <div class="game-price"><strong>$${g.price}</strong></div>
      </div>
      <button class="game-add" onclick="addToCart(${g.id})" title="Add to cart">+</button>
    </div>
  `).join('');
}

// ── RENDER SHOP ──
let currentFilter = 'all';
function renderShop(filter='all') {
  const grid = document.getElementById('shop-grid');
  const filtered = getVisibleGames(filter);
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <strong>No games found</strong>
        <span>Try another search or switch the genre filter.</span>
      </div>
    `;
    return;
  }
  grid.innerHTML = filtered.map(g=>`
    <div class="product-card">
      <div class="product-img">
        <img class="product-img-bg" src="${g.image}" alt="${g.name} thumbnail" loading="lazy">
      </div>
      <div class="product-body">
        <div class="product-genre">${g.genreLabel}</div>
        <div class="product-name">${g.name}</div>
        <div class="product-desc">${g.desc}</div>
        <div class="product-footer">
          <div class="product-price">$${g.price}</div>
          <button class="btn-add" onclick="addToCart(${g.id})">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterGames(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderShop(filter);
}

function setSearchQuery(value, { showShop = false } = {}) {
  searchQuery = value.trim();
  const searchForm = document.querySelector('.nav-search');
  searchForm?.classList.toggle('has-query', searchQuery.length > 0);
  renderFeatured();
  renderShop(currentFilter);
  if (showShop && searchQuery) showPage('shop');
}

function submitSearch(event) {
  event.preventDefault();
  setSearchQuery(document.getElementById('game-search').value, { showShop: true });
  return false;
}

function clearSearch() {
  const input = document.getElementById('game-search');
  input.value = '';
  setSearchQuery('');
  input.focus();
}

// ── CART ──
function addToCart(id) {
  const game = GAMES.find(g=>g.id===id);
  if (!cart.find(c=>c.id===id)) {
    cart.push({...game});
    updateCartBadge();
    showNotif(`${game.name} added to cart`);
  } else {
    showNotif('Already in your cart');
  }
}

function removeFromCart(id) {
  cart = cart.filter(c=>c.id!==id);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  badge.style.display = cart.length>0 ? 'block' : 'none';
}

function renderCart() {
  const el = document.getElementById('cart-content');
  if (cart.length===0) {
    el.innerHTML = `<p class="cart-empty">Your cart is empty. <a href="#" onclick="showPage('shop')" style="color:var(--orange)">Browse the shop →</a></p>`;
    return;
  }
  const total = cart.reduce((s,g)=>s+g.price,0).toFixed(2);
  el.innerHTML = `
    <div class="cart-items">
      ${cart.map(g=>`
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${g.image}" alt="${g.name} thumbnail">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${g.name}</div>
            <div class="cart-item-genre">${g.genreLabel}</div>
          </div>
          <span class="cart-item-price">$${g.price}</span>
          <button class="cart-remove" onclick="removeFromCart(${g.id})" title="Remove">✕</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-total">
        <span class="cart-total-label">TOTAL (${cart.length} item${cart.length!==1?'s':''})</span>
        <span class="cart-total-price">$${total}</span>
      </div>
    </div>
    <button class="btn-checkout" onclick="showNotif('Checkout coming soon! 🎮')">Proceed to checkout</button>
  `;
}

// ── NAVIGATION ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  const navEl = document.getElementById('nav-'+id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if (id==='cart') renderCart();
  return false;
}

// ── NOTIFICATION ──
function showNotif(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'), 2400);
}

// ── CURSOR ──
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let mx = 0, my = 0, rx = 0, ry = 0;

if (canUseCustomCursor && cur && ring) {
  const hoverTargets = 'a, button, input, textarea, select, label, .game-card, .product-card';

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    document.body.classList.add('cursor-ready');
    cur.style.left = `${mx}px`;
    cur.style.top = `${my}px`;
  });

  document.addEventListener('mouseover', e => {
    document.body.classList.toggle('cursor-hover', Boolean(e.target.closest(hoverTargets)));
  });

  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget || !e.relatedTarget.closest?.(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
  document.addEventListener('mouseup', () => document.body.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-down'));
  document.addEventListener('mouseenter', () => document.body.classList.add('cursor-ready'));

  function animRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animRing);
  }
  animRing();
}

// ── INIT ──
document.getElementById('game-search')?.addEventListener('input', event => {
  setSearchQuery(event.target.value, { showShop: event.target.value.trim().length > 0 });
});
renderFeatured();
renderShop();
