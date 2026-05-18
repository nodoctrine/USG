# Session Brief — 2026-05-16b
Handoff context for next chat. Do not duplicate content that lives in the key files below — just point to them.

## This Session

### Priority #2 — Centralized Cross-Nav (COMPLETE)
- Added `COURSES` table to `assets/shared-nav.js` (lines 137–175): course name, folder, entry page, and pages array
- Added `buildCrossNav()` IIFE (lines 177–205): reads `window.location.pathname`, finds current course/page, injects full nav HTML — runs before dropdown event listeners so dynamically injected buttons are wired correctly
- Replaced full static `<nav class="cross-nav">…</nav>` block with `<nav class="cross-nav"></nav>` in all 12 chapter/quiz HTML files and `_template.html`
- Updated `_dev/AUTHORING_GUIDE.md` and `_dev/mybooks_format_spec.md` to reflect new workflow
- **Adding a new chapter now requires one line in `COURSES.pages` — no HTML edits in any other file**

### C Programming Chapter 2 — Test + Discovery
- Added `{ file: 'chapter_02.html', label: 'Chapter 2' }` to C Programming's `COURSES.pages` (between Ch1 and quiz) to test the dynamic nav
- Chapter 0 (`chapter_00.html`) **excluded from `COURSES` for now** — it will be renumbered to its correct chapter number when the full course outline is known; do not link it until then
- Created `Courses/C_Programming/chapter_02.html` as a stub — **content is WRONG** (invented "Control Flow" topic); needs to be deleted and rebuilt from source material

### Source Content Discovery
- Found raw zyBooks source HTML at `C:\Users\lappy\Documents\Claude Study Guides\MyBooks\_Drop Source Content Here\Raw_C_Programming\`
- Files named `chNN_secNN.html` — ch01 has sec01–32, ch02 has sec01–21, ch03 has sec01+
- **Chapter 2 source covers "Variables and Data Types"** (int, identifiers, arithmetic, double, const, math functions, integer division/modulo, type conversions, binary, char, strings, overflow, unsigned, random numbers, printf/scanf, debugging)
- Added `_dev/_REMINDER.md` entry: source folder is the primary reference for all chapter content
- Saved memory file: `project_source_content.md`

## Current State
| Course             | Chapters              | Quiz Q | Notes                          |
|--------------------|-----------------------|--------|--------------------------------|
| Electronics Basics | Ch 1–5                | 44     |                                |
| C Programming      | Ch 1, Ch 2 (stub)     | 30     | Ch2 content wrong — rebuild    |
| How-To Guide       | Ch 1–2                | —      |                                |

`chapter_00.html` (C Programming capstone) exists but is excluded from nav pending renumbering.

## Immediate Next Step
**Rebuild `Courses/C_Programming/chapter_02.html`** from source:
- Delete current stub (wrong content)
- Read `ch02_sec01.html` through `ch02_sec21.html` from source folder
- Consolidate 21 source sections into ~4–5 USG sections
- Use source material as authoritative content reference

Open questions to resolve with user before rebuilding:
1. How many USG sections should Ch2 have, and which source sections map to each?
2. Use exact source wording or rewrite in USG style?

## Priority Backlog (unchanged from last session)
1. **Auto-derive ALL_BLOCKS / SEC_BLOCKS from DOM** — eliminate manual boilerplate per chapter
2. ~~Centralize cross-nav config~~ — **DONE this session**
3. **Storage refactor** — implement `window.USG` abstraction layer per `_dev/STORAGE_PLAN.md`
4. **KaTeX math rendering** — prerequisite for Wikipedia-sourced science/engineering content
5. **Mobile pass** — hamburger menu for sidebar

## Key Files
- `_dev/AUTHORING_GUIDE.md` — step-by-step for adding chapters, courses, quiz questions
- `_dev/mybooks_format_spec.md` — system spec, design rules, implementation status table
- `_dev/ARCHITECTURE.md` — file/folder structure and technical reference
- `_dev/STORAGE_PLAN.md` — storage abstraction design (window.USG)
- `_dev/_REMINDER.md` — standing rules for every session
- `assets/shared-nav.js` — CONFIG + COURSES table + all chapter engine logic
- `C:\Users\lappy\Documents\Claude Study Guides\MyBooks\_Drop Source Content Here\` — primary source for all chapter content
