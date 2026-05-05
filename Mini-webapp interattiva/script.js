
const products = [
  { id: 1, name: "Laptop Pro", price: 1200, desc: "Potente laptop." },
  { id: 2, name: "Smartphone X", price: 800, desc: "Telefono avanzato." },
  { id: 3, name: "Tablet Air", price: 600, desc: "Tablet leggero." },
  { id: 4, name: "Smartwatch Z", price: 300, desc: "Orologio smart." },
  { id: 5, name: "Cuffie Pro", price: 200, desc: "Audio di qualità." },
];

let visibleCount = 3;

const productList = document.getElementById("productList");
const favoritesList = document.getElementById("favoritesList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const toast = document.getElementById("toast");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function sanitize(text) {
  return text.replace(/[<>]/g, "");
}

function renderProducts(list) {
  productList.innerHTML = "";
  list.slice(0, visibleCount).forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${sanitize(p.name)}</h3>
      <p>€${p.price}</p>
      <button data-id="${p.id}">Dettagli</button>
      <button class="fav-btn" data-id="${p.id}">
        ${favorites.includes(p.id) ? "★" : "☆"}
      </button>
    `;
    productList.appendChild(card);
  });
}

function renderFavorites() {
  favoritesList.innerHTML = "";
  const favProducts = products.filter(p => favorites.includes(p.id));
  favProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `${p.name} - €${p.price}`;
    favoritesList.appendChild(div);
  });
}

function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 2000);
}

productList.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const product = products.find(p => p.id === id);
  if (!product) return;

  if (e.target.classList.contains("fav-btn")) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
      showToast("Aggiunto ai preferiti");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderProducts(products);
    renderFavorites();
  } else {
    modalBody.textContent = `${product.name} - ${product.desc}`;
    modal.classList.add("active");
  }
});

document.getElementById("closeModal").onclick = () => modal.classList.remove("active");

window.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") modal.classList.remove("active");
});

searchInput.addEventListener("input", () => {
  const value = sanitize(searchInput.value.toLowerCase());
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});

sortSelect.addEventListener("change", () => {
  let sorted = [...products];
  if (sortSelect.value === "name") {
    sorted.sort((a,b)=>a.name.localeCompare(b.name));
  }
  if (sortSelect.value === "price") {
    sorted.sort((a,b)=>a.price-b.price);
  }
  renderProducts(sorted);
});

document.getElementById("resetFilters").onclick = () => {
  searchInput.value = "";
  sortSelect.value = "";
  renderProducts(products);
};

document.getElementById("loadMore").onclick = () => {
  visibleCount += 2;
  renderProducts(products);
};

document.querySelector(".hamburger").onclick = function() {
  document.querySelector(".nav-links").classList.toggle("active");
};

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

renderProducts(products);
renderFavorites();
