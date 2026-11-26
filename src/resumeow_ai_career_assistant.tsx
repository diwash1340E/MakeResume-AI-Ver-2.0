import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ============================================================================
// 1. DESIGN TOKENS, TYPOGRAPHY & LIGHTWEIGHT ANIMATION STYLES
// ============================================================================
const RESUMEOW_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&display=swap');

  .rm-root {
    --bg: #fffdfa;
    --bg-subtle: #f7f4f0;
    --ink: #2a2438;
    --mute: #7a7388;
    --line: #ece7f2;
    --lav: #7c6cf0;
    --lav-s: #efecff;
    --lav-ink: #ffffff;
    --peach: #ffd9c0;
    --peach-ink: #8a4319;
    --mint: #c6eedb;
    --mint-ink: #176944;
    --org: #f28c38;
    --orgd: #c9651a;
    --err: #c0392b;
    --overlay: rgba(23, 20, 31, 0.28);

    min-height: 100vh;
    background-color: var(--bg);
    color: var(--ink);
    font-family: "Bricolage Grotesque", system-ui, -apple-system, sans-serif;
    line-height: 1.55;
    transition: background-color 0.22s ease, color 0.22s ease;
    overflow-x: clip;
  }

  .rm-root[data-theme="dark"] {
    --bg: #17141f;
    --bg-subtle: #1e1a29;
    --ink: #f1edf8;
    --mute: #a49db4;
    --line: #2e2940;
    --lav: #a79bff;
    --lav-s: #262142;
    --lav-ink: #17141f;
    --peach: #4a3427;
    --peach-ink: #ffcca8;
    --mint: #1f3a31;
    --mint-ink: #8be0bc;
    --org: #f28c38;
    --orgd: #ffad70;
    --err: #f87171;
    --overlay: rgba(7, 5, 12, 0.62);
  }

  .rm-root :focus-visible {
    outline: 2px solid var(--lav);
    outline-offset: 3px;
    border-radius: 4px;
  }

  /* Custom subtle scrollbars for sticky inspector & editors */
  .rm-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .rm-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .rm-scroll::-webkit-scrollbar-thumb {
    background: var(--line);
    border-radius: 99px;
  }

  /* Underline-only inputs with lavender focus */
  .rm-field {
    width: 100%;
    border: 0;
    border-bottom: 1.5px solid var(--line);
    background: transparent;
    padding: 8px 0;
    color: var(--ink);
    border-radius: 0;
    transition: border-color 0.2s ease;
  }
  .rm-field::placeholder {
    color: var(--mute);
    opacity: 0.72;
  }
  .rm-field:focus {
    outline: 0;
    border-bottom-color: var(--lav);
  }

  /* Cat Mascot SVG Animations */
  .rm-cat {
    overflow: visible;
    cursor: pointer;
    user-select: none;
    transition: width 0.28s ease, height 0.28s ease;
  }
  .rm-cat .eye {
    transform-box: fill-box;
    transform-origin: center;
    animation: rmBlink 5s infinite;
  }
  .rm-cat .tail {
    transform-box: fill-box;
    transform-origin: 0 100%;
    animation: rmTail 4s ease-in-out infinite;
  }
  .rm-cat .body {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: rmBreathe 3.6s ease-in-out infinite;
  }
  .rm-cat .x {
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .rm-cat[data-state="generating"] .laptop,
  .rm-cat[data-state="review"] .glasses,
  .rm-cat[data-state="error"] .q,
  .rm-cat[data-state="success"] .spark {
    opacity: 1;
  }
  .rm-cat[data-state="generating"] .paw {
    animation: rmType 0.28s infinite alternate;
  }
  .rm-cat[data-state="upload"] .pupil,
  .rm-cat[data-state="reading"] .pupil {
    transform: translate(2px, 3px);
  }
  .rm-cat[data-state="reading"] .pupil {
    animation: rmScan 1.6s ease-in-out infinite;
  }
  .rm-cat[data-state="upload"] .eye {
    animation: none;
    transform: scale(1.16);
  }
  .rm-cat[data-state="success"] .body {
    animation: rmHop 0.55s ease 2;
  }
  .rm-cat[data-state="error"] .head {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    transform: rotate(-9deg);
  }
  .rm-cat[data-state="sleep"] .eye {
    animation: none;
    transform: scaleY(0.1);
  }
  .rm-cat[data-state="sleep"] .body {
    animation-duration: 6s;
  }
  .rm-cat .z {
    opacity: 0;
    fill: var(--lav);
    font-weight: 700;
  }
  .rm-cat[data-state="sleep"] .z {
    animation: rmSleepZ 2.4s ease-in infinite;
  }
  .rm-cat .head,
  .rm-cat .pupil {
    transition: transform 0.22s ease;
  }
  .rm-quiet .rm-cat:not([data-state="success"]) * {
    animation: none !important;
  }

  @keyframes rmBlink {
    0%, 94%, 100% { transform: scaleY(1); }
    97% { transform: scaleY(0.1); }
  }
  @keyframes rmTail {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(14deg); }
  }
  @keyframes rmBreathe {
    50% { transform: scale(1.02, 1.03); }
  }
  @keyframes rmType {
    to { transform: translateY(3px); }
  }
  @keyframes rmScan {
    0%, 100% { transform: translate(3px, 3px); }
    50% { transform: translate(-3px, 3px); }
  }
  @keyframes rmHop {
    50% { transform: translateY(-12px); }
  }
  @keyframes rmSleepZ {
    0% { opacity: 0; transform: translate(0, 0); }
    30% { opacity: 1; }
    100% { opacity: 0; transform: translate(12px, -26px); }
  }

  /* Boop Heart */
  .rm-heart {
    position: fixed;
    pointer-events: none;
    font-size: 20px;
    color: var(--org);
    animation: rmFloatUp 0.95s ease-out forwards;
    z-index: 70;
  }
  @keyframes rmFloatUp {
    from { opacity: 1; transform: translateY(0) scale(0.9); }
    to { opacity: 0; transform: translateY(-58px) scale(1.15); }
  }

  /* Rolling Lavender Yarn Ball Loader */
  .rm-yarn-ball {
    animation: rmRollYarn 1.75s ease-in-out forwards;
  }
  @keyframes rmRollYarn {
    to {
      left: calc(100% - 26px);
      transform: rotate(720deg);
    }
  }

  /* Highlight Jump Flash */
  .rm-flash {
    animation: rmFlash 1.55s ease;
  }
  @keyframes rmFlash {
    0%, 55% {
      background-color: var(--org);
      color: #ffffff;
    }
  }

  /* Subtle Fade-In */
  .rm-fade {
    animation: rmFadeIn 0.24s ease;
  }
  @keyframes rmFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .rm-root *, .rm-root *::before, .rm-root *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

// ============================================================================
// 2. INLINE SVG ICONS (ZERO EXTERNAL ICON DEPENDENCIES)
// ============================================================================
const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);

const IconSplit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M12 3v18" />
  </svg>
);

const IconExternal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

// ============================================================================
// 3. REAL-TIME KEYWORD EXTRACTION & RESUME PARSING UTILITIES
// ============================================================================
const SKILLS_DICTIONARY = [
  'Python', 'PyTorch', 'Reinforcement learning', 'TypeScript', 'React', 'Next.js',
  'Go', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'MLOps',
  'GraphQL', 'Distributed Systems', 'gRPC', 'CUDA', 'LLMs', 'RLHF', 'C++',
  'Java', 'SQL', 'Git', 'Linux', 'Tailwind CSS', 'WebSockets', 'Accessibility',
  'Design Systems', 'CI/CD', 'Terraform', 'AWS', 'Evaluation', 'Observability',
  'REST APIs', 'Concurrency', 'Testing', 'Edge Computing',
];

function extractSkills(text) {
  if (!text || !text.trim()) return [];
  const lower = text.toLowerCase();
  const found = [];
  for (const skill of SKILLS_DICTIONARY) {
    const escaped = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i');
    if (rx.test(lower)) found.push(skill);
  }
  return found;
}

function analyzeResumeStats(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const sections = [
    /\beducation\b/i,
    /\b(experience|research|employment)\b/i,
    /\bprojects\b/i,
    /\bskills\b/i,
    /\bpublications\b/i,
  ].filter((rx) => rx.test(trimmed)).length;
  const skills = extractSkills(trimmed);
  return {
    words,
    sections: Math.max(sections, 1),
    skills,
  };
}

/**
 * Lightweight parser so direct edits in the Overleaf LaTeX editor
 * immediately reflect in the side-by-side Resume Preview pane.
 */
function parseCustomLatexToBlocks(tex) {
  const cleanTex = (s) =>
    s
      .replace(/\\%/g, '%')
      .replace(/\\&/g, '&')
      .replace(/\\_/g, '_')
      .replace(/\$\\cdot\$/g, '·')
      .replace(/--/g, '–')
      .replace(/\\\\/g, '')
      .replace(/\\textbf\{([^}]*)\}/g, '$1')
      .replace(/\\textit\{([^}]*)\}/g, '$1')
      .replace(/\\hfill/g, ' — ')
      .trim();

  const lines = tex.split('\n');
  let name = 'Alex Rivera';
  let contact = '';
  const sections = [];
  let currentSec = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('%')) continue;
    if (
      line.startsWith('\\documentclass') ||
      line.startsWith('\\usepackage') ||
      line.startsWith('\\pagestyle') ||
      line === '\\begin{document}' ||
      line === '\\end{document}' ||
      line.startsWith('\\begin{itemize}') ||
      line.startsWith('\\end{itemize}')
    ) {
      continue;
    }

    const secMatch = line.match(/^\\section\*?\{([^}]+)\}/);
    if (secMatch) {
      name = cleanTex(secMatch[1]);
      continue;
    }

    const subMatch = line.match(/^\\subsection\*?\{([^}]+)\}/);
    if (subMatch) {
      currentSec = { title: cleanTex(subMatch[1]), items: [] };
      sections.push(currentSec);
      continue;
    }

    if (!currentSec) {
      contact = contact ? `${contact} ${cleanTex(line)}` : cleanTex(line);
      continue;
    }

    if (line.startsWith('\\item')) {
      currentSec.items.push({
        type: 'bullet',
        text: cleanTex(line.replace(/^\\item\s*/, '')),
      });
    } else if (line.includes('\\hfill')) {
      const [left, right] = line.split('\\hfill');
      currentSec.items.push({
        type: 'heading',
        left: cleanTex(left),
        right: cleanTex(right),
      });
    } else {
      currentSec.items.push({
        type: 'text',
        text: cleanTex(line),
      });
    }
  }

  return { name, contact, sections };
}

// ============================================================================
// 4. SAMPLE MASTER RESUME & 3 REALISTIC DEMO PRESETS
// ============================================================================
const SAMPLE_PLAIN_RESUME = `Alex Rivera
alex.rivera@university.edu · Lubbock, TX · github.com/arivera

EDUCATION
Texas Tech University — B.S. in Computer Science (Expected May 2027)
GPA: 3.91 / 4.00 · Coursework: Distributed Systems, Machine Learning, Operating Systems, Databases

EXPERIENCE & RESEARCH
Undergraduate ML Research Assistant — Autonomous Systems Lab (Jan 2025 – Present)
- Trained PPO agents under simulated actuator failures for bipedal locomotion recovery.
- Built evaluation pipelines in Python to benchmark reward stability across 40+ environment seeds.

Software Engineering Intern — CoreMetric Systems (May 2025 – Aug 2025)
- Built backend APIs in Go and PostgreSQL for usage metering and webhook delivery.
- Improved dashboard query performance for enterprise accounts and added automated unit tests.

PROJECTS
ResuFlow — Interactive Career Workspace (React, TypeScript, Node.js, Tailwind CSS)
- Built a responsive resume workflow app with clean live editing and export tools.

MeshKV — Fault-Tolerant Key-Value Store (Go, gRPC, Redis)
- Implemented leader election and log replication across multi-node local clusters.

SKILLS
Languages: Python, Go, TypeScript, C++, SQL
Tools: React, Node.js, PostgreSQL, Redis, gRPC, Reinforcement learning, Git, Linux, Tailwind CSS`;

const SAMPLE_LATEX_RESUME = `\\documentclass[10.5pt,letterpaper]{article}
\\usepackage[margin=0.65in]{geometry}
\\usepackage{enumitem,hyperref}
\\pagestyle{empty}

\\begin{document}
\\section*{Alex Rivera}
alex.rivera@university.edu $\\cdot$ Lubbock, TX $\\cdot$ github.com/arivera

\\subsection*{Education}
\\textbf{Texas Tech University} \\hfill Expected May 2027 \\\\
B.S. in Computer Science (GPA: 3.91 / 4.00)

\\subsection*{Experience \\& Research}
\\textbf{Undergraduate ML Research Assistant — Autonomous Systems Lab} \\hfill Jan 2025 -- Present
\\begin{itemize}[leftmargin=1.2em,noitemsep]
  \\item Trained PPO agents under simulated actuator failures for bipedal locomotion recovery.
  \\item Built evaluation pipelines in Python to benchmark reward stability across 40+ environment seeds.
\\end{itemize}

\\textbf{Software Engineering Intern — CoreMetric Systems} \\hfill May 2025 -- Aug 2025
\\begin{itemize}[leftmargin=1.2em,noitemsep]
  \\item Built backend APIs in Go and PostgreSQL for usage metering and webhook delivery.
  \\item Improved dashboard query performance for enterprise accounts and added automated unit tests.
\\end{itemize}

\\subsection*{Projects}
\\textbf{ResuFlow — Interactive Career Workspace} \\hfill React, TypeScript, Tailwind CSS
\\begin{itemize}[leftmargin=1.2em,noitemsep]
  \\item Built a responsive resume workflow app with clean live editing and export tools.
\\end{itemize}

\\textbf{MeshKV — Fault-Tolerant Key-Value Store} \\hfill Go, gRPC, Redis
\\begin{itemize}[leftmargin=1.2em,noitemsep]
  \\item Implemented leader election and log replication across multi-node local clusters.
\\end{itemize}

\\subsection*{Skills}
Python, Go, TypeScript, C++, SQL, React, Node.js, PostgreSQL, Redis, gRPC, Reinforcement learning, Git, Linux
\\end{document}`;

const DEMO_PRESETS = {
  stripe: {
    id: 'stripe',
    label: 'Stripe — SWE Intern',
    subtitle: 'Core Payments Infrastructure',
    company: 'Stripe',
    position: 'Software Engineering Intern',
    fileName: 'Alex_Rivera_Master_Resume.pdf',
    notes: 'One page only. Emphasize distributed systems, PostgreSQL latency, and API reliability.',
    intensity: 'Balanced',
    jd: `Stripe — Software Engineering Intern, Core Payments Infrastructure

Design, build, and scale fault-tolerant distributed APIs processing millions of financial requests with sub-100ms latency and strict reliability guarantees.

Responsibilities:
- Build resilient backend services in Go or Python with strong Observability and Testing.
- Optimize PostgreSQL queries, indexing strategies, and asynchronous webhook pipelines.
- Collaborate across REST APIs, Distributed Systems, and developer tooling teams.

Qualifications:
- Strong foundation in Go, Python, PostgreSQL, Redis, and Distributed Systems.
- Bonus: Experience with Docker, Kubernetes, GraphQL, or Terraform.`,
    baseScores: { keywords: 72, skills: 84, experience: 82 },
    missingSkills: ['Docker', 'Kubernetes', 'GraphQL', 'Observability'],
    matchedSkills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'Distributed Systems'],
    appliedChanges: [
      {
        id: 'st-1',
        markId: 'm1',
        bulletKey: 'core_1',
        section: 'CoreMetric Systems',
        rationale: 'Aligned your Go & PostgreSQL webhook work with Stripe’s idempotency and API reliability language.',
        original: 'Built backend APIs in Go and PostgreSQL for usage metering and webhook delivery.',
        modified: 'Engineered fault-tolerant Go and PostgreSQL REST APIs for usage metering and idempotent webhook delivery across 95K+ daily events.',
        boost: { keywords: 5, skills: 2, experience: 3 },
      },
      {
        id: 'st-2',
        markId: 'm2',
        bulletKey: 'core_2',
        section: 'CoreMetric Systems',
        rationale: 'Surfaced database indexing and testing rigor directly highlighted in the role.',
        original: 'Improved dashboard query performance for enterprise accounts and added automated unit tests.',
        modified: 'Cut p95 enterprise dashboard query latency by 38% via composite PostgreSQL indexes and authored 70+ automated unit and integration tests.',
        boost: { keywords: 4, skills: 3, experience: 4 },
      },
      {
        id: 'st-3',
        markId: 'm3',
        bulletKey: 'mesh_1',
        section: 'MeshKV Project',
        rationale: 'Clarified distributed consensus terminology to reinforce your Distributed Systems fit.',
        original: 'Implemented leader election and log replication across multi-node local clusters.',
        modified: 'Implemented Raft leader election, log replication, and fault-injection tests across 5-node distributed clusters in Go and gRPC.',
        boost: { keywords: 3, skills: 2, experience: 2 },
      },
    ],
    suggestions: [
      {
        id: 'sug-st-1',
        markId: 's1',
        target: 'mesh_extra',
        title: 'Add latency & observability metrics to MeshKV if you measured them.',
        detail: 'Stripe values observability. Only add this if you actually captured throughput or tail latency numbers.',
        bulletText: 'Instrumented structured request tracing and p99 RPC latency histograms across cluster nodes.',
        boost: { keywords: 4, skills: 2, experience: 2 },
      },
      {
        id: 'sug-st-2',
        markId: 's2',
        target: 'res_extra',
        title: 'Mention any CI/CD or containerized test workflow you built.',
        detail: 'Not changed in your resume automatically — apply only if accurate.',
        bulletText: 'Standardized local multi-service integration suites to catch schema regressions before merge.',
        boost: { keywords: 3, skills: 2, experience: 1 },
      },
    ],
  },

  anthropic: {
    id: 'anthropic',
    label: 'Anthropic — Research Intern',
    subtitle: 'Alignment & Evaluation',
    company: 'Anthropic',
    position: 'ML Research Engineering Intern',
    fileName: 'Alex_Rivera_Master_Resume.pdf',
    notes: 'One page only. Lead with research, reproducible evaluation harnesses, and Python.',
    intensity: 'Balanced',
    jd: `Anthropic — ML Research Engineering Intern, Alignment & Evaluation

Partner with researchers to build scalable Evaluation harnesses, reliable Python experimentation pipelines, and Reinforcement learning tooling for frontier LLMs.

Responsibilities:
- Design deterministic, fault-tolerant evaluation suites in Python and PyTorch.
- Run reproducible large-scale experiments and analyze model behavior across edge cases.
- Collaborate closely with scientists on RLHF, Evaluation, and Linux cluster reliability.

Qualifications:
- Strong engineering foundation in Python, Reinforcement learning, Evaluation, and Linux.
- Bonus: Experience with PyTorch, CUDA, MLOps, or Docker.`,
    baseScores: { keywords: 70, skills: 82, experience: 85 },
    missingSkills: ['PyTorch', 'MLOps', 'Docker', 'RLHF'],
    matchedSkills: ['Python', 'Reinforcement learning', 'Evaluation', 'Linux', 'Git'],
    appliedChanges: [
      {
        id: 'an-1',
        markId: 'm1',
        bulletKey: 'ml_1',
        section: 'Autonomous Systems Lab',
        rationale: 'Highlighted measurable recovery reward and failure-mode rigor to mirror Alignment & Evaluation needs.',
        original: 'Trained PPO agents under simulated actuator failures for bipedal locomotion recovery.',
        modified: 'Trained PPO reinforcement learning agents under simulated actuator failures; improved recovery reward by 18% across out-of-distribution stress scenarios.',
        boost: { keywords: 5, skills: 3, experience: 4 },
      },
      {
        id: 'an-2',
        markId: 'm2',
        bulletKey: 'ml_2',
        section: 'Autonomous Systems Lab',
        rationale: 'Reframed benchmarking scripts as deterministic evaluation harnesses matching Anthropic’s core workflow.',
        original: 'Built evaluation pipelines in Python to benchmark reward stability across 40+ environment seeds.',
        modified: 'Architected reproducible Python evaluation harnesses benchmarking policy stability and failure modes across 40+ deterministic seeds.',
        boost: { keywords: 5, skills: 3, experience: 3 },
      },
      {
        id: 'an-3',
        markId: 'm3',
        bulletKey: 'mesh_1',
        section: 'MeshKV Project',
        rationale: 'Connected distributed reliability work to scalable ML experimentation infrastructure.',
        original: 'Implemented leader election and log replication across multi-node local clusters.',
        modified: 'Implemented fault-tolerant leader election and replicated state logs across multi-node clusters with deterministic chaos testing.',
        boost: { keywords: 2, skills: 2, experience: 2 },
      },
    ],
    suggestions: [
      {
        id: 'sug-an-1',
        markId: 's1',
        target: 'ml_extra',
        title: 'Mention technical write-ups or lab notes if you shared findings.',
        detail: 'Research engineering teams prize crisp written analysis alongside strong systems code.',
        bulletText: 'Authored weekly ablation reports documenting reward-shaping trade-offs and reproducibility checks for 6 lab members.',
        boost: { keywords: 3, skills: 2, experience: 3 },
      },
      {
        id: 'sug-an-2',
        markId: 's2',
        target: 'mesh_extra',
        title: 'Add a Docker or MLOps workflow bullet if you packaged experiments.',
        detail: 'Not changed in your resume automatically — only include if true.',
        bulletText: 'Containerized experiment dependencies to guarantee bit-for-bit reproducible training runs across Linux hosts.',
        boost: { keywords: 4, skills: 3, experience: 1 },
      },
    ],
  },

  vercel: {
    id: 'vercel',
    label: 'Vercel — Frontend Engineer',
    subtitle: 'Design Systems & DX',
    company: 'Vercel',
    position: 'Frontend Engineer Intern',
    fileName: 'Alex_Rivera_Master_Resume.pdf',
    notes: 'Highlight React, TypeScript, Tailwind CSS, Accessibility, and crisp interface craft.',
    intensity: 'Balanced',
    jd: `Vercel — Frontend Engineer Intern, Design Systems & DX

Craft ultra-fast, accessible web interfaces and developer tools powering Next.js and Vercel's dashboard.

Responsibilities:
- Build reusable React, TypeScript, and Tailwind CSS primitives with zero layout shift.
- Optimize perceived latency, keyboard Accessibility, and clean Design Systems architecture.
- Partner closely across frontend and backend teams to ship thoughtful DX improvements.

Qualifications:
- Strong fluency in React, TypeScript, Tailwind CSS, and Node.js.
- Bonus: Experience with Next.js, Design Systems, Accessibility, or Edge Computing.`,
    baseScores: { keywords: 71, skills: 83, experience: 79 },
    missingSkills: ['Next.js', 'Design Systems', 'Accessibility', 'Edge Computing'],
    matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git'],
    appliedChanges: [
      {
        id: 'vc-1',
        markId: 'm1',
        bulletKey: 'res_1',
        section: 'ResuFlow Project',
        rationale: 'Spotlighted React, TypeScript, and Tailwind CSS craft to directly mirror Vercel’s frontend stack.',
        original: 'Built a responsive resume workflow app with clean live editing and export tools.',
        modified: 'Engineered a responsive React, TypeScript, and Tailwind CSS workflow editor with live state synchronization, zero layout shift, and instant client-side export.',
        boost: { keywords: 6, skills: 4, experience: 4 },
      },
      {
        id: 'vc-2',
        markId: 'm2',
        bulletKey: 'core_2',
        section: 'CoreMetric Systems',
        rationale: 'Connected database query optimization directly to faster dashboard time-to-interactive.',
        original: 'Improved dashboard query performance for enterprise accounts and added automated unit tests.',
        modified: 'Reduced enterprise dashboard time-to-interactive by 38% via optimized query paths and shipped 70+ automated regression tests.',
        boost: { keywords: 4, skills: 2, experience: 3 },
      },
    ],
    suggestions: [
      {
        id: 'sug-vc-1',
        markId: 's1',
        target: 'res_extra',
        title: 'Call out keyboard navigation and WCAG contrast work in ResuFlow.',
        detail: 'Accessibility is central to Design Systems roles. Only apply if you implemented it.',
        bulletText: 'Implemented full keyboard navigation, ARIA tab/dialog semantics, and reduced-motion safeguards across all interactive views.',
        boost: { keywords: 5, skills: 3, experience: 2 },
      },
      {
        id: 'sug-vc-2',
        markId: 's2',
        target: 'mesh_extra',
        title: 'Quantify ResuFlow performance or interaction latency.',
        detail: 'Only you know the real numbers — add a measured metric if you profiled it.',
        bulletText: 'Maintained sub-100ms interaction latency and zero external bloat across desktop and ultrawide viewports.',
        boost: { keywords: 3, skills: 2, experience: 2 },
      },
    ],
  },
};

const INITIAL_SAVED_APPS = [
  {
    id: 'saved-linear-1',
    company: 'Linear',
    position: 'Product Engineer Intern',
    status: 'Interviewing',
    score: 88,
    savedAt: 'Nov 21, 2026',
    presetId: 'vercel',
    revertedIds: [],
    appliedSuggestionIds: ['sug-vc-1'],
    tappedSkills: ['Design Systems', 'Accessibility'],
    selectedDocs: { resume: true, coverLetter: true, recLetter: false },
  },
  {
    id: 'saved-acme-2',
    company: 'Acme Robotics',
    position: 'ML Engineering Intern',
    status: 'Applied',
    score: 84,
    savedAt: 'Nov 18, 2026',
    presetId: 'anthropic',
    revertedIds: [],
    appliedSuggestionIds: [],
    tappedSkills: ['PyTorch'],
    selectedDocs: { resume: true, coverLetter: true, recLetter: true },
  },
];

const STATUS_OPTIONS = ['Draft', 'Applied', 'Interviewing', 'Offer'];
const STARTER_CHIPS = ['One page only', 'Lead with research', 'Quantify impact', 'Emphasize systems'];
const CAT_QUIPS = [
  'Purr… that tickles.',
  'Your bullet points are looking sharp.',
  'I knock things off tables. Never your resume.',
  'Quantify your impact. Numbers get interviews.',
  'Have you had some water lately?',
];

// ============================================================================
// 5. DOCUMENT BUILDERS (RESUME MODEL, OVERLEAF LATEX, COVER LETTER, REC EMAIL)
// ============================================================================
function escapeTex(str) {
  return (str || '')
    .replace(/%/g, '\\%')
    .replace(/&/g, '\\&')
    .replace(/_/g, '\\_');
}

function buildTailoredResume(preset, revertedIds, appliedSuggestionIds, tappedSkills) {
  const resolve = (bulletKey, fallback) => {
    const chg = preset.appliedChanges.find((c) => c.bulletKey === bulletKey);
    if (!chg) return { text: fallback, isNew: false, markId: null };
    const reverted = revertedIds.includes(chg.id);
    return {
      text: reverted ? chg.original : chg.modified,
      isNew: !reverted,
      markId: !reverted ? chg.markId : null,
    };
  };

  const mlBullets = [
    resolve('ml_1', 'Trained PPO agents under simulated actuator failures for bipedal locomotion recovery.'),
    resolve('ml_2', 'Built evaluation pipelines in Python to benchmark reward stability across 40+ environment seeds.'),
  ];

  const coreBullets = [
    resolve('core_1', 'Built backend APIs in Go and PostgreSQL for usage metering and webhook delivery.'),
    resolve('core_2', 'Improved dashboard query performance for enterprise accounts and added automated unit tests.'),
  ];

  const resBullets = [
    resolve('res_1', 'Built a responsive resume workflow app with clean live editing and export tools.'),
  ];

  const meshBullets = [
    resolve('mesh_1', 'Implemented leader election and log replication across multi-node local clusters.'),
  ];

  preset.suggestions.forEach((sug) => {
    if (appliedSuggestionIds.includes(sug.id)) {
      const item = { text: sug.bulletText, isNew: true, markId: sug.markId };
      if (sug.target === 'ml_extra') mlBullets.push(item);
      if (sug.target === 'res_extra') resBullets.push(item);
      if (sug.target === 'mesh_extra') meshBullets.push(item);
    }
  });

  const baseSkills = [
    'Python', 'Go', 'TypeScript', 'C++', 'SQL',
    'React', 'Node.js', 'PostgreSQL', 'Redis', 'gRPC',
    'Reinforcement learning', 'Git', 'Linux',
  ];

  const addedSkills = tappedSkills.filter((s) => !baseSkills.includes(s));

  return {
    name: 'Alex Rivera',
    contact: 'alex.rivera@university.edu · Lubbock, TX · github.com/arivera',
    mlBullets,
    coreBullets,
    resBullets,
    meshBullets,
    baseSkills,
    addedSkills,
  };
}

function buildOverleafLatex(model, company, position, intensity) {
  const renderList = (bullets) =>
    bullets.map((b) => `  \\item ${escapeTex(b.text)}`).join('\n');

  const allSkills = [...model.baseSkills, ...model.addedSkills];

  return `% Overleaf-compatible resume tailored by ResuMeow (Mock data)
% Target: ${company || 'Target Company'} — ${position || 'Target Role'} (${intensity} intensity)
\\documentclass[10.5pt,letterpaper]{article}
\\usepackage[margin=0.65in]{geometry}
\\usepackage{enumitem,hyperref}
\\pagestyle{empty}

\\begin{document}
\\section*{${escapeTex(model.name)}}
alex.rivera@university.edu $\\cdot$ Lubbock, TX $\\cdot$ github.com/arivera

\\subsection*{Education}
\\textbf{Texas Tech University} \\hfill Expected May 2027 \\\\
B.S. in Computer Science (GPA: 3.91 / 4.00)

\\subsection*{Experience \\& Research}
\\textbf{Undergraduate ML Research Assistant — Autonomous Systems Lab} \\hfill Jan 2025 -- Present
\\begin{itemize}[leftmargin=1.2em,noitemsep]
${renderList(model.mlBullets)}
\\end{itemize}

\\textbf{Software Engineering Intern — CoreMetric Systems} \\hfill May 2025 -- Aug 2025
\\begin{itemize}[leftmargin=1.2em,noitemsep]
${renderList(model.coreBullets)}
\\end{itemize}

\\subsection*{Projects}
\\textbf{ResuFlow — Interactive Career Workspace} \\hfill React, TypeScript, Tailwind CSS
\\begin{itemize}[leftmargin=1.2em,noitemsep]
${renderList(model.resBullets)}
\\end{itemize}

\\textbf{MeshKV — Fault-Tolerant Key-Value Store} \\hfill Go, gRPC, Redis
\\begin{itemize}[leftmargin=1.2em,noitemsep]
${renderList(model.meshBullets)}
\\end{itemize}

\\subsection*{Skills}
${escapeTex(allSkills.join(', '))}
\\end{document}`;
}

function buildCoverLetter(tone, company, position, tappedSkills) {
  const c = company.trim() || 'Acme Robotics';
  const p = position.trim() || 'ML Engineering Intern';
  const skillNote =
    tappedSkills.length > 0
      ? ` I also bring hands-on familiarity with ${tappedSkills.join(', ')}.`
      : '';

  if (tone === 'Enthusiastic') {
    return `Hi ${c} Team,

I would love to join ${c} as a ${p}! As a Computer Science student who enjoys working at the intersection of dependable systems and thoughtful engineering, I have admired ${c}’s craft and would be thrilled to contribute this upcoming term.

In my research at the Autonomous Systems Lab, I trained PPO reinforcement learning agents under actuator-failure conditions and built reproducible Python evaluation pipelines across 40+ seeds. During my internship at CoreMetric Systems, I shipped Go and PostgreSQL backend APIs, cut p95 enterprise dashboard query latency by 38%, and authored 70+ automated tests.${skillNote}

I care deeply about clear communication, measurable outcomes, and leaving every codebase calmer than I found it. Thank you for considering my application — I would be excited to speak with your team!

Warmly,
Alex Rivera
alex.rivera@university.edu · github.com/arivera`;
  }

  if (tone === 'Formal') {
    return `Dear ${c} Hiring Committee,

I am writing to apply for the ${p} position at ${c}. Currently pursuing a B.S. in Computer Science at Texas Tech University (GPA: 3.91/4.00), I have focused my academic research and industry experience on reliable software infrastructure, empirical evaluation, and full-stack engineering.

At CoreMetric Systems, I engineered Go and PostgreSQL APIs for usage metering and webhook delivery while reducing p95 dashboard query latency by 38% and expanding automated test coverage. In parallel, my work as an Undergraduate ML Research Assistant in the Autonomous Systems Lab strengthened my background in reinforcement learning, deterministic evaluation harnesses, and experimental rigor.${skillNote}

I would welcome the opportunity to discuss how my skills align with ${c}’s goals. Thank you for your time and consideration.

Sincerely,
Alex Rivera
alex.rivera@university.edu`;
  }

  return `Dear ${c} Team,

I am applying for the ${p} role. I am a Computer Science student (3.91 GPA) with practical experience in reliable systems, machine learning evaluation, and modern web engineering.

Relevant highlights for ${c}:
• Autonomous Systems Lab: Trained PPO agents under actuator failures and built reproducible Python evaluation harnesses across 40+ seeds.
• CoreMetric Systems (SWE Intern): Built Go & PostgreSQL webhook/metering APIs, cut p95 dashboard latency by 38%, and added 70+ automated tests.
• Projects: Built ResuFlow (React, TypeScript, Tailwind CSS) and MeshKV (Go, gRPC, Redis).${skillNote}

Thank you for your time — I would love to connect.

Best,
Alex Rivera
alex.rivera@university.edu`;
}

function buildRecommendationDraft({ name, relationship, deadline, company, position }) {
  const c = company.trim() || 'Acme Robotics';
  const p = position.trim() || 'ML Engineering Intern';
  const who = name.trim() || 'Dr. Morales';
  const rel = relationship.trim() || 'Research Advisor';
  const due = deadline.trim() || 'December 15, 2026';

  const subject = `Recommendation letter request — Alex Rivera (${c}, ${p})`;
  const body = `Dear ${who},

I hope you are having a calm and productive week. I am reaching out to ask if you would feel comfortable writing a brief letter of recommendation for my application to the ${p} position at ${c}.

Because the team values rigorous engineering and clear problem-solving, your perspective as my ${rel} would mean a great deal to my application.

To save you time, I have attached my tailored resume and summarized a few highlights you are welcome to draw from:
• Autonomous Systems Lab: PPO failure-recovery experiments and reproducible Python evaluation pipelines across 40+ seeds
• CoreMetric Systems Internship: Go/PostgreSQL API engineering, 38% p95 query latency reduction, and 70+ automated tests
• Projects: ResuFlow (React/TypeScript) and MeshKV (Go/gRPC)

The portal deadline is ${due}, and they will send a direct submission link once I list your email. Please feel free to decline if your calendar is full this month — I completely understand.

Thank you so much for your mentorship and support.

Best regards,
Alex Rivera
alex.rivera@university.edu`;

  return { subject, body };
}

// ============================================================================
// 6. REUSABLE COMPONENTS: MILO CAT MASCOT, YARN LOADER, RESUME PREVIEW, INSPECTOR
// ============================================================================
const CatMascot = ({ state, quiet, compact, onBoop, pupilOffset }) => {
  const pupilStyle =
    !quiet && state === 'idle' && pupilOffset
      ? { transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }
      : undefined;

  return (
    <svg
      className={`rm-cat ${compact ? 'w-[72px] h-[68px] sm:w-[84px] sm:h-[80px]' : 'w-[144px] h-[136px] sm:w-[180px] sm:h-[170px] lg:w-[196px] lg:h-[186px]'}`}
      data-state={state}
      viewBox="0 0 200 190"
      role="img"
      aria-label={`Milo the orange cat assistant (${state})`}
      onClick={onBoop}
    >
      {/* Animated Tail */}
      <g className="tail">
        <path
          d="M142 150c34 4 44-30 24-48"
          fill="none"
          stroke="#f28c38"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>

      {/* Breathing Body + Expressive Head */}
      <g className="body">
        <ellipse cx="100" cy="152" rx="52" ry="34" fill="#f28c38" />
        <ellipse cx="100" cy="160" rx="26" ry="22" fill="#ffe3cc" />

        <g className="head">
          {/* Ears */}
          <path d="M52 62 48 24 82 46ZM148 62 152 24 118 46Z" fill="#f28c38" />
          <path d="M58 54 57 36 72 47ZM142 54 143 36 128 47Z" fill="#ffb98c" />

          {/* Head + Forehead Tabby Stripes */}
          <ellipse cx="100" cy="80" rx="54" ry="44" fill="#f28c38" />
          <path
            d="M92 40v14M100 38v16M108 40v14"
            stroke="#c9651a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Muzzle */}
          <ellipse cx="100" cy="94" rx="22" ry="16" fill="#ffe3cc" />

          {/* Eyes + Cursor Tracking Pupils */}
          <g className="eye">
            <ellipse cx="78" cy="78" rx="8" ry="9.5" fill="#fff" />
            <circle className="pupil" cx="78" cy="79" r="5" fill="#2a2438" style={pupilStyle} />
          </g>
          <g className="eye">
            <ellipse cx="122" cy="78" rx="8" ry="9.5" fill="#fff" />
            <circle className="pupil" cx="122" cy="79" r="5" fill="#2a2438" style={pupilStyle} />
          </g>

          {/* Nose & Mouth */}
          <path d="M95 90h10l-5 6Z" fill="#e0788a" />
          <path
            d="M100 96v4M90 102q5 4 10-2 5 6 10 2"
            fill="none"
            stroke="#2a2438"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Review State Lavender Glasses */}
          <g className="x glasses">
            <circle cx="78" cy="78" r="13" fill="none" stroke="var(--lav)" strokeWidth="3" />
            <circle cx="122" cy="78" r="13" fill="none" stroke="var(--lav)" strokeWidth="3" />
            <path d="M91 78h18" stroke="var(--lav)" strokeWidth="3" />
          </g>

          {/* Error State Question Mark */}
          <text className="x q" x="150" y="40" fontSize="30" fontWeight="700" fill="var(--lav)">
            ?
          </text>
        </g>

        {/* Generating State Miniature Lavender Laptop */}
        <g className="x laptop">
          <rect x="66" y="128" width="68" height="40" rx="5" fill="#d8d2f5" />
          <rect x="72" y="133" width="56" height="28" rx="3" fill="#7c6cf0" />
          <ellipse className="paw" cx="86" cy="164" rx="8" ry="5" fill="#f28c38" />
          <ellipse
            className="paw"
            cx="114"
            cy="164"
            rx="8"
            ry="5"
            fill="#f28c38"
            style={{ animationDelay: '0.15s' }}
          />
        </g>
      </g>

      {/* Sleep Z's */}
      <text className="z" x="150" y="50" fontSize="22">z</text>
      <text className="z" x="166" y="34" fontSize="16" style={{ animationDelay: '1.2s' }}>z</text>

      {/* Success Sparkles */}
      <g className="x spark" fill="var(--lav)">
        <path d="M30 40l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
        <path d="M168 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#f28c38" />
      </g>
    </svg>
  );
};

const YarnLoader = () => (
  <div
    className="relative mt-3.5 h-[28px] border-b-[1.5px] border-dashed border-[var(--line)]"
    aria-hidden="true"
  >
    <svg className="rm-yarn-ball absolute -bottom-[1px] left-0 w-[26px] h-[26px]" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="12" fill="var(--lav)" />
      <path
        d="M4 9q9 5 18-2M3 15q10 6 20-2M7 22q6-8 14-14"
        fill="none"
        stroke="var(--lav-s)"
        strokeWidth="1.6"
      />
    </svg>
  </div>
);

const ResumePreviewDocument = ({
  tailoredModel,
  manualLatex,
  flashMarkId,
  onResetLatex,
  compactWidth = false,
}) => {
  // If user typed custom LaTeX directly, render live parsed preview
  if (manualLatex !== null) {
    const parsed = parseCustomLatexToBlocks(manualLatex);
    return (
      <article className={`${compactWidth ? 'max-w-none' : 'max-w-[760px]'} py-1`}>
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2.5 text-[13px] text-[var(--mute)]">
          <span>Live preview synced from your custom LaTeX edits</span>
          <button
            type="button"
            onClick={onResetLatex}
            className="text-[var(--lav)] hover:underline underline-offset-4 cursor-pointer"
          >
            Reset LaTeX
          </button>
        </div>

        <h3 className="text-[24px] font-bold tracking-[-0.02em] leading-tight">{parsed.name}</h3>
        {parsed.contact && <p className="mt-1 text-[14px] text-[var(--mute)]">{parsed.contact}</p>}

        {parsed.sections.map((sec, idx) => (
          <div key={idx} className="mt-5 border-t border-[var(--line)] pt-3.5">
            <h4 className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--mute)]">
              {sec.title}
            </h4>
            <div className="space-y-1.5 text-[15px] leading-[1.6]">
              {sec.items.map((item, i) => {
                if (item.type === 'heading') {
                  return (
                    <div key={i} className="mt-2.5 flex flex-wrap items-baseline justify-between gap-2 first:mt-0">
                      <strong className="font-bold">{item.left}</strong>
                      <span className="text-[13.5px] text-[var(--mute)]">{item.right}</span>
                    </div>
                  );
                }
                if (item.type === 'bullet') {
                  return (
                    <div key={i} className="flex gap-2.5 pl-1">
                      <span className="text-[var(--mute)]">•</span>
                      <span>{item.text}</span>
                    </div>
                  );
                }
                return (
                  <p key={i} className="m-0">
                    {item.text}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </article>
    );
  }

  return (
    <article className={`${compactWidth ? 'max-w-none' : 'max-w-[760px]'} py-1`}>
      <h3 className="text-[24px] font-bold tracking-[-0.02em] leading-tight">{tailoredModel.name}</h3>
      <p className="mt-1 text-[14px] text-[var(--mute)]">{tailoredModel.contact}</p>

      {/* Education */}
      <div className="mt-5 border-t border-[var(--line)] pt-3.5">
        <h4 className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--mute)]">
          Education
        </h4>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <strong className="font-bold">Texas Tech University</strong>
          <span className="text-[13.5px] text-[var(--mute)]">Expected May 2027</span>
        </div>
        <p className="mt-0.5 text-[15px]">B.S. in Computer Science · GPA: 3.91 / 4.00</p>
      </div>

      {/* Experience & Research */}
      <div className="mt-5 border-t border-[var(--line)] pt-3.5">
        <h4 className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--mute)]">
          Experience & Research
        </h4>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <strong className="font-bold">Undergraduate ML Research Assistant — Autonomous Systems Lab</strong>
          <span className="text-[13.5px] text-[var(--mute)]">Jan 2025 – Present</span>
        </div>
        <ul className="mt-1.5 mb-4 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.6]">
          {tailoredModel.mlBullets.map((b, i) => (
            <li key={i}>
              {b.isNew ? (
                <mark
                  id={b.markId || undefined}
                  className={`rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)] transition-colors ${
                    flashMarkId === b.markId ? 'rm-flash' : ''
                  }`}
                >
                  {b.text}
                </mark>
              ) : (
                b.text
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <strong className="font-bold">Software Engineering Intern — CoreMetric Systems</strong>
          <span className="text-[13.5px] text-[var(--mute)]">May 2025 – Aug 2025</span>
        </div>
        <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.6]">
          {tailoredModel.coreBullets.map((b, i) => (
            <li key={i}>
              {b.isNew ? (
                <mark
                  id={b.markId || undefined}
                  className={`rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)] transition-colors ${
                    flashMarkId === b.markId ? 'rm-flash' : ''
                  }`}
                >
                  {b.text}
                </mark>
              ) : (
                b.text
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Projects */}
      <div className="mt-5 border-t border-[var(--line)] pt-3.5">
        <h4 className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--mute)]">
          Projects
        </h4>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <strong className="font-bold">ResuFlow — Interactive Career Workspace</strong>
          <span className="text-[13.5px] text-[var(--mute)]">React, TypeScript, Tailwind CSS</span>
        </div>
        <ul className="mt-1.5 mb-4 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.6]">
          {tailoredModel.resBullets.map((b, i) => (
            <li key={i}>
              {b.isNew ? (
                <mark
                  id={b.markId || undefined}
                  className={`rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)] transition-colors ${
                    flashMarkId === b.markId ? 'rm-flash' : ''
                  }`}
                >
                  {b.text}
                </mark>
              ) : (
                b.text
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <strong className="font-bold">MeshKV — Fault-Tolerant Key-Value Store</strong>
          <span className="text-[13.5px] text-[var(--mute)]">Go, gRPC, Redis</span>
        </div>
        <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-[15px] leading-[1.6]">
          {tailoredModel.meshBullets.map((b, i) => (
            <li key={i}>
              {b.isNew ? (
                <mark
                  id={b.markId || undefined}
                  className={`rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)] transition-colors ${
                    flashMarkId === b.markId ? 'rm-flash' : ''
                  }`}
                >
                  {b.text}
                </mark>
              ) : (
                b.text
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div className="mt-5 border-t border-[var(--line)] pt-3.5">
        <h4 className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--mute)]">
          Skills
        </h4>
        <p className="text-[15px] leading-[1.7]">
          {tailoredModel.baseSkills.join(', ')}
          {tailoredModel.addedSkills.length > 0 && (
            <>
              {', '}
              <mark className="rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)]">
                {tailoredModel.addedSkills.join(', ')}
              </mark>
            </>
          )}
        </p>
      </div>
    </article>
  );
};

const ScoreAndSkillsSummary = ({
  displayScore,
  liveScores,
  activePreset,
  tappedSkills,
  onToggleSkill,
  stacked = false,
}) => (
  <div className={stacked ? 'space-y-6' : 'grid gap-6 md:grid-cols-[minmax(240px,0.9fr)_1.1fr] md:items-start'}>
    {/* Score + Weighted Bars */}
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-[44px] font-medium leading-none tracking-[-0.03em]">{displayScore}</span>
        <span className="text-[16px] text-[var(--mute)]">/100</span>
      </div>
      <p className="mt-1 text-[13.5px] text-[var(--mute)]">Job match (mock)</p>
      <p className="mt-1 text-[14px] font-bold text-[var(--lav)]">{liveScores.verdict}</p>

      <dl className="mt-3 grid max-w-[280px] gap-1.5 text-[13px]">
        {[
          { label: 'Keywords', val: liveScores.keywords },
          { label: 'Skills', val: liveScores.skills },
          { label: 'Experience', val: liveScores.experience },
        ].map((row) => (
          <div key={row.label} className="grid grid-cols-[76px_1fr_28px] items-center gap-2">
            <dt className="text-[var(--mute)]">{row.label}</dt>
            <dd className="contents">
              <div className="relative h-1 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--lav)] transition-all duration-500"
                  style={{ width: `${row.val}%` }}
                />
              </div>
              <b className="text-right font-medium">{row.val}</b>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[12.5px] text-[var(--mute)]">
        Weighted: keywords 40%, skills 30%, experience 30%.
      </p>
    </div>

    {/* Missing & Matched Skills */}
    <div className={stacked ? 'border-t border-[var(--line)] pt-5' : ''}>
      <p className="mb-2.5 text-[13.5px] text-[var(--mute)]">
        Missing from your resume. Tap any you actually have.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {activePreset.missingSkills.map((skill) => {
          const added = tappedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              aria-pressed={added}
              onClick={() => onToggleSkill(skill)}
              className={`cursor-pointer rounded-full px-3 py-1 text-[13px] transition-all active:scale-95 ${
                added
                  ? 'bg-[var(--mint)] text-[var(--mint-ink)]'
                  : 'bg-[var(--peach)] text-[var(--peach-ink)] hover:brightness-95'
              }`}
            >
              {added ? `✓ ${skill}` : `+ ${skill}`}
            </button>
          );
        })}
        {activePreset.matchedSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[var(--mint)] px-3 py-1 text-[13px] text-[var(--mint-ink)]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ChangesInspectorList = ({
  activePreset,
  revertedIds,
  appliedSuggestionIds,
  onJumpToMark,
  onToggleRevert,
  onToggleSuggestion,
  compact = false,
}) => (
  <div className={compact ? 'space-y-6' : 'max-w-[820px] space-y-8'}>
    {/* Applied AI Changes */}
    <div>
      <h3 className="text-[16px] font-bold tracking-[-0.01em]">Applied to your resume</h3>
      <p className="mt-0.5 mb-2 text-[13.5px] text-[var(--mute)]">
        Already updated in Preview and LaTeX. Click any item to highlight it in Preview.
      </p>

      <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
        {activePreset.appliedChanges.map((chg) => {
          const reverted = revertedIds.includes(chg.id);
          return (
            <div key={chg.id} className="py-3.5">
              <div
                role={!reverted ? 'button' : undefined}
                tabIndex={!reverted ? 0 : undefined}
                onClick={() => !reverted && onJumpToMark(chg.markId)}
                onKeyDown={(e) => {
                  if (!reverted && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onJumpToMark(chg.markId);
                  }
                }}
                className={`rounded-md transition-colors ${
                  !reverted ? 'cursor-pointer hover:bg-[var(--lav-s)] -mx-2 px-2 py-1' : 'opacity-60'
                }`}
              >
                <div className="text-[14.5px] leading-[1.5]">
                  <span className="mr-2 inline-block rounded-full bg-[var(--mint)] px-2 py-0.5 text-[12px] font-bold text-[var(--mint-ink)]">
                    {reverted ? 'Reverted' : 'Applied'}
                  </span>
                  <strong className="font-semibold">{chg.section}:</strong>{' '}
                  <span className="text-[var(--ink)]">{chg.rationale}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3">
                {!reverted && (
                  <button
                    type="button"
                    onClick={() => onJumpToMark(chg.markId)}
                    className="cursor-pointer text-[13px] text-[var(--lav)] hover:underline underline-offset-4"
                  >
                    Highlight in preview
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onToggleRevert(chg)}
                  className="cursor-pointer rounded-lg border border-[var(--line)] px-2.5 py-1 text-[12.5px] text-[var(--ink)] transition-colors hover:bg-[var(--lav-s)]"
                >
                  {reverted ? 'Re-apply' : 'Revert'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Additional Improvement Recommendations (Not Automatically Applied) */}
    <div>
      <h3 className="text-[16px] font-bold tracking-[-0.01em]">Additional suggestions</h3>
      <p className="mt-0.5 mb-2 text-[13.5px] text-[var(--mute)]">
        Not changed in your resume — your call. Apply only what accurately reflects your experience.
      </p>

      <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
        {activePreset.suggestions.map((sug) => {
          const isApplied = appliedSuggestionIds.includes(sug.id);
          return (
            <div key={sug.id} className="py-3.5">
              <div className="text-[14.5px] leading-[1.5]">
                <span
                  className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[12px] font-bold ${
                    isApplied
                      ? 'bg-[var(--mint)] text-[var(--mint-ink)]'
                      : 'bg-[var(--peach)] text-[var(--peach-ink)]'
                  }`}
                >
                  {isApplied ? 'Applied' : 'Suggested'}
                </span>
                <strong className="font-semibold">{sug.title}</strong>
              </div>
              <p className="mt-1 text-[13.5px] text-[var(--mute)]">{sug.detail}</p>

              <div className="mt-2.5 flex items-center gap-3">
                <button
                  type="button"
                  aria-pressed={isApplied}
                  onClick={() => onToggleSuggestion(sug)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[12.5px] transition-colors ${
                    isApplied
                      ? 'border-[var(--lav)] bg-[var(--lav-s)] text-[var(--lav)]'
                      : 'border-[var(--line)] text-[var(--ink)] hover:bg-[var(--lav-s)]'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : '+ Apply'}
                </button>
                {isApplied && (
                  <button
                    type="button"
                    onClick={() => onJumpToMark(sug.markId)}
                    className="cursor-pointer text-[13px] text-[var(--lav)] hover:underline underline-offset-4"
                  >
                    Highlight in preview
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const SavedDrawer = ({ open, onClose, apps, onLoad, onStatusChange, onDelete }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  if (!open) return null;

  const filtered = statusFilter === 'All' ? apps : apps.filter((a) => a.status === statusFilter);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[var(--overlay)] rm-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Saved applications"
    >
      <aside
        className="rm-scroll flex h-full w-full max-w-[430px] flex-col overflow-y-auto border-l border-[var(--line)] bg-[var(--bg)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <h2 className="text-[19px] font-bold tracking-[-0.015em]">Saved applications</h2>
            <p className="mt-0.5 text-[13.5px] text-[var(--mute)]">Stored locally in your browser.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved applications"
            className="cursor-pointer rounded-lg border border-[var(--line)] p-1.5 text-[var(--ink)] transition-colors hover:bg-[var(--lav-s)]"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-[var(--line)] py-3.5">
          {['All', ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              aria-pressed={statusFilter === st}
              className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[13px] transition-colors ${
                statusFilter === st
                  ? 'border-[var(--lav)] bg-[var(--lav-s)] text-[var(--lav)] font-medium'
                  : 'border-[var(--line)] text-[var(--mute)] hover:bg-[var(--lav-s)] hover:text-[var(--ink)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex-1 divide-y divide-[var(--line)]">
          {filtered.length === 0 ? (
            <p className="pt-8 text-[14px] text-[var(--mute)]">
              No saved applications match this filter yet.
            </p>
          ) : (
            filtered.map((app) => (
              <div key={app.id} className="space-y-3 py-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[16px] font-bold">{app.company}</div>
                    <div className="text-[13.5px] text-[var(--mute)]">{app.position}</div>
                  </div>
                  <span className="rounded-full bg-[var(--mint)] px-2.5 py-0.5 text-[12.5px] font-medium text-[var(--mint-ink)]">
                    {app.score}/100
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <select
                      aria-label={`Application status for ${app.company}`}
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value)}
                      className="cursor-pointer border-0 border-b border-[var(--line)] bg-transparent py-0.5 text-[13px] text-[var(--ink)] focus:border-[var(--lav)] focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <span className="text-[12.5px] text-[var(--mute)]">{app.savedAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onLoad(app)}
                      className="cursor-pointer text-[13.5px] font-medium text-[var(--lav)] hover:underline underline-offset-4"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(app.id)}
                      aria-label={`Delete ${app.company}`}
                      className="cursor-pointer rounded-md border border-[var(--line)] p-1.5 text-[var(--mute)] transition-colors hover:bg-[var(--lav-s)] hover:text-[var(--ink)]"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

// ============================================================================
// 7. MAIN RESUMEOW APPLICATION
// ============================================================================
const THEME_STORAGE_KEY = 'resumeow_theme_v4';
const SAVED_STORAGE_KEY = 'resumeow_saved_apps_v4';

export default function App() {
  // Theme (Defaults to Warm Off-White Light Mode, persisted)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage issues
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // View & Header Controls
  const [view, setView] = useState('workspace'); // 'workspace' | 'results'
  const [quietCat, setQuietCat] = useState(false);
  const [demosOpen, setDemosOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  // Mascot State, Speech, Cursor Tracking & Boop Hearts
  const [catState, setCatState] = useState('idle');
  const [catSay, setCatSay] = useState('Drop in your master resume and I’ll tailor it to the job.');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState([]);

  const catWrapRef = useRef(null);
  const demosRef = useRef(null);
  const quipIdxRef = useRef(0);
  const napTimerRef = useRef(null);

  // Workspace Inputs
  const [presetId, setPresetId] = useState('anthropic');
  const [resumeFormat, setResumeFormat] = useState('pdf'); // 'pdf' | 'latex' | 'text'
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [latexSource, setLatexSource] = useState(SAMPLE_LATEX_RESUME);
  const [plainSource, setPlainSource] = useState(SAMPLE_PLAIN_RESUME);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState('Balanced'); // Light | Balanced | Strong
  const [selectedDocs, setSelectedDocs] = useState({
    resume: true,
    coverLetter: true,
    recLetter: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [formError, setFormError] = useState('');

  // Results State
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'latex' | 'compare' | 'changes' | 'cover' | 'rec'
  const [splitStudio, setSplitStudio] = useState(false); // 2xl side-by-side LaTeX + Preview toggle
  const [revertedIds, setRevertedIds] = useState([]);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState([]);
  const [tappedSkills, setTappedSkills] = useState([]);
  const [manualLatex, setManualLatex] = useState(null);
  const [flashMarkId, setFlashMarkId] = useState(null);

  // Score Count-Up State
  const [displayScore, setDisplayScore] = useState(0);
  const [hasCounted, setHasCounted] = useState(false);

  // Cover Letter State
  const [coverTone, setCoverTone] = useState('Concise');
  const [coverText, setCoverText] = useState('');

  // Recommendation Request State
  const [recName, setRecName] = useState('Dr. Elena Morales');
  const [recRel, setRecRel] = useState('Research Advisor');
  const [recDeadline, setRecDeadline] = useState('December 15, 2026');
  const [recManualBody, setRecManualBody] = useState(null);

  // Copy Button Feedback
  const [copiedFeedback, setCopiedFeedback] = useState('');

  // Saved Applications (LocalStorage)
  const [savedApps, setSavedApps] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SAVED_APPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedApps));
    } catch {
      // ignore
    }
  }, [savedApps]);

  const activePreset = DEMO_PRESETS[presetId] || DEMO_PRESETS.anthropic;

  // Close Demos Popover on Outside Click or Escape
  useEffect(() => {
    const onDown = (e) => {
      if (demosRef.current && !demosRef.current.contains(e.target)) {
        setDemosOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDemosOpen(false);
        setSavedOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Nap Scheduler (25s idle -> sleep)
  const scheduleNap = useCallback(() => {
    if (napTimerRef.current) clearTimeout(napTimerRef.current);
    if (quietCat) return;
    napTimerRef.current = setTimeout(() => {
      setCatState((curr) => {
        if (curr === 'idle') {
          setCatSay('Zzz… tap me when you’re back.');
          return 'sleep';
        }
        return curr;
      });
    }, 25000);
  }, [quietCat]);

  const setCat = useCallback(
    (nextState, nextMsg) => {
      setCatState(nextState);
      if (nextMsg) setCatSay(nextMsg);
      scheduleNap();
    },
    [scheduleNap]
  );

  // Global Activity Wake & Cursor Pupil Tracking
  useEffect(() => {
    scheduleNap();

    const onActivity = () => {
      setCatState((curr) => {
        if (curr === 'sleep') {
          setCatSay('Ready when you are.');
          return 'idle';
        }
        return curr;
      });
      scheduleNap();
    };

    const onPointerMove = (e) => {
      scheduleNap();
      if (quietCat || catState !== 'idle' || !catWrapRef.current) return;
      const rect = catWrapRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const mag = Math.min(3, dist / 65);
      setPupilOffset({ x: (dx / dist) * mag, y: (dy / dist) * mag });
    };

    window.addEventListener('pointerdown', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerdown', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('pointermove', onPointerMove);
      if (napTimerRef.current) clearTimeout(napTimerRef.current);
    };
  }, [quietCat, catState, scheduleNap]);

  // Boop the Cat
  const handleBoopCat = (e) => {
    if (catState === 'sleep') {
      setCat('idle', 'Ready when you are.');
      return;
    }
    if (quietCat) return;
    const id = `${Date.now()}-${Math.random()}`;
    setHearts((prev) => [...prev, { id, x: e.clientX - 8, y: e.clientY - 22 }]);
    setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 950);
    const quip = CAT_QUIPS[quipIdxRef.current % CAT_QUIPS.length];
    quipIdxRef.current += 1;
    setCatSay(quip);
  };

  // ============================================================================
  // LIVE ANALYTICS & DYNAMIC SCORING
  // ============================================================================
  const activeResumeText = useMemo(() => {
    if (resumeFormat === 'latex') return latexSource;
    if (resumeFormat === 'text') return plainSource;
    return fileName ? plainSource : '';
  }, [resumeFormat, latexSource, plainSource, fileName]);

  const resumeStats = useMemo(() => analyzeResumeStats(activeResumeText), [activeResumeText]);

  const liveJdExtraction = useMemo(() => {
    const jdSkills = extractSkills(jobDesc);
    if (jdSkills.length === 0) return null;
    const resumeSet = new Set((resumeStats?.skills || []).map((s) => s.toLowerCase()));
    const matched = jdSkills.filter((s) => resumeSet.has(s.toLowerCase()));
    const missing = jdSkills.filter((s) => !resumeSet.has(s.toLowerCase()));
    return { matched, missing };
  }, [jobDesc, resumeStats]);

  const tailoredModel = useMemo(
    () => buildTailoredResume(activePreset, revertedIds, appliedSuggestionIds, tappedSkills),
    [activePreset, revertedIds, appliedSuggestionIds, tappedSkills]
  );

  const generatedLatex = useMemo(
    () => buildOverleafLatex(tailoredModel, company, position, intensity),
    [tailoredModel, company, position, intensity]
  );

  const effectiveLatex = manualLatex !== null ? manualLatex : generatedLatex;

  const liveScores = useMemo(() => {
    let kw = activePreset.baseScores.keywords;
    let sk = activePreset.baseScores.skills;
    let ex = activePreset.baseScores.experience;

    if (intensity === 'Strong') kw += 2;
    if (intensity === 'Light') kw -= 2;

    activePreset.appliedChanges.forEach((c) => {
      if (!revertedIds.includes(c.id)) {
        kw += c.boost.keywords;
        sk += c.boost.skills;
        ex += c.boost.experience;
      }
    });

    activePreset.suggestions.forEach((s) => {
      if (appliedSuggestionIds.includes(s.id)) {
        kw += s.boost.keywords;
        sk += s.boost.skills;
        ex += s.boost.experience;
      }
    });

    tappedSkills.forEach(() => {
      kw += 3;
      sk += 2;
    });

    kw = Math.min(99, Math.max(40, kw));
    sk = Math.min(99, Math.max(40, sk));
    ex = Math.min(99, Math.max(40, ex));

    const total = Math.round(kw * 0.4 + sk * 0.3 + ex * 0.3);
    const verdict =
      total >= 88
        ? 'A purr-fect match. Your phrasing and skills align tightly.'
        : total >= 78
        ? 'Strong fit. Tap any missing skills you genuinely have to close the gap.'
        : 'Solid foundation. Review applied changes or add genuine skills.';

    return { keywords: kw, skills: sk, experience: ex, total, verdict };
  }, [activePreset, intensity, revertedIds, appliedSuggestionIds, tappedSkills]);

  // Smooth score count-up on Results entry
  useEffect(() => {
    if (view !== 'results') {
      setHasCounted(false);
      return;
    }
    if (hasCounted) {
      setDisplayScore(liveScores.total);
      return;
    }
    const reduced =
      quietCat ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (reduced) {
      setDisplayScore(liveScores.total);
      setHasCounted(true);
      return;
    }

    let n = 0;
    const target = liveScores.total;
    const iv = setInterval(() => {
      n += 3;
      if (n >= target) {
        setDisplayScore(target);
        setHasCounted(true);
        clearInterval(iv);
      } else {
        setDisplayScore(n);
      }
    }, 16);
    return () => clearInterval(iv);
  }, [view, liveScores.total, hasCounted, quietCat]);

  const generatedRec = useMemo(
    () =>
      buildRecommendationDraft({
        name: recName,
        relationship: recRel,
        deadline: recDeadline,
        company,
        position,
      }),
    [recName, recRel, recDeadline, company, position]
  );

  const effectiveRecBody = recManualBody !== null ? recManualBody : generatedRec.body;

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleSelectFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setFormError('');
    setCat('upload', `Sniffing through ${file.name}…`);
    setTimeout(() => setCat('idle', 'Got it. Now add the job description.'), 1650);
  };

  const handleLoadPreset = (id) => {
    const p = DEMO_PRESETS[id];
    if (!p) return;
    setPresetId(id);
    setFileName(p.fileName);
    setResumeFormat('pdf');
    setLatexSource(SAMPLE_LATEX_RESUME);
    setPlainSource(SAMPLE_PLAIN_RESUME);
    setCompany(p.company);
    setPosition(p.position);
    setJobDesc(p.jd);
    setNotes(p.notes);
    setIntensity(p.intensity);
    setSelectedDocs({ resume: true, coverLetter: true, recLetter: true });
    setFormError('');
    setDemosOpen(false);
    setView('workspace');
    setCat('upload', `Loaded ${p.label}.`);
    setTimeout(() => setCat('idle', 'Preset ready. Click Generate documents when set.'), 1550);
  };

  const handleResetWorkspace = () => {
    setFileName('');
    setCompany('');
    setPosition('');
    setJobDesc('');
    setNotes('');
    setIntensity('Balanced');
    setSelectedDocs({ resume: true, coverLetter: true, recLetter: false });
    setFormError('');
    setDemosOpen(false);
    setView('workspace');
    setCat('idle', 'Fresh slate. Drop in your master resume to start.');
  };

  const handleAddStarterChip = (chip) => {
    setNotes((prev) => {
      if (prev.toLowerCase().includes(chip.toLowerCase())) return prev;
      return prev.trim() ? `${prev.trim()} ${chip}.` : `${chip}.`;
    });
  };

  const handleGenerate = () => {
    if (!jobDesc.trim()) {
      setFormError('Add a job description so there is something to tailor to.');
      setCat('error', 'Hmm, I need a job description.');
      return;
    }

    const hasResume =
      (resumeFormat === 'pdf' && Boolean(fileName)) ||
      (resumeFormat === 'latex' && latexSource.trim().length > 15) ||
      (resumeFormat === 'text' && plainSource.trim().length > 15);

    if (!hasResume) {
      setFormError('Add your master resume first — or click “Use sample resume”.');
      setCat('error', 'Hmm, I need your master resume first.');
      return;
    }

    if (!selectedDocs.resume && !selectedDocs.coverLetter && !selectedDocs.recLetter) {
      setFormError('Select at least one document to generate.');
      setCat('error', 'Pick at least one document for me to draft.');
      return;
    }

    // Infer closest preset from role/JD keywords
    const text = `${company} ${position} ${jobDesc}`.toLowerCase();
    let inferred = presetId;
    if (text.includes('vercel') || text.includes('frontend') || text.includes('next.js')) {
      inferred = 'vercel';
    } else if (text.includes('stripe') || text.includes('payments') || text.includes('postgresql')) {
      inferred = 'stripe';
    } else if (text.includes('anthropic') || text.includes('pytorch') || text.includes('ml')) {
      inferred = 'anthropic';
    }
    setPresetId(inferred);

    setFormError('');
    setIsGenerating(true);
    setCat('generating', 'Typing up your documents…');

    setTimeout(() => {
      setIsGenerating(false);
      setRevertedIds([]);
      setAppliedSuggestionIds([]);
      setTappedSkills([]);
      setManualLatex(null);
      setRecManualBody(null);
      setSplitStudio(false);
      setCoverText(buildCoverLetter(coverTone, company, position, []));

      if (selectedDocs.resume) setActiveTab('preview');
      else if (selectedDocs.coverLetter) setActiveTab('cover');
      else setActiveTab('rec');

      setView('results');
      setCat('review', 'Reviewing the draft. Check what changed.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1750);
  };

  // Interactive Results Actions
  const handleToggleMissingSkill = (skill) => {
    setManualLatex(null);
    const exists = tappedSkills.includes(skill);
    const next = exists ? tappedSkills.filter((s) => s !== skill) : [...tappedSkills, skill];
    setTappedSkills(next);
    setCoverText(buildCoverLetter(coverTone, company, position, next));
    setCat(
      exists ? 'review' : 'success',
      exists
        ? `${skill} returned to missing.`
        : `${skill} added to your skills & LaTeX. Only keep it if it’s true.`
    );
    if (!exists) {
      setTimeout(() => setCat('review', 'Reviewing the draft.'), 1850);
    }
  };

  const handleToggleRevert = (chg) => {
    setManualLatex(null);
    const isReverted = revertedIds.includes(chg.id);
    setRevertedIds((prev) =>
      isReverted ? prev.filter((id) => id !== chg.id) : [...prev, chg.id]
    );
    setCat(
      'review',
      isReverted ? 'Re-applied edit to your resume.' : 'Reverted to your original wording.'
    );
  };

  const handleToggleSuggestion = (sug) => {
    setManualLatex(null);
    const isApplied = appliedSuggestionIds.includes(sug.id);
    setAppliedSuggestionIds((prev) =>
      isApplied ? prev.filter((id) => id !== sug.id) : [...prev, sug.id]
    );
    setCat(
      isApplied ? 'review' : 'success',
      isApplied ? 'Removed suggestion from your resume.' : 'Applied suggestion to Preview & LaTeX.'
    );
    if (!isApplied) {
      setTimeout(() => setCat('review', 'Reviewing the draft.'), 1800);
    }
  };

  const handleJumpToMark = (markId) => {
    setManualLatex(null);
    if (!splitStudio) setActiveTab('preview');
    setFlashMarkId(markId);
    setTimeout(() => {
      const el = document.getElementById(markId);
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 60);
    setTimeout(() => setFlashMarkId(null), 1600);
  };

  const handleToneSwitch = (nextTone) => {
    setCoverTone(nextTone);
    setCoverText(buildCoverLetter(nextTone, company, position, tappedSkills));
    setCat('review', `Cover letter shifted to ${nextTone.toLowerCase()} tone.`);
  };

  const handleCopy = async (overrideText, labelOverride) => {
    let text = overrideText;
    let label = labelOverride;
    if (!text) {
      if (activeTab === 'cover') {
        text = coverText;
        label = 'Cover letter';
      } else if (activeTab === 'rec') {
        text = `Subject: ${generatedRec.subject}\n\n${effectiveRecBody}`;
        label = 'Email';
      } else {
        text = effectiveLatex;
        label = 'LaTeX';
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // silent fallback in restricted frames
    }
    setCopiedFeedback('Copied');
    setCat('success', `Copied ${label}. Good luck out there!`);
    setTimeout(() => {
      setCopiedFeedback('');
      setCat('review', 'Reviewing the draft.');
    }, 2000);
  };

  const handleDownload = (overrideText, overrideFilename) => {
    const slug = (company.trim() || activePreset.company).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let content = overrideText;
    let filename = overrideFilename;
    if (!content) {
      if (activeTab === 'cover') {
        content = coverText;
        filename = `resumeow-${slug}-cover-letter.txt`;
      } else if (activeTab === 'rec') {
        content = `Subject: ${generatedRec.subject}\n\n${effectiveRecBody}`;
        filename = `resumeow-${slug}-recommendation.txt`;
      } else {
        content = effectiveLatex;
        filename = `resumeow-${slug}.tex`;
      }
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCat('success', `Downloaded ${filename}.`);
    setTimeout(() => setCat('review', 'Reviewing the draft.'), 2000);
  };

  const handleSaveCurrent = () => {
    const entry = {
      id: `app-${Date.now()}`,
      company: company.trim() || activePreset.company,
      position: position.trim() || activePreset.position,
      status: 'Draft',
      score: liveScores.total,
      savedAt: 'Nov 25, 2026',
      presetId,
      revertedIds,
      appliedSuggestionIds,
      tappedSkills,
      selectedDocs,
    };
    setSavedApps((prev) => [entry, ...prev]);
    setCat('success', `Saved ${entry.company} to your list.`);
    setTimeout(() => setCat('review', 'Reviewing the draft.'), 1900);
  };

  const handleLoadSaved = (app) => {
    const p = DEMO_PRESETS[app.presetId] || DEMO_PRESETS.anthropic;
    setPresetId(p.id);
    setCompany(app.company);
    setPosition(app.position);
    setJobDesc(p.jd);
    setFileName(p.fileName);
    setRevertedIds(app.revertedIds || []);
    setAppliedSuggestionIds(app.appliedSuggestionIds || []);
    setTappedSkills(app.tappedSkills || []);
    setSelectedDocs(app.selectedDocs || { resume: true, coverLetter: true, recLetter: false });
    setManualLatex(null);
    setRecManualBody(null);
    setSplitStudio(false);
    setCoverText(buildCoverLetter(coverTone, app.company, app.position, app.tappedSkills || []));
    setActiveTab(app.selectedDocs?.resume !== false ? 'preview' : 'cover');
    setSavedOpen(false);
    setView('results');
    setCat('review', `Reopened ${app.company}. Everything is right where you left it.`);
  };

  // Dynamic Tabs for Results View
  const resultTabs = useMemo(() => {
    const list = [];
    if (selectedDocs.resume) {
      const activeApplied =
        activePreset.appliedChanges.length - revertedIds.length + appliedSuggestionIds.length;
      list.push(
        { id: 'preview', label: 'Resume Preview', mobileOnly: false },
        { id: 'latex', label: 'Overleaf LaTeX', mobileOnly: false },
        { id: 'compare', label: 'Compare', mobileOnly: false },
        {
          id: 'changes',
          label: `Changes (${activeApplied}/${activePreset.suggestions.length})`,
          mobileOnly: true, // xl+ displays Changes permanently in the Sticky Right Inspector Rail
        }
      );
    }
    if (selectedDocs.coverLetter) list.push({ id: 'cover', label: 'Cover Letter', mobileOnly: false });
    if (selectedDocs.recLetter) list.push({ id: 'rec', label: 'Rec Request', mobileOnly: false });
    return list;
  }, [selectedDocs, activePreset, revertedIds.length, appliedSuggestionIds.length]);

  const canSplitLatexPreview =
    selectedDocs.resume && (activeTab === 'preview' || activeTab === 'latex');

  const downloadLabel =
    activeTab === 'cover' || activeTab === 'rec' ? 'Download .txt' : 'Download .tex';

  // Reusable ghost button class
  const ghostBtn =
    'inline-flex items-center gap-1.5 cursor-pointer rounded-[10px] border border-[var(--line)] bg-transparent px-3 py-1.5 text-[14px] text-[var(--ink)] transition-colors hover:bg-[var(--lav-s)] active:scale-[0.97]';

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className={`rm-root ${quietCat ? 'rm-quiet' : ''}`} data-theme={theme}>
      <style>{RESUMEOW_STYLES}</style>

      {/* Floating Boop Hearts */}
      {hearts.map((h) => (
        <span key={h.id} className="rm-heart" aria-hidden="true" style={{ left: h.x, top: h.y }}>
          ♥
        </span>
      ))}

      {/* FLUID ULTRA-RESPONSIVE CONTAINER (MOBILE -> LAPTOP -> 27" -> 34"+ ULTRAWIDE) */}
      <div className="mx-auto w-full px-5 pb-20 pt-5 sm:px-8 lg:max-w-[1360px] lg:px-10 xl:max-w-[1640px] xl:px-12 2xl:max-w-[2080px] 2xl:px-16">
        {/* ================================================================== */}
        {/* MINIMAL TOP HEADER (LIGHT / DARK THEME TOGGLE ON FAR RIGHT)        */}
        {/* ================================================================== */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-6 pt-1">
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                setView('workspace');
                setCat('idle', 'Ready when you are.');
              }}
              className="cursor-pointer border-0 bg-transparent p-0 text-[22px] font-bold tracking-[-0.025em] text-[var(--ink)]"
            >
              Resu<span className="text-[var(--lav)]">Meow</span>
            </button>

            <span className="rounded-full bg-[var(--peach)] px-2.5 py-0.5 text-[12.5px] text-[var(--peach-ink)]">
              Mock data: nothing is sent to a server
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Demos Popover */}
            <div className="relative" ref={demosRef}>
              <button
                type="button"
                className={ghostBtn}
                aria-expanded={demosOpen}
                onClick={() => setDemosOpen((o) => !o)}
              >
                <span>Demos</span>
                <IconChevronDown />
              </button>

              {demosOpen && (
                <div
                  role="menu"
                  className="rm-fade absolute right-0 top-[calc(100%+8px)] z-40 w-[270px] rounded-xl border border-[var(--line)] bg-[var(--bg)] p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
                >
                  {Object.values(DEMO_PRESETS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleLoadPreset(p.id)}
                      className="block w-full cursor-pointer rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--lav-s)]"
                    >
                      <div className="text-[14px] font-semibold text-[var(--ink)]">{p.label}</div>
                      <div className="text-[12.5px] text-[var(--mute)]">{p.subtitle}</div>
                    </button>
                  ))}
                  <div className="my-1.5 h-px bg-[var(--line)]" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleResetWorkspace}
                    className="block w-full cursor-pointer rounded-lg px-2.5 py-2 text-left text-[13.5px] text-[var(--mute)] transition-colors hover:bg-[var(--lav-s)] hover:text-[var(--ink)]"
                  >
                    Reset workspace
                  </button>
                </div>
              )}
            </div>

            {/* 2. Saved Applications */}
            <button type="button" className={ghostBtn} onClick={() => setSavedOpen(true)}>
              Saved ({savedApps.length})
            </button>

            {/* 3. Quiet Cat Toggle */}
            <button
              type="button"
              aria-pressed={quietCat}
              onClick={() =>
                setQuietCat((q) => {
                  const next = !q;
                  if (next && catState === 'sleep') setCatState('idle');
                  return next;
                })
              }
              className={`${ghostBtn} ${
                quietCat ? '!border-[var(--lav)] !bg-[var(--lav-s)] !text-[var(--lav)]' : ''
              }`}
            >
              Quiet cat: {quietCat ? 'on' : 'off'}
            </button>

            {/* 4. FAR RIGHT: Light / Dark Mode Toggle */}
            <button
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className={ghostBtn}
            >
              {theme === 'light' ? <IconMoon /> : <IconSun />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </header>

        {/* ================================================================== */}
        {/* HERO (FULL EDITORIAL IN WORKSPACE / COMPACT STRIP IN RESULTS)      */}
        {/* ================================================================== */}
        {view === 'workspace' ? (
          <section className="grid grid-cols-1 items-center gap-4 border-b border-[var(--line)] pb-8 pt-1 sm:grid-cols-[184px_1fr] sm:gap-7 lg:grid-cols-[200px_1fr]">
            <div ref={catWrapRef}>
              <CatMascot
                state={catState}
                quiet={quietCat}
                compact={false}
                onBoop={handleBoopCat}
                pupilOffset={pupilOffset}
              />
            </div>
            <div>
              <h1 className="m-0 mb-1.5 text-[clamp(28px,3.8vw,44px)] font-medium leading-[1.08] tracking-[-0.03em]">
                One calm place to apply for the next role.
              </h1>
              <p className="m-0 min-h-[1.6em] max-w-[54ch] text-[16px] text-[var(--mute)]" aria-live="polite">
                {catSay}
              </p>
            </div>
          </section>
        ) : (
          <section className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4 pt-0.5">
            <div className="flex items-center gap-4 min-w-0">
              <div ref={catWrapRef} className="shrink-0">
                <CatMascot
                  state={catState}
                  quiet={quietCat}
                  compact
                  onBoop={handleBoopCat}
                  pupilOffset={pupilOffset}
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[19px] font-bold tracking-[-0.02em] sm:text-[22px]">
                  {company.trim() || activePreset.company}{' '}
                  <span className="font-normal text-[var(--mute)]">·</span>{' '}
                  {position.trim() || activePreset.position}
                </h1>
                <p className="m-0 text-[14px] text-[var(--mute)]" aria-live="polite">
                  {catSay}
                </p>
              </div>
            </div>

            {/* Quick Results Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={ghostBtn} onClick={handleSaveCurrent}>
                Save
              </button>
              <button type="button" className={ghostBtn} onClick={() => handleCopy()}>
                {copiedFeedback || 'Copy'}
              </button>
              <button type="button" className={ghostBtn} onClick={() => handleDownload()}>
                {downloadLabel}
              </button>
              <button
                type="button"
                className={ghostBtn}
                onClick={() => {
                  setView('workspace');
                  setCat('idle', 'Ready for the next role.');
                }}
              >
                New application
              </button>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* VIEW 1: RESPONSIVE 1 -> 2 -> 3 COLUMN EDITORIAL STUDIO WORKSPACE   */}
        {/* ================================================================== */}
        {view === 'workspace' && (
          <main className="rm-fade pt-8">
            <div className="grid grid-cols-1 gap-y-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-12 2xl:grid-cols-[1.1fr_1.15fr_0.85fr] 2xl:gap-x-12 2xl:gap-y-0">
              {/* COLUMN 1: MASTER RESUME */}
              <section className="lg:col-start-1 lg:row-start-1">
                <h2 className="text-[19px] font-bold tracking-[-0.015em]">Master resume</h2>
                <p className="mt-0.5 mb-3.5 text-[14px] text-[var(--mute)]">
                  The full version of your resume. Tailoring starts here.
                </p>

                {/* Segmented Input Format Control */}
                <div
                  className="mb-3.5 inline-flex gap-1 rounded-[10px] bg-[var(--lav-s)] p-[3px]"
                  role="group"
                  aria-label="Resume format"
                >
                  {[
                    { id: 'pdf', label: 'PDF' },
                    { id: 'latex', label: 'LaTeX' },
                    { id: 'text', label: 'Plain text' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      aria-pressed={resumeFormat === fmt.id}
                      onClick={() => setResumeFormat(fmt.id)}
                      className={`cursor-pointer rounded-[8px] px-3 py-1 text-[14px] transition-all ${
                        resumeFormat === fmt.id
                          ? 'bg-[var(--bg)] text-[var(--ink)] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
                          : 'text-[var(--mute)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                {resumeFormat === 'pdf' && (
                  <div>
                    <label
                      className={`block cursor-pointer rounded-[14px] border-[1.5px] border-dashed border-[var(--lav)] px-5 py-7 text-center text-[15px] text-[var(--mute)] transition-colors 2xl:py-12 ${
                        dragOver ? 'bg-[var(--lav-s)]' : 'hover:bg-[var(--lav-s)]'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                        setCat('upload', 'Ooh, what have we got here?');
                      }}
                      onDragLeave={() => {
                        setDragOver(false);
                        setCat('idle', 'Ready when you are.');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        handleSelectFile(e.dataTransfer.files?.[0]);
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.tex,.txt"
                        onChange={(e) => handleSelectFile(e.target.files?.[0])}
                      />
                      {fileName ? (
                        <span className="font-medium text-[var(--ink)]">{fileName} added</span>
                      ) : (
                        <span>
                          Drag a file here or <strong className="font-semibold text-[var(--lav)]">browse</strong>
                        </span>
                      )}
                    </label>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[13.5px]">
                      <button
                        type="button"
                        onClick={() => {
                          setFileName('Alex_Rivera_Master_Resume.pdf');
                          setFormError('');
                          setCat('upload', 'Loaded Alex_Rivera_Master_Resume.pdf.');
                          setTimeout(() => setCat('idle', 'Got it. Now add the job description.'), 1500);
                        }}
                        className="cursor-pointer text-[var(--lav)] hover:underline underline-offset-4"
                      >
                        Use sample resume
                      </button>

                      {fileName && (
                        <button
                          type="button"
                          onClick={() => {
                            setFileName('');
                            setCat('idle', 'Resume removed.');
                          }}
                          className="cursor-pointer text-[var(--mute)] hover:text-[var(--ink)]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {resumeFormat === 'latex' && (
                  <textarea
                    aria-label="Master resume LaTeX source"
                    value={latexSource}
                    onChange={(e) => setLatexSource(e.target.value)}
                    placeholder="Paste your Overleaf or LaTeX resume…"
                    className="rm-field rm-scroll min-h-[180px] resize-y font-mono text-[13px] leading-[1.6] 2xl:min-h-[300px]"
                  />
                )}

                {resumeFormat === 'text' && (
                  <textarea
                    aria-label="Master resume plain text"
                    value={plainSource}
                    onChange={(e) => setPlainSource(e.target.value)}
                    placeholder="Paste your plain-text resume…"
                    className="rm-field rm-scroll min-h-[180px] resize-y text-[14.5px] leading-[1.6] 2xl:min-h-[300px]"
                  />
                )}

                {/* Quiet 1-line Quick Stats */}
                {resumeStats && (
                  <p className="mt-3 text-[13px] text-[var(--mute)]">
                    {resumeStats.words} words · {resumeStats.sections} sections · {resumeStats.skills.length}{' '}
                    skills detected
                  </p>
                )}
              </section>

              {/* COLUMN 2: TARGET OPPORTUNITY */}
              <section className="border-t border-[var(--line)] pt-7 lg:col-start-1 lg:row-start-2 lg:pt-8 2xl:col-start-2 2xl:row-start-1 2xl:border-l 2xl:border-t-0 2xl:pl-12 2xl:pt-0">
                <h2 className="text-[19px] font-bold tracking-[-0.015em]">Target opportunity</h2>
                <p className="mt-0.5 mb-4 text-[14px] text-[var(--mute)]">Where you’re applying.</p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13.5px] text-[var(--mute)]" htmlFor="rm-company">
                      Company
                    </label>
                    <input
                      id="rm-company"
                      type="text"
                      placeholder="Acme Robotics"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="rm-field mb-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[13.5px] text-[var(--mute)]" htmlFor="rm-position">
                      Position
                    </label>
                    <input
                      id="rm-position"
                      type="text"
                      placeholder="ML Engineering Intern"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="rm-field mb-4"
                    />
                  </div>
                </div>

                <label className="block text-[13.5px] text-[var(--mute)]" htmlFor="rm-jd">
                  Job description
                </label>
                <textarea
                  id="rm-jd"
                  placeholder="Paste the full posting."
                  value={jobDesc}
                  onFocus={() => setCat('reading', 'Reading closely…')}
                  onBlur={() => setCat('idle', 'Ready when you are.')}
                  onChange={(e) => {
                    setJobDesc(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="rm-field rm-scroll min-h-[120px] resize-y text-[15px] leading-[1.6] lg:min-h-[150px] 2xl:min-h-[260px]"
                />

                {/* Live Real-Time Keyword Extraction Strip */}
                {liveJdExtraction && (
                  <div className="mt-3.5 space-y-2">
                    <div className="text-[12.5px] text-[var(--mute)]">
                      Live keyword scan ({liveJdExtraction.matched.length} matched ·{' '}
                      {liveJdExtraction.missing.length} missing)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {liveJdExtraction.matched.slice(0, 7).map((sk) => (
                        <span
                          key={`m-${sk}`}
                          className="rounded-full bg-[var(--mint)] px-2.5 py-0.5 text-[12.5px] text-[var(--mint-ink)]"
                        >
                          {sk}
                        </span>
                      ))}
                      {liveJdExtraction.missing.slice(0, 7).map((sk) => (
                        <span
                          key={`x-${sk}`}
                          className="rounded-full bg-[var(--peach)] px-2.5 py-0.5 text-[12.5px] text-[var(--peach-ink)]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* COLUMN 3: CUSTOMIZE, DOCUMENTS & GENERATE */}
              <div className="space-y-9 border-t border-[var(--line)] pt-7 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0 2xl:col-start-3 2xl:row-start-1 2xl:row-span-1">
                {/* Customize */}
                <section>
                  <h2 className="text-[19px] font-bold tracking-[-0.015em]">Customize</h2>
                  <p className="mt-0.5 mb-3 text-[14px] text-[var(--mute)]">
                    Optional notes for the tailoring.
                  </p>

                  <textarea
                    aria-label="Optional tailoring notes"
                    placeholder="Keep it to one page. Lead with research."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="rm-field rm-scroll min-h-[96px] resize-y text-[15px] leading-[1.55]"
                  />

                  {/* Clickable Minimal Starter Chips */}
                  <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1.5">
                    {STARTER_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleAddStarterChip(chip)}
                        className="cursor-pointer text-[13px] text-[var(--mute)] transition-colors hover:text-[var(--lav)]"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  {/* Inline Intensity Selector */}
                  <div
                    className="mt-4 flex items-center gap-3 text-[13.5px] text-[var(--mute)]"
                    role="group"
                    aria-label="Tailoring intensity"
                  >
                    <span>Intensity:</span>
                    {['Light', 'Balanced', 'Strong'].map((level, i) => (
                      <React.Fragment key={level}>
                        {i > 0 && <span aria-hidden="true">·</span>}
                        <button
                          type="button"
                          aria-pressed={intensity === level}
                          onClick={() => setIntensity(level)}
                          className={`cursor-pointer border-b-[1.5px] pb-0.5 transition-colors ${
                            intensity === level
                              ? 'border-[var(--lav)] font-medium text-[var(--ink)]'
                              : 'border-transparent text-[var(--mute)] hover:text-[var(--ink)]'
                          }`}
                        >
                          {level}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </section>

                {/* Documents + Generate */}
                <section className="border-t border-[var(--line)] pt-7">
                  <h2 className="text-[19px] font-bold tracking-[-0.015em]">Documents</h2>
                  <p className="mt-0.5 mb-3 text-[14px] text-[var(--mute)]">
                    Pick one or several. They generate together.
                  </p>

                  <div className="mb-6 divide-y divide-[var(--line)] border-b border-[var(--line)]">
                    {[
                      { key: 'resume', title: 'Tailored resume', meta: '1 page' },
                      { key: 'coverLetter', title: 'Cover letter', meta: 'Draft' },
                      { key: 'recLetter', title: 'Recommendation request', meta: 'Email' },
                    ].map((doc) => (
                      <label
                        key={doc.key}
                        className="flex cursor-pointer items-center gap-3 py-3 text-[16px] text-[var(--ink)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDocs[doc.key]}
                          onChange={() =>
                            setSelectedDocs((d) => ({ ...d, [doc.key]: !d[doc.key] }))
                          }
                          className="h-[18px] w-[18px] cursor-pointer accent-[var(--lav)]"
                        />
                        <span>{doc.title}</span>
                        <small className="ml-auto text-[13px] text-[var(--mute)]">{doc.meta}</small>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    className="cursor-pointer rounded-[12px] bg-[var(--lav)] px-6 py-3 text-[15.5px] font-bold text-[var(--lav-ink)] transition-all hover:brightness-105 active:scale-[0.97] disabled:cursor-wait disabled:opacity-75"
                  >
                    {isGenerating ? 'Generating…' : 'Generate documents'}
                  </button>

                  {isGenerating && <YarnLoader />}

                  <p className="mt-2.5 min-h-[1.4em] text-[14px] text-[var(--err)]" role="alert">
                    {formError}
                  </p>
                </section>
              </div>
            </div>
          </main>
        )}

        {/* ================================================================== */}
        {/* VIEW 2: RESULTS STUDIO (SPLIT-PANE ON XL/2XL, TABBED ON <XL)       */}
        {/* ================================================================== */}
        {view === 'results' && (
          <section className="rm-fade pt-6" aria-label="Generated application results">
            {/* MOBILE / TABLET / LAPTOP (<1280px): TOP MATCH SUMMARY */}
            <div className="mb-6 border-b border-[var(--line)] pb-6 xl:hidden">
              <ScoreAndSkillsSummary
                displayScore={displayScore}
                liveScores={liveScores}
                activePreset={activePreset}
                tappedSkills={tappedSkills}
                onToggleSkill={handleToggleMissingSkill}
                stacked={false}
              />
            </div>

            {/* MAIN STUDIO GRID: 64% LEFT DOCUMENT STAGE / 36% STICKY RIGHT INSPECTOR RAIL ON XL+ */}
            <div className="xl:grid xl:grid-cols-[minmax(0,1.78fr)_minmax(340px,1fr)] xl:items-start xl:gap-10 2xl:gap-12">
              {/* LEFT STAGE: DOCUMENT TABS + ACTIVE DOCUMENT VIEW */}
              <div className="min-w-0">
                {/* Document Tabs + 2XL Split Preview/LaTeX Toggle */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
                  <div className="flex items-center gap-1 overflow-x-auto" role="tablist">
                    {resultTabs.map((t) => {
                      const isSelected = !splitStudio && activeTab === t.id;
                      return (
                        <button
                          key={t.id}
                          role="tab"
                          type="button"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSplitStudio(false);
                            setActiveTab(t.id);
                          }}
                          className={`cursor-pointer whitespace-nowrap rounded-[9px] px-3.5 py-1.5 text-[14.5px] transition-colors ${
                            t.mobileOnly ? 'xl:hidden' : ''
                          } ${
                            isSelected
                              ? 'bg-[var(--lav-s)] font-bold text-[var(--lav)]'
                              : 'text-[var(--mute)] hover:text-[var(--ink)]'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 2XL (1536px+) SIDE-BY-SIDE SPLIT PREVIEW + LATEX TOGGLE */}
                  {canSplitLatexPreview && (
                    <button
                      type="button"
                      aria-pressed={splitStudio}
                      onClick={() => setSplitStudio((s) => !s)}
                      className={`hidden 2xl:inline-flex items-center gap-1.5 cursor-pointer rounded-[9px] border px-3 py-1.5 text-[13.5px] transition-colors ${
                        splitStudio
                          ? 'border-[var(--lav)] bg-[var(--lav-s)] font-medium text-[var(--lav)]'
                          : 'border-[var(--line)] text-[var(--mute)] hover:bg-[var(--lav-s)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <IconSplit />
                      <span>Split Preview + LaTeX</span>
                    </button>
                  )}
                </div>

                {/* ------------------------------------------------------------ */}
                {/* 2XL SPLIT MODE: EDITABLE LATEX (LEFT) + LIVE PREVIEW (RIGHT) */}
                {/* ------------------------------------------------------------ */}
                {splitStudio && canSplitLatexPreview ? (
                  <div className="hidden 2xl:grid 2xl:grid-cols-2 2xl:gap-8">
                    {/* Left Half: Overleaf LaTeX Editor */}
                    <div className="min-w-0">
                      <div className="mb-2.5 flex items-center justify-between gap-2 text-[13px] text-[var(--mute)]">
                        <span>Overleaf LaTeX (edits update preview live)</span>
                        {manualLatex !== null && (
                          <button
                            type="button"
                            onClick={() => {
                              setManualLatex(null);
                              setCat('review', 'LaTeX reset to tailored version.');
                            }}
                            className="cursor-pointer text-[var(--lav)] hover:underline underline-offset-4"
                          >
                            Reset LaTeX
                          </button>
                        )}
                      </div>
                      <div className="rounded-xl bg-[var(--lav-s)] p-4">
                        <textarea
                          aria-label="Live Overleaf LaTeX editor"
                          spellCheck={false}
                          value={effectiveLatex}
                          onChange={(e) => setManualLatex(e.target.value)}
                          className="rm-scroll min-h-[620px] w-full resize-y border-0 bg-transparent font-mono text-[13px] leading-[1.65] text-[var(--ink)] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Right Half: Live Rendered Resume Preview */}
                    <div className="min-w-0 border-l border-[var(--line)] pl-8">
                      <ResumePreviewDocument
                        tailoredModel={tailoredModel}
                        manualLatex={manualLatex}
                        flashMarkId={flashMarkId}
                        onResetLatex={() => setManualLatex(null)}
                        compactWidth
                      />
                    </div>
                  </div>
                ) : null}

                {/* ------------------------------------------------------------ */}
                {/* SINGLE-STAGE TAB PANES                                       */}
                {/* ------------------------------------------------------------ */}
                <div className={splitStudio && canSplitLatexPreview ? '2xl:hidden' : ''}>
                  {/* TAB: RESUME PREVIEW */}
                  {activeTab === 'preview' && (
                    <ResumePreviewDocument
                      tailoredModel={tailoredModel}
                      manualLatex={manualLatex}
                      flashMarkId={flashMarkId}
                      onResetLatex={() => setManualLatex(null)}
                    />
                  )}

                  {/* TAB: OVERLEAF LATEX */}
                  {activeTab === 'latex' && (
                    <div>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="m-0 text-[13.5px] text-[var(--mute)]">
                          Overleaf-compatible LaTeX ·{' '}
                          {manualLatex !== null
                            ? 'Custom edits active'
                            : 'Live synced with your review choices'}
                        </p>
                        <div className="flex items-center gap-2.5">
                          {manualLatex !== null && (
                            <button
                              type="button"
                              onClick={() => {
                                setManualLatex(null);
                                setCat('review', 'LaTeX reset to synced tailored version.');
                              }}
                              className="cursor-pointer text-[13.5px] text-[var(--lav)] hover:underline underline-offset-4"
                            >
                              Reset LaTeX
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopy(effectiveLatex, 'LaTeX')}
                            className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1 text-[13px] hover:bg-[var(--lav-s)]"
                          >
                            Copy LaTeX
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(effectiveLatex)}
                            className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1 text-[13px] hover:bg-[var(--lav-s)]"
                          >
                            Download .tex
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[var(--lav-s)] p-4">
                        <textarea
                          aria-label="Editable Overleaf LaTeX editor"
                          spellCheck={false}
                          value={effectiveLatex}
                          onChange={(e) => setManualLatex(e.target.value)}
                          className="rm-scroll min-h-[420px] w-full resize-y border-0 bg-transparent font-mono text-[13px] leading-[1.65] text-[var(--ink)] focus:outline-none lg:min-h-[520px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB: COMPARE (ORIGINAL VS MODIFIED) */}
                  {activeTab === 'compare' && (
                    <div>
                      <p className="mb-5 text-[14px] text-[var(--mute)]">
                        Mint marks tailored additions. Peach strikethrough shows replaced original lines.
                      </p>

                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-9">
                        <div>
                          <div className="mb-2 text-[13px] font-bold uppercase tracking-[0.06em] text-[var(--mute)]">
                            Original
                          </div>
                          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
                            {activePreset.appliedChanges.map((chg) => {
                              const reverted = revertedIds.includes(chg.id);
                              return (
                                <div key={chg.id} className="py-3.5">
                                  <div className="mb-1 text-[12.5px] text-[var(--mute)]">{chg.section}</div>
                                  {reverted ? (
                                    <p className="m-0 text-[15px]">{chg.original}</p>
                                  ) : (
                                    <p className="m-0 text-[15px]">
                                      <del className="rounded-[3px] bg-[var(--peach)] px-1 py-0.5 text-[var(--peach-ink)]">
                                        {chg.original}
                                      </del>
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="border-t border-[var(--line)] pt-6 md:border-l md:border-t-0 md:pl-9 md:pt-0">
                          <div className="mb-2 text-[13px] font-bold uppercase tracking-[0.06em] text-[var(--mute)]">
                            Modified
                          </div>
                          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
                            {activePreset.appliedChanges.map((chg) => {
                              const reverted = revertedIds.includes(chg.id);
                              return (
                                <div key={chg.id} className="py-3.5">
                                  <div className="mb-1 text-[12.5px] text-[var(--mute)]">
                                    {chg.section} {reverted ? '(Reverted)' : ''}
                                  </div>
                                  {reverted ? (
                                    <p className="m-0 text-[15px] text-[var(--mute)]">{chg.original}</p>
                                  ) : (
                                    <p className="m-0 text-[15px]">
                                      <mark className="rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)]">
                                        {chg.modified}
                                      </mark>
                                    </p>
                                  )}
                                </div>
                              );
                            })}

                            {activePreset.suggestions
                              .filter((s) => appliedSuggestionIds.includes(s.id))
                              .map((sug) => (
                                <div key={sug.id} className="py-3.5">
                                  <div className="mb-1 text-[12.5px] text-[var(--mute)]">
                                    Applied suggestion
                                  </div>
                                  <p className="m-0 text-[15px]">
                                    <mark className="rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)]">
                                      {sug.bulletText}
                                    </mark>
                                  </p>
                                </div>
                              ))}

                            {tappedSkills.length > 0 && (
                              <div className="py-3.5">
                                <div className="mb-1 text-[12.5px] text-[var(--mute)]">
                                  Skills added by you
                                </div>
                                <p className="m-0 text-[15px]">
                                  <mark className="rounded-[3px] bg-[var(--mint)] px-1 py-0.5 text-[var(--mint-ink)]">
                                    {tappedSkills.join(', ')}
                                  </mark>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: CHANGES (<1280px MOBILE/LAPTOP VIEW) */}
                  {activeTab === 'changes' && (
                    <div className="xl:hidden">
                      <ChangesInspectorList
                        activePreset={activePreset}
                        revertedIds={revertedIds}
                        appliedSuggestionIds={appliedSuggestionIds}
                        onJumpToMark={handleJumpToMark}
                        onToggleRevert={handleToggleRevert}
                        onToggleSuggestion={handleToggleSuggestion}
                      />
                    </div>
                  )}

                  {/* TAB: COVER LETTER */}
                  {activeTab === 'cover' && (
                    <div className="max-w-[760px]">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-3.5">
                        <div className="flex items-center gap-3 text-[14px] text-[var(--mute)]">
                          <span>Tone:</span>
                          {['Enthusiastic', 'Formal', 'Concise'].map((t, idx) => (
                            <React.Fragment key={t}>
                              {idx > 0 && <span aria-hidden="true">·</span>}
                              <button
                                type="button"
                                aria-pressed={coverTone === t}
                                onClick={() => handleToneSwitch(t)}
                                className={`cursor-pointer border-b-[1.5px] pb-0.5 transition-colors ${
                                  coverTone === t
                                    ? 'border-[var(--lav)] font-medium text-[var(--ink)]'
                                    : 'border-transparent text-[var(--mute)] hover:text-[var(--ink)]'
                                }`}
                              >
                                {t}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="text-[13px] text-[var(--mute)]">
                            {coverText.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(coverText, 'Cover letter')}
                            className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1 text-[13px] hover:bg-[var(--lav-s)]"
                          >
                            Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(coverText)}
                            className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1 text-[13px] hover:bg-[var(--lav-s)]"
                          >
                            Download .txt
                          </button>
                        </div>
                      </div>

                      <textarea
                        aria-label="Editable cover letter"
                        rows={16}
                        value={coverText}
                        onChange={(e) => setCoverText(e.target.value)}
                        className="rm-field rm-scroll min-h-[380px] resize-y text-[15.5px] leading-[1.72]"
                      />
                    </div>
                  )}

                  {/* TAB: RECOMMENDATION REQUEST */}
                  {activeTab === 'rec' && (
                    <div className="max-w-[760px]">
                      <div className="mb-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div>
                          <label className="block text-[13px] text-[var(--mute)]" htmlFor="rm-rec-name">
                            Recommender Name
                          </label>
                          <input
                            id="rm-rec-name"
                            type="text"
                            value={recName}
                            onChange={(e) => {
                              setRecName(e.target.value);
                              setRecManualBody(null);
                            }}
                            className="rm-field"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] text-[var(--mute)]" htmlFor="rm-rec-rel">
                            Relationship
                          </label>
                          <input
                            id="rm-rec-rel"
                            type="text"
                            value={recRel}
                            onChange={(e) => {
                              setRecRel(e.target.value);
                              setRecManualBody(null);
                            }}
                            className="rm-field"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] text-[var(--mute)]" htmlFor="rm-rec-due">
                            Deadline
                          </label>
                          <input
                            id="rm-rec-due"
                            type="text"
                            value={recDeadline}
                            onChange={(e) => {
                              setRecDeadline(e.target.value);
                              setRecManualBody(null);
                            }}
                            className="rm-field"
                          />
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] py-3">
                        <div className="text-[14px]">
                          <span className="text-[var(--mute)]">Subject: </span>
                          <strong>{generatedRec.subject}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                `Subject: ${generatedRec.subject}\n\n${effectiveRecBody}`,
                                'Recommendation email'
                              )
                            }
                            className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1 text-[13px] hover:bg-[var(--lav-s)]"
                          >
                            Copy Email
                          </button>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(
                              generatedRec.subject
                            )}&body=${encodeURIComponent(effectiveRecBody)}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-1 text-[13px] text-[var(--ink)] no-underline hover:bg-[var(--lav-s)]"
                          >
                            <span>Open in Mail</span>
                            <IconExternal />
                          </a>
                        </div>
                      </div>

                      <textarea
                        aria-label="Editable recommendation request email"
                        rows={16}
                        value={effectiveRecBody}
                        onChange={(e) => setRecManualBody(e.target.value)}
                        className="rm-field rm-scroll min-h-[380px] resize-y text-[15.5px] leading-[1.72]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================ */}
              {/* RIGHT STICKY LIVE REVIEW INSPECTOR RAIL (XL 1280px+ / 2XL+)  */}
              {/* ============================================================ */}
              <aside
                aria-label="Live match and change inspector"
                className="rm-scroll hidden xl:block xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:self-start xl:overflow-y-auto xl:border-l xl:border-[var(--line)] xl:pl-8 2xl:pl-10"
              >
                <div className="space-y-7 pb-6">
                  <ScoreAndSkillsSummary
                    displayScore={displayScore}
                    liveScores={liveScores}
                    activePreset={activePreset}
                    tappedSkills={tappedSkills}
                    onToggleSkill={handleToggleMissingSkill}
                    stacked
                  />

                  <div className="border-t border-[var(--line)] pt-6">
                    <ChangesInspectorList
                      activePreset={activePreset}
                      revertedIds={revertedIds}
                      appliedSuggestionIds={appliedSuggestionIds}
                      onJumpToMark={handleJumpToMark}
                      onToggleRevert={handleToggleRevert}
                      onToggleSuggestion={handleToggleSuggestion}
                      compact
                    />
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}
      </div>

      {/* SAVED APPLICATIONS SLIDE-OVER DRAWER */}
      <SavedDrawer
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        apps={savedApps}
        onLoad={handleLoadSaved}
        onStatusChange={(id, status) =>
          setSavedApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
        }
        onDelete={(id) => setSavedApps((prev) => prev.filter((a) => a.id !== id))}
      />
    </div>
  );
}