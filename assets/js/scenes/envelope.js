/** Scene 1: a sealed envelope that opens on tap. */
(() => {
  "use strict";

  const OPEN_DURATION_MS = 1800;

  let refs;
  let ctx;
  let isOpen = false;
  let timer = 0;

  function open() {
    if (isOpen) return;
    isOpen = true;
    refs.envelope.classList.add("is-open");
    refs.envelope.setAttribute("aria-expanded", "true");
    timer = window.setTimeout(ctx.next, OPEN_DURATION_MS);
  }

  function reset() {
    window.clearTimeout(timer);
    isOpen = false;
    refs.envelope.classList.remove("is-open");
    refs.envelope.setAttribute("aria-expanded", "false");
  }

  window.Sorry.scenes = window.Sorry.scenes || {};
  window.Sorry.scenes.envelope = {
    mount(root, context) {
      ctx = context;
      refs = Sorry.utils.refs(root);
      refs.envelope.addEventListener("click", open);
    },
    enter: reset,
    leave: () => window.clearTimeout(timer),
  };
})();
