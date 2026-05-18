
## chapter_N.html
One file per chapter. Self-contained HTML — opens by double-click, no server. All content, all data, and all inline logic lives here. Reference is Electronics_Basics/chapter_01.html (690 lines).

---

- Block 1: Head (Lines 1-8)
	- DOCTYPE, charset, viewport meta.
	- `<title>` — subject + chapter number + chapter title.
	- Single external dependency: `<link rel="stylesheet" href="../../assets/shared.css">`.
	- No other imports in the head.

- Block 2: Page Header (Lines 11-32)
	- `.page-header` — sticky bar.
		- Left: `.header-subject` (course name) and `.header-chapter` (chapter title).
		- Right: `#remaining-pill` with hardcoded initial count, `#progress-pill`, theme pie SVG (three `<path>` segments, each with an inline `onclick="setTheme(...)"` call), help dropdown.
	- The help dropdown is fully inline here — its only link currently points to the How-To Guide chapter.

- Block 3: Cross-Nav + Progress Bar (Lines 34-39)
	- `<nav class="cross-nav"></nav>` — empty shell; `shared-nav.js` populates it at runtime.
	- `.progress-bar-track` / `.progress-bar-fill` — thin colored bar below the nav.
	- `.completion-banner` — hidden by default; shown at 100% with a hardcoded link to the next chapter.

- Block 4: Sidebar (Lines 43-53)
	- One `<a class="sidebar-link">` per section with `href="#sec-N"` and `data-sec="N"`.
	- Each link contains an `.s-count` span with a hardcoded initial `0/N` count.
	- Two reset buttons at the bottom, calling `resetChapter()` and `resetCourse()` inline.

- Block 5: Chapter Nav — Top (Lines 57-60)
	- Two buttons: Previous and Next chapter.
	- First chapter uses `<span class="nav-btn disabled">` for Previous (no link).
	- Next chapter target is a hardcoded relative href.

- Block 6: Sections (Lines 65 onward — repeating structure)
	- Each section is `<section class="section" id="sec-N">` with an `<h2 class="section-heading">`.
	- Sections contain a sequence of content blocks in any order (reading, figure, animation, MC, SA, activity).
	- Section count and block mix varies per chapter; no enforced ordering between block types within a section.

- Block 7: Reading Block
	- `.block.block-reading` — no ID, not tracked.
	- Paragraphs with `.term` spans for key terms. Bullet lists. Inline `<code>` for code snippets.
	- No interactivity.

- Block 8: Figure Block
	- `.block.block-figure` — no ID, not tracked.
	- `.block-header` with label and title text.
	- `.figure-body` — contains an HTML table, a styled `<div>` layout, or formula boxes. All visual content is inline HTML with inline `style=""` attributes throughout.
	- Optional `.figure-caption` at the bottom.
	- Diagrams use ASCII art, CSS-colored `<div>` blocks, or `<table>` — no external image files.

- Block 9: Animation Block (Lecture)
	- `.block.block-anim` — tracked; ID format `anim-N`.
	- `.act-header` with badge (`Lecture`), title, and `#chev-anim-N` chevron span.
	- `.anim-stage` contains multiple `.anim-frame` divs; the first has class `active`.
		- Each frame holds inline HTML content (styled divs, monospace art, etc.) and a `data-cap` attribute for the caption text.
	- `#anim-cap-N` below the stage shows the current frame's caption.
	- `.anim-controls` — Prev/Next buttons calling `animPrev()`/`animNext()` with the block ID inline; `#anim-prog-N` shows `1 / N`.
	- Frame visuals are fully inline — colors, layout, and content all hardcoded in `style=""` attributes.

- Block 10: Multiple Choice Block (Lecture Review)
	- `.block.block-mc` — tracked; ID format `mc-N`.
	- `.act-header` with badge (`Lecture Review`), title, `#chev-mc-N` chevron.
	- One or more `.mc-question` divs, each with ID `mcq-N-M`.
		- `.q-text` with `.q-num` prefix for the question number.
		- `.choices` — four `<label class="choice">` elements with radio inputs, values `a`/`b`/`c`/`d`.
		- Empty `#exp-mcq-N-M` div (filled by JS when answered).
	- Questions and choices are plain text inline in the HTML.
	- Correct answers and feedback strings live in the inline `<script>` (MC_DATA), not here.

- Block 11: Short Answer Block (Lecture Review)
	- `.block.block-sa` — tracked; ID format `sa-N`.
	- `.act-header` with badge, title, `#chev-sa-N` chevron.
	- `.q-text` for the question.
	- `.sa-row` — `.sa-input` text field with `id="sa-input-N"`, Check button, Show Answer button.
		- The Check button carries the full accepted-answers array and feedback HTML as inline `onclick` arguments: `checkSA('sa-N', ['ans1','ans2'], '<strong>Correct!</strong> ...')`.
		- The Show Answer button similarly carries the answer string and explanation inline: `showSA('sa-N', 'answer', '...')`.
	- Empty `#exp-sa-N` div below.

- Block 12: Activity / Challenge Block
	- `.block.block-act` — tracked; ID format `chal-N`.
	- `.act-header` with badge (`Activity`), title, `#chev-chal-N` chevron.
	- `.act-instructions` — plain text instructions.
	- `.editor-wrap` with `.editor-topbar` (filename + language label) and a `<textarea class="editor" id="ed-chal-N">`.
		- The textarea is pre-filled with a scaffold (problem setup with blanks) as inline text content.
	- Check Answer and Reset buttons calling `checkActivity()` and `resetActivity()` with the block ID inline.
	- `#out-chal-N` output div (hidden by default).
	- Test cases and the default scaffold text are duplicated in the inline `<script>` (ACTIVITIES object).

- Block 13: Chapter Nav — Footer (Lines 625-628)
	- Mirrors the top nav — same prev/next pattern at the bottom of `<main>`.

- Block 14: Inline `<script>` (Lines 633-686)
	- The entire data layer for the chapter. No functions defined here — only data and one function call.
	- `CHAPTER_ID` — localStorage key for this chapter (e.g. `'usg-eb1'`).
	- `COURSE_PREFIX` — prefix used by `resetCourse()` to clear all chapters (e.g. `'usg-eb'`).
	- `ALL_BLOCKS` — ordered array of every tracked block ID.
	- `SEC_BLOCKS` — maps section number to its array of tracked block IDs.
	- `prog` — loads the chapter's saved state from localStorage on page load.
	- Intersection observer — watches `.section` elements; highlights the active sidebar link as you scroll.
	- `animIdx` — empty object; populated at runtime by `shared-nav.js` during animation steps.
	- `MC_DATA` — object keyed by question ID (`mcq-N-M`). Each entry has:
		- `correct` — the correct choice letter (`'a'`–`'d'`)
		- `ok` — full HTML feedback string shown on correct answer
		- `bad` — full HTML feedback string shown on wrong answer
	- `mcDone` — empty object; tracks which MC blocks are fully answered (set by `shared-nav.js`).
	- `ACTIVITIES` — object keyed by challenge ID (`chal-N`). Each entry has:
		- `tests[]` — array of `{name, fn}` objects; `fn` is a regex test against the textarea value
		- `defaultCode` — the scaffold text (duplicates the textarea pre-fill above)
	- `renderProgress()` — called once at the end to initialize the progress bar and pills.

- Block 15: shared-nav.js (Line 687)
	- Loaded last. Provides all runtime behavior: `animNext`, `animPrev`, `checkSA`, `showSA`, `checkActivity`, `resetActivity`, `setTheme`, `renderProgress`, `resetChapter`, `resetCourse`, and the cross-nav builder.
	- No functions are defined in the chapter file itself.

---

## What is duplicated / inline in every chapter file

These are the things that currently live inside the chapter HTML rather than in a shared or external file:

- **Feedback strings** — `ok`/`bad` text in `MC_DATA`; full HTML explanation strings in `checkSA`/`showSA` button `onclick` attributes.
- **Activity test cases** — `ACTIVITIES.tests[]` regex functions and `defaultCode` scaffold text (also duplicated as the textarea pre-fill).
- **Figure and diagram content** — all table data, formula layouts, color-coded diagrams, and ASCII art are inline HTML with inline `style=""` attributes.
- **Animation frame content** — every frame's HTML and caption string is inline inside the chapter.
- **Question and answer text** — all MC question text, choice text, and SA question text.
- **Accepted answer lists** — the arrays passed into `checkSA()` inline.
- **Chapter navigation targets** — next/previous href values hardcoded in three places (completion banner, nav-top, nav-footer).
- **Initial sidebar counts** — `0/N` values in each `.s-count` span must match `SEC_BLOCKS` in the script.
- **Remaining pill count** — hardcoded integer in `#remaining-pill` must match `ALL_BLOCKS.length`.
