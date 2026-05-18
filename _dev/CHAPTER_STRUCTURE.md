# Chapter Structure Guide

How chapters are organized and what goes in each part.
For the HTML patterns that implement each block, see `AUTHORING_GUIDE.md`.

---

## The Standard Chapter Pattern

Every chapter follows this shape:

```
Chapter Overview          (reading block, not tracked, appears once)

  Section 1
    Intro                 (reading block, not tracked)
    Lecture               (slides, tracked as anim-N)
    Lecture Review        (multiple choice, tracked as mc-N)
    Activity              (formula or free response, tracked as chal-N)

  Section 2
    Intro
    Lecture
    Lecture Review
    Activity

  Section 3 ...           (add as many sections as the content requires)
```

---

## Chapter Overview

A single reading block placed before Section 1. Not inside any `<section>` tag — it lives at the chapter level.

**What goes here:** 3–5 sentences. Briefly state what the chapter covers across all sections and why it matters in the context of the broader subject. Think of it as the paragraph a textbook prints at the start of a chapter.

**What does not go here:** detailed content, formulas, or anything that belongs in a section.

Not tracked (no block ID, not in ALL_BLOCKS or SEC_BLOCKS).

---

## Per-Section Structure

### Intro (reading block)

The first thing in every section. 2–4 paragraphs describing the section topic in plain language. Introduce the concept conceptually before the slides dig into detail.

- Highlight first use of key vocabulary with `<span class="term">term</span>`
- Bullet lists are fine for rules, properties, or short comparisons
- Do not put step-by-step detail here — that belongs in the Lecture

Not tracked.

---

### Lecture (anim-N)

A step-through slide sequence covering the section content in detail. The reader clicks Next/Prev to advance. Marked done when the last frame is reached.

- Typical range: 3–6 frames per section
- Each frame advances the reader by one idea — one formula step, one code line, one state change
- Use HTML freely inside frames: `<code>`, `<strong>`, `<table>`, styled `<div>` elements
- Frame count in the `anim-progress` element must match the actual number of `anim-frame` divs
- The first frame must have class `active`

Block ID: `anim-N` (N increments globally across the chapter, not per section).

---

### Lecture Review (mc-N)

2–4 multiple choice questions testing what the Lecture just covered. Marked done when every question in the block is answered. Immediate feedback on each selection.

- Questions should be specific to content in this section's Lecture, not general recall
- Wrong-answer explanations should point directly to the correct fact
- 3–4 choices per question; only one correct answer

Block ID: `mc-N`. Question IDs: `mcq-{blockN}-{questionN}` (e.g., `mcq-2-1`, `mcq-2-2`).

---

### Activity (chal-N)

An open-ended exercise. The reader types an answer into a text area and clicks Check Answer. Two variants:

**Variant A — Formula / Math**
Ask the reader to compute a value given the known quantities. One or more regex tests check for the exact numeric answer. Use `\b` word boundaries (`/\b42\b/`) to avoid false positives from larger numbers.

```
Given: R = 470 ohms, V = 5 V. Calculate the current I in mA.
Answer: 10.638... → test for /\b10\.6\b/ or the rounded whole number
```

**Variant B — Free Response**
Ask the reader to explain a concept, describe a process, or identify the flaw in a scenario. Tests check for one or two required key terms, or simply that the reader typed a substantive answer:

```js
{ name: 'Mentions feedback', fn: c => /\bfeedback\b/i.test(c) }
{ name: 'Substantive answer', fn: c => c.trim().length > 40 }
```

For free response, `defaultCode` should be an empty string or a short prompt like `'Explain here.'`.

Block ID: `chal-N`.

---

## How Many Sections?

There is no fixed count. Use as many sections as the chapter's critical content requires:

- A short introductory chapter might have 2–3 sections
- A content-heavy chapter can have 4–6
- Each section should cover one coherent sub-topic that can stand alone

Each section adds exactly 3 tracked blocks (anim, mc, chal), so 3 sections = 9 remaining at the start, 4 sections = 12, and so on.

---

## JS Data Implications

**ALL_BLOCKS** — list every tracked block in document order, 3 per section:

```js
const ALL_BLOCKS = [
  'anim-1', 'mc-1', 'chal-1',
  'anim-2', 'mc-2', 'chal-2',
  'anim-3', 'mc-3', 'chal-3'
];
```

**SEC_BLOCKS** — map section number to its 3 block IDs:

```js
const SEC_BLOCKS = {
  1: ['anim-1', 'mc-1', 'chal-1'],
  2: ['anim-2', 'mc-2', 'chal-2'],
  3: ['anim-3', 'mc-3', 'chal-3']
};
```

**remaining-pill** initial count = `ALL_BLOCKS.length`.

**Sidebar** — one `<a class="sidebar-link">` per numbered section, initial count `0/3`. The Chapter Overview does not appear in the sidebar.

---

## Starting a New Chapter

Use `_structured_template.html` as the starting point (not `_template.html`, which is a comprehensive reference showing all block types).

1. Copy `_structured_template.html` to `Courses/[Name]/chapter_NN.html`
2. Fill in the Chapter Overview paragraph
3. For each section: write the Intro, build the Lecture frames, write MC questions, write the Activity
4. Set `CHAPTER_ID`, `COURSE_PREFIX`, `ALL_BLOCKS`, `SEC_BLOCKS`, `MC_DATA`, `ACTIVITIES`
5. Set `remaining-pill` count = total tracked blocks
6. Update sidebar link count labels (`0/3` per section)
7. Update chapter nav (prev/next links) and follow the full checklist in `AUTHORING_GUIDE.md`
