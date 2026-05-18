# Manual Entry Tool — Content Brief Format

A human-readable format for specifying chapter content before HTML generation. Used when source material is a lecture slide deck, Wikipedia article, or other human-readable reference — the author reads the source, distills it here, and AI generates the chapter HTML from this file.

This format is the alternative to AI reading raw source files directly. Both paths produce the same result: a fully-specified content brief that drives HTML generation.

---

## How It Works

1. Author reads the source material (PDF slides, web page, textbook, etc.)
2. Author fills in a content brief using the format below
3. AI reads the brief and generates the chapter HTML from `_template.html`
4. Raw images in the Figures section are flagged for the vector-converter tool (planned)

Brief files live alongside source material in `_Drop Source Content Here/Raw_[CourseName]/` and are named to match the chapter they describe: `chapter_02_brief.md`.

---

## Brief Format

Copy the skeleton below and fill it in. Each chapter gets one brief file.

---

```markdown
# Content Brief — [Course Name] Chapter [N]: [Title]

## Metadata
- Course: [course name]
- Chapter: [N]
- Title: [chapter title]
- Source: [PDF filename / URL / other reference]
- USG sections: [N]  (target: 4)

---

## Formulas

List every formula that appears in this chapter. These feed directly into Figure blocks and Activity test cases.

| Symbol | Meaning | Formula | Units |
|--------|---------|---------|-------|
| V      | Voltage | V = I × R | Volts (V) |
| I      | Current | I = V / R | Amps (A) |
| R      | Resistance | R = V / I | Ohms (Ω) |

Add as many rows as needed. Leave Formula blank for pure definitions.

---

## Sections

One subsection per USG section. Section count should match the `USG sections` value in Metadata.

---

### Section 1 — [Title]

**Summary:** One or two sentences describing what this section covers and why it matters.

**Key terms:**
- **[Term]** — definition
- **[Term]** — definition

**Lecture slides:**

Each slide becomes one frame in a Lecture block. Write them as step-through steps — each one builds on the last.

Slide 1: [Title]
[Content: what the slide says / shows. Bullet points fine.]

Slide 2: [Title]
[Content]

Slide 3: [Title]
[Content]

(Add more slides as needed. Aim for 3–6 per section.)

**Figures:**

Each figure here becomes a Figure block. Describe what it should show. If you have a source image, reference the filename — the vector-converter tool will turn it into a styled SVG diagram.

Figure 1.1 — [Title]
Type: [circuit diagram / table / waveform / code example / other]
Source image: [filename or "none"]
Description: [What the figure should show. Be specific — component labels, values, layout.]

Figure 1.2 — [Title]
...

**Review questions (Multiple Choice):**

These become MC blocks. For each question, mark the correct answer with *.

Q1: [Question text?]
  a) [Choice]
  b) [Choice]
  c) [Choice] *
  d) [Choice]
Explanation: [Why c is correct, and what the wrong answers get wrong.]

Q2: [Question text?]
  ...

**Review questions (Short Answer):**

Q1: [Question text?]
Answer: [exact answer the student should type]
Alt answers: [comma-separated alternatives, if any]
Explanation: [shown after Check or Show Answer]

**Activity:**

One hands-on exercise per section (optional for non-computational sections).

Task: [What the student does — calculate a value, write code, fill in a formula, etc.]
Scaffold: [Starter text pre-filled in the textarea]
Test cases:
  - [Description of test 1]: [what pattern/value to check for]
  - [Description of test 2]: [what to check]

---

### Section 2 — [Title]

[Repeat the Section 1 structure]

---

### Section 3 — [Title]

[...]

---

### Section 4 — [Title]

[...]

---

## Notes for AI

Optional. Anything the AI should know when generating this chapter that isn't captured in the structured fields above — tone guidance, tricky concepts, things to avoid, cross-references to other chapters, etc.

[Notes here, or delete this section if not needed.]
```

---

## Field Reference

### Formulas table
Used to populate Figure blocks showing formula references, and to write accurate Activity test cases. Every formula mentioned anywhere in the chapter should appear here so the AI has a single authoritative list.

### Lecture slides
Each slide maps to one frame in a Lecture (animation) block. The slide title becomes the frame heading. The slide content becomes the frame body. The last slide's content is what marks the block complete.

### Figures
Three types of figures are supported:

| Type | How it renders now | Vector-converter future |
|------|--------------------|-------------------------|
| `circuit diagram` | Described in text / ASCII art | Converts reference image to SVG with standard EE symbols |
| `table` | HTML `<table>` | No conversion needed |
| `waveform` | Described in text / ASCII art | Converts sketch to clean SVG waveform |
| `code example` | `.code-view` block with syntax highlighting | No conversion needed |
| `other` | Text description or ASCII art | TBD |

When a source image is provided for a `circuit diagram` or `waveform` figure, the AI should add a `<!-- VECTOR-CONVERT: [filename] -->` comment in the generated HTML so the vector-converter tool can find and replace it later.

### Review questions
MC questions become `block-mc` blocks. SA questions become `block-sa` blocks. Write at least two review questions per section — one MC and one SA is the minimum.

### Activity
Activities become `block-act` blocks with regex test cases. Not all sections need an activity — skip it for purely conceptual sections. Computational and coding sections should always have one.

---

## Example (partial)

```markdown
# Content Brief — Electronics Basics Chapter 1: Introduction to Electricity

## Metadata
- Course: Electronics Basics
- Chapter: 1
- Title: Introduction to Electricity
- Source: Chapter 1.pdf (MTT12 Lecture 1, Prof. Albert Wong)
- USG sections: 5

---

## Formulas

| Symbol | Meaning | Formula | Units |
|--------|---------|---------|-------|
| V      | Voltage | V = I × R | Volts (V) |
| I      | Current | I = V / R | Amps (A) |
| R      | Resistance | R = V / I | Ohms (Ω) |
| P      | Power | P = V × I | Watts (W) |

---

## Sections

### Section 1 — Electricity and Matter

**Summary:** Introduces atoms, charge, conductors, insulators, and semiconductors as the foundation for understanding how electricity works.

**Key terms:**
- **Atom** — the basic unit of matter; made of protons, neutrons, and electrons
- **Conductor** — material that allows electrons to flow freely (copper, silver)
- **Insulator** — material that resists electron flow (rubber, plastic)
- **Semiconductor** — material that can act as either, used in diodes and transistors

**Lecture slides:**

Slide 1: What Is Electricity?
Electricity is caused by the movement of electrons through a material. Electrons carry a negative charge; protons carry a positive charge. When electrons move in one direction through a conductor, we have electric current.

Slide 2: Conductors and Insulators
Conductors have loosely bound outer electrons that move freely — copper and silver are excellent conductors. Insulators hold their electrons tightly — rubber and plastic are common insulators. Semiconductors (silicon, germanium) can behave as either depending on conditions.

Slide 3: Static Electricity
When charge builds up on an insulator and cannot flow away, static electricity forms. Discharge produces a spark. ESD (electrostatic discharge) can damage electronic components — wrist straps and proper grounding prevent this.

**Figures:**

Figure 1.1 — Atomic Structure
Type: other
Source image: none
Description: Atom with nucleus (protons + neutrons) at center and electrons orbiting in shells. Label: proton (+), neutron (neutral), electron (-). Show 2 electrons in inner shell, 1 in outer shell.

**Review questions (Multiple Choice):**

Q1: Which material allows electrons to flow freely?
  a) Rubber
  b) Plastic
  c) Copper *
  d) Glass
Explanation: Copper is a conductor — its outer electrons are loosely bound and move freely. Rubber, plastic, and glass are insulators.

**Review questions (Short Answer):**

Q1: What is the term for the build-up of charge on an insulator that cannot flow away?
Answer: static electricity
Alt answers: static, static charge
Explanation: Static electricity occurs when charge accumulates on an insulator. Discharge produces a spark that can damage components.

**Activity:**
(none — conceptual section)
```

---

## Relationship to AI Source Reading

The two content paths are equivalent:

| Path | Author does | AI does |
|------|-------------|---------|
| Manual brief | Reads source, fills in brief | Reads brief, generates HTML |
| AI source reading | — | Reads source files directly, generates HTML |

The manual brief path is preferred when:
- The source is a PDF or image-heavy slide deck that is awkward for AI to parse
- The author wants to curate which topics are included rather than having AI decide
- The source is a live web page (Wikipedia, documentation) that AI cannot access
- Precision matters and human review of the content mapping is required

The AI source reading path is preferred when:
- The source files are machine-readable HTML (e.g., zyBooks exports)
- Speed matters and the author trusts the AI's topic selection
