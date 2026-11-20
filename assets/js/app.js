/** Entry point: binds content, mounts scenes and handles navigation. */
(() => {
  "use strict";

  const { config, scenes, effects, utils } = window.Sorry;
  const { qs, qsa, getPath } = utils;

  const ORDER = ["envelope", "letter", "reasons", "question", "celebration"];

  const sections = new Map(ORDER.map((name) => [name, qs(`[data-scene="${name}"]`)]));
  const progress = qs("[data-progress]");
  const fxLayer = qs("#fx-layer");
  const rain = effects.createHeartRain(qs("#heart-rain"));

  let current = null;

  const ctx = {
    config,
    go,
    next: () => go(ORDER[ORDER.indexOf(current) + 1]),
    effects: {
      rain,
      burst: (x, y, count) => effects.burst(fxLayer, x, y, count),
    },
  };

  /** Fills `[data-bind]` text and `[data-bind-src]` image sources from the config. */
  function applyBindings() {
    qsa("[data-bind]").forEach((el) => {
      el.textContent = getPath(config, el.dataset.bind) ?? "";
    });
    qsa("[data-bind-src]").forEach((el) => {
      el.src = getPath(config, el.dataset.bindSrc) ?? "";
    });
  }

  function renderProgress() {
    const activeIndex = ORDER.indexOf(current);
    progress.replaceChildren(
      ...ORDER.map((_, i) => {
        const dot = document.createElement("li");
        dot.className = "progress-dot";
        dot.classList.toggle("is-done", i < activeIndex);
        dot.classList.toggle("is-current", i === activeIndex);
        return dot;
      }),
    );
  }

  function go(name, { focus = true } = {}) {
    if (!sections.has(name) || name === current) return;

    if (current) {
      scenes[current].leave?.();
      sections.get(current).classList.remove("is-active");
    }

    current = name;
    const section = sections.get(name);
    section.classList.add("is-active");
    section.scrollTop = 0;

    renderProgress();
    scenes[name].enter?.();

    // Move focus to the new heading for keyboard and screen-reader users.
    if (focus) qs("h1, h2", section)?.focus({ preventScroll: true });
  }

  function init() {
    applyBindings();
    ORDER.forEach((name) => scenes[name].mount(sections.get(name), ctx));
    qsa('[data-action="next"]').forEach((button) => button.addEventListener("click", ctx.next));

    rain.start();
    rain.flurry(6);
    effects.enableCursorTrail(fxLayer);

    go(ORDER[0], { focus: false });
  }

  init();
})();
