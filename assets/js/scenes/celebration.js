/** Scene 5: celebration, final note and promises. */
(() => {
  "use strict";

  const { fromTemplate, slots, replayAnimation } = Sorry.utils;

  // [x, y] as a fraction of the viewport, plus heart count.
  const BURSTS = [
    [0.5, 0.45, 40],
    [0.2, 0.3, 24],
    [0.8, 0.3, 24],
    [0.5, 0.2, 24],
  ];
  const BURST_STAGGER_MS = 260;

  let refs;
  let ctx;
  let timers = [];

  function renderPromises() {
    const items = ctx.config.promises.map((text) => {
      const item = fromTemplate("tpl-promise");
      slots(item).text.textContent = text;
      return item;
    });
    refs.promises.replaceChildren(...items);
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function celebrate() {
    const { innerWidth: w, innerHeight: h } = window;
    clearTimers();
    timers = BURSTS.map(([px, py, count], i) =>
      window.setTimeout(() => ctx.effects.burst(w * px, h * py, count), i * BURST_STAGGER_MS),
    );
    ctx.effects.rain.flurry(20);
    replayAnimation(refs.photo, "animate-pop");
  }

  window.Sorry.scenes = window.Sorry.scenes || {};
  window.Sorry.scenes.celebration = {
    mount(root, context) {
      ctx = context;
      refs = Sorry.utils.refs(root);
      renderPromises();
      refs.restart.addEventListener("click", () => ctx.go("envelope"));
    },
    enter: celebrate,
    leave: clearTimers,
  };
})();
