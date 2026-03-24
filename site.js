/* f4u574.zip — site.js */

// Entry config: id, medium, tags, nav category, nav label, nav date
// Ordered newest-first (this is the display order)
const ENTRIES = [
    { id: 'jazz',         m: 'text image sound', t: 'research systems composition',    nav: 'text',  label: 'jazz compositions in text & other media', date: '03 19' },
    { id: 'rhizome',      m: 'text',             t: 'research systems deleuze methodology', nav: 'text',  label: 'rhizome not a tree',                      date: '03 18' },
    { id: 'fabric',       m: 'image',            t: 'material fashion',                 nav: 'image', label: 'fabric study #1 — silk organza',           date: '03 17' },
    { id: 'mitochondria', m: 'text',             t: 'research body consciousness',      nav: 'text',  label: 'no rest for mitochondria',                 date: '03 16' },
    { id: 'walk',         m: 'video',            t: 'landscape neringa',                nav: 'video', label: 'walking through neringa',                  date: '03 15' },
    { id: 'sketch1',      m: 'sound',            t: 'music sketch',                     nav: 'sound', label: 'untitled sound sketch #1',                 date: '03 14' },
    { id: 'foundation',   m: 'text',             t: 'research diary consciousness',     nav: 'text',  label: 'the foundation',                          date: '03 12' },
];

// --- Load entries ---
async function loadEntries() {
    const scroll = document.getElementById('sScroll');
    const navLists = { text: document.getElementById('l-text'), image: document.getElementById('l-image'), video: document.getElementById('l-video'), sound: document.getElementById('l-sound') };

    // Clear nav lists
    Object.values(navLists).forEach(ul => ul.innerHTML = '');

    // Fetch all fragments in parallel
    const fragments = await Promise.all(
        ENTRIES.map(e => fetch('entries/' + e.id + '.html').then(r => r.text()))
    );

    fragments.forEach((html, i) => {
        const entry = ENTRIES[i];

        // Create stream entry
        const div = document.createElement('div');
        div.className = 'se';
        div.id = 'e-' + entry.id;
        div.dataset.m = entry.m;
        div.dataset.t = entry.t;
        div.innerHTML = html;
        scroll.appendChild(div);

        // Create nav item
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.dataset.e = entry.id;
        li.onclick = () => sTo(entry.id);
        li.innerHTML = '<span class="d">' + entry.date + '</span><span>' + entry.label + '</span>';
        if (navLists[entry.nav]) navLists[entry.nav].appendChild(li);
    });

    // Store companion default content
    window._cd = document.getElementById('cContent').innerHTML;
}

// --- Pane toggling ---
function togglePane(p) {
    if (p === 'nav') {
        document.getElementById('navPane').classList.toggle('collapsed');
    } else {
        document.getElementById('compPane').classList.toggle('collapsed');
    }
}

// --- Nav category toggle ---
function tCat(c) {
    const l = document.getElementById('l-' + c), i = document.getElementById('i-' + c);
    l.classList.toggle('collapsed');
    i.textContent = l.classList.contains('collapsed') ? '>' : 'v';
}

// --- Scroll to entry ---
function sTo(id) {
    const e = document.getElementById('e-' + id);
    if (e) {
        e.scrollIntoView({ behavior: 'smooth', block: 'start' });
        e.style.background = document.body.classList.contains('dark') ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)';
        setTimeout(() => e.style.background = '', 2000);
    }
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const n = document.querySelector('.nav-item[data-e="' + id + '"]');
    if (n) n.classList.add('active');
    if (window.innerWidth <= 900) document.getElementById('navPane').classList.remove('mobile-open');
}

// --- Stream filter toggle ---
function tFM() { document.getElementById('fDD').classList.toggle('open'); }

// --- Stream filter ---
function sF(f) {
    document.querySelectorAll('.se').forEach(e => {
        if (f === 'all') e.style.display = '';
        else {
            const m = e.dataset.m || '', t = e.dataset.t || '';
            e.style.display = (m.includes(f) || t.includes(f)) ? '' : 'none';
        }
    });
    document.getElementById('sfLabel').textContent = f === 'all' ? 'All' : f;
    document.querySelectorAll('.s-fo').forEach(o => o.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    document.getElementById('fDD').classList.remove('open');
}

// --- Companion: open entry ---
function oC(id) {
    const e = document.getElementById('e-' + id);
    if (!e) return;
    const t = e.querySelector('.se-title').textContent,
          d = e.querySelector('.se-date').textContent,
          c = e.querySelector('.se-body').innerHTML;
    document.getElementById('cTitle').textContent = t;
    document.getElementById('cBack').style.display = 'inline';
    document.getElementById('cContent').innerHTML = '<div style="padding:4px 0;"><div style="font-size:10px;color:var(--accent);font-family:var(--mono);margin-bottom:8px;">' + d + '</div><div style="font-size:12px;line-height:1.6;">' + c + '</div></div>';
    document.getElementById('compPane').classList.remove('collapsed');
}

// --- Companion: filter by tag ---
function fC(tag) {
    let r = '';
    document.querySelectorAll('.se').forEach(e => {
        const m = e.dataset.m || '', t = e.dataset.t || '';
        if (m.includes(tag) || t.includes(tag)) {
            const ti = e.querySelector('.se-title').textContent,
                  d = e.querySelector('.se-date').textContent,
                  id = e.id.replace('e-', '');
            r += '<div class="cr" onclick="sTo(\'' + id + '\')"><div class="cr-t">' + ti + '</div><div class="cr-d">' + d + '</div></div>';
        }
    });
    document.getElementById('cTitle').textContent = tag;
    document.getElementById('cBack').style.display = 'inline';
    document.getElementById('cContent').innerHTML = r || '<div style="color:var(--accent);font-size:11px;">no entries</div>';
    document.getElementById('compPane').classList.remove('collapsed');
}

// --- Companion: back to index ---
function rC() {
    document.getElementById('cTitle').textContent = 'Index';
    document.getElementById('cBack').style.display = 'none';
    document.getElementById('cContent').innerHTML = window._cd;
}

// --- Init ---
document.addEventListener('DOMContentLoaded', loadEntries);
