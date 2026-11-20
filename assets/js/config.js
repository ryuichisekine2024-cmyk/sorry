/**
 * Site content.
 * Everything she reads lives here — edit this file to personalise the
 * experience. No other file needs to change.
 */
window.Sorry = window.Sorry || {};

window.Sorry.config = Object.freeze({
  envelopeTitle: "For My Little Dragon",
  greeting: "Hi!, My Little Dragon",
  signature: "I am Kuromi",

  images: {
    letter: "images/imsorryplsforgiveme.jpg",
    question: "images/willyouforgiveme.jpg",
    celebration: "images/iloveu.jpg",
  },

  letter: `I know I hurt you, and I'm truly sorry.

You didn't deserve that, and I hate that I made you feel that way. I've been thinking about it nonstop, and I understand why you're upset.

You mean everything to me. I'm not perfect, but I promise I'll keep learning and doing better, for you and for us.

Please give me the chance to make it right.`,

  // Cards in the swipe deck. "photo" shows an image, "note" shows text.
  cards: [
    { type: "photo", image: "images/plsforgiveme.jpg", caption: "even this kitten is begging" },
    { type: "note", text: "Your smile is my favorite thing in the whole world." },
    { type: "note", text: "You make every ordinary day feel special." },
    { type: "note", text: "my reason is we never talk since day1" },
    { type: "note", text: "I choose you. Today and every day after." },
  ],

  // Shown one after another each time she tries to press "No".
  noPleas: [
    "Are you sure?",
    "Pretty please?",
    "I'll buy you snacks.",
    "Think about the kitten...",
    "I'll give you all the cuddles.",
    "The No button is scared of you.",
    "Okay, just press Yes.",
  ],
  noLabels: ["No", "Are you sure?", "Really?", "Pleaseee", "...no?", "Nope"],

  finalMessage: "Thank you for forgiving me. I'm so lucky to have you, and I promise:",
  promises: [
    "To listen more and assume less",
    "To always talk things through",
    "To make you smile every single day",
    "To love you, always",
  ],
});
