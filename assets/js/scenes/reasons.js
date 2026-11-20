/** Scene 3: a swipeable deck of photo and note cards. */
(() => {
  "use strict";

  const { fromTemplate, slots, random } = Sorry.utils;

  const SWIPE_THRESHOLD_PX = 90;
  const TAP_TOLERANCE_PX = 6;
  const VISIBLE_DEPTH = 3;

  let refs;
  let ctx;
  let cards = [];
  let topIndex = 0;

  function createCard(card) {
    const isPhoto = card.type === "photo";
    const el = fromTemplate(isPhoto ? "tpl-photo-card" : "tpl-note-card");
    const slot = slots(el);

    if (isPhoto) {
      slot.image.src = card.image;
      slot.image.alt = card.caption ?? "";
      slot.caption.textContent = card.caption ?? "";
    } else {
      slot.text.textContent = card.text;
    }

    el.style.setProperty("--tilt", `${random(-5, 5).toFixed(1)}deg`);
    attachGestures(el);
    return el;
  }

  function render() {
    cards = ctx.config.cards.map(createCard);
    topIndex = 0;
    refs.deck.replaceChildren(...cards);
    layout();
  }

  function layout() {
    cards.slice(topIndex).forEach((el, depth) => {
      el.style.setProperty("--depth", depth);
      el.classList.toggle("is-top", depth === 0);
      el.classList.toggle("is-buried", depth >= VISIBLE_DEPTH);
      el.tabIndex = depth === 0 ? 0 : -1;
    });

    const total = cards.length;
    const done = topIndex >= total;
    refs.counter.textContent = done ? "All read" : `${topIndex + 1} / ${total}`;
    refs.nextCard.hidden = done;
    refs.next.hidden = !done;
  }

  function dismiss(el, direction = 1) {
    if (el !== cards[topIndex]) return;
    el.classList.remove("is-top", "is-dragging");
    el.classList.add("is-gone");
    el.style.transform = `translateX(${direction * 140}%) rotate(${direction * 28}deg)`;
    topIndex += 1;
    layout();
  }

  function attachGestures(el) {
    let pointerId = null;
    let startX = 0;
    let dx = 0;

    el.addEventListener("pointerdown", (event) => {
      if (!el.classList.contains("is-top")) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      dx = 0;
      el.setPointerCapture(pointerId);
      el.classList.add("is-dragging");
    });

    el.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      dx = event.clientX - startX;
      el.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`;
    });

    const release = (event, cancelled) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
      el.classList.remove("is-dragging");

      const distance = Math.abs(dx);
      const isTap = distance <= TAP_TOLERANCE_PX;
      if (!cancelled && (isTap || distance >= SWIPE_THRESHOLD_PX)) {
        dismiss(el, Math.sign(dx) || 1);
      } else {
        el.style.transform = ""; // spring back to the deck position
      }
    };

    el.addEventListener("pointerup", (event) => release(event, false));
    el.addEventListener("pointercancel", (event) => release(event, true));

    el.addEventListener("keydown", (event) => {
      if (["Enter", " ", "ArrowRight"].includes(event.key)) dismiss(el, 1);
      else if (event.key === "ArrowLeft") dismiss(el, -1);
      else return;
      event.preventDefault();
    });
  }

  window.Sorry.scenes = window.Sorry.scenes || {};
  window.Sorry.scenes.reasons = {
    mount(root, context) {
      ctx = context;
      refs = Sorry.utils.refs(root);
      refs.nextCard.addEventListener("click", () => cards[topIndex] && dismiss(cards[topIndex], 1));
    },
    enter: render,
  };
})();
