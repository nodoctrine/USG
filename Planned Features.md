PLANNED FEATURES — Universal Study Guide
========================================
Items confirmed by user but not yet implemented.
Add DONE to entries here when user confirms they are satisfied.

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

5. Complete Electronics Course
   Add the remainder of the electronics course one chapter at a time.

6. Professional SVG circuit diagrams
   Build proper vector schematic diagrams for every figure block that shows a circuit.
   Use standard electrical engineering symbols (IEC/IEEE): resistor zig-zag or rectangle,
   capacitor plates, inductor loops, op-amp triangle, transistor, ground, voltage source, etc.
   All SVGs must be inline and theme-aware (stroke="var(--text)", fill="var(--surface)")
   so they adapt to light/dark/retro automatically. Wire routing should follow schematic
   conventions (orthogonal lines, nodes shown as dots, no overlapping labels).
   Priority targets: op-amp configurations (Ch 5), RC/RL circuits (Ch 4), BJT (Ch 3),
   and register/port diagrams (C Programming Ch 0). 