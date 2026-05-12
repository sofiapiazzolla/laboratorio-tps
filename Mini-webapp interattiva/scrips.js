const events = [
  {
    id: 1,
    title: "Web Design Bootcamp",
    category: "Design",
    date: "2026-06-12"
  },

  {
    id: 2,
    title: "JavaScript Masterclass",
    category: "Development",
    date: "2026-07-01"
  },

  {
    id: 3,
    title: "Digital Marketing",
    category: "Marketing",
    date: "2026-08-20"
  },

  {
    id: 4,
    title: "React Advanced",
    category: "Development",
    date: "2026-09-15"
  },

  {
    id: 5,
    title: "UX Design Basics",
    category: "Design",
    date: "2026-10-10"
  }
];

const eventsContainer = document.getElementById("events-container");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const resetBtn = document.getElementById("reset-btn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal");
const toast = document.getElementById("toast");
const favoritesContainer = document.getElementById("favorites-container");

const themeToggle = document.getElementById("theme-toggle");

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

const loadMoreBtn = document.getElementById("load-more-btn");

let visibleItems = 3;

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

function renderEvents(list) {

  if (!Array.isArray(list)) return;

  eventsContainer.innerHTML = "";

  list.slice(0, visibleItems).forEach(event => {

    const card = document.createElement("article");

    card.classList.add("card");

    const title = document.createElement("h3");
    title.textContent = event.title;

    const category = document.createElement("p");
    category.textContent = event.category;

    const date = document.createElement("p");
    date.textContent = event.date;

    const detailsBtn = document.createElement("button");
    detailsBtn.textContent = "Dettagli";

    detailsBtn.addEventListener("click", () => {
      openModal(event);
    });

    const favoriteBtn = document.createElement("button");
    favoriteBtn.textContent = "Preferito";

    favoriteBtn.addEventListener("click", () => {
      addFavorite(event);
    });

    card.appendChild(title);
    card.appendChild(category);
    card.appendChild(date);
    card.appendChild(detailsBtn);
    card.appendChild(favoriteBtn);

    eventsContainer.appendChild(card);

  });
}

renderEvents(events);

function filterEvents() {

  let filtered = [...events];

  const searchValue =
    searchInput.value.toLowerCase();

  const categoryValue =
    categoryFilter.value;

  if (searchValue) {

    filtered = filtered.filter(event =>
      event.title
        .toLowerCase()
        .includes(searchValue)
    );
  }

  if (categoryValue !== "all") {

    filtered = filtered.filter(event =>
      event.category === categoryValue
    );
  }

  if (sortFilter.value === "name") {

    filtered.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sortFilter.value === "date") {

    filtered.sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );
  }

  renderEvents(filtered);
}

searchInput.addEventListener("input", filterEvents);

categoryFilter.addEventListener("change", filterEvents);

sortFilter.addEventListener("change", filterEvents);

resetBtn.addEventListener("click", () => {

  searchInput.value = "";

  categoryFilter.value = "all";

  sortFilter.value = "default";

  renderEvents(events);
});

function openModal(event) {

  document.getElementById("modal-title").textContent =
    event.title;

  document.getElementById("modal-date").textContent =
    event.date;

  document.getElementById("modal-category").textContent =
    event.category;

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {

  if (e.target === modal) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {
    closeModal();
  }
});

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function addFavorite(event) {

  const exists = favorites.some(fav => fav.id === event.id);

  if (exists) {
    showToast("Già nei preferiti");
    return;
  }

  favorites.push(event);

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  renderFavorites();

  showToast("Aggiunto ai preferiti");
}

function renderFavorites() {

  favoritesContainer.innerHTML = "";

  favorites.forEach(event => {

    const div = document.createElement("div");

    div.classList.add("favorite-item");

    const title = document.createElement("h4");
    title.textContent = event.title;

    div.appendChild(title);

    favoritesContainer.appendChild(div);
  });
}

renderFavorites();

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  const isDark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );
});

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

loadMoreBtn.addEventListener("click", () => {

  visibleItems += 3;

  renderEvents(events);
});
