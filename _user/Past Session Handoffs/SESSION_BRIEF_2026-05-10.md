# Session Brief — 2026-05-10
Handoff context for next chat. Do not duplicate content that lives in the key files below — just point to them.

## This Session
- All 11 cross-nav dropdowns: current course/chapter shown as non-selectable label at top of each menu
- Created EB Chapter 5: Operational Amplifiers — 4 sections, 10 tracked blocks, 16 anim frames
- Default chapter depth raised: 4 sections / ~10 blocks is now the standard (was 3 / ~6)
- EB quiz: 6 Ch 5 questions added (44 total); CHAPTER_NAMES updated; badge updated
- `reshuffleQuiz()` added to quiz-engine.js; Reshuffle button added to all quiz files and template
- Planned Features.md updated: items 1/2/5/6/7 marked done; user added items 8–13 directly
- mybooks_format_spec.md implementation table updated to reflect current state

## Current State
| Course             | Chapters              | Quiz Q |
|--------------------|-----------------------|--------|
| Electronics Basics | Ch 1–5                | 44     |
| C Programming      | Ch 1, Ch 0 (capstone) | 30     |
| How-To Guide       | Ch 1–2                | —      |

## Key Files
- `Planned Features.md` — full backlog with status; check before starting any new feature
- `_dev/AUTHORING_GUIDE.md` — step-by-step for adding chapters, courses, quiz questions
- `_dev/mybooks_format_spec.md` — system spec, design rules, implementation status table
- `_dev/ARCHITECTURE.md` — file/folder structure and technical reference
- `assets/shared-nav.js` — CONFIG object + all chapter engine logic + dropdown CSS
- `assets/quiz-engine.js` — full quiz engine; reshuffleQuiz() added this session
- `_template.html` / `_quiz_template.html` — always start new chapters/quizzes from these
