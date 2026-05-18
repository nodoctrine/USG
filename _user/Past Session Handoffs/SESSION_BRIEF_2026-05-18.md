# Session Brief — 2026-05-18
Handoff context for next chat. Do not duplicate content that lives in the key files below — just point to them.

## This Session

### Structured Chapter Template (COMPLETE)
- Created `_structured_template.html` — new canonical starting point for all new chapters
  - Format: Chapter Overview (reading block, not tracked) → per section: Intro → Lecture → Lecture Review (MC) → Activity
  - 3 tracked blocks per section (anim-N, mc-N, chal-N); number of sections varies by chapter content
- Created `_dev/CHAPTER_STRUCTURE.md` — explains the format, section count, activity variants, JS implications
- Updated `_dev/mybooks_format_spec.md` — added to status table and file structure listing
- `_template.html` kept as comprehensive all-block-types reference; `_structured_template.html` is the one authors copy

### Template CSS/JS Path Fix (COMPLETE)
- `_template.html`, `_structured_template.html`, `_quiz_template.html` were using `../../assets/` paths
- Fixed to `assets/` — these files live at the repo root, not inside `Courses/[Name]/`

### Header Injection — Item 4 (COMPLETE)
- `shared-nav.js` now injects the theme pie SVG and help dropdown into `.header-right` at runtime
- `injectHeaderControls()` IIFE runs before `initTheme()` so `.pie-seg` elements exist when `updatePie()` is called
- Help links stored in `CONFIG.help.links` — edit once, updates all chapter pages
- Dropdown only injected on chapter pages (`typeof ALL_BLOCKS !== 'undefined'`); quiz pages get SVG only
- Removed hardcoded SVG + dropdown from all 13 chapter/quiz HTML files and both chapter templates
- Item 4 from the modularization backlog is now DONE

### course_data.js — Item 1 (PARTIAL — EB ch01 only)
- Created `Courses/Electronics_Basics/course_data.js`
  - Keyed by CHAPTER_ID; each entry has `MC_DATA` and `ACTIVITIES`
  - Pattern: `const MC_DATA = COURSE_DATA[CHAPTER_ID].MC_DATA;` in the inline script
- Migrated EB chapter_01.html: inline script now 6 lines of routing data; data lives in course_data.js
- Load order: `course_data.js` → inline script → `shared-nav.js`
- Remaining chapters NOT yet migrated — EB ch01 is the proven example

### Content Architecture Decisions (discussed, not implemented)
- **course_data.js** (per course): MC_DATA + ACTIVITIES for all chapters
- **quiz_data.js** (per course): quiz question bank — separate from chapter MC questions (no integration)
- **Brief file** (`chapter_N_brief.md`): the authoring layer; drives generation of both HTML and course_data.js slice
- SA answers stay inline in HTML `onclick` attributes — no SA_DATA object to extract
- Quiz questions authored independently from chapter review questions (user sees no value in coupling them)

### Planned Features Updated
- Item 15: Manual Entry Tool — brief format designed, generation pipeline not yet built
- Item 16: Content authoring pipeline — marked TOP PRIORITY
  - Brief-to-chapter generation: brief in → chapter HTML + course_data.js slice out
  - Goal: authors never hand-edit HTML for content changes
  - See `_user/Planned Features.md` for full spec

### Manual-Entry-Tool.md Updated
- Reference changed from `_template.html` to `_structured_template.html`
- Section template updated to match structured format (Intro → Lecture → MC Review → Activity)
- SA removed from standard pattern; noted as available alternative
- Activity section now shows Variant A (formula) and Variant B (free response) clearly

## Current State
| Course             | Chapters                    | Quiz Q | Notes                                     |
|--------------------|-----------------------------|--------|-------------------------------------------|
| Electronics Basics | Ch 1–5                      | 44     | Ch1 migrated to course_data.js            |
| C Programming      | Ch 0, Ch 1, Ch 2 (stub)     | 30     | Ch2 content wrong — rebuild from source   |
| How-To Guide       | Ch 1–2                      | —      |                                           |

Inline scripts now contain only: `CHAPTER_ID`, `COURSE_PREFIX`, `ALL_BLOCKS`, `SEC_BLOCKS`, and two one-liner pulls from `COURSE_DATA` (chapters migrated to course_data.js).

## Immediate Next Steps
**Top priority — content authoring pipeline (item 16):**
- Discuss and design the brief-to-chapter generation workflow before implementing
- Questions to resolve: does AI regenerate the full HTML from brief, or patch it? How are figure placeholders handled? How does course_data.js get updated incrementally vs. full regeneration?

**Also pending:**
- Migrate remaining chapters to course_data.js (EB ch02-05, C ch00-02, HTG ch01-02)
- Create quiz_data.js for each course (same pattern as course_data.js)
- Rebuild C Programming chapter_02.html from source (Variables and Data Types; source: ch02_sec01–ch02_sec21.html)

## Key Files
- `_dev/CHAPTER_STRUCTURE.md` — structured chapter format reference
- `_dev/Manual-Entry-Tool.md` — content brief format for human authoring
- `_dev/mybooks_format_spec.md` — system spec and implementation status
- `_dev/AUTHORING_GUIDE.md` — step-by-step for adding chapters
- `_user/Planned Features.md` — feature backlog; item 16 is top priority
- `assets/shared-nav.js` — CONFIG (incl. help links) + injectHeaderControls + full engine
- `Courses/Electronics_Basics/course_data.js` — data layer example (EB ch01 migrated)
- `_structured_template.html` — canonical chapter starter
- `C:\Users\lappy\Documents\Claude Study Guides\MyBooks\_Drop Source Content Here\` — source material
