/** Scene 2: the apology letter, typed out character by character. */
(() => {
  "use strict";

  const { sleep, prefersReducedMotion } = Sorry.utils;

  const DELAY_MS = { char: 32, punctuation: 180, newline: 260 };

  const delayFor = (char) => {
    if (char === "\n") return DELAY_MS.newline;
    if (/[.,!?]/.test(char)) return DELAY_MS.punctuation;
    return DELAY_MS.char;
  };

  let refs;
  let ctx;
  let runId = 0; // invalidates an in-flight typing run when the scene restarts or leaves
  let skipRequested = false;

  function setFinished(finished) {
    refs.signature.classList.toggle("opacity-0", !finished);
    refs.skip.hidden = finished;
    refs.next.hidden = !finished;
  }

  /** Resolves `true` when typing completed for this run, `false` if it was cancelled. */
  async function type(text, id) {
    const output = document.createTextNode("");
    const caret = document.createElement("span");
    caret.className = "caret";
    refs.body.replaceChildren(output, caret);

    // Array.from keeps multi-byte characters intact.
    for (const char of Array.from(text)) {
      if (id !== runId) return false;
      if (skipRequested || prefersReducedMotion) {
        output.data = text;
        break;
      }
      output.data += char;
      await sleep(delayFor(char));
    }

    caret.remove();
    return id === runId;
  }

  async function play() {
    const id = ++runId;
    skipRequested = false;
    setFinished(false);
    if (await type(ctx.config.letter, id)) setFinished(true);
  }

  const skip = () => {
    skipRequested = true;
  };

  window.Sorry.scenes = window.Sorry.scenes || {};
  window.Sorry.scenes.letter = {
    mount(root, context) {
      ctx = context;
      refs = Sorry.utils.refs(root);
      refs.skip.addEventListener("click", skip);
      refs.paper.addEventListener("click", skip);
    },
    enter: play,
    leave: () => {
      runId += 1;
    },
  };
})();
