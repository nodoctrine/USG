Everywhere:
1) Replace all references to mb or mybooks. Change to -usg or USG. Be very consistent.
2) 4) Modify "Challenge" (or related abbreviations) to "Activity" in all locations

shared-nav.js
2) Remove "Tour" function from around Lines 102-256 in shared-nav.js
3) Remove backwards compatibility (and modify all previous chapters to use the current functions)
	- Remove duplicate functions (markDone,renderProgress, etc.) from older chapter inline scripts — they are already handled by shared-nav.js and the copies are dead code.

4) 