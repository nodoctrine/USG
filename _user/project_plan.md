# Study Guide Project Plan

## Core Concept
Build an original interactive textbook system as lightweight HTML files that open in a browser. The long-term goal is a reusable framework that Claude Code can use to generate a complete textbook on any subject on demand.

## Output Requirements
- Pure HTML files, openable in any browser with no server needed
- As small/lightweight as possible
- Self-contained (no external dependencies if avoidable)
- Fully functional interactivity — questions, labs, and answer explanations must actually work (not just look like they work)
- One HTML file per chapter, one folder per subject

## The Framework Goal
The end product is not just the textbooks — it's a reusable HTML/CSS/JS framework + a Claude Code prompt/workflow that allows:
> "Given this framework, generate a complete interactive textbook on [subject]"

This means the framework must be:
- Templated and consistent
- Well-documented so Claude Code can follow it reliably
- Modular (lesson types, question types, labs should be reusable components)

## Content Types to Support
- Reading sections with explanations
- Interactive step-through animations
- Knowledge check questions (multiple choice, fill-in, etc.)
- Coding/lab exercises
- Figures and diagrams

## Workflow Plan
1. Analyze reference HTML files to extract content patterns and structure
2. Build a clean minimal HTML template
3. Create a test chapter for C Programming as a proof of concept
4. Document the template so it can be handed to Claude Code for new subjects
5. Generate remaining subjects using the established framework

## Lessons Learned
- Script-downloaded HTML captures content/structure but not visuals — CSS/assets are missing
- Manual browser "Save As > Webpage Complete" captures full visuals including CSS, JS, and assets
- Use script downloads for content/structure reference, manual saves for visual/style reference
- Two reference types are intentional: we want our own visual design anyway

## Notes & Advice
- Keep CSS and JS inline or in a single file to maintain the "one file = one chapter" portability
- Sections should be short and focused
- Interactive elements should degrade gracefully (still readable without JS)
- Use semantic HTML for readability and potential future export/conversion
