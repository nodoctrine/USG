# Project Tips & Lessons Learned

## Browser Save Dialog
Chrome remembers the last "Save as type" used in the Save dialog.
Instead of scripting dropdown navigation, just manually set it once and Chrome will default to it going forward.
This avoids brittle keyboard automation of UI elements.

## General Principle
Before scripting around a UI problem, step back and ask:
- Does the app already remember this setting?
- Can a one-time manual action eliminate the need for automation entirely?
- Is there a simpler path that doesn't rely on the strategies already tried?
