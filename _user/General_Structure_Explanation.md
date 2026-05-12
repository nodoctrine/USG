
## Index.html
Everything starts at index.html.

- Block 1:
	- Lines 8 through 54 are for setting up the theme colors.
	- Lines 56 CSS reset to remove padding
	- Line57 -58 sets up font styling.
- Block 2: 
	- Line 60-72 details how the top bar is rendered
	- Line 74-79 redefines margins and padding that were reset in Line 56.
- Block 3:
	- Line 82 through 102 defines more UI elements.
- Block 4: 
	- Line 104 - 107 handles device screen size.
- Block 5: 
	- Line 111-129 defines the information for the help dropdown.
- Block 6: 
	- Line 130-250 defines what is displayed on the index screen.
- Block 7:
	- Line 257-260 defines some constants for shorthand references to courses and chapters
- Block 8: 
	- Line 262 through 283 shows how to render the % progress information.
- Block 9: 
	- Line 285 - 290 renders and reerenders when returned to

## shared.css



## shared-nav.js
This loads at the top, everywhere in the project in Chapters and Quizzes. (not index, index has its own)

Block 1:
- Holds all Ui elements and recurring designs/symbols

Block 2: 
- Scans chapters for CSS elements and populates them.

Block 3: 
- Sets color themes including the Pie-chart UI element.

Block 4: Tour
- Remove

Block 5
- Injected CSS
	- Line 260-276 (Style Injection and CSS elements)
- Click Handler
	- Line 278-297 (Course/Chapter Dropdown handler)
	- Lines 300-314 (Help button click handler)

Block 6: Backwards compatibility
- Remove

Block 7:  
- Line 352-406 (tracks all progress values)

Block 8: 
- Line 410-426 (controls animations)
	- Collects ID of all frames in memory and counts qty
		- Has precaution to exit if no frames found
	- If the animation isnt started, set frame to 0
	- Increments frame
		- Stores frame index
	- Finds art elements to render 
	- Loops through all frames, rendering etc

Block 9: 
- Line 429-458 (controls multiple choice quiz UI)
	- Only used in chapters bc practice quiz does more work when the quiz is interacted with.

Block 10:
- Linnes 461-480 (Short Answer Questions -  reads user input and compares to accepted answer list)

Block 11: 
- Lines 483-502 (Challenge Blocks - similar to short answer)

Block 12: 
- Lines 505-539 (Rest - for clearing progress)

Block 13: 
- Lines 542-558 (Sidebar - switches section when its 25% visible on screen)


