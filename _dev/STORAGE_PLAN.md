# Storage Refactor Plan
## Replacing raw localStorage with a resilient abstraction layer

Status: PLANNED — not yet implemented.

---

## Problem

All progress and theme data is stored directly via `localStorage`. This has two failure modes:

1. **Blocked** — privacy browsers (LibreWolf, Brave, hardened Firefox) throw an error on
   `localStorage.setItem()`. The page silently breaks; progress is never saved.
2. **Auto-cleared** — "Clear history on exit" settings wipe localStorage between sessions.
   localStorage appears to work during a session, but data is gone on next open. Not detectable
   at write time — only detectable by checking whether a sentinel written last session survived.

Cookies are not a viable fallback: many browsers do not support cookies on `file://` URLs at all.

---

## Storage Option Comparison

| Option          | Works on file:// | Privacy browser risk              | Notes                              |
|-----------------|------------------|-----------------------------------|------------------------------------|
| localStorage    | Yes              | May be blocked or cleared on exit | Current approach                   |
| sessionStorage  | Yes              | Cleared on tab close by design    | Useless for persistence            |
| Cookies         | Unreliable       | Often disabled for file://        | Not worth implementing             |
| IndexedDB       | Yes              | Same risks as localStorage        | More complex, no added benefit     |
| File export     | Yes, always      | None — user controls the file     | Most reliable option               |
| In-memory       | Yes, always      | N/A — session only                | Last-resort fallback               |

---

## Design Decisions (confirmed)

1. **Warning location** — Pop-up banner triggered when `index.html` is opened or regains focus
   (i.e. when a user returns from a chapter back to the index). Not a modal; non-blocking.
2. **Export / Import location** — Header area of `index.html` (alongside theme switcher and ? button).
3. **Export scope** — All courses in a single file (`usg-progress.json`). Not per-course.
4. **New file** — `assets/storage.js`, loaded before `shared-nav.js` on every page.

---

## Architecture

### New file: `assets/storage.js`

Sets up `window.USG` — a namespace shared across all pages.

Exposes four functions used everywhere in place of raw `localStorage` calls:

```js
USG.read(key)            // returns parsed value or null
USG.write(key, value)    // serializes and stores
USG.remove(key)          // removes one key
USG.clearPrefix(prefix)  // removes all keys starting with prefix
```

Internally:
- On load, runs a write/read/delete probe against localStorage.
- If the probe **throws** → marks `USG._storageBlocked = true`, uses an in-memory map.
- If the probe **passes** → uses localStorage. Also checks for the "cleared on exit" sentinel
  (see Detection section below).
- All four functions route to either localStorage or the in-memory map transparently.

### Load order on every page

```html
<script src="../../assets/storage.js"></script>   <!-- sets up USG, detects storage -->
<script src="../../assets/shared-nav.js"></script> <!-- uses USG.read/write -->
```

On `index.html` (one level up from Courses/):
```html
<script src="assets/storage.js"></script>
<script src="assets/shared-nav.js"></script>
```

---

## Detection: Two Failure Modes

### Mode 1 — Blocked (immediate)

```js
function probeStorage() {
  try {
    localStorage.setItem('usg-probe', '1');
    localStorage.removeItem('usg-probe');
    return true;
  } catch(e) {
    return false;
  }
}
```

If this returns false, set `USG._storageBlocked = true` and switch all reads/writes to the
in-memory fallback. Warn immediately on page load.

### Mode 2 — Cleared on exit (deferred, detectable on next session)

On every page load (after a successful probe), check for a sentinel key `usg-session-alive`.
- If it is **absent** and the user has visited before (tracked by a separate flag written to
  sessionStorage), it means localStorage was cleared between sessions.
- Write `usg-session-alive = '1'` on each load; also register a `beforeunload` handler that
  writes `usg-closed-cleanly = '1'`.
- On next load: if `usg-closed-cleanly` is absent but the user has a prior visit flag,
  localStorage is being auto-cleared.

Set `USG._storageClearedOnExit = true` when this is detected. Show a softer warning
(data currently saves within a session, but won't persist across sessions).

---

## Warning UI

Triggered on `index.html` when `USG._storageBlocked` or `USG._storageClearedOnExit` is true.

Appears as a non-blocking banner **below the header**, styled like the completion banner
(full-width, distinct background). Includes a dismiss button that suppresses it for the session
(using sessionStorage so it doesn't reappear on page revisit within the same tab session).

### Blocked variant (storage fully unavailable):
```
(i) Progress won't save — your browser is blocking local storage.
    That's good practice. Just know your progress resets each session.
    You can still Export / Import a save file manually.    [Got it]
```

### Cleared-on-exit variant (works intra-session, not across):
```
(i) Progress saves during this session but clears when your browser closes.
    Your privacy settings clear local data on exit — good habit.
    Use Export Progress to keep a permanent save file.    [Got it]
```

Tone: matter-of-fact, non-alarming, respects the user's choice.

---

## Export / Import

Location: header area of `index.html`, near the theme switcher.

Two buttons:

**Export Progress**
- Reads all `usg-*` keys from localStorage (or in-memory map if blocked)
- Serializes to JSON: `{ "usg-eb1": {...}, "usg-c1": {...}, "usg-theme": "dark", ... }`
- Triggers browser download as `usg-progress.json` via `<a download>` + Blob URL

**Import Progress**
- Opens a file picker (`<input type="file" accept=".json">`)
- Reads and parses the JSON
- Validates that keys start with `usg-` before writing (sanitization)
- Writes all keys to localStorage (or in-memory fallback)
- Reloads the index page to reflect updated progress badges

The import also works when localStorage is blocked — data loads into the in-memory map and
progress is visible for the current session.

---

## Changes to Existing Code

### `assets/shared-nav.js`
Replace all raw `localStorage` calls with `USG.*` equivalents:

| Old | New |
|-----|-----|
| `localStorage.getItem(CHAPTER_ID)` | `USG.read(CHAPTER_ID)` |
| `localStorage.setItem(CHAPTER_ID, ...)` | `USG.write(CHAPTER_ID, ...)` |
| `localStorage.removeItem(CHAPTER_ID)` | `USG.remove(CHAPTER_ID)` |
| `localStorage.getItem(CONFIG.themeKey)` | `USG.read(CONFIG.themeKey)` |
| `localStorage.setItem(CONFIG.themeKey, ...)` | `USG.write(CONFIG.themeKey, ...)` |

Approximately 8 call sites. No logic changes — drop-in replacements.

### `index.html`
- Replace the inline `localStorage.getItem('usg-theme')` in the theme init script
- Replace `localStorage.getItem(ch.key)` in `renderProgress()`
- Add Export / Import buttons to header
- Add storage warning banner (hidden by default; shown by storage.js if needed)

### Older chapter inline scripts (dead code — covered by item 3 in PLANNED CHANGES)
These call `localStorage` directly but are already overridden by shared-nav.js.
Remove them as part of the backwards-compat cleanup, not here.

### `assets/quiz-engine.js`
Replace localStorage calls for quiz history/performance (QUIZ_KEY reads and writes).
Scope to be confirmed by reading quiz-engine.js before implementation.

---

## What Does NOT Change

- Block IDs, section IDs, CHAPTER_ID strings, QUIZ_KEY strings — untouched
- Progress data format — still JSON objects keyed by block ID
- CSS, shared.css — untouched
- Chapter HTML files — no changes needed (they delegate all storage to shared-nav.js)

---

## Out of Scope (deferred to mobile pass)

Mobile introduces separate storage and UX concerns:
- `beforeunload` is unreliable on iOS/Android (affects Mode 2 detection)
- Safari on iOS has historically had intermittent localStorage support
- Export/Import via file picker behaves differently on mobile
- Header layout for Export/Import buttons needs to account for small screens

These will be addressed together with the hamburger menu / mobile layout work,
which is already tracked in the implementation status table as Not Started.

---

## Implementation Order

1. Write `assets/storage.js` (USG namespace, probe, in-memory fallback)
2. Add `<script src="assets/storage.js">` to `index.html` and `_template.html` / `_quiz_template.html`
3. Add the same tag to every existing chapter and quiz HTML file
4. Replace localStorage calls in `shared-nav.js`
5. Replace localStorage call in `index.html` renderProgress + theme init
6. Replace localStorage calls in `quiz-engine.js`
7. Add Export / Import buttons to `index.html` header
8. Add warning banner HTML to `index.html`; wire detection logic in `storage.js`
9. Verify: chapter progress, quiz history, theme preference, export round-trip, import round-trip
10. Test with localStorage manually disabled (DevTools > Application > Storage > disable)
