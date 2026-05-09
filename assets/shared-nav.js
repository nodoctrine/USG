'use strict';

// ── THEME ─────────────────────────────────────────────────────────
const THEMES = ['default','dark','retro'];
function updatePie(t) { document.querySelectorAll('.pie-seg').forEach(s => s.classList.toggle('pie-active', s.dataset.t === t)); }
function setTheme(t) { document.body.setAttribute('data-theme', t); localStorage.setItem('mb-theme', t); updatePie(t); }
(function initTheme() { const t = localStorage.getItem('mb-theme'); const a = (t && THEMES.includes(t)) ? t : 'dark'; document.body.setAttribute('data-theme', a); updatePie(a); })();

// ── TOUR ──────────────────────────────────────────────────────────
(function injectTourStyles() {
  const s = document.createElement('style');
  s.textContent = `
.tour-btn {
  background: rgba(255,255,255,0.09);
  border: 1.5px solid rgba(255,255,255,0.25);
  color: var(--header-text);
  width: 28px; height: 28px;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 15px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; line-height: 1;
  transition: background 0.15s;
  font-family: Georgia, serif;
}
.tour-btn:hover  { background: rgba(255,255,255,0.2); }
.tour-btn.active { background: var(--accent-cool); border-color: transparent; }
.tour-overlay { display: none; position: fixed; inset: 0; z-index: 500; }
.tour-overlay.on { display: block; }
.tour-bd { position: absolute; inset: 0; background: rgba(0,0,0,0.28); cursor: default; }
.tour-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.tour-ann {
  position: absolute;
  background: var(--surface);
  border: 1.5px solid var(--accent-cool);
  border-radius: var(--radius);
  padding: 8px 12px;
  max-width: 180px; min-width: 110px;
  font-size: 12px; line-height: 1.45;
  box-shadow: 0 4px 18px rgba(0,0,0,0.5);
  pointer-events: none; z-index: 502;
  color: var(--text);
}
.tour-ann strong {
  display: block;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--accent-cool);
  margin-bottom: 3px;
}
  `;
  document.head.appendChild(s);
})();

const TOUR_ITEMS = [
  { sel: '#progress-pill',      side: 'below', label: 'Progress',      text: 'Overall % complete. Updates each time you finish an activity.' },
  { sel: '#remaining-pill',     side: 'below', label: 'Remaining',     text: 'Activities left to complete in this chapter.' },
  { sel: '#theme-pie',          side: 'below', label: 'Theme',         text: 'Click a slice: Light, Dark, or Night Shift.' },
  { sel: '.progress-bar-track', side: 'below', label: 'Progress Bar',  text: 'Fills as activities complete. Full green = chapter done.' },
  { sel: '.sidebar-link',       side: 'right', label: 'Sections',      text: 'Jump to a section. Green ✓ when all activities complete.' },
  { sel: '.s-count',            side: 'right', label: 'Section Count', text: 'Done / total activities for this section.' },
  { sel: '.reset-btn',          side: 'right', label: 'Reset',         text: 'Clears saved progress. Confirms before erasing.' },
];

let tourActive = false;

function stopTour() {
  tourActive = false;
  const ov = document.getElementById('tour-overlay');
  if (ov) { ov.classList.remove('on'); ov.innerHTML = ''; }
  const btn = document.getElementById('tour-btn');
  if (btn) btn.classList.remove('active');
}

function startTour() {
  tourActive = true;
  document.documentElement.scrollTop = 0;
  const btn = document.getElementById('tour-btn');
  if (btn) btn.classList.add('active');

  const ov = document.getElementById('tour-overlay');
  if (!ov) return;
  ov.innerHTML = '';
  ov.classList.add('on');

  const bd = document.createElement('div');
  bd.className = 'tour-bd';
  bd.addEventListener('click', stopTour);
  ov.appendChild(bd);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'tour-svg');
  svg.innerHTML = `<defs><marker id="tarr" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0,0.5 L0,6.5 L7,3.5 z" fill="var(--accent-cool)"/></marker></defs>`;
  ov.appendChild(svg);

  const W = window.innerWidth, H = window.innerHeight;
  const items = [];

  TOUR_ITEMS.forEach(item => {
    const target = document.querySelector(item.sel);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (!rect.width && !rect.height) return;
    if (rect.bottom < 0 || rect.top > H || rect.right < 0 || rect.left > W) return;
    const ann = document.createElement('div');
    ann.className = 'tour-ann';
    ann.innerHTML = `<strong>${item.label}</strong>${item.text}`;
    ov.appendChild(ann);
    items.push({ ann, rect, side: item.side });
  });

  requestAnimationFrame(() => {
    const GAP = 14, PAD = 8;
    const placed = items.map(({ ann, rect, side }) => {
      const AW = ann.offsetWidth, AH = ann.offsetHeight;
      const tx = rect.left + rect.width  / 2;
      const ty = rect.top  + rect.height / 2;
      let ax, ay;
      if (side === 'below') {
        ax = Math.max(PAD, Math.min(tx - AW / 2, W - AW - PAD));
        ay = rect.bottom + GAP;
      } else if (side === 'right') {
        ax = Math.min(rect.right + GAP, W - AW - PAD);
        ay = Math.max(PAD, Math.min(ty - AH / 2, H - AH - PAD));
      } else {
        ax = Math.max(PAD, rect.left - AW - GAP);
        ay = Math.max(PAD, Math.min(ty - AH / 2, H - AH - PAD));
      }
      return { ann, rect, side, ax, ay, AW, AH, tx, ty };
    });

    placed.sort((a, b) => a.ay !== b.ay ? a.ay - b.ay : a.ax - b.ax);
    for (let i = 1; i < placed.length; i++) {
      for (let j = 0; j < i; j++) {
        const A = placed[j], B = placed[i];
        const xOvr = B.ax < A.ax + A.AW + 6 && B.ax + B.AW > A.ax - 6;
        const yOvr = B.ay < A.ay + A.AH + 6 && B.ay + B.AH > A.ay - 6;
        if (xOvr && yOvr) B.ay = A.ay + A.AH + 8;
      }
    }

    placed.forEach(({ ann, rect, side, ax, ay, AW, AH, tx, ty }) => {
      if (ay + AH > H + 10 || ay < -10 || ax < -10 || ax + AW > W + 10) return;
      ann.style.left = ax + 'px';
      ann.style.top  = ay + 'px';
      let lx1, ly1, lx2, ly2;
      if (side === 'below') {
        lx1 = Math.max(ax + 8, Math.min(tx, ax + AW - 8));
        ly1 = ay; lx2 = lx1; ly2 = rect.bottom;
      } else if (side === 'right') {
        lx1 = ax;         ly1 = ay + AH / 2;
        lx2 = rect.right; ly2 = ty;
      } else {
        lx1 = ax + AW;   ly1 = ay + AH / 2;
        lx2 = rect.left; ly2 = ty;
      }
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', lx1); line.setAttribute('y1', ly1);
      line.setAttribute('x2', lx2); line.setAttribute('y2', ly2);
      line.setAttribute('stroke', 'var(--accent-cool)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '5,3');
      line.setAttribute('marker-end', 'url(#tarr)');
      svg.appendChild(line);
    });
  });
}

function toggleTour() {
  if (tourActive) stopTour(); else startTour();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && tourActive) stopTour();
});

// ── DROPDOWN NAV ──────────────────────────────────────────────────
(function() {
  const s = document.createElement('style');
  s.textContent = `
.cn-dropdown{display:inline-flex;}
.cn-drop-btn{background:var(--accent-cool);color:#fff;border:none;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;line-height:1.4;font-family:inherit;}
.cn-drop-btn:hover{opacity:.88;}
.cn-drop-menu{display:none;position:fixed;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 20px rgba(0,0,0,.3);z-index:400;min-width:150px;overflow:hidden;}
.cn-drop-menu.open{display:block;}
.cn-drop-item{display:block;padding:8px 14px;font-size:13px;color:var(--text);white-space:nowrap;text-decoration:none;}
.cn-drop-item:hover{background:var(--surface-alt);text-decoration:none;}
button.cn-drop-item{background:none;border:none;width:100%;text-align:left;cursor:pointer;font-family:inherit;}
.cross-nav-home{font-size:12px;color:var(--text-muted);text-decoration:none;white-space:nowrap;flex-shrink:0;padding:0 4px;}
.cross-nav-home:hover{color:var(--accent-cool);text-decoration:none;}
  `;
  document.head.appendChild(s);
})();

document.querySelectorAll('.cn-drop-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const menu = btn.nextElementSibling;
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.cn-drop-menu').forEach(m => m.classList.remove('open'));
    if (!isOpen) {
      const r = btn.getBoundingClientRect();
      menu.style.top = (r.bottom + 4) + 'px';
      if (menu.dataset.align === 'right') {
        menu.style.right = (window.innerWidth - r.right) + 'px';
        menu.style.left  = 'auto';
      } else {
        menu.style.left  = r.left + 'px';
        menu.style.right = 'auto';
      }
      menu.classList.add('open');
    }
  });
});
document.addEventListener('click', () => document.querySelectorAll('.cn-drop-menu').forEach(m => m.classList.remove('open')));

// ── HELP BUTTON (? dropdown, always right-aligned) ────────────────
document.querySelectorAll('.help-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const menu = btn.nextElementSibling;
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.cn-drop-menu').forEach(m => m.classList.remove('open'));
    if (!isOpen) {
      const r = btn.getBoundingClientRect();
      menu.style.top   = (r.bottom + 4) + 'px';
      menu.style.right = (window.innerWidth - r.right) + 'px';
      menu.style.left  = 'auto';
      menu.classList.add('open');
    }
  });
});
