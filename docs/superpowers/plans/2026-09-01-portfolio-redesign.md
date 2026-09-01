# Evidence-First Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-file portfolio with a fast, accessible, evidence-first static site that presents Muhammad Ahmed as a hands-on robotics and embedded systems engineer and uses repository media to substantiate the featured work.

**Architecture:** Keep the deployment as plain GitHub Pages with one semantic HTML document, one focused stylesheet, and one progressive-enhancement script. Copy approved media from the project repositories into a local, provenance-documented asset tree, then enforce factual, structural, accessibility, and metadata requirements with a dependency-free Node test suite plus browser verification.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js 24 built-in test runner, macOS `sips`, HTML Tidy, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-01-portfolio-redesign-design.md`

## Global Constraints

- Keep the site static: no framework, package manager, backend, form service, analytics, or tracking.
- Preserve the approved near-black, warm-white, pink-accent identity; reserve green for evidence and status labels.
- Remove the canvas rain, custom cursor, external web fonts, and content-reveal dependencies.
- Keep all content available when JavaScript is disabled; JavaScript may control only the mobile menu and small progressive enhancements.
- Use only evidence-supported project statements. Do not publish repeatability, hit-rate, optimization, clinical, safety, accuracy, or deployment claims that the repositories do not establish.
- Do not publish a resume link until Muhammad approves the exact public file.
- Use repository-sourced media with accurate alt text and document each source in `README.md`.
- Meet WCAG AA contrast for normal text, provide visible keyboard focus, support reduced motion, and keep mobile touch targets at least 44 pixels high and wide.
- Use the exact title `Muhammad Ahmed | Robotics and Embedded Systems Engineer`.
- Use the exact meta description `Robotics and embedded systems portfolio featuring ROS 2 manipulation, embedded sensing, edge perception, and hardware-software integration projects by Muhammad Ahmed.`
- Keep all commit authors and committers as `Muhammad Ahmed <107060720+Ahmedshaikh77@users.noreply.github.com>` with no co-author trailer or automated attribution.
- Do not merge to `main` or publish GitHub Pages until the tested branch has been shown to Muhammad and he explicitly approves publishing it.

---

## File Map

| Path | Responsibility |
|---|---|
| `index.html` | Semantic document structure, recruiter-focused copy, metadata, JSON-LD, project links, and image markup |
| `assets/css/styles.css` | Design tokens, responsive layouts, focus treatment, reduced-motion rules, and visual hierarchy |
| `assets/js/main.js` | Accessible mobile navigation state only |
| `assets/icons/favicon.svg` | Pink-on-black monogram favicon |
| `assets/images/projects/*` | Local copies of approved project media |
| `assets/images/social-preview.png` | 1200 by 630 Open Graph and Twitter preview |
| `assets/images/portfolio-preview.png` | Final desktop screenshot used by the repository README |
| `tests/site.test.mjs` | Dependency-free checks for files, copy, metadata, claim boundaries, semantics, and progressive enhancement |
| `README.md` | Public project overview, preview, local run/deployment instructions, accessibility notes, and media provenance |
| `sitemap.xml` | Single canonical GitHub Pages URL for indexing |
| `.gitignore` | Excludes macOS metadata, local design scratch files, and local server artifacts |
| `docs/superpowers/specs/2026-09-01-portfolio-redesign-design.md` | Approved design contract, with status updated to approved |

---

### Task 1: Establish Guardrails and Repository Hygiene

**Files:**
- Create: `tests/site.test.mjs`
- Create: `.gitignore`
- Modify: `docs/superpowers/specs/2026-09-01-portfolio-redesign-design.md:3`
- Delete from Git tracking: `.DS_Store`

**Interfaces:**
- Consumes: the approved design specification and the current repository root
- Produces: `node --test tests/site.test.mjs` as the single automated acceptance command used by every later task

- [ ] **Step 1: Create the dependency-free acceptance test before changing the site**

Create `tests/site.test.mjs` with this exact content:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');

const requiredFiles = [
  'assets/css/styles.css',
  'assets/js/main.js',
  'assets/icons/favicon.svg',
  'assets/images/social-preview.png',
  'assets/images/portfolio-preview.png',
  'assets/images/projects/kinova-ball-mid-air.jpeg',
  'assets/images/projects/kinova-wind-up.jpeg',
  'assets/images/projects/kinova-stack-gazebo.png',
  'assets/images/projects/kinova-stack-rviz.png',
  'assets/images/projects/neurobot.png',
  'assets/images/projects/crutch-prototype.jpeg',
  'assets/images/projects/armbot-cad.png',
  'sitemap.xml',
  'README.md',
];

test('all production files exist and are non-empty', () => {
  for (const path of requiredFiles) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} is missing`);
    assert.ok(statSync(new URL(`../${path}`, import.meta.url)).size > 0, `${path} is empty`);
  }
});

test('page metadata matches the approved public identity', () => {
  assert.match(html, /<title>Muhammad Ahmed \| Robotics and Embedded Systems Engineer<\/title>/);
  assert.match(html, /name="description" content="Robotics and embedded systems portfolio featuring ROS 2 manipulation, embedded sensing, edge perception, and hardware-software integration projects by Muhammad Ahmed\."/);
  assert.match(html, /rel="canonical" href="https:\/\/ahmedshaikh77\.github\.io\/Muhammad-Ahmed-Portfolio\/"/);
  assert.match(html, /property="og:image" content="https:\/\/ahmedshaikh77\.github\.io\/Muhammad-Ahmed-Portfolio\/assets\/images\/social-preview\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /"@type":\s*"ProfilePage"/);
  assert.match(html, /"@type":\s*"Person"/);
});

test('semantic structure and approved hero copy are present', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<a class="skip-link" href="#main-content">Skip to main content<\/a>/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /Robots should work outside the demo\./);
  assert.match(html, /Robotics and Embedded Systems Engineer/);
  assert.match(html, /Open to robotics and embedded systems opportunities\./);
  assert.match(html, /aria-controls="primary-navigation"/);
  assert.match(html, /aria-expanded="false"/);
});

test('featured projects and factual boundaries are explicit', () => {
  const requiredCopy = [
    'Kinova Gen3 Lite manipulation suite',
    'Physical demonstration, with related simulation and implementation prototypes',
    'joint-state-triggered gripper release',
    'open-loop targeting',
    'Implementation present, validation pending',
    'documented cloud-service boundaries',
    'Embedded-mechatronics bench concept, not human-use validated',
    'committed paths are separate prototypes',
    'Robot-description concept',
    'current clean-launch blocker',
  ];

  for (const phrase of requiredCopy) assert.match(html, new RegExp(phrase));

  const forbiddenClaims = [
    /\b\d+(?:\.\d+)?%\s+(?:accuracy|improvement|reduction|success|repeatability)/i,
    /clinically validated/i,
    /production[- ]ready/i,
    /guaranteed/i,
    /medical benefit/i,
    /safe for human use/i,
  ];

  for (const claim of forbiddenClaims) assert.doesNotMatch(html, claim);
});

test('project media has the approved source paths, alt text, and dimensions', () => {
  const media = [
    ['kinova-ball-mid-air.jpeg', 'Kinova Gen3 Lite arm after releasing a ping-pong ball toward a cup target.'],
    ['kinova-wind-up.jpeg', 'Kinova Gen3 Lite arm in its wind-up pose before throwing a ping-pong ball.'],
    ['kinova-stack-gazebo.png', 'Gazebo view of the Kinova Gen3 Lite pick-and-place stacking scene.'],
    ['kinova-stack-rviz.png', 'RViz view of the Kinova Gen3 Lite pick-and-place stack and planning scene.'],
    ['neurobot.png', 'Repository illustration of the NeuroBot companion prototype.'],
    ['crutch-prototype.jpeg', 'Photograph of the CRUTCH prototype assembly used for exploratory bench work.'],
    ['armbot-cad.png', 'CAD perspective view of the six-joint ArmBot concept.'],
  ];

  for (const [filename, alt] of media) {
    const escaped = alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const image = new RegExp(`<img[^>]+src="assets/images/projects/${filename}"[^>]+alt="${escaped}"[^>]+width="\\d+"[^>]+height="\\d+"`, 's');
    assert.match(html, image, `${filename} needs source, alt, width, and height`);
  }
});

test('external new-tab links are protected and visibly identified', () => {
  const links = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((match) => match[0]);
  assert.ok(links.length >= 8);
  for (const link of links) {
    assert.match(link, /rel="noopener noreferrer"/);
    assert.match(link, /aria-label="[^"]+ \(opens in a new tab\)"/);
  }
});

test('styles support focus, mobile touch targets, and reduced motion', () => {
  const css = read('assets/css/styles.css');
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-(?:height|block-size):\s*44px/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(css, /cursor:\s*none/);
  assert.doesNotMatch(css, /@import\s+url/);
});

test('mobile navigation script maintains accessible state', () => {
  const script = read('assets/js/main.js');
  assert.match(script, /setAttribute\('aria-expanded'/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /matchMedia\('\(min-width: 768px\)'\)/);
});

test('README records authorship, deployment, accessibility, and media provenance', () => {
  const readme = read('README.md');
  assert.match(readme, /Live portfolio/i);
  assert.match(readme, /Local preview/i);
  assert.match(readme, /GitHub Pages/i);
  assert.match(readme, /Accessibility/i);
  assert.match(readme, /Media provenance/i);
  assert.match(readme, /Muhammad Ahmed/);
  assert.doesNotMatch(readme, /co-authored-by/i);
});
```

- [ ] **Step 2: Run the test and confirm it fails against the current single-file site**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: FAIL, beginning with missing `assets/css/styles.css` and other production files.

- [ ] **Step 3: Add repository hygiene rules and stop tracking macOS metadata**

Create `.gitignore` with:

```gitignore
.DS_Store
.superpowers/
*.log
```

Remove only the tracked root metadata file:

```bash
git rm --cached .DS_Store
```

Update the specification status line to:

```markdown
**Status:** Approved for implementation
```

- [ ] **Step 4: Verify the branch identity and staged scope**

Run:

```bash
git branch --show-current
git config user.name
git config user.email
git status --short
```

Expected: branch `codex/portfolio-evidence-first`; identity `Muhammad Ahmed` and `107060720+Ahmedshaikh77@users.noreply.github.com`; only `.gitignore`, `.DS_Store`, the spec status, and the test are ready for this task.

- [ ] **Step 5: Commit the guardrails**

```bash
git add .gitignore tests/site.test.mjs docs/superpowers/specs/2026-09-01-portfolio-redesign-design.md
git commit -m "test: define portfolio acceptance checks"
```

Expected: the commit has Muhammad Ahmed as both author and committer and contains no co-author trailer.

---

### Task 2: Import Verified Project Media and Create Brand Assets

**Files:**
- Create: `assets/images/projects/kinova-ball-mid-air.jpeg`
- Create: `assets/images/projects/kinova-wind-up.jpeg`
- Create: `assets/images/projects/kinova-stack-gazebo.png`
- Create: `assets/images/projects/kinova-stack-rviz.png`
- Create: `assets/images/projects/neurobot.png`
- Create: `assets/images/projects/crutch-prototype.jpeg`
- Create: `assets/images/projects/armbot-cad.png`
- Create: `assets/icons/favicon.svg`
- Create: `assets/images/social-preview.png`

**Interfaces:**
- Consumes: approved source media from sibling repositories and one CRUTCH README attachment URL
- Produces: the exact relative paths referenced by `index.html`, the test suite, social metadata, and the README

- [ ] **Step 1: Create the production asset directories and copy local repository media without transforming it**

Run:

```bash
mkdir -p assets/images/projects assets/icons
cp "../KinovaGen3-Beer-Pong/docs/Ball in Mid-Air During the Throw.jpeg" assets/images/projects/kinova-ball-mid-air.jpeg
cp "../KinovaGen3-Beer-Pong/docs/Robot in Wind-Up Pose Before the Throw.jpeg" assets/images/projects/kinova-wind-up.jpeg
cp ../kinovaGen3-Pick-and-Place/docs/_final_stack_gazebo.png assets/images/projects/kinova-stack-gazebo.png
cp ../kinovaGen3-Pick-and-Place/docs/_final_stack_rviz.png assets/images/projects/kinova-stack-rviz.png
cp ../Neuro-Adaptive-Robotic-Companion/assets/NeuroBot.png assets/images/projects/neurobot.png
cp ../6DOF-Robot/docs/Screenshot_2025-10-16_at_11.55.14_PM.png assets/images/projects/armbot-cad.png
```

Expected: six copied files exist under `assets/images/projects/`; no sibling repository is modified.

- [ ] **Step 2: Download the repository-linked CRUTCH prototype image after obtaining network permission**

Run:

```bash
curl -L --fail --show-error "https://github.com/user-attachments/assets/b7e089eb-321b-4cbf-8a11-7d43467a3301" -o assets/images/projects/crutch-prototype.jpeg
```

Expected: HTTP download succeeds and `sips -g format assets/images/projects/crutch-prototype.jpeg` identifies a readable JPEG-family image. If GitHub denies automated access, stop this step and request the user to download the exact attachment; do not replace it with unrelated stock media.

- [ ] **Step 3: Record the exact intrinsic dimensions used by the future image markup**

Run:

```bash
sips -g pixelWidth -g pixelHeight assets/images/projects/*
```

Expected: every file reports positive pixel width and height. Copy these exact values into the corresponding `width` and `height` attributes in Task 3.

- [ ] **Step 4: Create the SVG favicon**

Create `assets/icons/favicon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title">
  <title id="title">Muhammad Ahmed monogram</title>
  <rect width="64" height="64" rx="14" fill="#0a0a0d"/>
  <path d="M14 45V19h7l11 16 11-16h7v26h-7V30L32 46 21 30v15z" fill="#ff4f9a"/>
</svg>
```

- [ ] **Step 5: Create the 1200 by 630 social preview source and convert it to PNG**

Create `assets/images/social-preview.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#09090c"/>
  <circle cx="1060" cy="90" r="240" fill="#ff4f9a" opacity="0.08"/>
  <path d="M80 88h96" stroke="#ff4f9a" stroke-width="8"/>
  <text x="80" y="210" fill="#f7f4f6" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">Muhammad Ahmed</text>
  <text x="80" y="292" fill="#ff75ad" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="600">Robotics and Embedded Systems Engineer</text>
  <text x="80" y="405" fill="#c8c2c7" font-family="Arial, Helvetica, sans-serif" font-size="30">Selected work in ROS 2, embedded sensing,</text>
  <text x="80" y="452" fill="#c8c2c7" font-family="Arial, Helvetica, sans-serif" font-size="30">and edge perception</text>
  <rect x="80" y="520" width="174" height="42" rx="21" fill="#15261d"/>
  <text x="104" y="549" fill="#7be8a3" font-family="Menlo, monospace" font-size="19">EVIDENCE FIRST</text>
</svg>
```

Convert and verify:

```bash
sips -s format png assets/images/social-preview.svg --out assets/images/social-preview.png
sips -g pixelWidth -g pixelHeight assets/images/social-preview.png
```

Expected: `pixelWidth: 1200` and `pixelHeight: 630`. Delete only the intermediate SVG through an `apply_patch` deletion after confirming the PNG renders correctly.

- [ ] **Step 6: Run the acceptance suite to confirm only the unfinished site/document checks remain**

Run:

```bash
node --test tests/site.test.mjs
```

Expected: the media file test still reports only `assets/images/portfolio-preview.png` as absent; semantic, style, script, and README tests remain red because those tasks are not complete.

- [ ] **Step 7: Commit verified media and brand assets**

```bash
git add assets/icons/favicon.svg assets/images/projects assets/images/social-preview.png
git commit -m "assets: add verified robotics project media"
```

Expected: the intermediate `social-preview.svg` is not committed.

---

### Task 3: Build the Semantic Evidence-First Document

**Files:**
- Replace: `index.html`

**Interfaces:**
- Consumes: project asset paths and intrinsic dimensions from Task 2; canonical links and copy boundaries from the approved specification
- Produces: stable element IDs `main-content`, `primary-navigation`, `work`, `experience`, `capabilities`, `about`, and `contact` for CSS, JavaScript, tests, and deep links

- [ ] **Step 1: Replace the current document head with the exact metadata contract**

The new `<head>` must contain these values, with no external font or analytics requests:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Muhammad Ahmed | Robotics and Embedded Systems Engineer</title>
  <meta name="description" content="Robotics and embedded systems portfolio featuring ROS 2 manipulation, embedded sensing, edge perception, and hardware-software integration projects by Muhammad Ahmed.">
  <link rel="canonical" href="https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <meta name="theme-color" content="#09090c">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="Muhammad Ahmed | Robotics and Embedded Systems Engineer">
  <meta property="og:description" content="Selected work in ROS 2 manipulation, embedded sensing, edge perception, and hardware-software integration.">
  <meta property="og:url" content="https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/">
  <meta property="og:image" content="https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/assets/images/social-preview.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Muhammad Ahmed | Robotics and Embedded Systems Engineer">
  <meta name="twitter:description" content="Selected work in ROS 2, embedded sensing, and edge perception.">
  <meta name="twitter:image" content="https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/assets/images/social-preview.png">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "url": "https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/",
    "mainEntity": {
      "@type": "Person",
      "name": "Muhammad Ahmed",
      "jobTitle": "Robotics and Embedded Systems Engineer",
      "email": "mailto:ms1242@duke.edu",
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Duke University"
      },
      "sameAs": [
        "https://github.com/Ahmedshaikh77",
        "https://www.linkedin.com/in/muhammad-ahmed-nazir-shaikh/",
        "https://x.com/ShaikhRobotics"
      ]
    }
  }
  </script>
</head>
```

- [ ] **Step 2: Build the skip link, header, and recruiter-focused hero**

Use this exact hierarchy and copy:

```html
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header" data-header>
    <a class="brand" href="#top" aria-label="Muhammad Ahmed, home">MA<span aria-hidden="true">.</span></a>
    <button class="menu-button" type="button" aria-controls="primary-navigation" aria-expanded="false">
      <span class="menu-button__label">Menu</span>
      <span class="menu-button__icon" aria-hidden="true"></span>
    </button>
    <nav id="primary-navigation" class="site-nav" aria-label="Primary navigation">
      <a href="#work">Selected Work</a>
      <a href="#experience">Experience</a>
      <a href="#capabilities">Capabilities</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <main id="main-content">
    <section id="top" class="hero" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">Robotics and Embedded Systems Engineer</p>
        <h1 id="hero-title">Robots should work outside the demo.</h1>
        <p class="hero__lede">I connect sensing, embedded software, motion planning, and physical hardware to build robotics systems that can be tested honestly.</p>
        <p class="availability"><span aria-hidden="true"></span>Open to robotics and embedded systems opportunities.</p>
        <div class="hero__actions" aria-label="Portfolio actions">
          <a class="button button--primary" href="#work">View selected work</a>
          <a class="button button--secondary" href="https://github.com/Ahmedshaikh77" target="_blank" rel="noopener noreferrer" aria-label="View Muhammad Ahmed on GitHub (opens in a new tab)">View GitHub <span aria-hidden="true">↗</span></a>
          <a class="text-link" href="https://www.linkedin.com/in/muhammad-ahmed-nazir-shaikh/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Muhammad Ahmed on LinkedIn (opens in a new tab)">Connect on LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <aside class="hero__system" aria-label="Engineering focus">
        <p class="system-label">SYSTEM VIEW</p>
        <ol>
          <li><span>01</span> Sense</li>
          <li><span>02</span> Decide</li>
          <li><span>03</span> Act</li>
          <li><span>04</span> Verify</li>
        </ol>
      </aside>
    </section>
```

- [ ] **Step 3: Build selected work in the approved visual order**

Use `<section id="work" aria-labelledby="work-title">`, an `h2` titled `Selected work`, and four `article` elements with `h3` headings. Use the following exact content contract:

| Project | Status | Engineering question | Muhammad's contribution | Implemented approach | Evidence and boundary | Repository and media links |
|---|---|---|---|---|---|---|
| Kinova Gen3 Lite manipulation suite | `Physical demonstration, with related simulation and implementation prototypes` | `How do you turn motion-planning primitives into manipulation behaviors that can be inspected on hardware and in simulation?` | `I built the original beer_pong ROS 2 package with single-throw and six-cup nodes, gripper control, MoveIt 2 commands, collision-scene objects, and checked-in joint-limit configuration.` | `The suite combines MoveIt 2 motion commands and planning-scene setup with a Kortex gripper node. The throwing path triggers release from observed joint state; the related pick-and-place and writing prototypes use fixed task branches and fixed MAN stroke waypoints.` | `The physical throwing demo uses joint-state-triggered gripper release and open-loop targeting. The related repositories include captured Gazebo and RViz states and document current reproduction limits, not repeatability or hit-rate claims.` | Beer Pong `https://github.com/Ahmedshaikh77/KinovaGen3-Beer-Pong`; demo video `https://github.com/Ahmedshaikh77/KinovaGen3-Beer-Pong/blob/main/docs/Kinova%20Gen3%20Lite%20Beer%20Pong%20Demo.mp4`; Pick and Place `https://github.com/Ahmedshaikh77/kinovaGen3-Pick-and-Place`; Write Initials `https://github.com/Ahmedshaikh77/KinovaGen3-Write-Initials` |
| NeuroBot | `Implementation present, validation pending` | `Can a companion-robot perception pipeline degrade gracefully when one modality is noisy or unavailable?` | `I implemented the face-processing and voice-session pipeline, modality adapters, AdaptiveGate, late fusion, fault-injection helpers, and a Jetson-oriented latency and power harness.` | `The implementation keeps face processing local, adapts face, gesture, and audio outputs into a shared confidence representation, applies AdaptiveGate, and combines available modalities with late fusion. Voice sessions document Google speech-recognition and optional OpenAI service boundaries.` | `A compute-cost artifact records latency and board-power values across four Jetson power modes; the repository does not establish model accuracy, clinical inference, ROS 2 actuation, physiological sensor integration, or a validated multimodal improvement.` | `https://github.com/Ahmedshaikh77/Neuro-Adaptive-Robotic-Companion` |
| CRUTCH | `Embedded-mechatronics bench concept, not human-use validated` | `How can sensing, logging, actuation, and a compliant mechanism be explored without overstating an early assistive-device prototype?` | `My recorded work includes spring-damper concept documentation and additional-part integration, ESP32 communication paths, sensor and actuator integration, Python logging and visualization tools, and simulation and experiment materials.` | `The committed work explores ESP32 inertial and load-sensing paths, Python logging and visualization, a stepper interface, and a spring-damper mechanical concept as separate bench prototypes.` | `The committed paths are separate prototypes, not a verified 50 Hz integrated system, validated impact-force reduction, gait improvement, clinical device, or safe human-use claim.` | `https://github.com/Ahmedshaikh77/Comfortable-Responsive-Universal-Technology-for-Crutch-Health-CRUTCH` |
| ArmBot | `Robot-description concept` | `What has to be represented correctly before a custom arm can become a controllable robotics system?` | `I created the six-joint Xacro and URDF description, seven STL meshes, launch definitions, and the CAD and historical RViz evidence in the repository.` | `The implementation models the six-joint kinematic structure in Xacro and URDF, associates seven checked-in meshes with the links, and includes launch definitions for inspecting the description.` | `The repository demonstrates a robot-description concept and records a current clean-launch blocker. It does not present a demonstrated control system.` | `https://github.com/Ahmedshaikh77/6DOF-Robot` |

For every article:

- Put the repository-sourced cover before the copy on screens below 768 pixels.
- Use the exact `src`, `alt`, `width`, and `height` values established in Task 2.
- Keep each image attribute in the order `src`, `alt`, `width`, then `height` so the static acceptance check can audit the markup deterministically.
- Add `loading="lazy"` to every image except `kinova-ball-mid-air.jpeg`.
- Keep title, status, copy, and links outside the image so missing media cannot hide project information.
- Label the four factual blocks `Engineering question`, `My contribution`, `Implemented approach`, and `Evidence and current boundary` so a fast recruiter scan can separate contribution from project scope.
- In the Kinova article, use `kinova-ball-mid-air.jpeg` as the lead cover and add a supporting gallery containing `kinova-wind-up.jpeg`, `kinova-stack-gazebo.png`, and `kinova-stack-rviz.png` with their approved alt text.
- Open GitHub links in new tabs with `rel="noopener noreferrer"` and an `aria-label` ending in `(opens in a new tab)`.
- Add a semantic technology list. Use only these terms:
  - Kinova: `ROS 2`, `MoveIt 2`, `C++`, `Kortex`, `RViz`, `Gazebo`
  - NeuroBot: `Python`, `PyTorch`, `OpenCV`, `MediaPipe`, `NVIDIA Jetson`
  - CRUTCH: `ESP32`, `Embedded C++`, `IMU`, `Load sensing`, `Python logging`, `Mechatronics`
  - ArmBot: `URDF`, `Xacro`, `ROS 2`, `CAD`, `RViz`

- [ ] **Step 4: Build experience, capabilities, about, and contact sections**

Use these exact public facts and order:

```text
Experience
Robotics Systems Engineer | 24 and Up | May 2026 to present
Work across embedded software, sensor integration, hardware-software interfaces, rapid prototyping, system testing, and real-world debugging for robotics and intelligent automation systems.

Junior R&D Engineer | Duke University Wilkinson Garage Lab | June 2025 to May 2026
Contributed to robotics and medical-robotics prototyping, assistive-device concepts, sensor integration, and control work; supported fabrication and troubleshooting with 3D printers, CNC machines, laser cutters, and electronics workbenches; trained students in safe lab-equipment use.

Teaching appointments | Duke University | 2024 to 2026
Supported Robotics & Automation, Experimental Design & Research Methods, and Thermodynamics through lab and office hours, ROS assignment troubleshooting, design and test planning, technical feedback, and engineering problem-solving.
```

Encode every literal ampersand as `&amp;` when placing this copy into HTML.

Render capabilities as four semantic lists and link each heading to evidence already on the page:

```text
Robotics software: ROS 2, MoveIt 2, RViz, Gazebo, motion planning, planning scenes, gripper interfaces
Embedded systems: ESP32, microcontrollers, sensing, telemetry, embedded Linux
Perception and edge compute: Python, PyTorch, OpenCV, MediaPipe, NVIDIA Jetson
Hardware and mechatronics: sensor and actuator integration, prototyping, CAD, test documentation
```

Use this about copy:

```text
I work across the complete robotic system because most real failures do not respect discipline boundaries. A calibration offset can look like a planning problem, an electrical limitation can appear as unstable control, and a clean simulation can still hide a hardware integration issue. My approach is to make each boundary observable, document what the evidence proves, and iterate from the physical system back into the model.
```

Use these education and research items:

```text
M.S. Mechanical Engineering and Materials Science, Duke University, 2026
B.Tech. Mechanical Engineering, SRM Institute of Science and Technology
Tribo-Corrosion and Mechanical Performance of Electro-deposited Nano-Composite h-BN/Epoxy Coating
https://journals.sagepub.com/doi/10.1177/13506501241257560
```

Use this contact copy and destinations:

```text
Building robotics that crosses the boundary between software and hardware?
I am open to robotics, embedded systems, sensor integration, actuator integration, manipulation, and hardware-software systems roles.
Email: mailto:ms1242@duke.edu
LinkedIn: https://www.linkedin.com/in/muhammad-ahmed-nazir-shaikh/
GitHub: https://github.com/Ahmedshaikh77
X: https://x.com/ShaikhRobotics
```

End the body with a footer containing `© 2026 Muhammad Ahmed` and load the script with:

```html
  </main>
  <footer class="site-footer"><p>© 2026 Muhammad Ahmed</p></footer>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 5: Validate the HTML content before styling**

Run:

```bash
tidy -errors -quiet index.html
node --test tests/site.test.mjs
```

Expected: Tidy reports no project-caused structural errors. Metadata, semantics, project content, claim-boundary, image-markup, and protected-link tests pass; CSS, JavaScript, README, sitemap, and preview checks remain incomplete.

- [ ] **Step 6: Commit the semantic document**

```bash
git add index.html
git commit -m "feat: present evidence-first robotics case studies"
```

---

### Task 4: Implement the Responsive Accessible Visual System

**Files:**
- Create: `assets/css/styles.css`

**Interfaces:**
- Consumes: all class names and section IDs in Task 3
- Produces: recruiter-scan hierarchy, single-column mobile cards below 768 pixels, accessible focus and touch targets, and reduced-motion behavior

- [ ] **Step 1: Define the design tokens and global foundations**

Start `assets/css/styles.css` with these exact tokens and baseline rules:

```css
:root {
  color-scheme: dark;
  --bg: #09090c;
  --surface: #111116;
  --surface-raised: #17171e;
  --text: #f7f4f6;
  --muted: #c8c2c7;
  --subtle: #9f979d;
  --accent: #ff4f9a;
  --accent-strong: #ff75ad;
  --evidence: #7be8a3;
  --border: #323039;
  --max-width: 1180px;
  --radius-lg: 24px;
  --radius-md: 16px;
  --shadow: 0 24px 80px rgb(0 0 0 / 0.32);
  --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-width: 320px;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  line-height: 1.6;
  text-rendering: optimizeLegibility;
}
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
:focus-visible { outline: 3px solid var(--accent-strong); outline-offset: 4px; }
.skip-link {
  position: fixed;
  inset: 12px auto auto 12px;
  z-index: 100;
  padding: 10px 14px;
  background: var(--text);
  color: var(--bg);
  transform: translateY(-160%);
}
.skip-link:focus { transform: translateY(0); }
```

- [ ] **Step 2: Style the header and mobile navigation with no-JavaScript fallback**

Required behavior:

- `.site-header` is sticky, centered within `--max-width`, and uses a translucent dark background with a visible bottom border.
- `.site-nav` is visible and wraps when JavaScript is unavailable.
- `.js .site-nav` may collapse below 768 pixels; `.js .site-nav[data-open="true"]` restores it.
- `.menu-button` is hidden by default, shown only under `.js` below 768 pixels, and has `min-height: 44px` and `min-width: 44px`.
- All navigation links have at least 44 pixels of block-size on mobile.
- Desktop navigation is a horizontal row at 768 pixels and wider.

Use a CSS selector contract of `.js`, `.menu-button`, `.site-nav`, and `.site-nav[data-open="true"]`; Task 5 depends on those names.

- [ ] **Step 3: Style the hero and project hierarchy**

Implement these exact layout rules:

- Constrain the page to `min(var(--max-width), calc(100% - 40px))` on mobile and `calc(100% - 80px)` on desktop.
- Use `clamp(3rem, 8vw, 7rem)` for the hero `h1` and keep its maximum readable width at 11 characters per visual line.
- Place `.hero__copy` and `.hero__system` in one column by default and a `minmax(0, 1.45fr) minmax(280px, 0.55fr)` grid from 900 pixels.
- Keep `.hero__actions` wrapping so no action can leave the viewport.
- Give `.availability` a green circular marker, but keep the sentence as real text.
- Make the Kinova article full-width, NeuroBot and CRUTCH a two-column row at 900 pixels, and ArmBot full-width.
- Below 768 pixels, use one column for every project and place each media block before its content.
- Use `object-fit: cover` for photographic media and `object-fit: contain` with a dark technical panel for NeuroBot.
- Do not stretch NeuroBot beyond its intrinsic size.
- Give status labels a green foreground on a dark green background and keep body copy in `--muted` or brighter.

- [ ] **Step 4: Style experience, capabilities, about, contact, and footer**

Implement these scan patterns:

- Experience uses a left-side chronological rule on desktop and a compact stacked layout on mobile.
- Capabilities uses four equal cards at 1000 pixels, two at 640 pixels, and one below 640 pixels.
- Technology lists use semantic `ul` elements styled as wrapping pills.
- About uses a two-column layout for narrative and education/research above 900 pixels.
- Contact is a high-contrast panel with wrapping action links and no form.
- Section headings share a visible monospace eyebrow and have consistent vertical rhythm.
- The footer contains only the copyright line and a top border.

- [ ] **Step 5: Add reduced-motion and resilient responsive rules**

End the file with:

```css
@media (max-width: 767px) {
  .hero__actions,
  .contact__actions { align-items: stretch; }
  .button,
  .text-link,
  .site-nav a { min-height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Do not add `cursor: none`, continuous animation, hidden initial content, remote font imports, or an IntersectionObserver requirement.

- [ ] **Step 6: Run static checks and inspect the stylesheet for forbidden regressions**

Run:

```bash
node --test tests/site.test.mjs
rg -n "cursor:\\s*none|@import|opacity:\\s*0.*reveal|canvas" assets/css/styles.css index.html
```

Expected: the style test passes and the search prints no matches. JavaScript, README, sitemap, and preview checks remain incomplete.

- [ ] **Step 7: Commit the responsive visual system**

```bash
git add assets/css/styles.css
git commit -m "feat: add accessible responsive portfolio styling"
```

---

### Task 5: Add the Accessible Mobile Navigation Enhancement

**Files:**
- Create: `assets/js/main.js`

**Interfaces:**
- Consumes: `.menu-button`, `#primary-navigation`, `.site-nav[data-open]`, and the `768px` CSS breakpoint
- Produces: synchronized `aria-expanded` and `data-open` states with Escape, link-selection, and desktop-reset behavior

- [ ] **Step 1: Write the complete progressive-enhancement script**

Create `assets/js/main.js` with:

```js
document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#primary-navigation');
const desktopQuery = window.matchMedia('(min-width: 768px)');

if (menuButton && navigation) {
  const setOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
    menuButton.querySelector('.menu-button__label').textContent = open ? 'Close' : 'Menu';
  };

  const closeMenu = () => setOpen(false);

  menuButton.addEventListener('click', () => {
    setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });

  closeMenu();
}
```

- [ ] **Step 2: Verify script behavior statically**

Run:

```bash
node --check assets/js/main.js
node --test tests/site.test.mjs
```

Expected: JavaScript syntax and mobile-navigation tests pass. Only README, sitemap, final preview, and browser-dependent acceptance items remain.

- [ ] **Step 3: Commit the enhancement**

```bash
git add assets/js/main.js
git commit -m "feat: add accessible mobile navigation"
```

---

### Task 6: Document the Portfolio and Add Search Indexing

**Files:**
- Replace: `README.md`
- Create: `sitemap.xml`

**Interfaces:**
- Consumes: final information architecture, canonical URL, project URLs, and media paths
- Produces: public maintenance/deployment guidance and a project-level sitemap

- [ ] **Step 1: Replace the README with an evidence-focused public overview**

Use this exact section order:

````markdown
# Muhammad Ahmed | Robotics and Embedded Systems Portfolio

[![Portfolio preview](assets/images/portfolio-preview.png)](https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/)

## Live portfolio

Visit [ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio](https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/).

## Purpose

This portfolio presents selected robotics and embedded systems work through evidence, implementation boundaries, and personal contribution. It focuses on ROS 2 manipulation, embedded sensing, edge perception, and hardware-software integration.

## Selected features

- Evidence-first case studies with repository-sourced media
- Accurate project status and validation boundaries
- Responsive layouts for mobile, tablet, and desktop
- Keyboard-operable navigation and reduced-motion support
- Open Graph, Twitter card, JSON-LD, favicon, and sitemap metadata
- Plain HTML, CSS, and JavaScript with no build step

## Repository structure

```text
.
|-- index.html
|-- sitemap.xml
|-- assets/
|   |-- css/styles.css
|   |-- js/main.js
|   |-- icons/favicon.svg
|   `-- images/
|       |-- portfolio-preview.png
|       |-- social-preview.png
|       `-- projects/
`-- tests/site.test.mjs
```

## Local preview

From the repository root, run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

Run the dependency-free checks with:

```bash
node --test tests/site.test.mjs
```

## GitHub Pages deployment

The site is published from the repository's `main` branch through GitHub Pages. After a tested change is merged into `main`, verify that the live revision matches the commit and that all project media resolves from the published URL.

## Accessibility and performance

The site uses semantic landmarks and heading order, a skip link, visible keyboard focus, 44-pixel mobile targets, reduced-motion styles, explicit image dimensions, local system fonts, and progressive enhancement. Core content stays visible if JavaScript is unavailable.

## Media provenance

- `kinova-ball-mid-air.jpeg` and `kinova-wind-up.jpeg`: copied from `Ahmedshaikh77/KinovaGen3-Beer-Pong` under `docs/`.
- `kinova-stack-gazebo.png` and `kinova-stack-rviz.png`: copied from `Ahmedshaikh77/kinovaGen3-Pick-and-Place` under `docs/`.
- `neurobot.png`: copied from `Ahmedshaikh77/Neuro-Adaptive-Robotic-Companion` under `assets/`; presented as a repository illustration.
- `crutch-prototype.jpeg`: downloaded from the prototype image linked in the `Ahmedshaikh77/Comfortable-Responsive-Universal-Technology-for-Crutch-Health-CRUTCH` README at `https://github.com/user-attachments/assets/b7e089eb-321b-4cbf-8a11-7d43467a3301`.
- `armbot-cad.png`: copied from `Ahmedshaikh77/6DOF-Robot` under `docs/`.
- `social-preview.png`: portfolio identity graphic created for this site.
- `portfolio-preview.png`: screenshot of the finished local portfolio.

Repository media is used to show the documented project context. An image alone is not presented as proof of performance, ownership of every pictured component, clinical validation, or production readiness.

## Authorship

Designed, written, and maintained by Muhammad Ahmed.
````

- [ ] **Step 2: Create the canonical sitemap**

Create `sitemap.xml` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Run documentation and metadata checks**

Run:

```bash
node --test tests/site.test.mjs
tidy -errors -quiet index.html
```

Expected: README and sitemap checks pass; only the missing final portfolio screenshot prevents the full automated suite from passing.

- [ ] **Step 4: Commit documentation and search indexing**

```bash
git add README.md sitemap.xml
git commit -m "docs: explain portfolio evidence and deployment"
```

---

### Task 7: Verify the Experience and Capture the Final Preview

**Files:**
- Create: `assets/images/portfolio-preview.png`
- Modify if verification finds defects: `index.html`, `assets/css/styles.css`, `assets/js/main.js`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: complete local site from Tasks 1 through 6
- Produces: reviewed 390, 768, and 1280 pixel experiences plus the README screenshot that makes the automated suite green

- [ ] **Step 1: Start the local static server**

Run:

```bash
python3 -m http.server 4173
```

Expected: `http://localhost:4173/` returns the portfolio and each project image returns HTTP 200.

- [ ] **Step 2: Verify the desktop experience at 1280 pixels**

Using the in-app browser, set a 1280-pixel-wide viewport and verify:

- Header and all five navigation links are visible.
- Hero identity, headline, supporting copy, availability, and all three actions fit without horizontal scrolling.
- Kinova is the first full-width project.
- NeuroBot and CRUTCH form a balanced two-column row.
- ArmBot closes the project section at full width.
- Experience, capabilities, about, and contact follow the approved order.
- Every project image loads and no console errors occur.
- The page has no continuous animation and uses the native cursor.

- [ ] **Step 3: Verify tablet and mobile experiences at 768 and 390 pixels**

At each width, verify:

- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- Hero actions wrap and remain visible.
- Project cards are single-column at 390 pixels and covers appear before copy.
- The menu button reports `aria-expanded="false"`, becomes `true` when opened, closes after a navigation link is selected, and closes on Escape while returning focus to the button.
- Every menu and action target is at least 44 by 44 CSS pixels on mobile.
- Keyboard Tab order starts with the skip link and proceeds logically.
- Project titles and links remain usable when an image request is blocked.

- [ ] **Step 4: Verify no-JavaScript and reduced-motion behavior**

Disable JavaScript in the browser and reload. Confirm all content and navigation links remain visible and usable. Emulate `prefers-reduced-motion: reduce`, reload, and confirm smooth scrolling and nonessential transitions are disabled.

- [ ] **Step 5: Verify contrast and external links**

Inspect computed color pairs for normal text:

- `#f7f4f6` on `#09090c`
- `#c8c2c7` on `#09090c`
- `#c8c2c7` on `#111116`
- `#ff75ad` on `#09090c`
- `#7be8a3` on the status-label background

Each must meet 4.5:1 for normal text. Open each GitHub, LinkedIn, X, SAGE, email, and canonical link once. Record any service that blocks automated access, but do not replace a correct URL because of an anti-bot response.

- [ ] **Step 6: Capture the final 1280-pixel desktop screenshot**

With the local page at the top and a 1280 by 900 viewport, capture a PNG screenshot showing the hero and the beginning of selected work. Save it exactly as `assets/images/portfolio-preview.png`. Confirm the screenshot contains the final site rather than a browser error page and has no personal browser chrome, account notifications, or unrelated tabs.

- [ ] **Step 7: Run the complete automated and static verification suite**

Run:

```bash
node --test tests/site.test.mjs
node --check assets/js/main.js
tidy -errors -quiet index.html
git diff --check
```

Expected: all Node tests pass, JavaScript syntax is valid, Tidy reports no project-caused HTML errors, and `git diff --check` prints nothing.

- [ ] **Step 8: Inspect for unsupported claims and stale positioning**

Run:

```bash
rg -n "student|candidate|clinically validated|production.ready|accuracy|hit rate|repeatability|gait improvement|force reduction|safe for human use|cursor:\\s*none|<canvas" index.html README.md assets
```

Expected: no unsupported claim, stale student positioning, custom cursor, or canvas implementation appears. A repository-boundary sentence may contain a denied term only when it explicitly states that the repository does not establish that claim; review every match manually.

- [ ] **Step 9: Commit the verified preview and any review fixes**

```bash
git add assets/images/portfolio-preview.png index.html assets/css/styles.css assets/js/main.js tests/site.test.mjs
git commit -m "test: verify responsive portfolio experience"
```

If no implementation file changed during browser review, stage and commit only `assets/images/portfolio-preview.png` with the same message.

---

### Task 8: Final Review, Authorship Audit, and Approval-Gated Publish

**Files:**
- Review only: all files changed on `codex/portfolio-evidence-first`

**Interfaces:**
- Consumes: a fully green branch and final browser screenshots
- Produces: a user-reviewable branch; after explicit approval, an updated `main` branch and matching GitHub Pages deployment

- [ ] **Step 1: Compare the implementation against every acceptance criterion in the approved specification**

Run:

```bash
git diff --stat main...HEAD
git diff --check main...HEAD
node --test tests/site.test.mjs
```

Review the diff section by section: hero, selected work, experience, capabilities, about, contact, accessibility, metadata, documentation, and media provenance. Confirm no source code in any robotics repository changed.

- [ ] **Step 2: Scan the implementation plan and production files for unfinished markers**

Run:

```bash
rg -n "T[O]DO|T[B]D|F[I]XME" docs/superpowers/plans/2026-09-01-portfolio-redesign.md index.html README.md assets tests
```

Expected: no matches.

- [ ] **Step 3: Audit every branch commit for sole Muhammad Ahmed authorship**

Run:

```bash
git log main..HEAD --format='%h | %an <%ae> | %cn <%ce> | %s%n%b'
```

Expected: every author and committer is `Muhammad Ahmed <107060720+Ahmedshaikh77@users.noreply.github.com>` and no commit body contains a co-author trailer or automated attribution.

- [ ] **Step 4: Present the tested local site and branch summary to Muhammad**

Show the final local portfolio, list the factual boundaries preserved, identify every repository cover used, and state that `main` and the live GitHub Pages site are still unchanged. Ask for explicit approval to publish this tested revision.

- [ ] **Step 5: Publish only after Muhammad explicitly approves the tested revision**

After approval, update local `main` with a fast-forward and push it:

```bash
git switch main
git merge --ff-only codex/portfolio-evidence-first
git push origin main
```

Expected: the push succeeds without a merge commit. Do not use a force push.

- [ ] **Step 6: Verify the deployed revision**

Open `https://ahmedshaikh77.github.io/Muhammad-Ahmed-Portfolio/` after GitHub Pages finishes deploying. Confirm the live title, hero, project media, responsive navigation, and `social-preview.png` match the approved commit. Report the final commit hash and live URL to Muhammad.
