# Universal Study Guide — Architecture

## Directory Structure

```
Universal Study Guide/          ← GitHub repo root
├── assets/
│   ├── shared.css              ← ALL CSS for chapter + quiz pages
│   ├── shared-nav.js           ← Theme switcher + tour + dropdown nav
│   └── quiz-engine.js          ← Full quiz engine (reads QUESTIONS/QUIZ_KEY from page)
├── _dev/
│   └── ARCHITECTURE.md         ← This file
├── _template.html               ← Copy→rename to create a new chapter
├── _quiz_template.html          ← Copy→rename to create a new quiz
├── index.html                   ← Course catalog (self-contained styles)
├── Relevant Memory Information/ ← Project docs for AI/author reference
└── Courses/
    ├── Electronics_Basics/
    │   ├── chapter_01.html
    │   ├── chapter_02.html
    │   ├── quiz.html
    │   └── shared.js            ← Stub only (superseded by assets/shared-nav.js)
    └── C_Programming/
        ├── chapter_01.html
        ├── quiz.html
        └── shared.js            ← Stub only (superseded by assets/shared-nav.js)
```

Raw source material (PDFs, zyBooks exports) lives OUTSIDE the repo in:
`_Drop Source Content Here/Raw_[CourseName]/` — **must be read before writing any chapter content**; not a runtime dependency.

All chapter content must be derived from these source files. Do not generate content from general knowledge. See `AUTHORING_GUIDE.md` for details.

## Why Shared Assets

At 50+ courses × 25 chapters each = 1,250+ chapter files, plus 50+ quiz files.
Without sharing, every file carries ~260 lines of duplicate CSS + 200 lines of duplicate JS.
With `assets/`, each file shrinks by ~460 lines — roughly 50% smaller on disk and in context windows.

This directly reduces token cost when an AI assistant reads files during development.

## Chapter File Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Universal Study Guide · [SUBJECT] — Chapter [N]: [TITLE]</title>
<link rel="stylesheet" href="../../assets/shared.css">
</head>
<body data-theme="dark">

<!-- HEADER, CROSS-NAV, PROGRESS BAR, TOUR OVERLAY (copy from template) -->

<div class="layout">
  <nav class="sidebar"> ... </nav>
  <main class="main-content"> ... </main>
</div>

<script>
'use strict';
// ── CUSTOMIZE: chapter identity ────────────────────────────────────
const CHAPTER_ID = 'usg-XX-N';          // unique localStorage key
const ALL_BLOCKS  = ['anim-1','mc-1']; // every tracked block id
const SEC_BLOCKS  = { 1:['anim-1'], 2:['mc-1'] }; // section → blocks

// ── Keep: progress, sidebar, animation, MC, SA, challenge, reset ──
// ── Remove: THEMES/updatePie/setTheme/initTheme (moved to shared-nav.js) ──

let prog = JSON.parse(localStorage.getItem(CHAPTER_ID) || '{}');
function markDone(id) { ... }
function renderProgress() { ... }
// ... rest of chapter-specific JS ...
renderProgress();
</script>
<script src="../../assets/shared-nav.js"></script>
</body>
</html>
```

**Key rules:**
- `<link rel="stylesheet" href="../../assets/shared.css">` — no inline `<style>` block
- Inline `<script>` contains ONLY chapter-specific logic (progress, MC data, challenges)
- `shared-nav.js` loads LAST — it initialises theme (reads localStorage) + tour + dropdown
- Do NOT put `THEMES`, `updatePie`, `setTheme`, or `initTheme` in the inline script

## Quiz File Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Universal Study Guide · [SUBJECT] — Practice Quiz</title>
<link rel="stylesheet" href="../../assets/shared.css">
</head>
<body data-theme="dark">

<!-- HEADER (no tour-btn), CROSS-NAV -->

<main class="quiz-main">
  <!-- Setup / Quiz / Results screens (copy from _quiz_template.html) -->
</main>

<script>
'use strict';
// ── CUSTOMIZE ─────────────────────────────────────────────────────
const QUESTIONS = [
  // { id, topic, chapter, text, formula?, choices:{a,b,c,d?}, correct, explanation }
];
const CHAPTER_NAMES = { 1: 'Ch 1: Title' }; // chapter number → display name
const QUIZ_KEY = 'usg-XX-quiz';               // unique localStorage key
</script>
<script src="../../assets/shared-nav.js"></script>
<script src="../../assets/quiz-engine.js"></script>
</body>
</html>
```

**Key rules:**
- `QUESTIONS`, `CHAPTER_NAMES`, `QUIZ_KEY` stay inline — engine reads them as globals
- `shared-nav.js` loads before `quiz-engine.js` (theme must initialise first)
- `quiz-engine.js` calls `buildChapterFilter()` and `renderHistory('history-setup')` at load time
- `chapter` field on questions: integer matching a key in `CHAPTER_NAMES`
- Chapter filter chips auto-hide when all questions share the same chapter

## Question Object Format

All questions share these fields:

```javascript
{
  id:          'q01',           // unique string, stable across sessions
  type:        'mc',            // 'mc' (default, safe to omit) | 'text'
  topic:       "Ohm's Law",     // short label shown above the card
  chapter:     1,               // integer key in CHAPTER_NAMES
  text:        "What is ...",   // HTML allowed (<code>, <strong>, SVG, etc.)
  formula:     'V = I × R',     // optional hint — null to omit
  explanation: 'Because ...',   // HTML allowed — shown after answer checked
}
```

### MC questions (`type: 'mc'` or omit `type`)

```javascript
{
  // ...shared fields...
  choices: { a:'...', b:'...', c:'...', d:'...' },  // d is optional
  correct: 'b',                 // key of the correct choice ('a'–'d')
}
```

### Text questions (`type: 'text'`)

```javascript
{
  // ...shared fields...
  correct:    '14.20',          // expected answer string; comparison is case-insensitive + trimmed
  tolerance:  0.01,             // optional number — enables numeric comparison within ±tolerance
                                // omit or null for exact string match
  badAnswers: [                 // optional — known wrong inputs with custom hints
    { value: '7.89', hint: 'That applies the voltage divider formula, which is for series circuits.' },
  ],
  // Engine also auto-detects off-by-decimal-point errors for numeric questions.
}
```

## Adding a New Course

1. Create `Courses/CourseName/` directory
2. Copy `_template.html` → `Courses/CourseName/chapter_01.html`
3. Customize the CUSTOMIZE markers: title, subject, chapter number, CHAPTER_ID, ALL_BLOCKS, SEC_BLOCKS, section content
4. Copy `_quiz_template.html` → `Courses/CourseName/quiz.html`
5. Customize QUESTIONS, CHAPTER_NAMES, QUIZ_KEY
6. Add course card to `index.html` with `href="Courses/CourseName/chapter_01.html"` (update COURSES array in JS too)
7. **No `shared.js` needed** — chapter and quiz files load `../../assets/shared-nav.js` directly

## Symbol Policy

No emojis anywhere in HTML, JS, or template files. ASCII symbols and plain Unicode characters are both allowed. Emojis render as large colored glyphs on modern OSes and conflict with the design system.

Current conventions in use:

| Old | Replacement | Context |
|-----|-------------|---------|
| 🎉 `&#127881;` | _(removed)_ | Completion banner |
| 🔀 `&#x1F500;` | _(removed)_ | Randomize button |
| ⚡ `&#9889;` | `/!\` | Weakness Focus button |
| 💡 `&#128161;` | `(i)` | Hint button |
| 👀 `&#128065;` | _(removed)_ | Show Answer button |

---

## Storage Key Conventions

| Page | Key pattern | Example |
|------|-------------|---------|
| Chapter | `usg-{course}{N}` | `usg-eb1`, `usg-c1` |
| Quiz perf/log | `usg-{course}-quiz` | `usg-eb-quiz`, `usg-c-quiz` |
| Theme | `usg-theme` | shared across all pages |

**Course prefix registry** (add when creating new courses):

| Prefix | Course |
|--------|--------|
| `eb` | Electronics Basics |
| `c` | C Programming |

## Token Budget Savings (Motivation)

| File type | Before | After | Saved |
|-----------|--------|-------|-------|
| Chapter HTML | ~650 lines | ~390 lines | ~260 lines |
| Quiz HTML | ~670 lines | ~380 lines | ~290 lines |
| Per session read | reads full CSS every time | reads only once (shared.css) | — |

At 1,250 chapters + 50 quizzes: **~325,000 fewer lines** of duplicated code across the project.
An AI assistant reading 10 chapter files per session saves ~2,600 lines of context.
