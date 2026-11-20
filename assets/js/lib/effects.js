/** Decorative heart effects: background rain, bursts and the cursor trail. */
(() => {
  "use strict";

  const { icon, random, pick, prefersReducedMotion, hasFinePointer } = Sorry.utils;

  const PALETTE = ["#fb7185", "#f43f5e", "#fda4af", "#f472b6", "#ec4899", "#f9a8d4", "#e879f9"];

  /** A self-removing heart SVG. Position/motion come from CSS custom properties. */
  function createHeart(className, size) {
    const node = icon("heart-solid", className);
    node.style.setProperty("--size", `${size}px`);
    node.style.color = pick(PALETTE);
    node.addEventListener("animationend", () => node.remove(), { once: true });
    return node;
  }

  /** Hearts drifting up the background. Pauses while the tab is hidden. */
  function createHeartRain(container, { interval = 650, max = 36 } = {}) {
    let timer = 0;

    const spawn = () => {
      if (container.childElementCount >= max) return;
      const node = createHeart("falling-heart", random(12, 32));
      node.style.left = `${random(0, 100)}%`;
      node.style.setProperty("--drift", `${random(-60, 60)}px`);
      node.style.setProperty("--duration", `${random(7, 14)}s`);
      container.append(node);
    };

    const start = () => {
      if (!timer && !prefersReducedMotion) timer = window.setInterval(spawn, interval);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const flurry = (count = 16) => {
      for (let i = 0; i < count; i += 1) window.setTimeout(spawn, i * 90);
    };

    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    return { start, stop, flurry };
  }

  /** Radial burst of hearts from a viewport point. */
  function burst(layer, x, y, count = 28) {
    const total = prefersReducedMotion ? Math.ceil(count / 4) : count;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i += 1) {
      const angle = random(0, Math.PI * 2);
      const distance = random(100, 280);
      const node = createHeart("burst-heart", random(14, 30));
      node.style.setProperty("--x", `${x}px`);
      node.style.setProperty("--y", `${y}px`);
      node.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      node.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      node.style.setProperty("--rot", `${random(-180, 180)}deg`);
      node.style.animationDelay = `${random(0, 120)}ms`;
      fragment.append(node);
    }

    layer.append(fragment);
  }

  /** Tiny hearts following the mouse (desktop only). */
  function enableCursorTrail(layer, { throttleMs = 70 } = {}) {
    if (prefersReducedMotion || !hasFinePointer) return;

    let last = 0;
    window.addEventListener(
      "pointermove",
      (event) => {
        const now = performance.now();
        if (now - last < throttleMs) return;
        last = now;

        const node = createHeart("trail-heart", random(8, 14));
        node.style.setProperty("--x", `${event.clientX}px`);
        node.style.setProperty("--y", `${event.clientY}px`);
        layer.append(node);
      },
      { passive: true },
    );
  }

  window.Sorry.effects = Object.freeze({ createHeartRain, burst, enableCursorTrail });
})();
