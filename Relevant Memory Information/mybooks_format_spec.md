# Universal Study Guide — Format Specification

## What This Is

Universal Study Guide is an interactive textbook system. Each chapter is a single HTML file that opens in any browser with no server required. The visual design is original and the content structure supports a wide range of subjects.

The system is designed so that Claude Code can generate a complete textbook for any subject by following this spec.

---

## Core Design Philosophy

**Refactor effort must not scale with chapter count.**

When a UI feature, style, or behavior needs to change, it should require editing the fewest possible files — ideally one. Before adding any code to a chapter file, ask: *will this need to change across all chapters someday?* If yes, it belongs in a shared file, not inlined per chapter.

Practical rules that follow from this:

- Code that is identical across chapters lives in `assets/` (CSS and JS), not copy-pasted into each chapter
- Chapter files only contain what is genuinely unique to that chapter: content, section structure, progress block IDs, and chapter-specific JS constants
- Shared files use relative local paths — not CDN links — so portability is preserved and files still open by double-click

Shared assets: `assets/shared.css` (all styles), `assets/shared-nav.js` (theme + tour + nav), `assets/quiz-engine.js` (quiz logic). Adding a new chapter means two tags: `<link rel="stylesheet" href="../../assets/shared.css">` and `<script src="../../assets/shared-nav.js"></script>`.

---

## File & Folder Structure

```
Universal Study Guide/          ← GitHub repo root
  _template.html                ← Canonical starter for any new chapter
  _quiz_template.html           ← Canonical starter for any new quiz
  index.html                    ← Course catalog (self-contained)
  assets/
    shared.css                  ← ALL page CSS (~260 lines, shared across all chapters + quizzes)
    shared-nav.js               ← Theme switcher + tour + dropdown nav (loaded last in chapters)
    quiz-engine.js              ← Full quiz engine (loaded after shared-nav.js in quizzes)
  Courses/
    [CourseName]/
      chapter_01.html
      chapter_02.html
      quiz.html
      shared.js                 ← One-line stub only; superseded by assets/shared-nav.js
  Relevant Memory Information/
    mybooks_format_spec.md      ← This file
  _dev/
    ARCHITECTURE.md             ← Technical architecture and file format reference
    AUTHORING_GUIDE.md          ← Step-by-step guide to create new chapters
```

Raw source material (PDFs, zyBooks exports) lives OUTSIDE the repo in `_Drop Source Content Here/`.

- One folder per course, all under `Courses/`
- One HTML file per chapter; one quiz file per course
- All CSS/shared JS lives in `assets/` — chapter files contain ONLY chapter-specific logic
- Asset paths from course files are always `../../assets/` (two levels up through `Courses/[Name]/`)
- All files open correctly by double-clicking in Windows Explorer — no server needed
- **Always start a new chapter from `_template.html`** — do not copy an existing chapter

---

## Page Structure

Each chapter file contains:

1. **Page header** — subject name, chapter number, chapter title + UI controls (progress, theme, tour)
2. **Cross-course navigation bar** — always present; links between all courses and all chapters
3. **Progress bar** — thin colored bar directly below the cross-nav
4. **Section list** — all sections of the chapter rendered top to bottom
5. **Each section** contains a section title followed by one or more content blocks

```
[Chapter Header]           ← sticky, 54px, z-index 200
[Cross-Course Nav Bar]     ← sticky, 36px, top: 54px, z-index 198
[Progress Bar]             ← sticky, 4px,  top: 90px, z-index 197
[Completion Banner]        ← non-sticky, appears at 100%
  [Section 1 Title]
    [Content Block]
    [Content Block]
    ...
  [Section 2 Title]
    [Content Block]
    ...
```

**Sticky offset rule:** Because the header (54px) and cross-nav (36px) are both sticky, all elements that must clear them use `top: 90px`. This value must be updated if the header or cross-nav height changes.

---

## Content Block Types

Every piece of content is one of six types.

### 1. Reading Block
Plain explanatory text. May contain:
- Paragraphs with **bold key terms** (highlighted on first use via `.term` class)
- Bullet and numbered lists
- Inline code (`like_this`)

No interactivity. Not tracked. Just reads like a textbook page.

### 2. Figure / Diagram Block
A titled box with a left accent border. Used to show a static code sample, table, diagram, or formula reference without asking the reader to do anything.

Structure:
- Header bar: label "Figure" + title "Figure N.M — Title"
- Body: code view, HTML table, or styled content
- Optional caption below

Not tracked.

### 3. Lecture
A step-through visual that walks the reader through a concept. The reader clicks "Next" / "Prev" to advance through frames. Each frame shows a state change with a caption.

Completion: marked done when the reader reaches the last frame.
Block ID prefix: `anim-N`

### 4. Lecture Review — Multiple Choice
One or more questions, each with 3–5 radio choices. On selection: immediate feedback (green correct / red wrong) + explanation paragraph.

Completion: marked done when all questions in the block are answered.
Block ID prefix: `mc-N`
Question ID format: `mcq-{blockN}-{qN}` (e.g., `mcq-1-1`, `mcq-1-2`)

### 5. Lecture Review — Short Answer
A text input question with a Check button and a Show Answer button.

Completion: marked done when checked (correct or not) or answer is shown.
Block ID prefix: `sa-N`
Input ID: `sa-input-{N}` where N matches the block number

### 6. Activity — Calculation / Coding Lab
An open-ended exercise with a textarea. The reader writes or fills in their work, then clicks "Check Answer" to run regex-based test cases against their input.

Structure:
- Instructions
- Textarea (pre-filled with a scaffold)
- Check Answer + Reset buttons
- Pass/fail output panel

Completion: marked done when all test cases pass.
Block ID prefix: `chal-N`
Editor ID: `ed-chal-N` | Output ID: `out-chal-N`

> **Challenge test quality:** Regex tests should be specific enough to avoid false positives. Use word boundaries (`\b`) and require the exact expected value. For math challenges, require the numeric answer as a standalone number.

---

## Completion & Progress Tracking

Progress is tracked in `localStorage` so it persists between browser sessions on the same machine.

### Block-level
Each tracked block has a chevron indicator in its top-right corner:
- **Gray ○** — not yet attempted
- **Green ✓** — completed

### Section-level
Each section in the sidebar shows a `done/total` pill (e.g. `1/2`). When all blocks in a section are done, the pill turns green and shows ✓.

### Chapter-level
- **Progress bar** — thin colored bar fills as blocks are completed
- **% complete pill** — shows the overall percentage in the header
- **Remaining pill** — shows how many activities are left; hidden when all done
- **Completion banner** — full-width green banner at 100% complete, with link to next chapter

### localStorage Key Convention

All keys follow the pattern: `mb-{courseCode}{chapterNumber}`

| Course | Code | Example key |
|---|---|---|
| C Programming | `c` | `mb-c1`, `mb-c2` |
| Electronics Basics | `eb` | `mb-eb1`, `mb-eb2` |
| Theme preference | — | `mb-theme` |

`resetCourse()` clears all keys starting with the course prefix (e.g., `mb-c` clears all C Programming chapters). New courses must use a unique two-letter code to avoid key collisions.

### Reset Controls
Two reset buttons sit at the bottom of the sidebar:
- **Reset this chapter** — clears progress for the current chapter only
- **Reset entire course** — clears `localStorage` for all chapters in the course (matched by course key prefix)

Both prompt for confirmation before proceeding.

---

## Navigation

### Within a chapter
- A sticky sidebar lists all sections with done/total counts
- Clicking a section name scrolls to it (via `href="#sec-N"`)
- Completed sections show a checkmark and green color in the sidebar
- An `IntersectionObserver` auto-highlights the active section as you scroll

### Between chapters (same course)
- "Previous Chapter" / "Next Chapter" buttons at top and bottom of main content
- First chapter: Previous button is a disabled `<span class="nav-btn disabled">`
- Links are simple `<a href="chapter_02.html">` — no server needed

### Cross-course navigation (always present)
A sticky bar at `top: 54px` (directly below the header) shows:
- **Course selector** — links to Chapter 1 of every other course; current course shown as a non-linked `<span class="cross-nav-link active">`
- **Chapter selector** — links to all available chapters in the current course; current chapter shown as a non-linked `<span>`

When a new course or chapter is added, **every existing chapter file** must have its cross-nav updated to include the new link. This is the one structural change that does scale with count; keep it minimal (course name only, not full title).

```html
<nav class="cross-nav">
  <a href="../../index.html" class="cross-nav-home">← All Courses</a>
  <div class="cross-nav-divider"></div>
  <span class="cross-nav-label">Course:</span>
  <div class="cn-dropdown">
    <button class="cn-drop-btn">C Programming ▾</button>
    <div class="cn-drop-menu">
      <!-- sibling courses — one level up stays inside Courses/ -->
      <a class="cn-drop-item" href="../Electronics_Basics/chapter_01.html">Electronics Basics</a>
    </div>
  </div>
  <div class="cross-nav-divider"></div>
  <span class="cross-nav-label">Chapter:</span>
  <div class="cn-dropdown">
    <button class="cn-drop-btn">Chapter 1 ▾</button>
    <div class="cn-drop-menu">
      <a class="cn-drop-item" href="chapter_01.html">Chapter 1</a>
      <a class="cn-drop-item" href="chapter_02.html">Chapter 2</a>
    </div>
  </div>
</nav>
```

Path rules from inside `Courses/[Name]/`:
- Back to index: `../../index.html`
- Assets: `../../assets/shared.css`, `../../assets/shared-nav.js`
- Sibling course: `../OtherCourse/chapter_01.html` (one `..` stays inside `Courses/`)

---

## Visual Design Principles

MyBooks uses an original visual style with three built-in themes. Guidelines that apply to all themes:

- Clean, minimal, readable
- **No emojis anywhere in the codebase** — not in HTML, JS strings, or button labels. ASCII symbols and plain Unicode characters are both fine as substitutes. Emojis render as large colored glyphs on modern OSes and conflict with the clean visual style.
- Activity blocks have a distinct left accent border and a type label
- Color coding by activity type (consistent across themes):
  - Reading/Figure: no warm/cool accent — neutral
  - Figure: `--accent-figure` (steel blue)
  - Lecture: `--accent-warm` left border
  - Lecture Review (Multiple Choice): `--accent-warm` left border
  - Lecture Review (Short Answer): `--accent-warm` left border
  - Activity: `--accent-cool` left border

### Theme System

`data-theme` is set on `<body>`. CSS custom properties on each theme selector cascade to all children. The `<html>` tag must **not** have a `data-theme` attribute.

```html
<body data-theme="dark">   <!-- always dark on initial load; JS adjusts from localStorage -->
```

Built-in themes:
- `default` — clean light theme, neutral palette
- `dark` — dark background, high contrast (default on page load)
- `retro` — warm amber tones, Night Shift-inspired

Theme selection is saved to `localStorage` under key `mb-theme` and applies across all courses.

---

## Starting a New Chapter

**Always start from `_template.html`** — copy it to the target folder and rename it. Do not copy an existing chapter (it contains content that must be removed).

### Checklist: What to customize in `_template.html`

1. `<title>` — update subject, chapter number, and title
2. `<body data-theme="dark">` — leave as-is (dark is the default)
3. `.page-header` — update subject name and chapter title text
4. `#remaining-pill` — update initial count to match total tracked blocks
5. Cross-nav `<nav class="cross-nav">` — set active course/chapter, add links to all others
6. Sidebar links — one `<a>` per section with correct `data-sec` and `s-count` initial values
7. Chapter nav top/footer — set correct prev/next `href` values (use `<span class="nav-btn disabled">` for first chapter)
8. Completion banner — update next chapter link
9. `CHAPTER_ID` — `'mb-{courseCode}{chapterN}'`
10. `ALL_BLOCKS` — array of every tracked block ID in document order
11. `SEC_BLOCKS` — object mapping section number → array of block IDs in that section
12. `MC_DATA` — one entry per question in every MC block
13. `CHALLENGES` — one entry per challenge block with `tests[]` and `defaultCode`
14. `resetCourse()` prefix string — match the course code prefix

---

## Generating a New Textbook

To generate a textbook for any subject, Claude Code needs:

1. **This spec** (so it knows the format)
2. **A subject name, chapter outline, and course code** (two-letter key, e.g. `py` for Python)
3. **Content for each section** (either provided by the user or generated by Claude)
4. **The existing `_template.html`** (read it, substitute placeholders — do not read an existing chapter)

### Content Guidelines

- Do not use real personal names (first or last) in example code, sample output, or placeholder text
- Use neutral placeholders like `"Hello, World!"`, abstract variable names, or generic scenarios
- Figures that require images should use text-based ASCII art, styled `<div>` elements, or HTML tables — no `<img>` tags pointing to external URLs

### Section Content Targets
For each section, include:
- At least one Reading block
- At least one Figure or Animation block where relevant
- At least two Participation activities (MC or Short Answer)
- One Challenge activity if the subject has hands-on exercises

---

## Implementation Status

| Item                                                                             | Status        |
| -------------------------------------------------------------------------------- | ------------- |
| HTML/CSS/JS template (`_template.html`, `_quiz_template.html`)                   | [x] Complete    |
| All six content block types                                                      | [x] Complete    |
| localStorage progress tracking                                                   | [x] Complete    |
| Three-theme system (Light / Dark / Night Shift)                                  | [x] Complete    |
| SVG pie chart theme switcher                                                     | [x] Complete    |
| Shared asset extraction (`assets/shared.css`, `shared-nav.js`, `quiz-engine.js`) | [x] Complete    |
| Cross-course dropdown navigation                                                 | [x] Complete    |
| Practice quiz engine with chapter filter + weakness mode + history               | [x] Complete    |
| C Programming — Chapter 1                                                        | [x] Complete    |
| C Programming — Practice Quiz (25 questions)                                     | [x] Complete    |
| Electronics Basics — Chapter 1                                                   | [x] Complete    |
| Electronics Basics — Chapter 2                                                   | [x] Complete    |
| Electronics Basics — Practice Quiz (26 questions)                                | [x] Complete    |
| Architecture + Authoring docs (`_dev/`)                                          | [x] Complete    |
| GitHub repo structure (`Universal Study Guide/` root, `Courses/` subfolder)      | [x] Complete    |
| C Programming — Chapters 2+                                                      | [ ] Not started |
| Electronics Basics — Chapter 3                                                   | [x] Complete    |
| Electronics Basics — Chapter 4                                                   | [x] Complete    |
| Electronics Basics — Chapters 5+                                                 | [ ] Not started |
| Mistake hint system (common wrong answers with explanations)                     | [~] In progress |
| Text-input question type                                                         | [~] In progress |
| How-It-Do Guide (developer docs as a course)                                     | [~] In progress |
| Additional courses                                                               | [ ] Not started |
| Mobile sidebar (hamburger menu)                                                  | [ ] Not started |
| Cross-browser test (Chrome, Firefox, Edge)                                       | [ ] Not started |
