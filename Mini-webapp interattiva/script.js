const products = [
  {
    id: 1,
    name: "Laptop Pro",
    price: 1200,
    desc: "Potente laptop",
    img: "https://via.placeholder.com/300x200?text=Laptop"
  },
  {
    id: 2,
    name: "Smartphone X",
    price: 800,
    desc: "Telefono avanzato",
    img: "https://via.placeholder.com/300x200?text=Phone"
  },
  {
    id: 3,
    name: "Tablet Air",
    price: 600,
    desc: "Tablet leggero",
    img: "https://via.placeholder.com/300x200?text=Tablet"
  }
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const productList = document.getElementById("productList");
const favoritesList = document.getElementById("favoritesList");

function createCard(p) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = p.img;
  img.alt = p.name;

  const title = document.createElement("h3");
  title.textContent = p.name;

  const price = document.createElement("p");
  price.textContent = `€${p.price}`;

  const btn = document.createElement("button");
  btn.textContent = favorites.includes(p.id) ? "Rimuovi" : "Preferito";

  btn.onclick = () => {
    if (favorites.includes(p.id)) {
      favorites = favorites.filter(f => f !== p.id);
    } else {
      favorites.push(p.id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    location.reload();
  };

  card.append(img, title, price, btn);
  return card;
}

function renderProducts(list) {
  productList.innerHTML = "";
  list.forEach(p => {
    productList.appendChild(createCard(p));
  });
}

function renderFavorites() {
  const favProducts = products.filter(p => favorites.includes(p.id));
  favProducts.forEach(p => {
    favoritesList.appendChild(createCard(p));
  });
}

if (productList) {
  renderProducts(products);

  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  searchInput?.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value)
    );
    renderProducts(filtered);
  });

  sortSelect?.addEventListener("change", () => {
    let sorted = [...products];
    if (sortSelect.value === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortSelect.value === "price") {
      sorted.sort((a, b) => a.price - b.price);
    }
    renderProducts(sorted);
  });
}

if (favoritesList) {
  renderFavorites();
}
