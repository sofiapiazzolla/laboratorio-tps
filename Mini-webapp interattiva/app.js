// app.js
// Dati simulati degli eventi
const eventsData = [
  { id: 1, title: "Workshop Floral Design", date: "2026-06-15", category: "creativita", img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&q=80", desc: "Impara a creare composizioni floreali eleganti." },
  { id: 2, title: "Masterclass Make-up", date: "2026-05-20", category: "beauty", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80", desc: "Tecniche avanzate con professionisti del settore." },
  { id: 3, title: "Corso Calligrafia", date: "2026-07-10", category: "creativita", img: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=500&q=80", desc: "L'arte di scrivere con pennino e inchiostro dorato." },
  { id: 4, title: "Yoga e Benessere", date: "2026-05-25", category: "wellness", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80", desc: "Ritrova il tuo equilibrio interiore." }
];

// --- 1. Hamburger Menu ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if(hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// --- Funzioni Utility ---
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getRegistrations() {
  return JSON.parse(localStorage.getItem('myAgendaRegistrations')) || [];
}

// --- Gestione Pagina Eventi ---
const eventsGrid = document.getElementById('events-grid');
if (eventsGrid) {
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('category');
  const sortFilter = document.getElementById('sort');

  function renderEvents(events) {
    eventsGrid.innerHTML = '';
    if(events.length === 0) {
      eventsGrid.innerHTML = '<p>Nessun evento trovato.</p>';
      return;
    }
    events.forEach(ev => {
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `
        <img src="${ev.img}" alt="${ev.title}" class="event-img">
        <div class="event-info">
          <p class="event-date">${new Date(ev.date).toLocaleDateString('it-IT')}</p>
          <h3 class="event-title">${ev.title}</h3>
          <p>${ev.desc}</p>
          <button class="btn" onclick="openModal(${ev.id})" style="margin-top: 15px;">Iscriviti</button>
        </div>
      `;
      eventsGrid.appendChild(card);
    });
  }

  // --- 2 & 3. Filtro, Ricerca e Ordinamento ---
  function applyFilters() {
    let filtered = eventsData.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(searchInput.value.toLowerCase());
      const matchCat = categoryFilter.value === 'all' || ev.category === categoryFilter.value;
      return matchSearch && matchCat;
    });

    if (sortFilter.value === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortFilter.value === 'date-desc') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortFilter.value === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderEvents(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);

  // Init
  renderEvents(eventsData);
}

// --- 4. Modale e 5. Form Validation ---
const modal = document.getElementById('registration-modal');
const closeBtn = document.querySelector('.close-modal');
const form = document.getElementById('registration-form');
let currentEventId = null;

window.openModal = function(eventId) {
  currentEventId = eventId;
  const ev = eventsData.find(e => e.id === eventId);
  document.getElementById('modal-event-title').innerText = "Iscrizione: " + ev.title;
  modal.classList.add('active');
  document.getElementById('user-name').focus();
}

function closeModalFunc() {
  modal.classList.remove('active');
  form.reset();
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
}

if(modal) {
  closeBtn.addEventListener('click', closeModalFunc);
  
  // Chiusura via ESC e click fuori
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModalFunc();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
  });

  // Validazione Form e 6. LocalStorage
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');

    // Validazione Nome
    if(nameInput.value.trim() === '') {
      nameInput.parentElement.classList.add('error');
      isValid = false;
    } else {
      nameInput.parentElement.classList.remove('error');
    }

    // Validazione Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(emailInput.value)) {
      emailInput.parentElement.classList.add('error');
      isValid = false;
    } else {
      emailInput.parentElement.classList.remove('error');
    }

    if(isValid) {
      const regs = getRegistrations();
      const ev = eventsData.find(e => e.id === currentEventId);
      
      // Controllo se già iscritto
      if(regs.find(r => r.id === ev.id)) {
        showToast("Sei già iscritta a questo evento!");
      } else {
        regs.push(ev);
        localStorage.setItem('myAgendaRegistrations', JSON.stringify(regs));
        showToast("Iscrizione completata con successo! ✨");
      }
      closeModalFunc();
    }
  });
}

// --- Gestione Pagina Profilo ---
const profileAgenda = document.getElementById('profile-agenda');
if (profileAgenda) {
  const regs = getRegistrations();
  if(regs.length === 0) {
    profileAgenda.innerHTML = '<p>Non sei ancora iscritta a nessun evento. Vai al <a href="events.html" class="gold-text">Catalogo</a>.</p>';
  } else {
    regs.forEach(ev => {
      const li = document.createElement('div');
      li.className = 'event-card';
      li.style.flexDirection = 'row';
      li.style.alignItems = 'center';
      li.style.padding = '1rem';
      li.innerHTML = `
        <div style="flex-grow: 1;">
          <h3 style="margin-bottom: 0;">${ev.title}</h3>
          <p class="event-date" style="margin: 0;">${new Date(ev.date).toLocaleDateString('it-IT')}</p>
        </div>
        <span style="background: var(--bg-color); padding: 5px 10px; border-radius: 20px; border: 1px solid var(--primary-pink); color: var(--primary-pink); font-weight:bold;">Confermato ✓</span>
      `;
      profileAgenda.appendChild(li);
    });
  }
}
