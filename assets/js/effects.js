(() => {
  'use strict';

  const radar = document.querySelector('.radar-cursor');
  const toggle = document.querySelector('.motion-toggle');
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('.hero-stream');
  if (!radar || !toggle || !hero || !canvas || !window.matchMedia) return;

  let context = null;
  try {
    context = canvas.getContext('2d');
  } catch {
    // Canvas is optional; navigation and the pointer enhancement remain independent.
  }
  const motionQuery = window.matchMedia(
    '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  let manuallyPaused = false;
  let touchInput = false;
  let heroVisible = false;
  let needsSize = true;
  let frame = null;
  let lastDraw = 0;
  let width = 0;
  let height = 0;
  let columns = [];
  const glyphs = '/cmd_vel/joint_states/tf/odom/imu/emg/ppg/plan/exec 0123456789abcdef,.';

  const enabled = () => motionQuery.matches && !manuallyPaused && !touchInput && !document.hidden;
  const hideRadar = () => {
    radar.hidden = true;
    document.documentElement.removeAttribute('data-radar-active');
  };

  function sizeStream() {
    const bounds = hero.getBoundingClientRect();
    width = Math.max(1, Math.ceil(bounds.width));
    height = Math.max(1, Math.ceil(bounds.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(36, Math.max(8, Math.floor(width / 44)));
    columns = Array.from({ length: count }, (_, index) => ({
      x: (index + 0.5) * width / count,
      y: Math.random() * height,
      speed: 12 + Math.random() * 18,
      offset: Math.floor(Math.random() * glyphs.length),
    }));
    needsSize = false;
  }

  function drawStream(now) {
    frame = null;
    if (!enabled() || !heroVisible) return;
    const elapsed = now - lastDraw;
    // A capped paint rate and elapsed-time motion avoid fast displays speeding up the stream.
    if (elapsed >= 1000 / 24) {
      const seconds = Math.min(elapsed / 1000, 0.1);
      context.clearRect(0, 0, width, height);
      context.font = '11px monospace';
      for (const column of columns) {
        column.y += column.speed * seconds;
        if (column.y > height + 112) column.y = -16;
        for (let trail = 0; trail < 7; trail += 1) {
          context.fillStyle = trail === 0 ? 'rgba(255,45,120,0.55)' : `rgba(255,45,120,${(7 - trail) * 0.026})`;
          const index = (column.offset + trail + Math.floor(column.y / 16)) % glyphs.length;
          context.fillText(glyphs[(index + glyphs.length) % glyphs.length], column.x, column.y - trail * 16);
        }
      }
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
    toggle.textContent = manuallyPaused ? 'Play effects' : 'Pause effects';
    if (!enabled()) hideRadar();
    canvas.hidden = !enabled() || !context;
    if (enabled() && heroVisible && context) {
      if (needsSize) sizeStream();
      if (frame === null) {
        lastDraw = performance.now();
        frame = window.requestAnimationFrame(drawStream);
      }
    } else {
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
    if (!enabled() || !document.hasFocus() || event.pointerType === 'touch') {
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
