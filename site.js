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

// --- SVG icon templates ---
var SVG_LEFT = '<svg width="6" height="9" viewBox="0 0 8 12" style="display:block;"><path d="M7 1L2 6L7 11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var SVG_RIGHT = '<svg width="6" height="9" viewBox="0 0 8 12" style="display:block;"><path d="M1 1L6 6L1 11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// --- Load entries into both stream and companion columns ---
async function loadEntries() {
    var sScroll = document.getElementById('sScroll');
    var cScroll = document.getElementById('cScroll');
    var navLists = { text: document.getElementById('l-text'), image: document.getElementById('l-image'), video: document.getElementById('l-video'), sound: document.getElementById('l-sound') };

    Object.values(navLists).forEach(function(ul) { ul.innerHTML = ''; });

    var fragments = await Promise.all(
        ENTRIES.map(function(e) { return fetch('entries/' + e.id + '.html').then(function(r) { return r.text(); }); })
    );

    fragments.forEach(function(html, i) {
        var entry = ENTRIES[i];

        // Stream entry
        var div = document.createElement('div');
        div.className = 'se';
        div.id = 'e-' + entry.id;
        div.dataset.m = entry.m;
        div.dataset.t = entry.t;
        div.innerHTML = html;
        sScroll.appendChild(div);

        // Companion entry (twin)
        var cdiv = document.createElement('div');
        cdiv.className = 'se';
        cdiv.id = 'ce-' + entry.id;
        cdiv.dataset.m = entry.m;
        cdiv.dataset.t = entry.t;
        cdiv.innerHTML = html;
        cScroll.appendChild(cdiv);

        // Nav item
        var li = document.createElement('li');
        li.className = 'nav-item';
        li.dataset.e = entry.id;
        li.onclick = function() { sTo(entry.id); };
        li.innerHTML = '<span class="d">' + entry.date + '</span><span>' + entry.label + '</span>';
        if (navLists[entry.nav]) navLists[entry.nav].appendChild(li);
    });

    // Update nav bar date from newest entry
    if (ENTRIES.length > 0) {
        var d = ENTRIES[0].date;
        var parts = d.split(' ');
        document.getElementById('navDate').textContent = parts[0] + '/' + parts[1] + '/26 10:19';
    }
}

// --- Helper: ensure companion pane is open ---
function openCompanionHeader() {
    document.getElementById('compPane').classList.remove('collapsed');
    document.getElementById('hCompToggle').innerHTML = SVG_RIGHT;
}

// --- Nav toggle (columns only — header never changes) ---
function toggleNav() {
    var nav = document.getElementById('navPane');
    var btn = document.getElementById('hNavToggle');
    if (window.innerWidth <= 900) {
        nav.classList.toggle('mobile-open');
    } else {
        nav.classList.toggle('collapsed');
    }
    var isCollapsed = nav.classList.contains('collapsed');
    btn.innerHTML = isCollapsed ? SVG_RIGHT : SVG_LEFT;
}

// --- Companion toggle (columns only — header never changes) ---
function toggleComp() {
    var comp = document.getElementById('compPane');
    var btn = document.getElementById('hCompToggle');
    comp.classList.toggle('collapsed');
    var isCollapsed = comp.classList.contains('collapsed');
    btn.innerHTML = isCollapsed ? SVG_LEFT : SVG_RIGHT;
    if (isCollapsed && window._searchActive) {
        deactivateSearch();
    }
}

// --- Nav category toggle ---
function tCat(c) {
    var l = document.getElementById('l-' + c), i = document.getElementById('i-' + c);
    l.classList.toggle('collapsed');
    i.textContent = l.classList.contains('collapsed') ? '>' : 'v';
}

// --- Scroll to entry in stream ---
function sTo(id) {
    var e = document.getElementById('e-' + id);
    if (e) {
        e.scrollIntoView({ behavior: 'smooth', block: 'start' });
        e.style.background = document.body.classList.contains('dark') ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)';
        setTimeout(function() { e.style.background = ''; }, 2000);
    }
    document.querySelectorAll('.nav-item').forEach(function(i) { i.classList.remove('active'); });
    var n = document.querySelector('.nav-item[data-e="' + id + '"]');
    if (n) n.classList.add('active');
    if (window.innerWidth <= 900) document.getElementById('navPane').classList.remove('mobile-open');
}

// --- Stream filter menu toggle ---
function tFM() { document.getElementById('fDD').classList.toggle('open'); }

// --- Stream filter ---
function sF(f) {
    document.querySelectorAll('#sScroll .se').forEach(function(e) {
        if (f === 'all') e.style.display = '';
        else {
            var m = e.dataset.m || '', t = e.dataset.t || '';
            e.style.display = (m.includes(f) || t.includes(f)) ? '' : 'none';
        }
    });
    document.getElementById('sfLabel').textContent = f === 'all' ? 'all' : f;
    document.querySelectorAll('#fDD .s-fo').forEach(function(o) { o.classList.remove('active'); });
    if (event && event.target) event.target.classList.add('active');
    document.getElementById('fDD').classList.remove('open');
}

// --- Companion filter menu toggle ---
function tCFM() { document.getElementById('cDD').classList.toggle('open'); }

// --- Companion filter ---
function cF(f) {
    document.querySelectorAll('#cScroll .se').forEach(function(e) {
        if (f === 'all') e.style.display = '';
        else {
            var m = e.dataset.m || '', t = e.dataset.t || '';
            e.style.display = (m.includes(f) || t.includes(f)) ? '' : 'none';
        }
    });
    document.getElementById('cfLabel').textContent = f === 'all' ? 'all' : f;
    document.querySelectorAll('#cDD .c-fo').forEach(function(o) { o.classList.remove('active'); });
    if (event && event.target) event.target.classList.add('active');
    document.getElementById('cDD').classList.remove('open');
}

// --- Cross-column scroll (hyperlinks/references) ---
// Clicking a reference in one column scrolls the OTHER column to that entry
function oC(id) {
    var el = event ? event.target : null;
    var inComp = el && el.closest('#cScroll');
    var highlight = document.body.classList.contains('dark') ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)';
    if (inComp) {
        // Clicked in companion -> scroll stream
        var target = document.getElementById('e-' + id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.style.background = highlight;
            setTimeout(function() { target.style.background = ''; }, 2000);
        }
    } else {
        // Clicked in stream -> scroll companion
        openCompanionHeader();
        var target = document.getElementById('ce-' + id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.style.background = highlight;
            setTimeout(function() { target.style.background = ''; }, 2000);
        }
    }
}

// --- Search ---
window._searchActive = false;

function toggleSearch() {
    if (window._searchActive) {
        deactivateSearch();
    } else {
        activateSearch();
    }
}

function activateSearch() {
    window._searchActive = true;
    document.getElementById('hSearch').classList.add('active');
    openCompanionHeader();
    document.getElementById('compBar').classList.add('search-mode');
    document.getElementById('compPane').classList.add('search-active');
    var input = document.getElementById('compSearchInput');
    input.value = '';
    input.focus();
    document.getElementById('cSearchResults').innerHTML = '<div style="color:var(--accent);font-size:11px;font-family:var(--mono);padding-top:4px;">type to search entries...</div>';
}

function deactivateSearch() {
    window._searchActive = false;
    document.getElementById('hSearch').classList.remove('active');
    document.getElementById('compBar').classList.remove('search-mode');
    document.getElementById('compPane').classList.remove('search-active');
    document.getElementById('compSearchInput').value = '';
}

function doSearch() {
    var input = document.getElementById('compSearchInput');
    var q = input.value.toLowerCase().trim();
    if (!q) return;
    var r = '';
    document.querySelectorAll('#sScroll .se').forEach(function(e) {
        var text = e.textContent.toLowerCase();
        if (text.includes(q)) {
            var ti = e.querySelector('.se-title').textContent;
            var d = e.querySelector('.se-date').textContent;
            var id = e.id.replace('e-', '');
            r += '<div class="cr" onclick="sTo(\'' + id + '\')"><div class="cr-t">' + ti + '</div><div class="cr-d">' + d + '</div></div>';
        }
    });
    document.getElementById('cSearchResults').innerHTML = r || '<div style="color:var(--accent);font-size:11px;font-family:var(--mono);">no results</div>';
}

// --- Dark mode ---
function toggleDark() {
    document.body.classList.toggle('dark');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
    loadEntries();
    var input = document.getElementById('compSearchInput');
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            doSearch();
        } else if (e.key === 'Escape') {
            deactivateSearch();
        }
    });
});
