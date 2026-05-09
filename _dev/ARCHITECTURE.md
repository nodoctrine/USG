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
`_Drop Source Content Here/Raw_[CourseName]/` — used for authoring, not a runtime dependency.

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
const CHAPTER_ID = 'mb-XX-N';          // unique localStorage key
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
const QUIZ_KEY = 'mb-XX-quiz';               // unique localStorage key
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

```javascript
{
  id:          'q01',              // unique string, stable across sessions
  topic:       "Ohm's Law",        // short topic label shown on card
  chapter:     1,                  // integer key in CHAPTER_NAMES
  text:        "What is ...",      // HTML allowed
  formula:     'V = I × R',        // optional — shown as hint / auto-revealed
  choices: {
    a: 'Option A',
    b: 'Option B',
    c: 'Option C',
    d: 'Option D',                 // d is optional — omit for 3-choice questions
  },
  correct:     'b',                // key of correct choice
  explanation: 'Because ...',      // HTML allowed — shown after answer
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

## Storage Key Conventions

| Page | Key pattern | Example |
|------|-------------|---------|
| Chapter | `mb-{course}{N}` | `mb-eb1`, `mb-c1` |
| Quiz perf/log | `mb-{course}-quiz` | `mb-eb-quiz`, `mb-c-quiz` |
| Theme | `mb-theme` | shared across all pages |

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
