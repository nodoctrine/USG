
## quiz-engine.js
Loaded on quiz pages only (after shared-nav.js). Reads `QUESTIONS`, `CHAPTER_NAMES`, and `QUIZ_KEY` from the inline script in the quiz HTML file.

- Block 1: Storage (Lines 4-6)
	- `loadData()` / `saveData()` — read and write the full performance object to localStorage under `QUIZ_KEY`.
		- The stored object has two keys: `perf` (per-question stats) and `log` (past session history).

- Block 2: State (Lines 8-13)
	- Five module-level variables that hold live quiz state:
		- `currentMode` — `'standard'` or `'weakness'`
		- `quizQueue` — the ordered array of question objects for the current session
		- `qIndex` — index of the question currently on screen
		- `answers` — parallel array to `quizQueue`; each slot is `null` or `{chosen, revealed}`
		- `selectedChapters` — Set of chapter numbers currently active in the filter

- Block 3: Text Answer Helpers (Lines 15-63)
	- Six helper functions used to evaluate and give feedback on typed answers.
		- `normalizeText` — trims and lowercases a string before comparison.
		- `isNumericMatch` — parses both strings as floats and checks they are within a `tolerance` value.
		- `sigFigHint` — detects if the user's number is off by a factor of 10/100/etc. (decimal-point errors); returns a plain-text hint string or null.
		- `findBadAnswerHint` — checks the user's input against a question's `badAnswers` list first; falls back to `sigFigHint` if the question uses numeric tolerance.
		- `isAnswerCorrect` — single correctness check for all question types: numeric tolerance path, text equality path, and MC value equality path.
		- `buildExpHTML` — assembles the explanation HTML and its CSS class string. Handles three states: revealed, skipped, and answered (correct or incorrect). Injects a `.mistake-hint` block if the question has a known bad-answer entry that matches.

- Block 4: Mode (Lines 65-71)
	- `setMode(mode)` — updates `currentMode` and toggles the `.active` class on the two mode buttons.
	- `setModeAndStart(mode)` — convenience wrapper; sets mode then immediately calls `startQuiz()`.

- Block 5: Chapter Filter (Lines 73-98)
	- `getFilteredPool()` — returns the question pool filtered to selected chapters; returns all questions if nothing is explicitly filtered out.
	- `updatePoolCount()` — updates the "X questions" count shown on the setup screen.
	- `buildChapterFilter()` — reads unique chapter numbers from `QUESTIONS`, creates a chip button per chapter, pre-selects all of them. Hides the entire filter row if the quiz only covers one chapter.
	- `toggleChapter(ch)` — adds or removes a chapter from `selectedChapters` and updates the chip's `.active` state.

- Block 6: Question Selection (Lines 100-120)
	- `shuffle(arr)` — Fisher-Yates in-place shuffle; returns a new array.
	- `weightedSelect(pool, perf, count)` — used in weakness mode. Assigns each question a weight of `(wrong + 1) / (correct + 1)` so questions answered incorrectly more often are more likely to appear. Picks without replacement using weighted random sampling.
	- `selectQuestions()` — picks up to 10 questions. Uses `weightedSelect` in weakness mode (only if performance data exists); otherwise shuffles and slices.

- Block 7: Quiz Flow — Rendering (Lines 122-237)
	- `startQuiz()` — validates the pool is non-empty, resets `quizQueue`/`qIndex`/`answers`, switches to the quiz screen, and calls `renderQuestion()`.
	- `liveScore()` — counts how many answered questions are correct so far (used for the live "N correct" counter).
	- `renderQuestion()` — the main render function; rebuilds the question card HTML on every navigation.
		- Updates the question counter and live score display.
		- Shows/hides Prev, Check, and Next buttons based on position and answered state.
		- **Text-input questions**: unanswered state renders a live text input; answered state renders a read-only input with correct/incorrect class and a "Correct answer:" line if wrong. Enables Check button only when the field is non-empty.
		- **Multiple choice questions**: unanswered state renders clickable radio labels; answered state renders the same labels locked with correct/incorrect classes applied. Enables Check button only after a selection.
		- Both types show a formula hint button and a Show Answer button while unanswered.

- Block 8: Answer Commit (Lines 239-294)
	- `commitAnswer(chosen, revealed)` — the single function that finalizes a question. It:
		1. Stores `{chosen, revealed}` in the `answers` array.
		2. Increments the correct or wrong counter in `localStorage` for that question ID.
		3. Applies correct/incorrect styling to the input or radio labels in the DOM.
		4. Appends the "Correct answer:" line for wrong text answers.
		5. Reveals the formula box if one was hidden.
		6. Removes the hints row.
		7. Calls `buildExpHTML` and injects the explanation block.
		8. Hides Check, shows Next, updates the live score.
	- `checkAnswer()` — reads the current selection or text input value and calls `commitAnswer`.

- Block 9: Navigation (Lines 296-327)
	- `nextQuestion()` — auto-commits a null answer (skipped) if the user clicks Next without answering, then advances `qIndex`. Calls `showResults()` when the last question is passed.
	- `prevQuestion()` — decrements `qIndex` and re-renders; already-answered questions render in their locked state.
	- `reshuffleQuiz()` — re-runs `selectQuestions()` mid-session and resets answers without leaving the quiz screen.
	- `toggleFormulaHint()` — toggles the hidden state of the formula box.
	- `revealAnswer()` — calls `commitAnswer(null, true)` to mark the question as revealed rather than answered.

- Block 10: Results (Lines 329-370)
	- `showResults()` — calculates the final score and assigns a tier (`perfect` / `good` / `mid` / `bad`).
		- Fills in the large score display and tier message.
		- Builds the wrong-items list: questions answered incorrectly or revealed, showing the user's answer and the correct answer side by side.
		- Saves the session to the history log (capped at 20 entries) and writes it back to localStorage.
		- Hides the "Switch to Weakness Mode" button if already in weakness mode.
		- Calls `renderHistory` to populate the results-screen history table, then switches to the results screen.

- Block 11: History (Lines 372-384)
	- `renderHistory(id)` — reads the history log from localStorage and builds the past attempts table into whichever element ID is passed.
		- Called twice: once for the setup screen (`history-setup`) and once for the results screen (`history-results`).
		- Score cells get a color class (`good` / `mid` / `bad`) matching the same tier thresholds used in results.

- Block 12: Screens and Init (Lines 386-395)
	- `showScreen(name)` — shows one of three screens (`setup`, `quiz`, `results`) by toggling `.hidden` on each `screen-*` element. Scrolls to top on every transition.
	- `showSetup()` — thin wrapper around `showScreen('setup')` called by the "Try Again" and "Back" buttons.
	- Last two lines execute immediately on load: `buildChapterFilter()` and `renderHistory('history-setup')` — populates the filter chips and the setup-screen history table before the user interacts.
