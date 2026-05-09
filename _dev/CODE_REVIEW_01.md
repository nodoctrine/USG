# Code Review — Session 1

Files reviewed: `C_Programming/chapter_01.html`, `Electronics_Basics/chapter_01.html`, `_template.html`

---

## Bugs Found and Fixed

### 1. Vestigial `data-theme` on `<html>` tag — `C_Programming/chapter_01.html`, `_template.html`
**Severity:** Low (cosmetic/correctness)

`<html lang="en" data-theme="default">` — the spec requires `data-theme` only on `<body>`. JS always sets it on `document.body`, so the `<html>` attribute is a stale leftover that could confuse CSS cascade debugging.

**Fix:** Removed `data-theme="default"` from both `<html>` tags.

---

### 2. Dead code: `cycleTheme()` never called — all chapter files
**Severity:** Low (dead code)

`cycleTheme()` is defined in all chapter files but no element calls it. The theme switcher calls `setTheme()` directly via the SVG pie segment `onclick` handlers. `cycleTheme` is unreachable code.

**Fix:** Removed `cycleTheme()` from `C_Programming/chapter_01.html`, `Electronics_Basics/chapter_01.html`, and `_template.html`.

---

### 3. Hardcoded code-pane colors not using CSS variables — all files
**Severity:** Medium (theming correctness)

Two hardcoded hex values appear in code-view and challenge block CSS:
- `#2d3140` — used as `border` on `.editor-wrap`, `.chal-output`, and `border-right` on `.ln`
- `#4b5263` — used as `color` on `.ln` (line numbers)

These values are not theme-aware. In the retro theme, code blocks have a warm dark background (`#0c0804`) so a cool blue-grey border is slightly off.

**Fix:** Added `--code-border` to the CSS variables (`:root` and `[data-theme="retro"]`). Replaced `#4b5263` with `var(--code-cmt)` (semantically appropriate — same muted tone as code comments). Replaced all `#2d3140` occurrences with `var(--code-border)`.

CSS variables added:
- `:root`: `--code-border: #2d3140`
- `[data-theme="retro"]`: `--code-border: #2a1808`
- `[data-theme="dark"]` inherits from `:root` (same value is appropriate)

---

### 4. No `aria-current="page"` on active cross-nav elements — both chapter files
**Severity:** Low (accessibility)

The current course and chapter in the cross-nav bar are rendered as `<span class="cross-nav-link active">` with no `aria-current` attribute. Screen readers cannot distinguish the active item from plain text without the attribute.

**Fix:** Added `aria-current="page"` to all active cross-nav `<span>` elements in both chapter files and the template.

---

### 5. Template missing cross-nav bar — `_template.html`
**Severity:** Medium (authoring correctness)

The `_template.html` was created before the cross-nav feature was added. Any new chapter started from the template would be missing the cross-nav CSS, the HTML bar, and the correct `top: 90px` offsets for the sidebar and progress bar.

**Fix:** Added cross-nav CSS block to template, added cross-nav HTML placeholder after `</header>`, and updated all `top: 54px` / `calc(100vh - 54px)` offsets to `top: 90px` / `calc(100vh - 90px)`.

---

## Non-Issues (Initially Flagged, Verified OK)

### Challenge regex tests — `Electronics_Basics/chapter_01.html`
The test patterns `/\b3\b/` and `/\b500\b/` were initially noted as potentially matching adjacent digits (e.g., "30" or "5000"). On closer inspection, JavaScript's `\b` word boundary correctly distinguishes `3` from `30` and `500` from `5000` because digits are word characters — no word boundary exists between adjacent digits. The tests are correct as written.

---

## Deferred (Not Fixed This Session)

| Item | Reason deferred |
|---|---|
| `.editor-topbar { background: #181c24; color: #6b7280; }` hardcoded | Minor; topbar is always dark regardless of theme; low visual impact |
| `aria-label` on reset buttons | Nice-to-have accessibility; not blocking |
| Mobile sidebar (hamburger menu) | Feature work; tracked in spec backlog |
| Cross-browser test (Chrome, Firefox, Edge) | Requires manual testing |
