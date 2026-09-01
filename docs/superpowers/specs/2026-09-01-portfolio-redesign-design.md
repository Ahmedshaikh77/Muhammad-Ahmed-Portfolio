# Muhammad Ahmed Portfolio Redesign

**Date:** 2026-09-01<br>
**Status:** Approved for implementation
**Direction:** Evidence-first technical

## Context

The current portfolio has a distinctive black and pink identity, but its strongest robotics work appears too late, the mobile navigation is removed, some calls to action are offscreen, and several prominent metrics are not supported by the current public repositories. The site also describes Muhammad as a Duke student after the stated 2026 graduation date.

The redesign will preserve the memorable technical character while changing the portfolio from a long skills and claims page into an evidence-first engineering portfolio. Recruiters should understand Muhammad's focus, strongest work, personal contribution, and availability within the first screen and first two sections.

## Audience and primary outcome

The primary audience is technical recruiters, hiring managers, and robotics engineers hiring for:

- Robotics systems engineering
- Embedded systems and firmware
- Sensor and actuator integration
- Robotic manipulation and controls
- Hardware-software integration
- Edge perception and physical AI

The primary outcome is a qualified recruiter opening a project, GitHub profile, LinkedIn profile, or contact link after a fast scan.

## Design principles

1. **Evidence before keywords.** Real projects, media, implementation boundaries, and personal contribution appear before a large skills inventory.
2. **Credibility over inflated metrics.** Unsupported outcome numbers and clinical or deployment claims are removed.
3. **System-level positioning.** The page connects mechanics, electronics, sensing, embedded software, perception, planning, controls, and testing.
4. **Memorable but professional.** The black and pink visual identity remains, while decorative motion and visual noise are reduced.
5. **Accessible by default.** Content remains available without JavaScript, navigation works on mobile and keyboard, and reduced-motion preferences are respected.
6. **Static and maintainable.** The site remains plain HTML, CSS, and JavaScript with no framework or build step.

## Visual direction

### Color and typography

- Near-black background with slightly lighter project panels.
- Warm white primary text.
- Pink accent for actions and selected technical details.
- Green is reserved for evidence or status labels such as `Physical demonstration`.
- Muted text must meet WCAG AA contrast on every background.
- Use a compact system sans-serif and system monospace stack to avoid unnecessary font downloads.

### Motion

- Remove the continuous full-page canvas rain.
- Remove the custom radar cursor.
- Use limited entrance or hover transitions only when motion is permitted.
- Under `prefers-reduced-motion: reduce`, disable smooth scrolling and all nonessential transitions.
- Content is visible by default and never depends on IntersectionObserver.

## Information architecture

### 1. Header and navigation

Desktop navigation:

- Selected Work
- Experience
- Capabilities
- About
- Contact

Mobile navigation uses an accessible menu button with `aria-expanded`, a visible label, keyboard support, and 44-pixel minimum touch targets. A skip link leads directly to main content.

### 2. Hero

The hero must answer three questions immediately: who Muhammad is, what he builds, and where the proof is.

**Headline:**

> Robots should work outside the demo.

**Identity:**

> Robotics and Embedded Systems Engineer

**Supporting copy:**

> I connect sensing, embedded software, motion planning, and physical hardware to build robotics systems that can be tested honestly.

**Availability line:**

> Open to robotics and embedded systems opportunities.

**Primary actions:**

- View selected work
- View GitHub
- Connect on LinkedIn

A resume action is not published until Muhammad explicitly selects and approves the exact resume file for public upload.

### 3. Selected work

Selected work appears directly after the hero. The Kinova manipulation suite is the first full-width case study. NeuroBot and CRUTCH follow in a two-column desktop layout, and ArmBot spans the section width as a compact closing case study. At widths below 768 pixels, every case study becomes a single-column card with the cover above the content.

Every case study contains:

- Repository-sourced cover media with recorded provenance
- Accurate status label
- Problem or engineering question
- Muhammad's contribution
- Implemented approach
- Evidence and current boundary
- Technology list
- Repository, media, and related-project links

#### Case study A: Kinova Gen3 Lite manipulation suite

**Lead status:** Physical demonstration, with related simulation and implementation prototypes<br>
**Lead cover source:** `KinovaGen3-Beer-Pong/docs/Ball in Mid-Air During the Throw.jpeg`<br>
**Target asset:** `assets/images/projects/kinova-ball-mid-air.jpeg`<br>
**Alt text:** `Kinova Gen3 Lite arm after releasing a ping-pong ball toward a cup target.`

The suite leads with the ball-throwing demonstration and links three related projects. Muhammad's contribution is stated as the original `beer_pong` ROS 2 package containing the single-throw and six-cup nodes, gripper-control node, MoveIt 2 commands, collision-scene objects, and checked-in joint-limit configuration.

- Ball throwing: joint-state-triggered gripper release and open-loop targeting
- Pick and place: fixed task branches and captured Gazebo and RViz states
- Write initials: fixed MAN stroke waypoints with Cartesian-first planning and RViz markers

Claims of repeatability, hit rate, optimization, clean reproduction, or physical and simulation parity are excluded unless supported by saved evidence.

The supporting gallery uses these additional images copied from the project repositories:

- `KinovaGen3-Beer-Pong/docs/Robot in Wind-Up Pose Before the Throw.jpeg`
- `kinovaGen3-Pick-and-Place/docs/_final_stack_gazebo.png`
- `kinovaGen3-Pick-and-Place/docs/_final_stack_rviz.png`

#### Case study B: NeuroBot

**Status:** Implementation present, validation pending<br>
**Cover source:** `Neuro-Adaptive-Robotic-Companion/assets/NeuroBot.png`<br>
**Target asset:** `assets/images/projects/neurobot.png`<br>
**Alt text:** `Repository illustration of the NeuroBot companion prototype.`

The case study describes local face processing, voice interaction with documented cloud-service boundaries, and an adaptive gate for audio, gesture, and face modalities. Muhammad's contribution is the face-processing and voice-session pipeline, modality adapters, `AdaptiveGate`, late fusion, fault-injection helpers, and Jetson-oriented latency and power harness. It states that a Jetson-oriented compute-cost artifact records latency and board-power values across four power modes. It must not claim model accuracy, clinical inference, a validated multimodal improvement, ROS 2 actuation, or physiological sensor integration that the current repository does not establish.

The source image is only suitable for a small contained treatment. It appears at or near native scale inside a styled technical panel and is not stretched into a full-bleed cover. It is labeled as a repository illustration, not a photograph of a validated physical system.

#### Case study C: CRUTCH

**Status:** Embedded-mechatronics bench concept, not human-use validated<br>
**Cover source:** The prototype photograph linked in the CRUTCH repository README: `https://github.com/user-attachments/assets/b7e089eb-321b-4cbf-8a11-7d43467a3301`<br>
**Target asset:** `assets/images/projects/crutch-prototype.jpeg`<br>
**Alt text:** `Photograph of the CRUTCH prototype assembly used for exploratory bench work.`

This is repository-sourced media rather than a file currently stored in the repository. Muhammad has explicitly approved using repository media as portfolio covers. The implementation copies the attachment locally, records its source in the portfolio README, and does not imply that the photograph alone verifies performance or ownership of every pictured component.

The case study covers ESP32 inertial and load-sensing paths, Python logging, the stepper interface, and the spring-damper mechanical concept. Muhammad's recorded contribution includes the spring-damper concept documentation and additional-part integration, ESP32 communication paths, sensor and actuator integration, Python logging and visualization tools, and simulation and experiment materials. It explicitly says the committed paths are separate prototypes. It does not claim a verified 50 Hz integrated system, impact-force reduction, gait improvement, clinical benefit, or safe human use.

Muhammad's contribution is stated separately from team-level project scope.

#### Case study D: ArmBot

**Status:** Robot-description concept<br>
**Cover source:** `6DOF-Robot/docs/Screenshot_2025-10-16_at_11.55.14_PM.png`<br>
**Target asset:** `assets/images/projects/armbot-cad.png`<br>
**Alt text:** `CAD perspective view of the six-joint ArmBot concept.`

The case study describes the six-joint Xacro and URDF model, seven STL meshes, launch definitions, and CAD and historical RViz evidence. The repository attributes authorship to Muhammad Ahmed. The case study clearly notes the current clean-launch blocker and absence of a demonstrated control system.

### 4. Experience

The section carries forward only employment details already published in the current portfolio: Robotics Systems Engineer at 24 and Up from May 2026 to present, Junior R&D Engineer at Duke University's Wilkinson Garage Lab from June 2025 to May 2026, and the published Duke teaching appointments. The Duke teaching roles are condensed into one entry. Each entry uses public responsibilities, avoids vague promotional language, and does not invent confidential outcomes.

The GitHub profile already identifies Muhammad as a 2026 graduate and the user approved that profile refresh. The degree is therefore written as:

> M.S. Mechanical Engineering and Materials Science, Duke University, 2026

The site no longer uses `student` or `candidate` language.

### 5. Capabilities

Replace the long keyword wall with four evidence-linked groups:

- Robotics software: ROS 2, MoveIt 2, RViz, Gazebo, motion planning, planning scenes, gripper interfaces
- Embedded systems: ESP32, microcontrollers, sensing, telemetry, embedded Linux
- Perception and edge compute: Python, PyTorch, OpenCV, MediaPipe, NVIDIA Jetson
- Hardware and mechatronics: sensor and actuator integration, prototyping, CAD, test documentation

Each group links to at least one selected project that demonstrates the capability.

### 6. About, education, and research

This compact section contains:

- One personal engineering paragraph
- Duke and SRM education
- One verified SAGE publication link
- Research or employment metrics only when a public source or user-approved evidence supports them

The publication is titled `Tribo-Corrosion and Mechanical Performance of Electro-deposited Nano-Composite h-BN/Epoxy Coating` and links to `https://journals.sagepub.com/doi/10.1177/13506501241257560`.

### 7. Contact

Use the contact details already established in the GitHub profile refresh:

- Email: `ms1242@duke.edu`
- LinkedIn: `https://www.linkedin.com/in/muhammad-ahmed-nazir-shaikh/`
- GitHub: `https://github.com/Ahmedshaikh77`
- X: `https://x.com/ShaikhRobotics`

The contact section targets robotics, embedded systems, sensor integration, actuator integration, manipulation, and hardware-software systems roles.

## Repository architecture

The existing single-file site will be separated into small static assets:

```text
Muhammad-Ahmed-Portfolio/
|-- index.html
|-- README.md
|-- sitemap.xml
|-- .gitignore
`-- assets/
    |-- css/
    |   `-- styles.css
    |-- js/
    |   `-- main.js
    |-- icons/
    |   `-- favicon.svg
    `-- images/
        |-- portfolio-preview.png
        |-- projects/
        |   |-- kinova-ball-mid-air.jpeg
        |   |-- kinova-wind-up.jpeg
        |   |-- kinova-stack-gazebo.png
        |   |-- kinova-stack-rviz.png
        |   |-- neurobot.png
        |   |-- crutch-prototype.jpeg
        |   `-- armbot-cad.png
        `-- social-preview.png
```

The site does not need a framework, package manager, backend, form submission service, or analytics script.

## Progressive enhancement and error handling

- All text, links, project cards, and navigation remain usable without JavaScript.
- JavaScript is limited to the mobile menu and optional small enhancements.
- If JavaScript fails, the desktop and mobile content remains visible.
- Every project image has useful alternative text and explicit dimensions to reduce layout shift.
- Images use `loading="lazy"` below the first selected project.
- Missing media does not hide the project title or links.
- External links opened in a new tab use `rel="noopener noreferrer"` and an accessible new-window cue.

## Accessibility requirements

- One `h1`, logical `h2` sections, and `h3` card headings.
- A `<main>` landmark and skip link.
- Visible `:focus-visible` indicators.
- Minimum 44-pixel interactive targets on mobile.
- WCAG AA contrast for normal text.
- No native cursor suppression.
- Reduced-motion support.
- Semantic lists replace the current data-table-like skills presentation.
- Navigation can be operated using keyboard only.
- Decorative graphics are hidden from assistive technology.

## Search and sharing

Add:

- Concise title and meta description
- Canonical URL
- Open Graph metadata
- Twitter card metadata
- `ProfilePage` and `Person` JSON-LD
- SVG favicon
- 1200 by 630 social-preview graphic
- Project-level `sitemap.xml`

Use the exact page title `Muhammad Ahmed | Robotics and Embedded Systems Engineer` and the meta description `Robotics and embedded systems portfolio featuring ROS 2 manipulation, embedded sensing, edge perception, and hardware-software integration projects by Muhammad Ahmed.`

The social preview uses the text `Muhammad Ahmed`, `Robotics and Embedded Systems Engineer`, and `Selected work in ROS 2, embedded sensing, and edge perception`. It does not display unsupported metrics.

## README redesign

The repository README will include:

- Screenshot of the final portfolio
- Live-site link
- Purpose and selected features
- Repository structure
- Local preview instructions
- Deployment notes for GitHub Pages
- Accessibility and performance notes
- Content and media provenance
- Sole authorship attribution to Muhammad Ahmed

No Codex or automated co-author attribution is added.

## Testing and acceptance criteria

The redesign is complete only when:

1. The page renders without console errors at 390, 768, and 1280 pixel widths.
2. No horizontal overflow occurs at those widths.
3. Mobile navigation is visible, keyboard operable, and reports its expanded state.
4. Hero actions are visible without horizontal scrolling.
5. Content remains visible when JavaScript is unavailable.
6. Reduced-motion mode removes nonessential motion.
7. Text and controls meet WCAG AA contrast requirements.
8. Every external link resolves or is documented as blocked by automated access.
9. Every project cover loads and has accurate alternative text.
10. HTML validation has no project-caused errors.
11. The final site contains no unsupported project metrics or clinical claims.
12. After the user approves the tested implementation, the explicitly authorized publish stage updates `main`, and the live GitHub Pages deployment matches that revision.
13. Every commit author and committer is Muhammad Ahmed only.

## Out of scope

- New robotics source-code functionality
- Rewriting the underlying project repositories
- Publishing a resume without approval of the exact file
- Contact forms, databases, or backend services
- Analytics or tracking
- Claims based on private or unavailable evidence
