// ------------------------------
// 1. Sample product data
// In a real project, this data would usually come from a database or API.
// ------------------------------
const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2499, rating: 4.8, emoji: "🎧", description: "Clear sound with a comfortable fit." },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 3299, rating: 4.6, emoji: "⌚", description: "Track your activity and daily routine." },
  { id: 3, name: "Everyday Backpack", category: "Fashion", price: 1499, rating: 4.5, emoji: "🎒", description: "A practical bag for work and travel." },
  { id: 4, name: "Running Shoes", category: "Fashion", price: 2199, rating: 4.7, emoji: "👟", description: "Lightweight shoes for everyday movement." },
  { id: 5, name: "Desk Lamp", category: "Home", price: 899, rating: 4.3, emoji: "💡", description: "A simple lamp for your study desk." },
  { id: 6, name: "Coffee Mug", category: "Home", price: 399, rating: 4.4, emoji: "☕", description: "A sturdy mug for your favourite drink." },
  { id: 7, name: "Sunglasses", category: "Fashion", price: 1199, rating: 4.2, emoji: "🕶️", description: "A classic style for sunny days." },
  { id: 8, name: "Bluetooth Speaker", category: "Electronics", price: 1799, rating: 4.6, emoji: "🔊", description: "Portable sound for your room or outing." },
  { id: 9, name: "Indoor Plant", category: "Home", price: 499, rating: 4.5, emoji: "🪴", description: "Add a little greenery to your space." }
];

// ------------------------------
// 2. Get references to HTML elements
// We use these references to update the page with JavaScript.
// ------------------------------
const productGrid = document.getElementById("productGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const cartCount = document.getElementById("cartCount");
const clearFiltersButton = document.getElementById("clearFilters");

// This variable stores how many products have been added to the cart.
let cartItems = 0;

// ------------------------------
// 3. Create category checkboxes dynamically
// This avoids writing a separate checkbox manually for every category.
// ------------------------------
function createCategoryFilters() {
  const categories = [...new Set(products.map(product => product.category))];

  categoryFilters.innerHTML = categories.map(category => `
    <label>
      <input type="checkbox" value="${category}" class="category-checkbox">
      ${category}
    </label>
  `).join("");

  // When a category checkbox changes, refresh the product list.
  document.querySelectorAll(".category-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", displayProducts);
  });
}

// ------------------------------
// 4. Get products after applying search, category and sort filters
// ------------------------------
function getFilteredProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Find all checked category checkboxes.
  const selectedCategories = [...document.querySelectorAll(".category-checkbox:checked")]
    .map(checkbox => checkbox.value);

  // First filter products by their name, category or description.
  let filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);

    return matchesSearch && matchesCategory;
  });

  // Then sort the filtered products according to the selected option.
  const sortValue = sortSelect.value;

  if (sortValue === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return filteredProducts;
}

// ------------------------------
// 5. Display product cards on the page
// Template literals make it easy to create HTML using product data.
// ------------------------------
function displayProducts() {
  const filteredProducts = getFilteredProducts();

  // Update the number of products currently visible.
  resultCount.textContent = `Showing ${filteredProducts.length} of ${products.length} products`;

  // Show a helpful message if there are no matching products.
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Generate one card for each product and place all cards in the grid.
  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image" aria-label="${product.name}">${product.emoji}</div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <span class="product-price">₹${product.price.toLocaleString("en-IN")}</span>
          <span class="product-rating">★ ${product.rating}</span>
        </div>
        <button class="add-button" type="button" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </article>
  `).join("");

  // Attach click events to the Add to Cart buttons after creating the cards.
  document.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.productId));
  });
}

// ------------------------------
// 6. Add a product to the cart
// This beginner demo only updates the cart count; it does not process payments.
// ------------------------------
function addToCart(productId) {
  const selectedProduct = products.find(product => product.id === Number(productId));

  if (selectedProduct) {
    cartItems++;
    cartCount.textContent = cartItems;
  }
}

// ------------------------------
// 7. Event listeners
// These run the relevant function when the user interacts with the page.
// ------------------------------

// Search while typing, so results update immediately.
searchInput.addEventListener("input", displayProducts);

// Prevent the search form from reloading the page when submitted.
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  displayProducts();
});

// Re-render the list when the sorting option changes.
sortSelect.addEventListener("change", displayProducts);

// Clear the search, category selections and sorting option.
clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "featured";

  document.querySelectorAll(".category-checkbox").forEach(checkbox => {
    checkbox.checked = false;
  });

  displayProducts();
});

// ------------------------------
// 8. Initial page setup
// Run these functions once the script loads.
// ------------------------------
createCategoryFilters();
displayProducts();
