/** Scene 4: "Will you forgive me?" — the No button runs away, Yes keeps growing. */
(() => {
  "use strict";

  const { random, clamp, replayAnimation, hasFinePointer } = Sorry.utils;

  const EDGE_PX = 16;
  const SAFE_GAP_PX = 40;
  const MAX_TRIES = 24;
  const YES_GROWTH = 0.15;
  const YES_MAX_SCALE = 2.2;

  let refs;
  let ctx;
  let dodges = 0;

  const overlaps = (a, b, gap) =>
    a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;

  const messageAt = (list, index) => list[Math.min(index, list.length - 1)];

  function releaseNo() {
    refs.no.classList.remove("is-runaway");
    refs.no.style.left = "";
    refs.no.style.top = "";
  }

  function reset() {
    dodges = 0;
    refs.plea.textContent = "";
    refs.noLabel.textContent = ctx.config.noLabels[0];
    refs.yes.style.transform = "";
    releaseNo();
  }

  function moveNo() {
    const button = refs.no;
    const rect = button.getBoundingClientRect();

    if (!button.classList.contains("is-runaway")) {
      // Pin it where it currently is, then animate away from there.
      button.style.left = `${rect.left}px`;
      button.style.top = `${rect.top}px`;
      button.classList.add("is-runaway");
    }

    const yes = refs.yes.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - EDGE_PX;
    const maxY = window.innerHeight - rect.height - EDGE_PX;
    let x = EDGE_PX;
    let y = EDGE_PX;

    for (let i = 0; i < MAX_TRIES; i += 1) {
      x = random(EDGE_PX, maxX);
      y = random(EDGE_PX, maxY);
      const candidate = { left: x, top: y, right: x + rect.width, bottom: y + rect.height };
      if (!overlaps(candidate, yes, SAFE_GAP_PX)) break;
    }

    requestAnimationFrame(() => {
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    });
  }

  function dodge(event) {
    event?.preventDefault();
    dodges += 1;

    const { noPleas, noLabels } = ctx.config;
    refs.plea.textContent = messageAt(noPleas, dodges - 1);
    refs.noLabel.textContent = messageAt(noLabels, dodges);
    refs.yes.style.transform = `scale(${Math.min(1 + dodges * YES_GROWTH, YES_MAX_SCALE)})`;

    replayAnimation(refs.photo, "animate-shake");
    moveNo();
  }

  function keepNoOnScreen() {
    if (!refs.no.classList.contains("is-runaway")) return;
    const rect = refs.no.getBoundingClientRect();
    refs.no.style.left = `${clamp(rect.left, EDGE_PX, window.innerWidth - rect.width - EDGE_PX)}px`;
    refs.no.style.top = `${clamp(rect.top, EDGE_PX, window.innerHeight - rect.height - EDGE_PX)}px`;
  }

  window.Sorry.scenes = window.Sorry.scenes || {};
  window.Sorry.scenes.question = {
    mount(root, context) {
      ctx = context;
      refs = Sorry.utils.refs(root);

      if (hasFinePointer) refs.no.addEventListener("pointerenter", dodge);
      refs.no.addEventListener("click", dodge);
      refs.yes.addEventListener("click", () => {
        releaseNo();
        ctx.next();
      });
      window.addEventListener("resize", keepNoOnScreen);
    },
    enter: reset,
    leave: releaseNo,
  };
})();
