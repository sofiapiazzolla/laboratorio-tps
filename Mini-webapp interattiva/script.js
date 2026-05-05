// STATE MANAGEMENT
let tasks = JSON.parse(localStorage.getItem('orbit_tasks')) || [];

// DOM ELEMENTS
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('add-task-form');
const themeBtn = document.getElementById('theme-switch');
const modal = document.getElementById('modal-overlay');

// 1. TEMA DARK/LIGHT PERSISTENTE
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
});

// Carica tema salvato
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeBtn.textContent = '☀️';
}

// 2. RENDER TASK CON FILTRI E SANIFICAZIONE
function renderTasks(filter = 'all', search = '') {
    taskList.innerHTML = '';
    
    const filtered = tasks.filter(t => {
        const matchesFilter = filter === 'all' || t.priority === filter;
        const matchesSearch = t.text.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        // Uso textContent per evitare XSS
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const btn = document.createElement('button');
        btn.textContent = 'Dettagli';
        btn.onclick = () => openModal(task);
        
        li.append(span, btn);
        taskList.appendChild(li);
    });
    updateStats();
}

// 3. VALIDAZIONE FORM E AGGIUNTA
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const priority = document.getElementById('priority-input');
    
    if (input.value.trim().length < 3) {
        showToast("Il testo deve avere almeno 3 caratteri", "error");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: input.value,
        priority: priority.value,
        date: new Date().toLocaleDateString()
    };

    tasks.push(newTask);
    saveAndRender();
    input.value = '';
    showToast("Task aggiunto con successo!");
});

// 4. MODALE CON CHIUSURA ESC/CLICK OUT
function openModal(task) {
    document.getElementById('modal-body').textContent = `Priorità: ${task.priority} - Creato il: ${task.date}`;
    document.getElementById('modal-title').textContent = task.text;
    modal.classList.remove('hidden');
}

window.addEventListener('keydown', (e) => { if(e.key === 'Escape') modal.classList.add('hidden'); });
modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.add('hidden'); });
document.querySelector('.close-modal').onclick = () => modal.classList.add('hidden');

// 5. TOAST NOTIFICATIONS
function showToast(msg, type = "success") {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// UTILS
function saveAndRender() {
    localStorage.setItem('orbit_tasks', JSON.stringify(tasks));
    renderTasks();
}

function updateStats() {
    document.getElementById('task-count').textContent = tasks.length;
}

// Navigazione SPA-like semplice
document.querySelectorAll('.nav-links a').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.querySelector(link.getAttribute('href')).classList.remove('hidden');
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
    };
});

// Init
renderTasks();
