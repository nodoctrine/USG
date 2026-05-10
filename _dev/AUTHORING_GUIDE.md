# Universal Study Guide — Authoring Guide

How to create a new chapter from scratch using the template.

---

## Quick Start

1. Copy `_template.html` to your course folder and rename it (e.g., `Courses/C_Programming/chapter_02.html`)
2. Open the file and replace all `[PLACEHOLDER]` values
4. Build your sections following the block patterns below
5. Update `ALL_BLOCKS`, `SEC_BLOCKS`, `MC_DATA`, `CHALLENGES` in the JS section
6. Open in a browser — progress should track immediately

---

## Architecture: Where Logic Lives

**`assets/shared-nav.js`** owns all behavior. It contains:
- `CONFIG` — single source of truth for badge labels, chevron symbols, progress strings, feedback text, reset prompts, and theme settings. Edit one value; every chapter updates.
- All engine functions: `markDone`, `renderProgress`, `animNext/Prev`, `handleMC`, `checkSA`, `showSA`, `checkChallenge`, `resetChallenge`, `resetChapter`, `resetCourse`, IntersectionObserver for sidebar.

**The chapter's inline `<script>`** is data-only — no functions, no hardcoded strings. It defines six constants and three mutable state variables that `shared-nav.js` reads after it loads.

**`assets/shared.css`** defines layout heights as CSS custom properties (`--header-h`, `--nav-h`, `--progress-h`). All sticky offsets use `calc(var(--header-h) + var(--nav-h))` so changing a height requires editing exactly one variable.

---

## JS Constants: What Each One Does

These are the only things that **must** change per chapter. All logic is in `shared-nav.js`.

### `CHAPTER_ID`
The localStorage key for this chapter's progress. Format: `mb-{courseCode}{chapterNumber}`

```js
const CHAPTER_ID = 'mb-c2';   // C Programming, Chapter 2
const CHAPTER_ID = 'mb-eb1';  // Electronics Basics, Chapter 1
```

Course codes defined so far: `c` (C Programming), `eb` (Electronics Basics).

### `COURSE_PREFIX`
The localStorage prefix for the entire course. `resetCourse()` in `shared-nav.js` removes every key that starts with this string, clearing all chapters at once.

```js
const COURSE_PREFIX = 'mb-eb';  // clears mb-eb1, mb-eb2, mb-eb3, ...
const COURSE_PREFIX = 'mb-c';   // clears mb-c1, mb-c2, ...
```

Must match the course-code portion of `CHAPTER_ID`.

### `ALL_BLOCKS`
Array of every tracked block ID in the order they appear in the HTML. Only activities are tracked — Reading and Figure blocks are not.

```js
const ALL_BLOCKS = ['anim-1', 'mc-1', 'sa-1', 'chal-1'];
```

The `remaining-pill` initial value in the HTML should equal `ALL_BLOCKS.length`.

### `SEC_BLOCKS`
Maps section number (integer) → array of block IDs in that section. Used to update the sidebar section counts.

```js
const SEC_BLOCKS = {
  1: ['anim-1'],
  2: ['mc-1', 'sa-1'],
  3: ['chal-1']
};
```

Every block in `ALL_BLOCKS` must appear in exactly one section. Total of all arrays must equal `ALL_BLOCKS.length`.

### `MC_DATA`
One entry per question (not per block). Key format: `mcq-{blockN}-{questionN}`.

```js
const MC_DATA = {
  'mcq-1-1': {
    correct: 'c',   // value of the correct radio input
    ok:  '<strong>Correct!</strong> Explanation of why it is right.',
    bad: '<strong>Not quite.</strong> Explanation of the right answer.'
  },
  'mcq-1-2': { correct: 'b', ok: '...', bad: '...' }
};
```

The `handleMC()` function extracts the block number from the key (`mcq-1-*` → `mc-1`) and marks the block done when all its questions are answered.

### `CHALLENGES`
One entry per challenge block.

```js
const CHALLENGES = {
  'chal-1': {
    tests: [
      { name: 'Description shown to user', fn: c => /pattern/.test(c) }
    ],
    defaultCode: `Starter text shown in the textarea`
  }
};
```

**Test quality guidelines:**
- Use `\b` word boundaries for numeric answers: `/\b42\b/`
- Require the exact expected number — not a superset
- Prefer testing a specific pattern over a loose value
- Multiple tests = granular feedback; each test result shows separately

---

## Block Patterns

### Reading Block (not tracked, no ID needed)

```html
<div class="block block-reading">
  <p><span class="term">Key term</span> definition text. More explanation.</p>
  <ul>
    <li>Bullet with <code>inline code</code></li>
  </ul>
  <p>Second paragraph.</p>
</div>
```

### Figure Block (not tracked, no ID needed)

```html
<div class="block block-figure">
  <div class="block-header">
    <span class="block-label">Figure</span>
    <span class="block-title-text">Figure N.M — Title</span>
  </div>
  <div class="figure-body">
    <!-- table, styled divs, ASCII art, or code view -->
  </div>
  <div class="figure-caption">Optional caption text.</div>
</div>
```

For code figures, use the `.code-view` / `.ln` / `.cc` structure with span-based syntax highlighting classes: `.kw` `.str` `.cmt` `.num` `.fn` `.tp` `.pp`

### Lecture Block (tracked, ID = `anim-N`)

```html
<div class="block block-anim" id="anim-1">
  <div class="act-header">
    <span class="act-badge badge-part">Lecture</span>
    <span class="act-title">N.S.N — Animation Title</span>
    <span class="chevron pend" id="chev-anim-1">○</span>
  </div>
  <div class="act-body">
    <div class="anim-stage">
      <div class="anim-frame active" data-cap="Caption for frame 1.">
        <strong>Step 1</strong><br><br>
        Content here. Use HTML freely.
      </div>
      <div class="anim-frame" data-cap="Caption for frame 2.">
        <strong>Step 2</strong><br><br>
        Content here.
      </div>
      <!-- add more frames as needed -->
    </div>
    <div class="anim-caption" id="anim-cap-1">Caption for frame 1.</div>
    <div class="anim-controls">
      <button class="btn btn-ghost"   onclick="animPrev('anim-1')">← Prev</button>
      <button class="btn btn-primary" onclick="animNext('anim-1')">Next →</button>
      <span class="anim-progress" id="anim-prog-1">1 / 2</span>
    </div>
  </div>
</div>
```

- The initial `anim-progress` text should match the actual frame count
- The first frame must have class `active`
- Completion triggers automatically when the last frame is reached

### Lecture Review Block — Multiple Choice (tracked, ID = `mc-N`)

```html
<div class="block block-mc" id="mc-1">
  <div class="act-header">
    <span class="act-badge badge-part">Lecture Review</span>
    <span class="act-title">N.S.N — Question Block Title</span>
    <span class="chevron pend" id="chev-mc-1">○</span>
  </div>
  <div class="act-body">

    <div class="mc-question" id="mcq-1-1">
      <div class="q-text"><span class="q-num">1)</span> Question text?</div>
      <div class="choices">
        <label class="choice"><input type="radio" name="mcq-1-1" value="a"> <span>Choice A</span></label>
        <label class="choice"><input type="radio" name="mcq-1-1" value="b"> <span>Choice B</span></label>
        <label class="choice"><input type="radio" name="mcq-1-1" value="c"> <span>Choice C (correct)</span></label>
      </div>
      <div class="explanation" id="exp-mcq-1-1"></div>
    </div>

    <!-- repeat mc-question div for each additional question -->

  </div>
</div>
```

- `name` attribute on radios must match the question `id` exactly
- `value` letters correspond to MC_DATA `correct` field
- All questions in one block share the same `mc-N` block ID; block is done when all questions answered

### Lecture Review Block — Short Answer (tracked, ID = `sa-N`)

```html
<div class="block block-sa" id="sa-1">
  <div class="act-header">
    <span class="act-badge badge-part">Lecture Review</span>
    <span class="act-title">N.S.N — SA Title</span>
    <span class="chevron pend" id="chev-sa-1">○</span>
  </div>
  <div class="act-body">
    <div class="q-text">Question text?</div>
    <div class="sa-row">
      <input type="text" class="sa-input" id="sa-input-1" placeholder="answer" autocomplete="off" spellcheck="false">
      <button class="btn btn-primary" onclick="checkSA('sa-1', ['answer','alt answer'], '<strong>Correct!</strong> Explanation.')">Check</button>
      <button class="btn btn-ghost"   onclick="showSA('sa-1', 'answer', 'The answer is X.')">Show Answer</button>
    </div>
    <div class="explanation" id="exp-sa-1"></div>
  </div>
</div>
```

- `sa-input-N` ID must match the block number (e.g., `sa-2` → `sa-input-2`)
- `checkSA` third arg accepts an array of lowercase accepted answers; comparison is case-insensitive
- `showSA` second arg is the display value shown in the input

### Activity Block (tracked, ID = `chal-N`)

```html
<div class="block block-chal" id="chal-1">
  <div class="act-header">
    <span class="act-badge badge-chal">Activity</span>
    <span class="act-title">N.S.N — Challenge Title</span>
    <span class="chevron pend" id="chev-chal-1">○</span>
  </div>
  <div class="act-body">
    <div class="chal-instructions">
      What the user needs to do.
    </div>
    <div class="editor-wrap">
      <div class="editor-topbar"><span>filename.ext</span><span>LANGUAGE</span></div>
      <textarea class="editor" id="ed-chal-1" spellcheck="false">starter scaffold text</textarea>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="checkChallenge('chal-1')">▶ Check Answer</button>
      <button class="btn btn-ghost"   onclick="resetChallenge('chal-1')">Reset</button>
    </div>
    <div class="chal-output" id="out-chal-1"></div>
  </div>
</div>
```

---

## Sidebar Entry (one per section)

```html
<a href="#sec-2" class="sidebar-link" data-sec="2">
  N.2 Section Title
  <span class="s-count" id="sc-2">0/3</span>
</a>
```

- `data-sec` must match the integer in `SEC_BLOCKS`
- Initial count text `0/N` where N = number of tracked blocks in that section
- The `IntersectionObserver` in the JS will auto-mark active section on scroll

---

## Cross-Nav: Keeping It Current

The cross-nav uses **dropdown menus** (`.cn-dropdown`). The CSS and JS for the dropdowns are injected by `shared.js` — no per-chapter code needed. The HTML structure is:

```html
<nav class="cross-nav">
  <span class="cross-nav-label">Course:</span>
  <div class="cn-dropdown">
    <button class="cn-drop-btn" aria-haspopup="true" aria-expanded="false">Current Course &#9662;</button>
    <div class="cn-drop-menu">
      <a class="cn-drop-item" href="../OtherCourse/chapter_01.html">Other Course</a>  <!-- sibling inside Courses/ -->
    </div>
  </div>
  <div class="cross-nav-divider"></div>
  <span class="cross-nav-label">Chapter:</span>
  <div class="cn-dropdown">
    <button class="cn-drop-btn" aria-haspopup="true" aria-expanded="false">Chapter N &#9662;</button>
    <div class="cn-drop-menu">
      <a class="cn-drop-item" href="chapter_01.html">Chapter 1</a>
      <!-- add more as chapters are created -->
    </div>
  </div>
</nav>
```

Every time a new course or chapter is added, **update the cross-nav in every existing chapter file**.

For a new chapter within the same course — add a `.cn-drop-item` to the chapter dropdown in every chapter of that course:
```html
<a class="cn-drop-item" href="chapter_02.html">Chapter 2</a>
```

For a new course — add a `.cn-drop-item` to the course dropdown in every chapter of every other course:
```html
<a class="cn-drop-item" href="../NewCourse/chapter_01.html">New Course Name</a>
```

> **Why `position: fixed` on the menu?** The `.cross-nav` has `overflow-x: auto`, which clips `position: absolute` descendants. The dropdown JS uses `getBoundingClientRect()` to place the menu at the correct viewport coordinates.

---

## Symbol Usage

- **No emojis** — not in button labels, banners, JS strings, or content. They render as large colored glyphs and conflict with the visual style.
- ASCII symbols and plain Unicode characters are both fully allowed as substitutes.

---

## Common Mistakes

| Mistake | Result | Fix |
|---|---|---|
| Block ID in HTML doesn't match `ALL_BLOCKS` | Block never marks done | Keep IDs identical |
| Question `id` and radio `name` don't match | `handleMC` can't find the question | They must be identical strings |
| `SEC_BLOCKS` missing a block ID | Section count and sidebar never complete | Every tracked block must appear exactly once |
| `sa-input-N` number doesn't match block number | `checkSA` reads wrong input | N must match (e.g., `sa-3` → `sa-input-3`) |
| `data-theme` on `<html>` tag | Theme inconsistency | Only set `data-theme` on `<body>` |
| Forgot to update `remaining-pill` count | Shows wrong number initially | Count = `ALL_BLOCKS.length` |
| Copied existing chapter instead of template | Leftover content / ID collisions | Always start from `_template.html` |

---

## Adding a New Chapter (Checklist)

The quiz and index are separate files — they are **not** updated automatically when a chapter file is created. Every new chapter requires all of the following:

**The chapter file itself**
1. Copy `_template.html` to the course folder and rename it (e.g., `chapter_02.html`)
2. Replace all `[PLACEHOLDER]` values
3. Set `CHAPTER_ID`, `COURSE_PREFIX`, `ALL_BLOCKS`, `SEC_BLOCKS`, `MC_DATA`, `CHALLENGES`
4. Set `remaining-pill` count = `ALL_BLOCKS.length`

**Navigation — within the course**
5. Set the new chapter's "Previous Chapter" nav to the chapter before it
6. Set the new chapter's "Next Chapter" nav to the chapter after it (or `<span class="nav-btn disabled">` if it is the last)
7. Update the **previous** chapter's "Next Chapter" nav to point to the new chapter
8. Update the **next** chapter's "Previous Chapter" nav to point to the new chapter (if one exists)
9. Update the completion banner of the chapter that now leads into the new one

**Cross-nav dropdowns — in every chapter of this course**
10. Add a `<a class="cn-drop-item">` for the new chapter in every other chapter's chapter dropdown

**`index.html`**
11. Add a `<a class="chapter-row">` entry for the new chapter with the correct `data-key` and `data-total`
12. Place it in the correct position (matching the intended chapter order)

**`quiz.html`**
13. Add quiz questions for the new chapter (`chapter: N` field)
14. Add the chapter to `CHAPTER_NAMES` (`N: 'Ch N: Title'`)
15. Update the quiz question-count badge in `index.html` to reflect the new total

> **Why the quiz step is easy to miss:** `quiz.html` is a completely separate file. Creating a chapter file has no effect on the quiz. Treat quiz questions as part of the chapter deliverable — write them in the same session the chapter is built.

---

## Placeholder Chapter Numbers

When a chapter's final position in the course is not yet known (e.g., a capstone chapter being written before the middle chapters exist), use `chapter_00.html` as a placeholder filename. The file still needs a valid `CHAPTER_ID` (e.g., `mb-c0`).

Nav setup for a placeholder last chapter:
- Its own nav: Previous → the chapter currently before it; Next = `<span class="nav-btn disabled">`
- The chapter before it: its Next nav points to this placeholder
- When new chapters are inserted between them, update both nav links accordingly

The chapter dropdown and `index.html` card should list the placeholder in its intended position (last), not by filename sort order.

---

## Adding a New Course

1. Create folder: `Courses/[CourseName]/`
2. Copy `_template.html` → `Courses/[CourseName]/chapter_01.html`
3. Choose a two-letter course code (check existing codes: `c`, `eb`)
4. Set `CHAPTER_ID = 'mb-{code}1'`
5. Update cross-nav in **every existing chapter** to include a link to the new course's Chapter 1
6. Add the course card to `index.html` with `href="Courses/[CourseName]/chapter_01.html"`
7. Add the new course to the Implementation Status table in the format spec
8. **No `shared.js` needed** — chapters load `../../assets/shared-nav.js` directly

---

## Naming Reference

| Element | Convention | Example |
|---|---|---|
| Chapter files | `chapter_NN.html` | `chapter_01.html` |
| Section IDs | `sec-N` | `sec-3` |
| Animation block | `anim-N` | `anim-2` |
| Animation caption | `anim-cap-N` | `anim-cap-2` |
| Animation progress | `anim-prog-N` | `anim-prog-2` |
| MC block | `mc-N` | `mc-3` |
| MC question | `mcq-{blockN}-{qN}` | `mcq-3-2` |
| MC explanation | `exp-mcq-{blockN}-{qN}` | `exp-mcq-3-2` |
| SA block | `sa-N` | `sa-1` |
| SA input | `sa-input-N` | `sa-input-1` |
| SA explanation | `exp-sa-N` | `exp-sa-1` |
| Challenge block | `chal-N` | `chal-2` |
| Challenge editor | `ed-chal-N` | `ed-chal-2` |
| Challenge output | `out-chal-N` | `out-chal-2` |
| Chevron | `chev-{blockId}` | `chev-anim-1`, `chev-mc-2` |
| Sidebar count | `sc-N` | `sc-4` |
| localStorage key | `mb-{courseCode}{chapterN}` | `mb-eb2` |
