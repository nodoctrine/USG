PLANNED FEATURES — Universal Study Guide
========================================
Items confirmed by user but not yet implemented.
Add DONE to entries here when user confirms they are satisfied.
Ask user thorough questions before implementing from this list if this document is referenced in a prompt

*** TOP PRIORITY ***

16. Content authoring pipeline — brief-to-chapter generation
    Chapter HTML files are 600+ lines of dense markup that are difficult to read
    and difficult for non-developers to edit. The goal is a clear pipeline where:
      - Author fills in a chapter_N_brief.md (see item 15 / Manual-Entry-Tool.md)
      - AI reads the brief and generates the full chapter HTML + course_data.js slice
      - The brief is the only file a content author ever needs to touch
      - Editing a lecture slide, question, or activity means editing the brief and
        regenerating — not hand-editing HTML
    Deliverables:
      - Validated generation pipeline: brief in → working chapter HTML out
      - Brief format updated to drive _structured_template.html exactly
      - course_data.js populated automatically as part of generation
      - Authoring guide updated with brief-first workflow as the primary path
    Dependency: item 15 (Manual Entry Tool format) is designed; pipeline not built.

********************

1. DONE ? button → dropdown menu
   Convert the header question mark button into a dropdown that lists
   available guide courses (How-To Guide, How-It-Do Guide).

2. DONE How-To Guide course
   User-facing guide explaining how to use the study system.
   Lives as a full course in the Courses/ folder, accessible from the ? dropdown.

3. How-It-Do Guide course
   Developer/AI-facing guide explaining how the system works behind the scenes.
   Includes the interactive file/feature node map.
   Lives as a full course in the Courses/ folder, accessible from the ? dropdown.

4. Interactive file map
   Clickable SVG/JS node graph in the How-It-Do Guide showing every file,
   its dependencies, and its role in the system. Click a node for a detail panel.

5. DONE - Complete Electronics Course
   Add the remainder of the electronics course one chapter at a time.

6. DONE Randomize button inside the active quiz
   Currently Randomize only appears on the quiz setup screen. Add it (or equivalent
   shuffle control) inside the running quiz UI so the user can re-shuffle question
   order mid-session without having to exit and restart.

7. External optional plugin for converting images to Professional SVG circuit diagrams
   Build proper vector schematic diagrams for every figure block that shows a circuit.
   Use standard electrical engineering symbols (IEC/IEEE): resistor zig-zag or rectangle,
   capacitor plates, inductor loops, op-amp triangle, transistor, ground, voltage source, etc.
   All SVGs must be inline and theme-aware (stroke="var(--text)", fill="var(--surface)")
   so they adapt to light/dark/retro automatically. Wire routing should follow schematic
   conventions (orthogonal lines, nodes shown as dots, no overlapping labels).
   Priority targets: op-amp configurations (Ch 5), RC/RL circuits (Ch 4), BJT (Ch 3),
   and register/port diagrams (C Programming Ch 0). 

8. Ability to generate Formula Reference Guide

9. Ability to geneerate Concepts Reference Guide

10. Add "Units" as a way to bundle chapters. Include appropriate dropdown section and all other relevant menus


13. Long term reach Idea - Making courses from wikipedia
	I am going to detail the content below at a high level, and i want you to use the content of the Wikipedia articles to create each section of the chapter. 
	The first option is to download the Wikipedia articles themselves for only the content you want.
	Then create the map of how these articles are linked (obsidian might be good for that). 
	In fact obsidian might be a good way to do that even without this interactive textbook feature, just a web of subjects flowing from a high level topic using links already in the Wikipedia articles.
	Maybe convert Wikipedia to markdown first.

14. Add the ability to favorite a section or "mark as review"

15. Manual Entry Tool (content brief format)
    Human-readable `.md` brief files for authoring chapter content without AI reading raw source files.
    Author reads source material (PDF, Wikipedia, slides), fills in a structured brief, and AI generates
    the chapter HTML + course data from it. Each brief covers: formulas table, per-section intro text,
    lecture slides, MC review questions, activities with test cases, and figure descriptions.
    Brief files live in `_Drop Source Content Here/Raw_[CourseName]/chapter_N_brief.md`.
    Figures flagged for the vector-converter tool (item 7) via <!-- VECTOR-CONVERT --> comments.
    Format spec lives in `_dev/Manual-Entry-Tool.md`.
    Status: format designed; generation pipeline not yet implemented.