/** Small DOM and math helpers shared by every module. */
(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /** Collects `[data-ref]` elements inside `root` into a `{ name: element }` map. */
  const refs = (root) =>
    Object.fromEntries(qsa("[data-ref]", root).map((node) => [node.dataset.ref, node]));

  /** Clones the first element of a `<template id="...">`. */
  const fromTemplate = (id) => document.getElementById(id).content.firstElementChild.cloneNode(true);

  /** Returns the `[data-slot]` children of a cloned template as a map. */
  const slots = (root) =>
    Object.fromEntries(qsa("[data-slot]", root).map((node) => [node.dataset.slot, node]));

  /** Builds an `<svg><use href="#i-name"/></svg>` pointing at the Heroicons sprite. */
  const icon = (name, className = "size-5") => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return svg;
  };

  /** Restarts a CSS animation class on an element. */
  const replayAnimation = (el, className) => {
    el.classList.remove(className);
    void el.offsetWidth; // force reflow
    el.classList.add(className);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const random = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const getPath = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  window.Sorry = window.Sorry || {};
  window.Sorry.utils = Object.freeze({
    qs, qsa, refs, fromTemplate, slots, icon, replayAnimation,
    sleep, random, pick, clamp, getPath,
    prefersReducedMotion, hasFinePointer,
  });
})();
