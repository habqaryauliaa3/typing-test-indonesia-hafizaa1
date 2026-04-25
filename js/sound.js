// sound.js

// load audio
const typingSound = new Audio("assets/sounds/type.mp3");
const correctSound = new Audio("assets/sounds/correct.mp3");

// biar bisa diputar berulang cepat
typingSound.volume = 0.3;
correctSound.volume = 0.5;

// 🔊 suara ngetik
function playTyping() {
  typingSound.currentTime = 0; // reset biar bisa spam
  typingSound.play().catch(() => {});
}

// ✅ suara benar
function playCorrect() {
  correctSound.currentTime = 0;
  correctSound.play();
}