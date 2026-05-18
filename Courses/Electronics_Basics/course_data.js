'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DATA — Electronics Basics
//
// One entry per chapter, keyed by CHAPTER_ID (matches the localStorage key).
// Each chapter's inline <script> pulls its own slice:
//   const MC_DATA    = COURSE_DATA[CHAPTER_ID].MC_DATA;
//   const ACTIVITIES = COURSE_DATA[CHAPTER_ID].ACTIVITIES;
//
// To add a new chapter: append a new key below. No chapter HTML edits needed
// beyond adding those two lines to the inline script.
// ─────────────────────────────────────────────────────────────────────────────

const COURSE_DATA = {

  'usg-eb1': {
    MC_DATA: {
      'mcq-1-1':{ correct:'c', ok:'<strong>Correct!</strong> Electrons carry a negative (−) charge. Their movement through a conductor is what we call electric current.', bad:'<strong>Not quite.</strong> Electrons carry negative charge. Protons (+) are in the nucleus; neutrons carry no charge.' },
      'mcq-1-2':{ correct:'d', ok:'<strong>Correct!</strong> Copper has loosely-held outer electrons that move freely — making it an excellent conductor. It is the most common material used in electrical wiring.', bad:'<strong>Not quite.</strong> Rubber, plastic, and glass are insulators — they resist current flow. Copper is a good conductor.' },
      'mcq-2-1':{ correct:'b', ok:'<strong>Correct!</strong> Batteries produce DC — Direct Current flows in one constant direction with fixed polarity.', bad:'<strong>Not quite.</strong> Batteries produce DC (Direct Current) — steady flow in one direction. AC (Alternating Current) is what comes out of wall outlets.' },
      'mcq-2-2':{ correct:'c', ok:'<strong>Correct!</strong> Current requires a closed, complete loop. Any break in the circuit stops current flow entirely.', bad:'<strong>Not quite.</strong> Current can only flow through a closed (complete, unbroken) circuit.' },
      'mcq-3-1':{ correct:'c', ok:'<strong>Correct!</strong> I = V ÷ R = 12 V ÷ 4 Ω = <strong>3 A</strong>.', bad:'<strong>Not quite.</strong> Use I = V ÷ R: I = 12 ÷ 4 = 3 A.' },
      'mcq-3-2':{ correct:'c', ok:'<strong>Correct!</strong> I = V ÷ R. If R doubles, I = V ÷ 2R = half the original current. More resistance → less current.', bad:'<strong>Not quite.</strong> From I = V/R: doubling R while keeping V constant halves the current.' },
      'mcq-4-1':{ correct:'b', ok:'<strong>Correct!</strong> A series circuit has only one path — the same current flows through every component in that path.', bad:'<strong>Not quite.</strong> In a series circuit there is one path, so the same current flows through every component. Voltage is what divides.' },
      'mcq-4-2':{ correct:'c', ok:'<strong>Correct!</strong> Series total: R<sub>t</sub> = 10 + 20 + 30 = <strong>60 Ω</strong>.', bad:'<strong>Not quite.</strong> In series, resistances add directly: R<sub>t</sub> = 10 + 20 + 30 = 60 Ω.' }
    },
    ACTIVITIES: {
      'chal-1': {
        tests: [
          { name: 'Problem 1: I = 3 A  (24 V ÷ 8 Ω)', fn: c => /\b3\b/.test(c) },
          { name: 'Problem 2: V = 12 V  (2 A × 6 Ω)', fn: c => /\b12\b/.test(c) }
        ],
        defaultCode: `Problem 1: V = 24 V, R = 8 Ω → Find I\nI = V ÷ R = ___ ÷ ___ = ___ A\n\nProblem 2: I = 2 A, R = 6 Ω → Find V\nV = I × R = ___ × ___ = ___ V`
      },
      'chal-2': {
        tests: [
          { name: 'Series total = 500 Ω  (100+150+250)', fn: c => /\b500\b/.test(c) },
          { name: 'Parallel total ≈ 2.86 Ω  (5‖10‖20)',  fn: c => /2\.86|2\.857|20\/7/.test(c) }
        ],
        defaultCode: `Problem 1 (Series): R1=100Ω, R2=150Ω, R3=250Ω\nRt = R1 + R2 + R3 = ___ + ___ + ___ = ___ Ω\n\nProblem 2 (Parallel): R1=5Ω, R2=10Ω, R3=20Ω\n1/Rt = 1/5 + 1/10 + 1/20 = ___ → Rt = ___ Ω`
      }
    }
  },

};
