// Dati Mockati Estesi
const eventsData = [
    { id: 1, name: "Composizione Floreale Base", date: "15 Giugno 2026", time: "10:00 - 12:30", location: "Serra Botanica, Milano", category: "Arte & Design", price: "€ 45,00", desc: "Scopri i segreti per creare il centrotavola perfetto utilizzando fiori freschi di stagione. Materiali inclusi.", icon: "🌸" },
    { id: 2, name: "Ritirata Yoga & Mindfulness", date: "20 Giugno 2026", time: "09:00 - 18:00", location: "Villa Rose, Como", category: "Benessere", price: "€ 120,00", desc: "Una giornata intera dedicata a te stessa, tra meditazione guidata, yoga dolce e tisane artigianali.", icon: "🧘‍♀️" },
    { id: 3, name: "Personal Branding al Femminile", date: "5 Luglio 2026", time: "14:00 - 18:00", location: "Spazio Coworking Luce, Roma", category: "Business", price: "€ 85,00", desc: "Impara a comunicare il valore del tuo progetto con autenticità ed eleganza sui canali digitali.", icon: "✨" },
    { id: 4, name: "Calligrafia Moderna", date: "12 Luglio 2026", time: "15:00 - 17:30", location: "Caffè Letterario, Firenze", category: "Arte & Design", price: "€ 50,00", desc: "Un workshop pratico per padroneggiare pennini e inchiostri, ideale per creare inviti e biglietti personalizzati.", icon: "🖋️" }
];

// Stato Iscrizioni condiviso tra le pagine tramite localStorage
let enrolledEvents = JSON.parse(localStorage.getItem('iscrizioniFlora')) || [];

// Elementi condivisi (Header/Menu/Tema)
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');

// 1. Tema Dark/Light (Eseguito su tutte le pagine)
const initTheme = () => {
    const savedTheme = localStorage.getItem('floraTheme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
};

themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('floraTheme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('floraTheme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

// 2. Hamburger Menu (Mobile)
hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navUl.classList.toggle('show');
});

// 3. Helper DOM sicuro (Niente innerHTML)
const createEl = (tag, classNames = '', text = '') => {
    const el = document.createElement(tag);
    if (classNames) el.className = classNames;
    if (text) el.textContent = text;
    return el;
};

// 4. Renderizzazione Dinamica (Usata in events.html e diary.html)
const renderEvents = (eventsToRender, container, isMyEvents = false) => {
    container.innerHTML = '';
    if (eventsToRender.length === 0) {
        container.appendChild(createEl('p', '', 'Nessuna esperienza trovata.'));
        return;
    }

    eventsToRender.forEach(ev => {
        const card = createEl('div', 'card');
        
        const header = createEl('div', 'card-header');
        header.appendChild(createEl('span', 'card-icon', ev.icon));
        header.appendChild(createEl('span', 'card-category', ev.category));
        card.appendChild(header);

        card.appendChild(createEl('h3', '', ev.name));
        
        const details = createEl('div', 'card-details');
        const dateP = createEl('p'); dateP.innerHTML = `<strong>🗓 </strong> ${ev.date}`;
        const locP = createEl('p'); locP.innerHTML = `<strong>📍 </strong> ${ev.location}`;
        details.appendChild(dateP); details.appendChild(locP);
        card.appendChild(details);

        card.appendChild(createEl('div', 'card-price', ev.price));
        
        if (!isMyEvents) {
            const btn = createEl('button', 'btn secondary-btn btn-full', 'Dettagli e Prenotazioni');
            btn.addEventListener('click', () => openModal(ev));
            card.appendChild(btn);
        } else {
            const statusBtn = createEl('button', 'btn primary-btn btn-full', 'Posto Riservato ✓');
            statusBtn.disabled = true;
            statusBtn.style.opacity = '0.8';
            card.appendChild(statusBtn);
        }
        container.appendChild(card);
    });
};

// Inizializza il tema su ogni pagina
initTheme();

// ==========================================
// LOGICA SPECIFICA PER: events.html
// ==========================================
const eventsGrid = document.getElementById('events-grid');
if (eventsGrid) {
    let currentFilteredEvents = [...eventsData];
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const modal = document.getElementById('event-modal');
    const form = document.getElementById('enroll-form');

    // Mostra tutti gli eventi all'avvio della pagina
    renderEvents(eventsData, eventsGrid);

    // Filtri
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
        searchInput.value = ''; categoryFilter.value = 'all'; applyFilters();
    });

    // Modale
    window.openModal = (ev) => {
        document.getElementById('modal-icon').textContent = ev.icon;
        document.getElementById('modal-title').textContent = ev.name;
        document.getElementById('modal-date').textContent = ev.date;
        document.getElementById('modal-time').textContent = ev.time;
        document.getElementById('modal-location').textContent = ev.location;
        document.getElementById('modal-price').textContent = ev.price;
        document.getElementById('modal-desc').textContent = `"${ev.desc}"`;
        document.getElementById('modal-event-id').value = ev.id;
        
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
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // Toast & Form
    const showToast = (message) => {
        const container = document.getElementById('toast-container');
        const toast = createEl('div', 'toast', message);
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const nameInput = document.getElementById('user-name');
        const emailInput = document.getElementById('user-email');
        
        if (!nameInput.value.trim()) { nameInput.parentElement.classList.add('error'); isValid = false; } 
        else { nameInput.parentElement.classList.remove('error'); }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) { emailInput.parentElement.classList.add('error'); isValid = false; } 
        else { emailInput.parentElement.classList.remove('error'); }

        if (isValid) {
            const eventId = parseInt(document.getElementById('modal-event-id').value, 10);
            if (!enrolledEvents.includes(eventId)) {
                enrolledEvents.push(eventId);
                localStorage.setItem('iscrizioniFlora', JSON.stringify(enrolledEvents));
                showToast('🌿 Prenotazione confermata con successo!');
            } else {
                showToast('Hai già riservato un posto per questo evento.');
            }
            closeModal();
        }
    });
}

// ==========================================
// LOGICA SPECIFICA PER: diary.html
// ==========================================
const myEventsList = document.getElementById('my-events-list');
if (myEventsList) {
    const myEvents = eventsData.filter(ev => enrolledEvents.includes(ev.id));
    renderEvents(myEvents, myEventsList, true);
}
