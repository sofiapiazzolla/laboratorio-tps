// Dati Mockati
const eventsData = [
    { id: 1, name: "Workshop React Advanced", date: "2026-06-15", category: "Tecnologia", desc: "Impara i segreti dei React Hooks e le performance." },
    { id: 2, name: "Masterclass UI/UX", date: "2026-06-20", category: "Design", desc: "Principi fondamentali per un'interfaccia utente perfetta." },
    { id: 3, name: "Marketing Digitale 2026", date: "2026-07-05", category: "Business", desc: "Strategie SEO e Social Media aggiornate." },
    { id: 4, name: "Introduzione all'IA Generativa", date: "2026-07-12", category: "Tecnologia", desc: "Come integrare modelli LLM nelle tue app." }
];

// Stato
let enrolledEvents = JSON.parse(localStorage.getItem('iscrizioni')) || [];
let currentFilteredEvents = [...eventsData];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.view-section');
const eventsGrid = document.getElementById('events-grid');
const myEventsList = document.getElementById('my-events-list');
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');

const modal = document.getElementById('event-modal');
const form = document.getElementById('enroll-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

// 1. Tema Dark/Light
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
};

themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// 2. Navigazione SPA-like & Hamburger
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Rimuovi active ovunque
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Aggiungi active al target
        e.target.classList.add('active');
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
        
        // Chiudi menu mobile
        navUl.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');

        // Aggiorna vista se si va su Iscrizioni
        if(targetId === 'my-events-section') renderMyEvents();
    });
});

hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navUl.classList.toggle('show');
});

document.getElementById('cta-events').addEventListener('click', () => {
    document.querySelector('[data-target="events-section"]').click();
});

// 3. Funzione di supporto per creare elementi (Sicurezza: no innerHTML)
const createEl = (tag, classNames = '', text = '') => {
    const el = document.createElement(tag);
    if (classNames) el.className = classNames;
    if (text) el.textContent = text;
    return el;
};

// 4. Renderizzazione Eventi
const renderEvents = (eventsToRender, container, isMyEvents = false) => {
    container.innerHTML = ''; // Svuota il contenitore
    if (eventsToRender.length === 0) {
        container.appendChild(createEl('p', '', 'Nessun evento trovato.'));
        return;
    }

    eventsToRender.forEach(ev => {
        const card = createEl('div', 'card');
        card.appendChild(createEl('h3', '', ev.name));
        card.appendChild(createEl('p', 'meta', `${ev.date} | ${ev.category}`));
        
        if (!isMyEvents) {
            const btn = createEl('button', 'btn primary-btn', 'Vedi Dettagli');
            btn.addEventListener('click', () => openModal(ev));
            card.appendChild(btn);
        } else {
            card.appendChild(createEl('p', '', 'Sei iscritto a questo evento! ✅'));
        }
        
        container.appendChild(card);
    });
};

const renderMyEvents = () => {
    const myEvents = eventsData.filter(ev => enrolledEvents.includes(ev.id));
    renderEvents(myEvents, myEventsList, true);
};

// 5. Ricerca e Filtri
const applyFilters = () => {
    const term = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    
    currentFilteredEvents = eventsData.filter(ev => {
        const matchName = ev.name.toLowerCase().includes(term);
        const matchCat = cat === 'all' || ev.category === cat;
        return matchName && matchCat;
    });
    renderEvents(currentFilteredEvents, eventsGrid);
};

searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);

document.getElementById('reset-filters').addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'all';
    applyFilters();
});

// 6. Modale
const openModal = (ev) => {
    document.getElementById('modal-title').textContent = ev.name;
    document.getElementById('modal-date').textContent = `${ev.date} | ${ev.category}`;
    document.getElementById('modal-desc').textContent = ev.desc;
    document.getElementById('modal-event-id').value = ev.id;
    
    // Reset form
    form.reset();
    document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('error'));
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
};

document.querySelector('.close-modal').addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// 7. Validazione Form e Toast
const showToast = (message) => {
    const container = document.getElementById('toast-container');
    const toast = createEl('div', 'toast', message);
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    
    // Validate Name
    if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('error');
        isValid = false;
    } else {
        nameInput.parentElement.classList.remove('error');
    }
    
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('error');
        isValid = false;
    } else {
        emailInput.parentElement.classList.remove('error');
    }

    if (isValid) {
        const eventId = parseInt(document.getElementById('modal-event-id').value, 10);
        if (!enrolledEvents.includes(eventId)) {
            enrolledEvents.push(eventId);
            localStorage.setItem('iscrizioni', JSON.stringify(enrolledEvents));
            showToast('Iscrizione completata con successo!');
        } else {
            showToast('Sei già iscritto a questo evento.');
        }
        closeModal();
    }
});

// Inizializzazione
initTheme();
renderEvents(eventsData, eventsGrid);
