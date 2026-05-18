
## shared.css
All page styles live here — chapters and quizzes. Nothing is inlined in chapter files.

- Block 1: Layout Constants
	- Lines 6-15 define the three CSS variables that control the sticky stack heights:
		- `--header-h` (54px), `--nav-h` (36px), `--progress-h` (4px)
		- Every `top:` and `calc()` elsewhere in the file references these — change once, updates everywhere.

- Block 2: Theming
	- Lines 17-41 define all three color themes as CSS custom property sets.
		- `:root` — default (light) theme
		- `[data-theme="dark"]` — dark theme
		- `[data-theme="retro"]` — warm amber / Night Shift theme
	- Variables cover: backgrounds, surfaces, text, borders, accent colors, and the full code syntax palette.

- Block 3: Base
	- Lines 43-48 — CSS reset (box-sizing, zero margin/padding), body font stack, link color, inline `<code>` styling.

- Block 4: Header
	- Lines 50-66 — sticky page header bar (54px, z-index 200).
		- `.header-left` / `.header-right` split the bar into subject/chapter label (left) and controls (right).
		- Controls: progress pill, remaining pill, theme pie-chart switcher, help button.
		- Pie segments (`.pie-seg`) have per-theme fill colors; `.pie-active` shows the current theme at full opacity.

- Block 5: Cross-Nav
	- Lines 68-71 — sticky navigation bar directly below the header (top: 54px, z-index 198).
		- Contains course and chapter selectors built by `shared-nav.js` at runtime.
		- Only label and divider styles defined here; the nav HTML itself is injected by JS.

- Block 6: Progress
	- Lines 73-78 — thin progress bar (4px) sticky at top: 90px (header + nav), z-index 197.
		- `.progress-bar-fill` animates width with a 0.4s ease transition.
		- `.completion-banner` is hidden by default; `.visible` class reveals it at 100% completion.

- Block 7: Sidebar
	- Lines 80-94 — left panel; sticky at top: 90px, full remaining viewport height.
		- `.sidebar-link` — section links; `.active` highlights current section; `.section-done` turns it green.
		- `.s-count` — done/total pill per section; `.all-done` variant turns it solid green.
		- `.reset-btn` — chapter/course reset buttons at the bottom of the sidebar.

- Block 8: Main Content
	- Lines 96-101 — `.main-content` is max 840px wide, centered with auto margins.
		- `.chapter-nav-top` and `.nav-btn` handle prev/next chapter buttons at the top of the content area.
		- `.nav-btn.disabled` used on first/last chapter (no pointer events, reduced opacity).

- Block 9: Sections and Reading Blocks
	- Lines 103-115 — `.section` spacing and `.section-heading` with bottom border.
		- `.block` is the base card style shared by all block types (border, radius, shadow).
		- `.block-reading` adds padding and paragraph/list spacing.
		- `.term` highlights a key term in accent-cool color.

- Block 10: Figure
	- Lines 117-128 — `.block-figure` gets a steel-blue left accent border.
		- `.block-header` — top bar with label and title; `.figure-body` and `.figure-caption` below.
		- `.code-view` — dark code display area with monospace font.
			- `.ln` — line number column (non-selectable, right-aligned).
			- `.cc` — code content column.
		- Syntax highlight classes: `.kw` `.str` `.cmt` `.num` `.fn` `.tp` `.pp` — each maps to a code color variable.

- Block 11: Activity Header and Animation
	- Lines 130-148 — shared activity header styles used by lecture, MC, SA, and challenge blocks.
		- `.act-badge` — colored pill label; `.badge-part` (warm) for participation, `.badge-act` (cool) for challenge.
		- `.chevron.pend` (gray) / `.chevron.done` (green) — completion indicator in top-right of each block.
		- `.block-anim` — animation/lecture block with warm left accent border.
		- `.anim-stage` — display area for the current frame; `.anim-frame.active` controls which frame is visible.
		- `.anim-controls` — prev/next buttons and step counter.

- Block 12: Multiple Choice
	- Lines 150-168 — `.block-mc` with warm left accent border.
		- `.choice` — radio option card; `.correct` / `.incorrect` apply green/red backgrounds on selection.
		- Correct/incorrect backgrounds are theme-overridden for dark and retro (semi-transparent versions).
		- `.explanation` — hidden by default; `.visible` reveals it; `.wrong` variant uses error-color left border.

- Block 13: Short Answer
	- Lines 170-178 — `.block-sa` with warm left accent border.
		- `.sa-input` — monospace text input; `.correct` / `.incorrect` border and background states.
		- Dark and retro themes override the correct background to a semi-transparent tint.

- Block 14: Challenge (Coding / Calculation Activity)
	- Lines 180-190 — `.block-act` with cool left accent border.
		- `.editor-wrap` — dark wrapper for the code textarea.
		- `textarea.editor` — resizable monospace input area.
		- `.act-output` — hidden by default; `.visible` shows pass/fail test results.
		- `.t-pass` (green) / `.t-fail` (red) / `.t-row` style individual test case lines.

- Block 15: Buttons
	- Lines 192-200 — `.btn` base style; variants: `.btn-primary` (blue), `.btn-ghost` (neutral), `.btn-success` (green).
		- Size modifiers: `.btn-lg` (larger padding), `.btn-sm` (smaller padding).

- Block 16: Footer, Formula Box, and Tables
	- Lines 202-210 — `.chapter-nav-footer` — prev/next buttons at the bottom of the page.
		- `.formula-box` — warm-accent bordered box for displaying formulas.
		- `.formula-row` / `.formula-item` — horizontal list of individual formula cards.
		- `.comp-table` — comparison/reference table with alternating row shading.

- Block 17: Quiz Pages
	- Lines 215-271 — all styles specific to quiz.html (not used in chapter pages).
		- `.quiz-hero` — centered title and subtitle at top of quiz setup screen.
		- `.mode-btn` — card-style mode selector (All Questions / Weakness Mode); `.active` highlights selection.
		- `.chip` — pill-shaped chapter filter toggle; `.active` fills it in accent-cool.
		- `.history-table` — past quiz results table with score color coding (good / mid / bad).
		- `.q-card` — question card during an active quiz session.
		- `.q-text-input` — text answer input used by text-input question type.
		- `.mistake-hint` — warm-accented hint box shown for common wrong answers.
		- `.score-display` — large score readout on results screen; color varies by score band.
		- `.wrong-item` — lists missed questions after a quiz with correct answer shown.

- Block 18: Responsive
	- Lines 273-275 — two breakpoints.
		- Below 740px: sidebar is hidden; main content padding reduced.
		- Below 600px: quiz page padding reduced; mode buttons go full-width.
