(() => {
  'use strict';

  const radar = document.querySelector('.radar-cursor');
  const toggle = document.querySelector('.motion-toggle');
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('.hero-stream');
  if (!radar || !toggle || !hero || !canvas || !window.matchMedia) return;
  const packet = document.querySelector('.signal-packet');
  const copy = document.querySelector('.hero__copy');
  const system = document.querySelector('.hero__system');

  let context = null;
  try {
    context = canvas.getContext('2d');
  } catch {
    // Canvas is optional; navigation and the pointer enhancement remain independent.
  }
  const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const pointerQuery = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  const wideLayoutQuery = window.matchMedia('(min-width: 900px)');
  let manuallyPaused = false;
  let touchInput = false;
  let heroVisible = false;
  let needsSize = true;
  let frame = null;
  let lastDraw = 0;
  let width = 0;
  let height = 0;
  let traces = [];
  let activeTime = 0;
  let currentStage = -1;
  const stages = ['sense', 'decide', 'act', 'verify'];
  // Coordinates match the four nodes in the decorative signal-board SVG.
  const signalNodes = [[66, 65], [230, 65], [230, 187], [66, 187]];

  const enabled = () => motionQuery.matches && !manuallyPaused && !document.hidden;
  const radarEnabled = () => enabled() && pointerQuery.matches && !touchInput;
  const hideRadar = () => {
    radar.hidden = true;
    document.documentElement.removeAttribute('data-radar-active');
  };

  function sizeStream() {
    const bounds = hero.getBoundingClientRect();
    const systemTop = system ? system.getBoundingClientRect().top - bounds.top : 0;
    const compact = !wideLayoutQuery.matches;
    // The stacked phone layout reserves the background for the card, not the text above it.
    const canvasTop = compact && system ? Math.max(0, Math.min(bounds.height - 1, systemTop - 24)) : 0;
    width = Math.max(1, Math.ceil(bounds.width));
    height = Math.max(1, Math.ceil(bounds.height - canvasTop));
    canvas.style.top = `${canvasTop}px`;
    canvas.style.height = `${height}px`;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const copyRight = copy ? copy.getBoundingClientRect().right - bounds.left : width * 0.68;
    const boardTop = system ? systemTop - canvasTop : height * 0.4;
    const left = Math.min(width - 70, Math.max(width * 0.6, copyRight + 16));
    // Route the background beside the copy and behind the opaque system card.
    const paths = compact ? [
      [[8, 42], [8, 12], [width - 12, 12], [width - 12, height - 18], [32, height - 18]],
      [[width - 28, 24], [28, 24], [28, height - 36], [width - 6, height - 36], [width - 6, 72]],
    ] : [
      [[left, 22], [left, Math.max(70, boardTop + 66)], [width - 60, Math.max(70, boardTop + 66)]],
      [[left + 24, 42], [width - 16, 42], [width - 16, height - 16], [left + 24, height - 16]],
      [[width - 54, 10], [width - 54, Math.max(55, boardTop - 22)], [left + 40, Math.max(55, boardTop - 22)], [left + 40, height - 36]],
      [[left - 12, height - 12], [width - 4, height - 12], [width - 4, 82], [width - 80, 82]],
    ];
    traces = paths.map((points) => {
      const lengths = points.slice(1).map((point, index) =>
        Math.hypot(point[0] - points[index][0], point[1] - points[index][1]));
      return { points, lengths, total: lengths.reduce((sum, length) => sum + length, 0) };
    });
    needsSize = false;
  }

  function pointAlong(trace, progress) {
    let distance = progress * trace.total;
    for (let index = 0; index < trace.lengths.length; index += 1) {
      const length = trace.lengths[index];
      if (distance <= length || index === trace.lengths.length - 1) {
        const amount = length ? distance / length : 0;
        const start = trace.points[index];
        const end = trace.points[index + 1];
        return [start[0] + (end[0] - start[0]) * amount, start[1] + (end[1] - start[1]) * amount];
      }
      distance -= length;
    }
    return trace.points[0];
  }

  function syncSignal() {
    const phase = (activeTime % 8000) / 2000;
    const stage = Math.floor(phase);
    if (stage !== currentStage) {
      hero.setAttribute('data-signal-stage', stages[stage]);
      currentStage = stage;
    }
    if (packet) {
      const start = signalNodes[stage];
      const end = signalNodes[(stage + 1) % signalNodes.length];
      const fraction = phase - stage;
      packet.setAttribute('cx', start[0] + (end[0] - start[0]) * fraction);
      packet.setAttribute('cy', start[1] + (end[1] - start[1]) * fraction);
    }
  }

  function drawStream(now) {
    frame = null;
    if (!enabled() || !heroVisible) return;
    const elapsed = now - lastDraw;
    // One clock drives both illustrations; pausing never skips ahead in the control loop.
    if (elapsed >= 1000 / 24) {
      activeTime += Math.min(elapsed, 100);
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1.25;
      traces.forEach((trace, index) => {
        context.strokeStyle = 'rgba(255,117,173,0.32)';
        context.beginPath();
        trace.points.forEach(([x, y], pointIndex) => {
          if (pointIndex === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
        const [x, y] = pointAlong(trace, (activeTime / 6000 + index / 4) % 1);
        context.fillStyle = 'rgba(255,79,154,0.18)';
        context.beginPath();
        context.arc(x, y, 8, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = 'rgba(255,160,199,0.95)';
        context.beginPath();
        context.arc(x, y, 2.8, 0, Math.PI * 2);
        context.fill();
      });
      syncSignal();
      lastDraw = now;
    }
    frame = window.requestAnimationFrame(drawStream);
  }

  function stopStream() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
  }

  function syncEffects() {
    toggle.hidden = !motionQuery.matches;
    // This is an action button with a changing label, not a stable-label ARIA toggle.
    toggle.textContent = manuallyPaused ? 'Play animations' : 'Pause animations';
    if (!radarEnabled()) hideRadar();
    canvas.hidden = !enabled() || !context;
    if (enabled() && heroVisible && context) {
      hero.setAttribute('data-animations', 'running');
      if (needsSize) sizeStream();
      syncSignal();
      if (frame === null) {
        lastDraw = performance.now();
        frame = window.requestAnimationFrame(drawStream);
      }
    } else {
      hero.removeAttribute('data-animations');
      stopStream();
    }
  }

  function measureVisibility() {
    const bounds = hero.getBoundingClientRect();
    heroVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    syncEffects();
  }

  function updateInput(event) {
    const isTouch = event.pointerType === 'touch';
    if (isTouch !== touchInput) {
      touchInput = isTouch;
      syncEffects();
    }
  }

  document.addEventListener('pointermove', (event) => {
    updateInput(event);
    if (!radarEnabled() || !document.hasFocus() || event.pointerType === 'touch') {
      hideRadar();
      return;
    }
    radar.style.left = `${event.clientX}px`;
    radar.style.top = `${event.clientY}px`;
    radar.hidden = false;
    document.documentElement.setAttribute('data-radar-active', 'true');
  }, { passive: true });
  document.addEventListener('pointerdown', updateInput, { passive: true });
  document.addEventListener('pointercancel', hideRadar, { passive: true });

  toggle.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    syncEffects();
  });
  document.addEventListener('keydown', hideRadar);
  document.documentElement.addEventListener('pointerleave', hideRadar);
  window.addEventListener('blur', hideRadar);
  document.addEventListener('visibilitychange', syncEffects);
  motionQuery.addEventListener('change', syncEffects);
  pointerQuery.addEventListener('change', syncEffects);
  wideLayoutQuery.addEventListener('change', () => {
    needsSize = true;
    syncEffects();
  });
  window.addEventListener('resize', () => {
    needsSize = true;
    measureVisibility();
  }, { passive: true });
  if (window.IntersectionObserver) {
    const observer = new window.IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      syncEffects();
    });
    observer.observe(hero);
  } else {
    window.addEventListener('scroll', measureVisibility, { passive: true });
  }
  measureVisibility();
})();
