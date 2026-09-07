import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const scriptPath = new URL('../assets/js/effects.js', import.meta.url);
// A missing enhancement behaves like an empty script during the initial RED run.
const script = existsSync(scriptPath) ? readFileSync(scriptPath, 'utf8') : '';

function emit(target, type, properties = {}) {
  const event = new Event(type);
  Object.assign(event, properties);
  target.dispatchEvent(event);
}

class Element extends EventTarget {
  hidden = true;
  textContent = '';
  style = {};
  attributes = new Map();
  rect = { width: 1180, height: 640, top: 0, right: 1180, bottom: 640, left: 0 };
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  getBoundingClientRect() { return this.rect; }
}

function browser(options = {}) {
  const document = new EventTarget();
  const window = new EventTarget();
  const hero = new Element();
  if (options.heroOffscreen) hero.rect = { ...hero.rect, top: -800, bottom: -160 };
  const canvas = new Element();
  const radar = new Element();
  const toggle = new Element();
  const packet = new Element();
  packet.setAttribute('cx', '66');
  packet.setAttribute('cy', '65');
  toggle.textContent = 'Pause animations';
  const elements = new Map([
    ['.hero', hero], ['.hero-stream', canvas],
    ['.radar-cursor', radar], ['.motion-toggle', toggle],
    ['.signal-packet', packet],
  ]);
  document.querySelector = (selector) => elements.get(selector) ?? null;
  document.documentElement = new Element();
  document.hidden = false;
  let focused = true;
  document.hasFocus = () => focused;
  window.innerHeight = 900;
  window.innerWidth = 1440;
  window.devicePixelRatio = options.dpr ?? 1;

  const conditions = { width: 1440, hover: true, fine: true, reduced: false, ...options };
  const queries = [];
  window.matchMedia = (media) => {
    const query = new EventTarget();
    query.media = media;
    Object.defineProperty(query, 'matches', { get() {
      const width = media.match(/min-width:\s*(\d+)px/);
      return (!width || conditions.width >= Number(width[1]))
        && (!media.includes('(hover: hover)') || conditions.hover)
        && (!media.includes('(pointer: fine)') || conditions.fine)
        && (!media.includes('(prefers-reduced-motion: no-preference)') || !conditions.reduced);
    } });
    queries.push(query);
    return query;
  };

  // Node has no layout, media-query, canvas, observer, or animation-frame APIs.
  // These boundaries retain their observable state; the enhancement code is real.
  const drawing = [];
  const context = {
    fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, font: '',
    clearRect(...args) { drawing.push({ method: 'clearRect', args }); },
    fillRect(...args) { drawing.push({ method: 'fillRect', args }); },
    fillText(...args) { drawing.push({ method: 'fillText', args, color: this.fillStyle }); },
    beginPath(...args) { drawing.push({ method: 'beginPath', args }); },
    moveTo(...args) { drawing.push({ method: 'moveTo', args }); },
    lineTo(...args) { drawing.push({ method: 'lineTo', args }); },
    stroke(...args) { drawing.push({ method: 'stroke', args, color: this.strokeStyle }); },
    arc(...args) { drawing.push({ method: 'arc', args }); },
    fill(...args) { drawing.push({ method: 'fill', args, color: this.fillStyle }); },
    setTransform(...args) { drawing.push({ method: 'setTransform', args }); },
  };
  canvas.getContext = () => {
    if (options.canvasThrows) throw new Error('Canvas unavailable');
    return options.canvasNull ? null : context;
  };
  const frames = new Map();
  let nextFrame = 0;
  let clock = 0;
  window.requestAnimationFrame = (callback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  };
  window.cancelAnimationFrame = (id) => frames.delete(id);
  const observers = [];
  window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.target = target; }
  };
  if (options.noObserver) delete window.IntersectionObserver;
  if (options.missing) elements.delete(options.missing);

  vm.runInNewContext(script, { window, document, performance: { now: () => clock } });

  return {
    window, document, hero, canvas, radar, toggle, packet, drawing, frames,
    move(x = 180, y = 240, pointerType = 'mouse') {
      emit(document, 'pointermove', { clientX: x, clientY: y, pointerType });
    },
    setConditions(values) {
      const previous = queries.map((query) => query.matches);
      Object.assign(conditions, values);
      queries.forEach((query, index) => {
        if (query.matches !== previous[index]) emit(query, 'change', { matches: query.matches });
      });
    },
    setVisible(visible) {
      hero.rect = { ...hero.rect, top: visible ? 0 : -800, bottom: visible ? 640 : -160 };
      for (const observer of observers) {
        observer.callback([{ target: observer.target, isIntersecting: visible }]);
      }
      emit(window, 'scroll');
    },
    setHidden(hidden) {
      document.hidden = hidden;
      emit(document, 'visibilitychange');
    },
    setFocus(value) {
      focused = value;
      emit(window, value ? 'focus' : 'blur');
    },
    frame(at) {
      clock = at;
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(at);
    },
  };
}

function tracePaths(drawing) {
  const paths = [];
  let path = [];
  for (const { method, args } of drawing) {
    if (method === 'beginPath') path = [];
    if (method === 'moveTo' || method === 'lineTo') path.push(args);
    if (method === 'stroke' && path.length > 1) paths.push(path);
  }
  return paths;
}

function packetPosition(page) {
  return [Number(page.packet.getAttribute('cx')), Number(page.packet.getAttribute('cy'))];
}

function assertPacketAt(page, expected) {
  const actual = packetPosition(page);
  expected.forEach((coordinate, index) => {
    assert.ok(Math.abs(actual[index] - coordinate) < 0.001,
      `packet coordinate ${index}: expected ${coordinate}, received ${actual[index]}`);
  });
}

test('a fine desktop pointer gets a decorative follower only after moving', () => {
  const page = browser();
  assert.equal(page.radar.hidden, true);
  page.move(180, 240);
  assert.equal(page.radar.hidden, false);
  assert.equal(page.document.documentElement.getAttribute('data-radar-active'), 'true');
  assert.equal(page.radar.style.left, '180px');
  assert.equal(page.radar.style.top, '240px');
});

test('the radar replaces the native pointer only while it is visible', () => {
  const page = browser();
  assert.equal(page.document.documentElement.getAttribute('data-radar-active'), null);
  page.move();
  assert.equal(page.document.documentElement.getAttribute('data-radar-active'), 'true');
  emit(page.document, 'keydown', { key: 'Tab' });
  assert.equal(page.document.documentElement.getAttribute('data-radar-active'), null);
  page.move();
  emit(page.document, 'pointercancel', { pointerType: 'mouse' });
  assert.equal(page.document.documentElement.getAttribute('data-radar-active'), null);
});

for (const [name, conditions] of [
  ['narrow screens', { width: 899 }],
  ['non-hover input', { hover: false }],
  ['coarse pointers', { fine: false }],
  ['reduced-motion preference', { reduced: true }],
]) {
  test(`${name} prevent effects and react to preference changes`, () => {
    const page = browser();
    page.move();
    assert.equal(page.radar.hidden, false);
    page.setConditions(conditions);
    assert.equal(page.radar.hidden, true);
    assert.equal(page.document.documentElement.getAttribute('data-radar-active'), null);
    page.move();
    assert.equal(page.radar.hidden, true);
    assert.equal(page.toggle.hidden, true);
    assert.equal(page.frames.size, 0);
    assert.equal(page.hero.getAttribute('data-animations'), null);
    page.setConditions({ width: 900, hover: true, fine: true, reduced: false });
    page.move();
    assert.equal(page.radar.hidden, false);
  });
}

for (const [name, options] of [
  ['a narrow viewport', { width: 899 }],
  ['reduced motion', { reduced: true }],
]) {
  test(`${name} starts as a static hero without scheduling animation`, () => {
    const page = browser(options);
    page.frame(1000);
    assert.equal(page.frames.size, 0);
    assert.equal(page.drawing.length, 0);
    assert.equal(page.canvas.hidden, true);
    assert.equal(page.toggle.hidden, true);
    assert.equal(page.hero.getAttribute('data-animations'), null);
    assertPacketAt(page, [66, 65]);
  });
}

for (const [name, hide] of [
  ['keyboard use', (page) => emit(page.document, 'keydown', { key: 'Tab' })],
  ['leaving the page', (page) => emit(page.document.documentElement, 'pointerleave')],
  ['window blur', (page) => page.setFocus(false)],
  ['a hidden document', (page) => page.setHidden(true)],
  ['touch input on a hybrid device', (page) => page.move(180, 240, 'touch')],
]) {
  test(`${name} hides the decorative follower`, () => {
    const page = browser();
    page.move();
    assert.equal(page.radar.hidden, false);
    hide(page);
    assert.equal(page.radar.hidden, true);
    assert.equal(page.document.documentElement.getAttribute('data-radar-active'), null);
  });
}

test('a changing action label controls manual pause without conflicting toggle semantics', () => {
  const page = browser();
  assert.equal(page.toggle.hidden, false);
  assert.equal(page.toggle.textContent, 'Pause animations');
  assert.equal(page.toggle.getAttribute('aria-pressed'), null);
  page.move();
  emit(page.toggle, 'click');
  assert.equal(page.toggle.textContent, 'Play animations');
  assert.equal(page.radar.hidden, true);
  assert.equal(page.document.documentElement.getAttribute('data-radar-active'), null);
  page.move();
  assert.equal(page.radar.hidden, true);
  emit(page.toggle, 'click');
  assert.equal(page.toggle.textContent, 'Pause animations');
  page.move();
  assert.equal(page.radar.hidden, false);
});

test('automatic disabling never loses the user’s manual pause', () => {
  const page = browser();
  emit(page.toggle, 'click');
  assert.equal(page.toggle.textContent, 'Play animations');
  page.setConditions({ reduced: true });
  assert.equal(page.toggle.hidden, true);
  page.setConditions({ reduced: false });
  assert.equal(page.toggle.hidden, false);
  assert.equal(page.toggle.textContent, 'Play animations');
  page.move();
  assert.equal(page.radar.hidden, true);
});

test('the hero paints bounded orthogonal circuit traces and pulses with capped pixel density', () => {
  const page = browser({ dpr: 4 });
  assert.equal(page.canvas.hidden, false);
  assert.equal(page.canvas.width, 2360);
  assert.equal(page.canvas.height, 1280);
  page.frame(50);
  const paths = tracePaths(page.drawing);
  assert.ok(paths.length > 0, 'the hero should contain stroked circuit paths');
  assert.ok(paths.length <= 24, 'the circuit paths should remain low density');
  for (const path of paths) {
    assert.ok(path.length <= 16, 'each circuit trace should use a bounded number of segments');
    for (let index = 1; index < path.length; index += 1) {
      const [x, y] = path[index];
      const [previousX, previousY] = path[index - 1];
      assert.ok(Number.isFinite(x) && Number.isFinite(y), 'trace coordinates should be finite');
      assert.ok(x === previousX || y === previousY, 'circuit trace segments should be orthogonal');
    }
  }
  const pulses = page.drawing.filter(({ method }) => method === 'arc');
  assert.ok(pulses.length > 0, 'the paths should carry visible pulses');
  assert.ok(pulses.length <= 16, 'pulse count should stay small');
  assert.ok(pulses.every(({ args }) => args[2] > 0 && args[2] <= 8), 'pulses should remain small');
  assert.ok(page.drawing.some(({ method }) => method === 'fill'), 'pulses should be filled');
  assert.equal(page.drawing.filter(({ method }) => method === 'fillText').length, 0);
  assert.equal(page.frames.size, 1);
});

test('drawing is frame-rate limited and advances from elapsed time', () => {
  const page = browser();
  page.frame(50);
  const paths = tracePaths(page.drawing);
  const first = page.drawing.filter(({ method }) => method === 'arc');
  assert.ok(first.length > 0);
  page.drawing.length = 0;
  page.frame(60);
  page.frame(90);
  assert.equal(page.drawing.length, 0, 'frames inside the 24 fps budget should not redraw');
  page.frame(100);
  const second = page.drawing.filter(({ method }) => method === 'arc');
  assert.equal(second.length, first.length);
  assert.deepEqual(tracePaths(page.drawing), paths, 'circuit geometry should stay fixed as pulses travel');
  assert.ok(second.some(({ args }, index) =>
    args[0] !== first[index].args[0] || args[1] !== first[index].args[1]),
  'pulse positions should advance over time');
});

test('the signal packet travels clockwise through Sense, Decide, Act, and Verify every eight active seconds', () => {
  const page = browser();
  const checkpoints = [
    [0, 'sense', [66, 65]],
    [1000, 'sense', [148, 65]],
    [2000, 'decide', [230, 65]],
    [3000, 'decide', [230, 126]],
    [4000, 'act', [230, 187]],
    [5000, 'act', [148, 187]],
    [6000, 'verify', [66, 187]],
    [7000, 'verify', [66, 126]],
    [8000, 'sense', [66, 65]],
  ];
  let previousTime = -100;
  for (const [at, stage, position] of checkpoints) {
    for (let time = previousTime + 100; time <= at; time += 100) page.frame(time);
    assert.equal(page.hero.getAttribute('data-signal-stage'), stage, `signal stage at ${at} ms`);
    assertPacketAt(page, position);
    previousTime = at;
  }
});

test('signal movement follows elapsed time across different frame cadences', () => {
  for (const interval of [50, 100]) {
    const page = browser();
    for (let time = 0; time <= 1000; time += interval) page.frame(time);
    assert.equal(page.hero.getAttribute('data-signal-stage'), 'sense');
    assertPacketAt(page, [148, 65]);
  }
});

test('a delayed animation frame advances the signal by at most one tenth of a second', () => {
  const page = browser();
  page.frame(0);
  page.frame(100);
  page.frame(10000);
  assert.equal(page.hero.getAttribute('data-signal-stage'), 'sense');
  assertPacketAt(page, [82.4, 65]);
});

for (const [name, pause, resume] of [
  ['leaving the viewport', (page) => page.setVisible(false), (page) => page.setVisible(true)],
  ['a hidden tab', (page) => page.setHidden(true), (page) => page.setHidden(false)],
  ['reduced motion', (page) => page.setConditions({ reduced: true }), (page) => page.setConditions({ reduced: false })],
  ['manual pause', (page) => emit(page.toggle, 'click'), (page) => emit(page.toggle, 'click')],
]) {
  test(`${name} stops canvas work and can resume one animation loop`, () => {
    const page = browser();
    assert.equal(page.frames.size, 1);
    assert.equal(page.hero.getAttribute('data-animations'), 'running');
    page.frame(50);
    pause(page);
    assert.equal(page.frames.size, 0);
    assert.equal(page.hero.getAttribute('data-animations'), null);
    page.drawing.length = 0;
    page.frame(5000);
    assert.equal(page.drawing.length, 0);
    resume(page);
    assert.equal(page.frames.size, 1);
    assert.equal(page.hero.getAttribute('data-animations'), 'running');
    page.frame(5050);
    assert.equal(page.frames.size, 1);
    assert.ok(page.drawing.some(({ method }) => method === 'stroke'));
  });
}

for (const [name, pause, resume] of [
  ['leaving the viewport', (page) => page.setVisible(false), (page) => page.setVisible(true)],
  ['a hidden tab', (page) => page.setHidden(true), (page) => page.setHidden(false)],
  ['manual pause', (page) => emit(page.toggle, 'click'), (page) => emit(page.toggle, 'click')],
]) {
  test(`${name} freezes the signal and resumes from its active-time position`, () => {
    const page = browser();
    for (let time = 0; time <= 1900; time += 100) page.frame(time);
    assert.equal(page.hero.getAttribute('data-signal-stage'), 'sense');
    assertPacketAt(page, [221.8, 65]);
    pause(page);
    page.frame(10000);
    assert.equal(page.hero.getAttribute('data-signal-stage'), 'sense');
    assertPacketAt(page, [221.8, 65]);
    resume(page);
    page.frame(10000);
    assert.equal(page.hero.getAttribute('data-signal-stage'), 'sense');
    assertPacketAt(page, [221.8, 65]);
    page.frame(10100);
    assert.equal(page.hero.getAttribute('data-signal-stage'), 'decide');
    assertPacketAt(page, [230, 65]);
  });
}

test('the radar remains available below the hero while the stream is stopped', () => {
  const page = browser();
  assert.equal(page.frames.size, 1);
  page.setVisible(false);
  assert.equal(page.frames.size, 0);
  page.move();
  assert.equal(page.radar.hidden, false);
});

test('manual pause survives visibility changes without restarting canvas work', () => {
  const page = browser();
  assert.equal(page.frames.size, 1);
  emit(page.toggle, 'click');
  page.setVisible(false);
  page.setHidden(true);
  page.setVisible(true);
  page.setHidden(false);
  assert.equal(page.frames.size, 0);
  assert.equal(page.toggle.textContent, 'Play animations');
});

for (const options of [{ canvasNull: true }, { canvasThrows: true }]) {
  test(`canvas ${options.canvasNull ? 'context unavailability' : 'initialization failure'} leaves the pointer and pause controls usable`, () => {
    let page;
    assert.doesNotThrow(() => { page = browser(options); });
    assert.equal(page.canvas.hidden, true);
    assert.equal(page.frames.size, 0);
    assert.equal(page.hero.getAttribute('data-animations'), null);
    page.move();
    assert.equal(page.radar.hidden, false);
    emit(page.toggle, 'click');
    assert.equal(page.radar.hidden, true);
    assert.equal(page.toggle.textContent, 'Play animations');
  });
}

test('a missing optional effect element leaves the document untouched', () => {
  for (const missing of ['.hero', '.hero-stream', '.radar-cursor', '.motion-toggle']) {
    let page;
    assert.doesNotThrow(() => { page = browser({ missing }); });
    assert.equal(page.toggle.hidden, true);
    assert.equal(page.frames.size, 0);
  }
});

test('a missing optional signal packet leaves the background and radar usable', () => {
  const page = browser({ missing: '.signal-packet' });
  page.frame(0);
  page.frame(100);
  assert.equal(page.frames.size, 1);
  assert.ok(tracePaths(page.drawing).length > 0);
  assert.equal(page.hero.getAttribute('data-animations'), 'running');
  assert.equal(page.hero.getAttribute('data-signal-stage'), 'sense');
  page.move();
  assert.equal(page.radar.hidden, false);
  emit(page.toggle, 'click');
  assert.equal(page.frames.size, 0);
  assert.equal(page.hero.getAttribute('data-animations'), null);
});

test('the stream does not start for an initially offscreen hero', () => {
  const page = browser({ heroOffscreen: true });
  assert.equal(page.frames.size, 0);
  assert.equal(page.hero.getAttribute('data-animations'), null);
  page.setVisible(true);
  assert.equal(page.frames.size, 1);
});

test('viewport suspension also works when IntersectionObserver is unavailable', () => {
  let page;
  assert.doesNotThrow(() => { page = browser({ noObserver: true }); });
  assert.equal(page.frames.size, 1);
  page.setVisible(false);
  assert.equal(page.frames.size, 0);
  page.setVisible(true);
  assert.equal(page.frames.size, 1);
});

test('resizing updates canvas dimensions, including after a manual pause', () => {
  const page = browser();
  assert.equal(page.canvas.width, 1180);
  page.hero.rect = { ...page.hero.rect, width: 1000, height: 700 };
  emit(page.window, 'resize');
  assert.equal(page.canvas.width, 1000);
  assert.equal(page.canvas.height, 700);
  emit(page.toggle, 'click');
  page.hero.rect = { ...page.hero.rect, width: 1100, height: 720 };
  emit(page.window, 'resize');
  assert.equal(page.frames.size, 0);
  emit(page.toggle, 'click');
  assert.equal(page.canvas.width, 1100);
  assert.equal(page.canvas.height, 720);
  assert.equal(page.frames.size, 1);
});

test('a touch interaction suspends both effects until fine-pointer input resumes', () => {
  const page = browser();
  assert.equal(page.frames.size, 1);
  page.move();
  emit(page.document, 'pointerdown', { pointerType: 'touch' });
  assert.equal(page.frames.size, 0);
  assert.equal(page.radar.hidden, true);
  assert.equal(page.canvas.hidden, true);
  assert.equal(page.hero.getAttribute('data-animations'), null);
  page.move();
  assert.equal(page.radar.hidden, false);
  assert.equal(page.frames.size, 1);
  assert.equal(page.hero.getAttribute('data-animations'), 'running');
  emit(page.toggle, 'click');
  page.move(50, 60, 'touch');
  page.move();
  assert.equal(page.frames.size, 0);
  assert.equal(page.radar.hidden, true);
});
