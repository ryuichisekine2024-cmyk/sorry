/** Scene 1: a sealed envelope that opens on tap. */
(() => {
  "use strict";

  const OPEN_DURATION_MS = 1800;

  let root;
  let refs;
  let ctx;
  let isOpen = false;
  let timer = 0;

  function open() {
    if (isOpen) return;
    isOpen = true;
    root.classList.add("is-opening"); // fades the title so the rising letter doesn't overlap it
    refs.envelope.classList.add("is-open");
    refs.envelope.setAttribute("aria-expanded", "true");
    timer = window.setTimeout(ctx.next, OPEN_DURATION_MS);
  }

  function reset() {
    window.clearTimeout(timer);
    isOpen = false;
    root.classList.remove("is-opening");
    refs.envelope.classList.remove("is-open");
    refs.envelope.setAttribute("aria-expanded", "false");
  }

  window.Sorry.scenes = window.Sorry.scenes || {};
  window.Sorry.scenes.envelope = {
    mount(el, context) {
      root = el;
      ctx = context;
      refs = Sorry.utils.refs(root);
      refs.envelope.addEventListener("click", open);
    },
    enter: reset,
    leave: () => window.clearTimeout(timer),
  };
})();
