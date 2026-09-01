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
