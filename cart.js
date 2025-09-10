// Simple cart management
const cartItems = [];

function addToCart(product) {
  cartItems.push(product);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = cartItems.length;
  });
}

function openCart() {
  renderCart();
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.add('open');
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.remove('open');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cartItems.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 mt-4">عربة التسوق فارغة</p>';
    return;
  }
  container.innerHTML = cartItems.map(item =>
    `<div class="flex justify-between border-b py-2"><span>${item.name}</span><span class="text-yellow-500 font-bold">${item.price} أوقية</span></div>`
  ).join('');
}
