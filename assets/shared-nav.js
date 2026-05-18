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
    'block-act': 'Activity',
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
    actPass: '✓',   // symbol on a passing test row in the activity output panel
    actFail: '✗',   // symbol on a failing test row in the activity output panel
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
  themeKey:     'usg-theme',

};
// ═══════════════════════════════════════════════════════════════════════════════

// Runtime state — declared here so all engine functions share the same
// references. The if(ALL_BLOCKS) block at the bottom assigns real values
// from localStorage once the chapter's constants are confirmed present.
let prog    = {};
let animIdx = {};
let mcDone  = {};


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


// ── COURSE REGISTRY ────────────────────────────────────────────────────────────
// Single source of truth for all cross-nav links.
// To add a chapter: append to the course's pages array.
// To add a course:  add a new object here. No chapter HTML edits needed.
const COURSES = [
  {
    name:   'Electronics Basics',
    folder: 'Electronics_Basics',
    entry:  'chapter_01.html',
    pages: [
      { file: 'chapter_01.html', label: 'Chapter 1' },
      { file: 'chapter_02.html', label: 'Chapter 2' },
      { file: 'chapter_03.html', label: 'Chapter 3' },
      { file: 'chapter_04.html', label: 'Chapter 4' },
      { file: 'chapter_05.html', label: 'Chapter 5' },
      { file: 'quiz.html',       label: 'Practice Quiz' },
    ],
  },
  {
    name:   'C Programming',
    folder: 'C_Programming',
    entry:  'chapter_01.html',
    pages: [
      { file: 'chapter_00.html', label: 'Chapter 0' },
      { file: 'chapter_01.html', label: 'Chapter 1' },
      { file: 'chapter_02.html', label: 'Chapter 2' },
      { file: 'quiz.html',       label: 'Practice Quiz' },
    ],
  },
  {
    name:   'How-To Guide',
    folder: 'How_To_Guide',
    entry:  'chapter_01.html',
    pages: [
      { file: 'chapter_01.html', label: 'Chapter 1' },
      { file: 'chapter_02.html', label: 'Chapter 2' },
      { file: 'quiz.html',       label: 'Practice Quiz' },
    ],
  },
];

(function buildCrossNav() {
  const nav = document.querySelector('nav.cross-nav');
  if (!nav) return;
  const parts         = window.location.pathname.split('/');
  const currentFile   = decodeURIComponent(parts[parts.length - 1]);
  const currentFolder = decodeURIComponent(parts[parts.length - 2]);
  const course = COURSES.find(c => c.folder === currentFolder);
  if (!course) return;
  const page      = course.pages.find(p => p.file === currentFile);
  const pageLabel = page ? page.label : currentFile;
  const courseItems  = COURSES.map(c => c.folder === currentFolder
    ? `<span class="cn-drop-item cn-drop-current">${c.name}</span>`
    : `<a class="cn-drop-item" href="../${c.folder}/${c.entry}">${c.name}</a>`
  ).join('');
  const chapterItems = course.pages.map(p => p.file === currentFile
    ? `<span class="cn-drop-item cn-drop-current">${p.label}</span>`
    : `<a class="cn-drop-item" href="${p.file}">${p.label}</a>`
  ).join('');
  nav.innerHTML =
    `<a href="../../index.html" class="cross-nav-home">&#8592; All Courses</a>` +
    `<div class="cross-nav-divider"></div>` +
    `<span class="cross-nav-label">Course:</span>` +
    `<div class="cn-dropdown"><button class="cn-drop-btn" aria-haspopup="true" aria-expanded="false">${course.name} &#9662;</button>` +
    `<div class="cn-drop-menu">${courseItems}</div></div>` +
    `<div class="cross-nav-divider"></div>` +
    `<span class="cross-nav-label">Chapter:</span>` +
    `<div class="cn-dropdown"><button class="cn-drop-btn" aria-haspopup="true" aria-expanded="false">${pageLabel} &#9662;</button>` +
    `<div class="cn-drop-menu">${chapterItems}</div></div>`;

  // Inject progress bar and completion banner immediately after the cross-nav.
  // ALL_BLOCKS is defined by the chapter inline script, which runs before
  // shared-nav.js loads, so this typeof check is reliable at execution time.
  // Quiz pages do not define ALL_BLOCKS and are skipped.
  if (typeof ALL_BLOCKS !== 'undefined') {
    const track = document.createElement('div');
    track.className = 'progress-bar-track';
    track.innerHTML = '<div class="progress-bar-fill" id="progress-bar"></div>';
    nav.after(track);

    const pageIdx  = course.pages.findIndex(p => p.file === currentFile);
    const nextPage = (pageIdx >= 0 && pageIdx < course.pages.length - 1)
      ? course.pages[pageIdx + 1] : null;
    const banner = document.createElement('div');
    banner.className = 'completion-banner';
    banner.id        = 'completion-banner';
    banner.innerHTML = nextPage
      ? `Chapter complete! <a href="${nextPage.file}">Continue to ${nextPage.label} &rarr;</a>`
      : 'Chapter complete!';
    track.after(banner);
  }
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
//   const CHAPTER_ID    — localStorage key for this chapter (e.g. 'usg-eb3')
//   const COURSE_PREFIX — localStorage prefix for the course (e.g. 'usg-eb')
//   const ALL_BLOCKS    — array of every tracked block ID, in document order
//   const SEC_BLOCKS    — object mapping section number → array of block IDs
//   const MC_DATA       — object mapping question ID → { correct, ok, bad }
//   const ACTIVITIES    — object mapping block ID → { tests[], defaultCode }
//
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
document.querySelectorAll('.block-mc input[type="radio"]:not([data-usg-bound])').forEach(inp => {
  inp.dataset.usgBound = '1';
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


// ── ACTIVITY ───────────────────────────────────────────────────────────────────
function checkActivity(blockId) {
  const ch  = ACTIVITIES[blockId];
  const ed  = document.getElementById('ed-' + blockId);
  const out = document.getElementById('out-' + blockId);
  if (!ch || !ed || !out) return;
  const results = ch.tests.map(t => ({ ...t, pass: t.fn(ed.value) }));
  out.innerHTML = results.map(r =>
    `<div class="t-row ${r.pass ? 't-pass' : 't-fail'}">${r.pass ? CONFIG.feedback.actPass : CONFIG.feedback.actFail}  ${r.name}</div>`
  ).join('');
  out.className = 'act-output visible';
  if (results.every(r => r.pass)) markDone(blockId);
}
function resetActivity(blockId) {
  const ch  = ACTIVITIES[blockId];
  const ed  = document.getElementById('ed-' + blockId);
  const out = document.getElementById('out-' + blockId);
  if (ed)  ed.value     = ch?.defaultCode || '';
  if (out) out.className = 'act-output';
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
  document.querySelectorAll('.act-output').forEach(el => el.className = 'act-output');
  if (typeof ACTIVITIES !== 'undefined') {
    Object.keys(ACTIVITIES).forEach(id => {
      const ed = document.getElementById('ed-' + id);
      if (ed) ed.value = ACTIVITIES[id].defaultCode;
    });
  }
  if (typeof animIdx !== 'undefined') {
    Object.keys(animIdx).forEach(id => { animIdx[id] = 0; animGo(id, 0); });
  }
  renderProgress();
}

function resetCourse() {
  if (!confirm(CONFIG.reset.course)) return;
  // COURSE_PREFIX is defined in the chapter's inline script (e.g. 'usg-eb').
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
  prog = JSON.parse(localStorage.getItem(CHAPTER_ID) || '{}');

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
