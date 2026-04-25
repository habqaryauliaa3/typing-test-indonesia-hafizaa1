// settings.js

const settings = {
  soundTyping: true,
  soundCorrect: true,

  font: "arial",     // arial | times | calibri | ms
  size: "md",        // xs | sm | md | lg | xl
  theme: "light",    // light | dark
};

// ===== SOUND =====
function toggleTypingSound() {
  settings.soundTyping = !settings.soundTyping;
  updateButtonUI();
}

function toggleCorrectSound() {
  settings.soundCorrect = !settings.soundCorrect;
  updateButtonUI();
}

function updateButtonUI() {
  const btn1 = document.querySelector('[onclick="toggleTypingSound()"]');
  const btn2 = document.querySelector('[onclick="toggleCorrectSound()"]');

  btn1.classList.toggle("off", !settings.soundTyping);
  btn2.classList.toggle("off", !settings.soundCorrect);
}

// ===== FONT =====
function setFont(fontName) {
  settings.font = fontName;
  applySettings();
}

// ===== SIZE =====
function setSize(sizeName) {
  settings.size = sizeName;
  applySettings();
}

// ===== THEME =====
function toggleTheme() {
  settings.theme = settings.theme === "light" ? "dark" : "light";
  applySettings();
}

// ===== APPLY KE UI =====
function applySettings() {
  const body = document.body;
  const text = document.getElementById("textDisplay");

  // reset
  body.className = "";
  text.className = "";

  // font (global)
  body.classList.add("font-" + settings.font);

  // size (KHUSUS textDisplay)
  text.classList.add("size-" + settings.size);

  // theme (global)
  body.classList.add(settings.theme);
}

function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  const gear = document.querySelector(".gear");

  panel.classList.toggle("show");
  gear.classList.toggle("active");
}

applySettings();
updateButtonUI();