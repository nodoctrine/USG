'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG — Single source of truth for all display strings and UI behavior.
// Change a value here and it takes effect on every page that loads this file.
// Do not scatter these values into individual chapter files.
// ═══════════════════════════════════════════════════════════════════════════════
const CONFIG = {

  // ── Block badge labels ────────────────────────────────────────────────────
  // Text shown in the colored badge on each activity block.
  // Keys match the second CSS class on the block <div> (e.g. "block-anim").
  // Renaming a label here updates every chapter at once — no per-file edits needed.
  labels: {
    'block-anim': 'Lecture',
    'block-mc':   'Lecture Review',
    'block-sa':   'Lecture Review',
    'block-chal': 'Activity',
  },

  // ── Chevron symbols ───────────────────────────────────────────────────────
  // Shown in the top-right corner of each tracked block.
  // pending = not yet completed; done = all items finished.
  chevron: {
    pending: '○',
    done:    '✓',
  },

  // ── Header pill and sidebar strings ──────────────────────────────────────
  // {n}, {done}, {total} are replaced with computed counts at runtime.
  progress: {
    pctSuffix: '% complete',     // appended to integer percentage in the header pill
    remaining: '{n} remaining',  // header pill when blocks remain; {n} = count left
    allDone:   'all done!',      // header pill text when 0 remaining (pill also hides)
    secDone:   '✓',             // sidebar section count when all blocks in section are done
    secFmt:    '{done}/{total}', // sidebar section count format while in progress
  },

  // ── Activity feedback strings ─────────────────────────────────────────────
  // Displayed inside activity blocks as response to reader input.
  // saWrong is shown when a short-answer check fails and the answer was not revealed.
  feedback: {
    saWrong:  'Not quite — try again or click <em>Show Answer</em>.',
    chalPass: '✓',   // symbol on a passing test row in the challenge output panel
    chalFail: '✗',   // symbol on a failing test row in the challenge output panel
  },

  // ── Reset confirmation prompts ────────────────────────────────────────────
  // Text shown in window.confirm() before clearing localStorage.
  // The course reset uses COURSE_PREFIX from the chapter's inline script to
  // know which localStorage keys to clear.
  reset: {
    chapter: 'Reset all progress for this chapter? This cannot be undone.',
    course:  'Reset ALL progress for the entire course? This cannot be undone.',
  },

  // ── Theme system ──────────────────────────────────────────────────────────
  // themes must match the data-theme attribute values used in HTML and CSS,
  // and the data-t attributes on the SVG pie segments.
  // defaultTheme is applied when no saved preference exists.
  // themeKey is the localStorage key shared across all courses and pages.
  themes:       ['default', 'dark', 'retro'],
  defaultTheme: 'dark',
  themeKey:     'mb-theme',

};
// ═══════════════════════════════════════════════════════════════════════════════


// ── LABELS — read each block's CSS class and inject the badge text ─────────────
// Runs once on load. Badge spans can be left empty in new chapters.
// On legacy chapters the badge already has text; this overwrites with the
// canonical CONFIG value, keeping old files consistent without editing them.
(function applyLabels() {
  document.querySelectorAll('.block').forEach(block => {
    const badge = block.querySelector('.act-badge');
    if (!badge) return;
    for (const cls of block.classList) {
      if (CONFIG.labels[cls]) { badge.textContent = CONFIG.labels[cls]; return; }
    }
  });
})();


// ── THEME ──────────────────────────────────────────────────────────────────────
function updatePie(t) {
  document.querySelectorAll('.pie-seg').forEach(s => s.classList.toggle('pie-active', s.dataset.t === t));
}
function setTheme(t) {
  document.body.setAttribute('data-theme', t);
  localStorage.setItem(CONFIG.themeKey, t);
  updatePie(t);
}
(function initTheme() {
  const saved = localStorage.getItem(CONFIG.themeKey);
  const t = (saved && CONFIG.themes.includes(saved)) ? saved : CONFIG.defaultTheme;
  document.body.setAttribute('data-theme', t);
  updatePie(t);
})();


// ── TOUR ───────────────────────────────────────────────────────────────────────
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
  { sel: '.sidebar-link',       side: 'right', label: 'Sections',      text: 'Jump to a section. Green when all activities complete.' },
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

function toggleTour() { if (tourActive) stopTour(); else startTour(); }

document.addEventListener('keydown', e => { if (e.key === 'Escape' && tourActive) stopTour(); });


// ── DROPDOWN NAV ───────────────────────────────────────────────────────────────
(function() {
  const s = document.createElement('style');
  s.textContent = `
.cn-dropdown{display:inline-flex;}
.cn-drop-btn{
      background:var(--accent-cool);
      color:#fff;
      border:none;
      padding:3px 10px;
      border-radius:4px;
      font-size:12px;
      font-weight:600;
      cursor:pointer;
      white-space:nowrap;
      display:inline-flex;
      align-items:center;
      gap:5px;line-height:1.4;
      font-family:inherit;
      }
.cn-drop-btn:hover{opacity:.88;}
.cn-drop-menu{display:none;position:fixed;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 4px 20px rgba(0,0,0,.3);z-index:400;min-width:150px;overflow:hidden;}
.cn-drop-menu.open{display:block;}
.cn-drop-item{display:block;padding:8px 14px;font-size:13px;color:var(--text);white-space:nowrap;text-decoration:none;}
.cn-drop-item:hover{background:var(--surface-alt);text-decoration:none;}
button.cn-drop-item{background:none;border:none;width:100%;text-align:left;cursor:pointer;font-family:inherit;}
.cross-nav-home{font-size:12px;color:var(--text-muted);text-decoration:none;white-space:nowrap;flex-shrink:0;padding:0 4px;}
.cross-nav-home:hover{color:var(--accent-cool);text-decoration:none;}
span.cn-drop-current{display:block;padding:8px 14px;font-size:13px;color:var(--accent-cool);font-weight:600;cursor:default;pointer-events:none;border-bottom:1px solid var(--border);margin-bottom:2px;}
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


// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER ENGINE — Progress tracking, activity logic, and reset.
//
// These functions expect the following globals defined by the chapter's inline
// script (the data-only block at the bottom of each chapter HTML file):
//
//   const CHAPTER_ID    — localStorage key for this chapter (e.g. 'mb-eb3')
//   const COURSE_PREFIX — localStorage prefix for the course (e.g. 'mb-eb')
//   const ALL_BLOCKS    — array of every tracked block ID, in document order
//   const SEC_BLOCKS    — object mapping section number → array of block IDs
//   const MC_DATA       — object mapping question ID → { correct, ok, bad }
//   const CHALLENGES    — object mapping block ID → { tests[], defaultCode }
//   var   prog          — object loaded from localStorage; tracks which blocks are done
//   var   animIdx       — object tracking the current frame index per animation block
//   var   mcDone        — object tracking which MC questions have been answered
//
// Functions defined here as `function` declarations override any same-named
// functions from legacy chapter inline scripts, so existing chapters continue
// to work unchanged while getting all CONFIG-driven behavior.
// ═══════════════════════════════════════════════════════════════════════════════

function markDone(id) {
  prog[id] = true;
  localStorage.setItem(CHAPTER_ID, JSON.stringify(prog));
  renderProgress();
}

function renderProgress() {
  if (typeof ALL_BLOCKS === 'undefined') return;
  const total = ALL_BLOCKS.length;
  const done  = ALL_BLOCKS.filter(id => prog[id]).length;
  const pct   = Math.round((done / total) * 100);

  // Chevrons — one per tracked block
  ALL_BLOCKS.forEach(id => {
    const el = document.getElementById('chev-' + id);
    if (!el) return;
    el.textContent = prog[id] ? CONFIG.chevron.done    : CONFIG.chevron.pending;
    el.className   = 'chevron ' + (prog[id] ? 'done' : 'pend');
  });

  // Sidebar section counts
  Object.entries(SEC_BLOCKS).forEach(([sec, ids]) => {
    const sd  = ids.filter(id => prog[id]).length;
    const st  = ids.length;
    const all = sd === st;
    const sc  = document.getElementById('sc-' + sec);
    const lk  = document.querySelector(`[data-sec="${sec}"]`);
    if (sc) {
      sc.textContent = all
        ? CONFIG.progress.secDone
        : CONFIG.progress.secFmt.replace('{done}', sd).replace('{total}', st);
      sc.className = 's-count' + (all ? ' all-done' : '');
    }
    if (lk) lk.classList.toggle('section-done', all);
  });

  // Header pills
  const pill = document.getElementById('progress-pill');
  if (pill) pill.textContent = pct + CONFIG.progress.pctSuffix;

  const rem = total - done;
  const rp  = document.getElementById('remaining-pill');
  if (rp) {
    rp.textContent  = rem > 0 ? CONFIG.progress.remaining.replace('{n}', rem) : CONFIG.progress.allDone;
    rp.style.display = rem === 0 ? 'none' : '';
  }

  // Progress bar
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = pct + '%';

  // Completion banner
  const bn = document.getElementById('completion-banner');
  if (bn) bn.classList.toggle('visible', done === total);
}


// ── ANIMATION ──────────────────────────────────────────────────────────────────
function animGo(id, delta) {
  const frames = document.querySelectorAll(`#${id} .anim-frame`);
  const n = frames.length;
  if (!n) return;
  if (animIdx[id] === undefined) animIdx[id] = 0;
  animIdx[id] = Math.max(0, Math.min(animIdx[id] + delta, n - 1));
  const i   = animIdx[id];
  const num = id.replace('anim-', '');
  frames.forEach((f, fi) => f.classList.toggle('active', fi === i));
  const cap = document.getElementById('anim-cap-' + num);
  const prg = document.getElementById('anim-prog-' + num);
  if (cap) cap.textContent = frames[i].dataset.cap || '';
  if (prg) prg.textContent = (i + 1) + ' / ' + n;
  if (i === n - 1) markDone(id);
}
function animNext(id) { animGo(id,  1); }
function animPrev(id) { animGo(id, -1); }


// ── MULTIPLE CHOICE ────────────────────────────────────────────────────────────
function handleMC(name, value) {
  const data = MC_DATA[name];
  if (!data) return;
  document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
    inp.disabled = true;
    const lbl = inp.closest('.choice');
    if (inp.value === data.correct) lbl.classList.add('correct');
    else if (inp.value === value)   lbl.classList.add('incorrect');
  });
  const exp = document.getElementById('exp-' + name);
  if (exp) {
    const ok = value === data.correct;
    exp.innerHTML = ok ? data.ok : data.bad;
    exp.className = 'explanation visible' + (ok ? '' : ' wrong');
  }
  mcDone[name] = true;
  const blockNum = name.match(/^mcq-(\d+)/)[1];
  if (Object.keys(MC_DATA).filter(k => k.startsWith('mcq-' + blockNum)).every(k => mcDone[k])) {
    markDone('mc-' + blockNum);
  }
}

// Attach radio listeners. Guard prevents double-binding on legacy chapters
// that also wire these in their inline script — calling handleMC twice is
// safe but the guard avoids it for cleanliness.
document.querySelectorAll('.block-mc input[type="radio"]:not([data-mb-bound])').forEach(inp => {
  inp.dataset.mbBound = '1';
  inp.addEventListener('change', () => handleMC(inp.name, inp.value));
});


// ── SHORT ANSWER ───────────────────────────────────────────────────────────────
function checkSA(blockId, accepted, okMsg) {
  const num   = blockId.replace('sa-', '');
  const input = document.getElementById('sa-input-' + num);
  const exp   = document.getElementById('exp-' + blockId);
  if (!input || !exp) return;
  const ok = accepted.map(a => a.toLowerCase()).includes(input.value.trim().toLowerCase());
  input.className = 'sa-input ' + (ok ? 'correct' : 'incorrect');
  exp.innerHTML   = ok ? okMsg : CONFIG.feedback.saWrong;
  exp.className   = 'explanation visible' + (ok ? '' : ' wrong');
  if (ok) markDone(blockId);
}
function showSA(blockId, answer, msg) {
  const num   = blockId.replace('sa-', '');
  const input = document.getElementById('sa-input-' + num);
  const exp   = document.getElementById('exp-' + blockId);
  if (input) { input.value = answer; input.className = 'sa-input correct'; }
  if (exp)   { exp.innerHTML = msg;  exp.className   = 'explanation visible'; }
  markDone(blockId);
}


// ── CHALLENGE ──────────────────────────────────────────────────────────────────
function checkChallenge(blockId) {
  const ch  = CHALLENGES[blockId];
  const ed  = document.getElementById('ed-' + blockId);
  const out = document.getElementById('out-' + blockId);
  if (!ch || !ed || !out) return;
  const results = ch.tests.map(t => ({ ...t, pass: t.fn(ed.value) }));
  out.innerHTML = results.map(r =>
    `<div class="t-row ${r.pass ? 't-pass' : 't-fail'}">${r.pass ? CONFIG.feedback.chalPass : CONFIG.feedback.chalFail}  ${r.name}</div>`
  ).join('');
  out.className = 'chal-output visible';
  if (results.every(r => r.pass)) markDone(blockId);
}
function resetChallenge(blockId) {
  const ch  = CHALLENGES[blockId];
  const ed  = document.getElementById('ed-' + blockId);
  const out = document.getElementById('out-' + blockId);
  if (ed)  ed.value     = ch?.defaultCode || '';
  if (out) out.className = 'chal-output';
}


// ── RESET ──────────────────────────────────────────────────────────────────────
function resetChapter() {
  if (!confirm(CONFIG.reset.chapter)) return;
  prog = {};
  localStorage.removeItem(CHAPTER_ID);
  document.querySelectorAll('.block-mc input[type="radio"]').forEach(inp => {
    inp.checked  = false;
    inp.disabled = false;
    inp.closest('.choice').className = 'choice';
  });
  document.querySelectorAll('.explanation').forEach(el => el.className = 'explanation');
  document.querySelectorAll('.sa-input').forEach(el => { el.value = ''; el.className = 'sa-input'; });
  document.querySelectorAll('.chal-output').forEach(el => el.className = 'chal-output');
  if (typeof CHALLENGES !== 'undefined') {
    Object.keys(CHALLENGES).forEach(id => {
      const ed = document.getElementById('ed-' + id);
      if (ed) ed.value = CHALLENGES[id].defaultCode;
    });
  }
  if (typeof animIdx !== 'undefined') {
    Object.keys(animIdx).forEach(id => { animIdx[id] = 0; animGo(id, 0); });
  }
  renderProgress();
}

function resetCourse() {
  if (!confirm(CONFIG.reset.course)) return;
  // COURSE_PREFIX is defined in the chapter's inline script (e.g. 'mb-eb').
  // Clears all localStorage keys that start with that prefix, covering every
  // chapter in the course regardless of how many exist.
  if (typeof COURSE_PREFIX !== 'undefined') {
    Object.keys(localStorage).filter(k => k.startsWith(COURSE_PREFIX)).forEach(k => localStorage.removeItem(k));
  }
  resetChapter();
}


// ── SIDEBAR ACTIVE SECTION ────────────────────────────────────────────────────
// Only runs on chapter pages (where ALL_BLOCKS is defined).
if (typeof ALL_BLOCKS !== 'undefined') {
  const _io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const s = e.target.id.replace('sec-', '');
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`[data-sec="${s}"]`);
      if (a) a.classList.add('active');
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.section').forEach(s => _io.observe(s));

  // Initial render — draws chevrons, pills, and progress bar from saved state.
  renderProgress();
}
