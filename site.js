/* === f4u574.zip — site logic === */

// === ENTRY LOADING ===
// Entries live as separate HTML files in /entries/
// This function fetches and displays them in the content pane

async function loadEntry(id) {
    const contentPane = document.getElementById('contentPane');
    
    try {
        const response = await fetch(`entries/${id}.html`);
        if (!response.ok) throw new Error('Entry not found');
        const html = await response.text();
        
        // Insert content
        contentPane.innerHTML = html;
        
        // Re-trigger fade animations
        const entryContent = contentPane.querySelector('.entry-content');
        if (entryContent) {
            entryContent.querySelectorAll(':scope > *').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // force reflow
                el.style.animation = '';
            });
        }
    } catch (err) {
        contentPane.innerHTML = `<div style="color:var(--accent);padding:40px 0;">entry not found: ${id}</div>`;
    }
    
    // Update active state in nav
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeItem = document.querySelector(`.nav-item[data-entry="${id}"]`);
    if (activeItem) activeItem.classList.add('active');
    
    // Scroll content to top
    contentPane.scrollTo(0, 0);
    
    // Close mobile nav
    if (window.innerWidth <= 768) {
        document.getElementById('navPane').classList.remove('open');
        document.querySelector('.nav-overlay').classList.remove('show');
        document.querySelector('.burger').classList.remove('open');
    }
    
    // Update URL hash (so you can link directly to entries)
    history.pushState(null, '', `#${id}`);
}

// === CATEGORY TOGGLES ===
function toggleCategory(cat) {
    const list = document.getElementById('list-' + cat);
    const icon = document.getElementById('icon-' + cat);
    list.classList.toggle('collapsed');
    icon.textContent = list.classList.contains('collapsed') ? '>' : 'v';
}

// === BURGER MENU ===
function toggleNav() {
    document.getElementById('navPane').classList.toggle('open');
    document.querySelector('.nav-overlay').classList.toggle('show');
    document.querySelector('.burger').classList.toggle('open');
}

// === DAILY AUDIO ===
function toggleDailyAudio(btn) {
    btn.innerHTML = btn.innerHTML.includes('▶') ? '⏸' : '▶';
}

// === LOAD FROM URL HASH ===
// If someone visits f4u574.zip#rhizome, load that entry directly
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        loadEntry(hash);
    } else {
        // Load default entry (most recent)
        loadEntry('foundation');
    }
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash) loadEntry(hash);
});
