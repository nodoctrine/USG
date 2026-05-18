
## chapter_02.html — Electronics Basics
Structure is identical to chapter_01.html at the file level. All blocks, the inline script pattern, and the asset links are the same. Differences are catalogued at the bottom. Reference: Electronics_Basics/chapter_02.html (752 lines).

---

- Block 1: Head (Lines 1-8)
	- Same pattern as Chapter 1. Single `<link>` to `../../assets/shared.css`.

- Block 2: Page Header (Lines 11-32)
	- Same structure. Updated subject/chapter text.
	- `#remaining-pill` hardcoded to `12 remaining` (same count as Chapter 1).
	- Theme pie SVG and help dropdown are byte-for-byte identical to Chapter 1.

- Block 3: Cross-Nav + Progress Bar (Lines 34-39)
	- Identical to Chapter 1. Empty cross-nav shell, progress bar, completion banner.
	- Completion banner links to `chapter_03.html` instead of `chapter_02.html`.

- Block 4: Sidebar (Lines 43-52)
	- 4 section links (2.1–2.4) instead of 5. Same `s-count` pattern with hardcoded `0/3` for all four sections.
	- Reset buttons identical.

- Block 5: Chapter Nav — Top (Lines 56-59)
	- **Both buttons are active `<a>` links** — Chapter 2 is a middle chapter, so Previous is not disabled.
	- Previous links to `chapter_01.html`; Next links to `chapter_03.html`.

- Block 6: Section 1 — Electrical Power (Lines 63-195)
	- Reading block → Figure block → Animation block (`anim-1`) → MC block (`mc-1`) → SA block (`sa-1`).
	- This pattern (Reading → Figure → Animation → MC → SA) repeats for sections 1 and 2.
	- Figure 2.1 contains a `.formula-box` with a `.formula-row` inside it, plus a `<table>` below — two components inside one figure body.

- Block 7: Section 2 — Kirchhoff's Current Law (Lines 199-326)
	- Same pattern as Section 1: Reading → Figure → Animation (`anim-2`) → MC (`mc-2`) → SA (`sa-2`).
	- Figure 2.2 uses a CSS-styled inline diagram (colored spans) to represent a node with labeled current arrows — no `<table>`, no ASCII art.

- Block 8: Section 3 — Kirchhoff's Voltage Law (Lines 330-474)
	- Pattern shifts: Reading → Figure → Animation (`anim-3`) → MC (`mc-3`) → **Challenge** (`chal-1`).
	- SA is replaced by a challenge from section 3 onward.
	- Figure 2.3 uses box-drawing characters (`┌─┐│└─┘`) for a circuit loop diagram, with inline `style` color overrides.

- Block 9: Section 4 — Capacitors (Lines 479-647)
	- Reading → Figure → Animation (`anim-4`) → MC (`mc-4`) → **Challenge** (`chal-2`).
	- Figure 2.4 is the most complex figure in either chapter — three side-by-side sub-panels: capacitor schematic symbol, a CSS bar chart simulating a charging curve (10 bars with hardcoded height percentages), and a formula reference table.

- Block 10: Chapter Nav — Footer (Lines 649-652)
	- Both buttons are active `<a>` links (mirrors the top nav).

- Block 11: Inline `<script>` (Lines 657-749)
	- Same structure as Chapter 1: `CHAPTER_ID`, `COURSE_PREFIX`, `ALL_BLOCKS`, `SEC_BLOCKS`, `prog`, intersection observer, `animIdx`, `MC_DATA`, `mcDone`, `ACTIVITIES`, `renderProgress()`.
	- `CHAPTER_ID = 'usg-eb2'`, `COURSE_PREFIX = 'usg-eb'`.
	- `ALL_BLOCKS` follows strict section order: all of section 1, then section 2, then 3, then 4.
	- `MC_DATA` entries use multi-line formatting with labeled properties on separate lines.
	- `ACTIVITIES.defaultCode` is a single escaped template string using `\n` throughout.

- Block 12: shared-nav.js (Line 750)
	- Identical to Chapter 1. Loaded last.

---

## What differs between Chapter 1 and Chapter 2

- **Previous chapter nav is active** — Chapter 1 uses `<span class="nav-btn disabled">` for Previous; Chapter 2 uses a real `<a>` link on both top and footer nav.

- **4 sections instead of 5** — Chapter 1 has sections 1.1–1.5; Chapter 2 has 2.1–2.4. Both total 12 tracked blocks.

- **All animations have 4 frames** — Chapter 1 animations have 3 frames each (`1 / 3`); Chapter 2 animations all have 4 frames (`1 / 4`).

- **MC questions have 3 choices instead of 4** — Chapter 1 MC blocks use `a/b/c/d`; Chapter 2 MC blocks use only `a/b/c`. The `MC_DATA` `correct` value is always one of those three letters.

- **Every section has a Figure block** — Chapter 1 is uneven: sections 1 and 2 have an animation but no figure; section 4 inserts a figure mid-section after the reading. Chapter 2 places a figure consistently as the second block in every section, before the animation.

- **Section terminal block alternates by section** — Chapter 2 sections 1 and 2 end with an SA; sections 3 and 4 end with a challenge. Chapter 1 scatters SA and challenge blocks without that pattern.

- **MC_DATA formatting** — Chapter 1 writes each entry as a single dense line; Chapter 2 uses multi-line formatting with each property (`correct`, `ok`, `bad`) on its own indented line.

- **ALL_BLOCKS ordering** — Chapter 1's array is not in strict section order (`anim-1, mc-1, anim-2, mc-2, sa-1, sa-2, anim-3 ...`), suggesting blocks were added over time. Chapter 2's array follows strict section-by-section order (`anim-1, mc-1, sa-1, anim-2, mc-2, sa-2 ...`).

- **Figure complexity and variety** — Chapter 2 figures use a wider range of techniques: `.formula-box` inside a figure body (Figure 2.1), inline CSS colored-span node diagram (Figure 2.2), box-drawing character circuit diagram (Figure 2.3), and a multi-panel layout with a simulated bar chart (Figure 2.4). Chapter 1 figures use primarily `<table>` and inline CSS triangle/block layouts.

- **Completion banner target** — Chapter 1 links to `chapter_02.html`; Chapter 2 links to `chapter_03.html`. The only per-chapter edit in the banner.
