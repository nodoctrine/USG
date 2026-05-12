PLANNED FEATURES — Universal Study Guide
========================================
Items confirmed by user but not yet implemented.
Add DONE to entries here when user confirms they are satisfied.
Ask user thorough questions before implementing from this list if this document is referenced in a prompt

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

7. Professional SVG circuit diagrams
   Build proper vector schematic diagrams for every figure block that shows a circuit.
   Use standard electrical engineering symbols (IEC/IEEE): resistor zig-zag or rectangle,
   capacitor plates, inductor loops, op-amp triangle, transistor, ground, voltage source, etc.
   All SVGs must be inline and theme-aware (stroke="var(--text)", fill="var(--surface)")
   so they adapt to light/dark/retro automatically. Wire routing should follow schematic
   conventions (orthogonal lines, nodes shown as dots, no overlapping labels).
   Priority targets: op-amp configurations (Ch 5), RC/RL circuits (Ch 4), BJT (Ch 3),
   and register/port diagrams (C Programming Ch 0). 

8. Formula Reference Guide

9. Concepts Reference Guide

10. Add "Units" as a way to bundle chapters. Include appropriate dropdown section and all other relevant menus


13. Idea - Making courses from wikipedia
	I am going to detail the content below at a high level, and i want you to use the content of the Wikipedia articles to create each section of the chapter. 
	The first option is to download the Wikipedia articles themselves for only the content you want.
	Then create the map of how these articles are linked (obsidian might be good for that). 
	In fact obsidian might be a good way to do that even without this interactive textbook feature, just a web of subjects flowing from a high level topic using links already in the Wikipedia articles.
	Maybe convert Wikipedia to markdown first.


