// main.js

// ambil elemen display
const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timerElement = document.getElementById("timer");

let started = false;
let time = 60;
let timerInterval = null;
let totalTyped = 0;

// load words.json
fetch("data/words.json")
  .then(response => response.json())
  .then(words => {
    console.log(words); // 👈 tambah ini
    start(words);
  });

// fungsi utama

function startTimer() {
  timerInterval = setInterval(() => {
    time--;
    timerElement.innerText = time;

    if (time <= 0) {
      clearInterval(timerInterval);
      endTest(); // 🔥 panggil report
    }
  }, 1000);
}

function start(words) {
  const filteredWords = getWordsByMode(words, currentMode);

  const count = parseInt(document.getElementById("wordCount").value);

  fullWords = getRandomWords(filteredWords, count);

  renderText(fullWords.join(" "));
}

input.addEventListener("input", (e) => {
  if (!started) {
    startTimer();
    started = true;
  }

  handleTyping(e);
  totalTyped = e.target.value.length;
});

function endTest() {
  input.disabled = true;

  checkLastWord(); // FIX UTAMA

  console.log("Mistakes:", mistakes);

  // 🔥 HITUNG WPM DULU
  const wpm = Math.round(totalTyped / 5);

  // 🔥 AMBIL BEST
  const best = parseInt(localStorage.getItem("bestWPM")) || 0;

  // 🔥 SIMPAN JIKA LEBIH BESAR
  if (wpm > best) {
    localStorage.setItem("bestWPM", wpm);
  }

  showReport();
}

function showReport() {
  const reportDiv = document.getElementById("report");
  reportDiv.style.display = "block";

  const errors = mistakes.filter(m => m.type === "error");
  const corrections = mistakes.filter(m => m.type === "correction");

  const wpmElement = document.getElementById("wpm");
  const errorElement = document.getElementById("errorCount");
  const correctionElement = document.getElementById("correctionCount");
  const detailElement = document.getElementById("reportDetail");

  const wpm = Math.round(totalTyped / 5);

  wpmElement.innerText = "WPM: " + wpm;
  errorElement.innerText = "Error: " + errors.length;
  correctionElement.innerText = "Correction: " + corrections.length;

  const totalMistakes = errors.length + corrections.length;

  const accuracy = totalTyped === 0
    ? 0
    : Math.round(((totalTyped - totalMistakes) / totalTyped) * 100);

  const accElement = document.getElementById("accuracy");
  accElement.innerText = "Accuracy: " + accuracy + "%";

  const streakEl = document.getElementById("streak");
  streakEl.innerText = "Max Streak: " + maxStreak;

  const best = parseInt(localStorage.getItem("bestWPM")) || 0;

  const bestEl = document.getElementById("bestWpm");
  bestEl.innerText = "Best WPM: " + best;

  detailElement.innerHTML = "";

  mistakes.forEach(m => {
    const p = document.createElement("p");

    if (m.type === "error") {
      p.innerText = `❌ ${m.word} → ${m.expected}`;
    } else {
      p.innerText = `🟡 ${m.detail}`;
    }

    detailElement.appendChild(p);


  });
}

function resetGame() {
  const btn = document.querySelector('button[onclick="resetGame()"]');
  btn.classList.add("refreshing");

  setTimeout(() => {
    btn.classList.remove("refreshing");
  }, 600);

  time = 60;
  timerElement.innerText = time;

  clearInterval(timerInterval);
  input.disabled = false;
  input.value = "";

  document.getElementById("report").style.display = "none";

  mistakes = [];
  totalTyped = 0;
  started = false;
  lastCheckedWordIndex = -1;

  streak = 0;
  maxStreak = 0;

  // 🔥 reload text TANPA refresh page
  textDisplay.classList.add("fade-out");

  setTimeout(() => {
    fetch("data/words.json")
      .then(res => res.json())
      .then(words => {
        start(words);

        // 🔥 ANIMASI MUNCUL
        textDisplay.classList.remove("fade-out");
        textDisplay.classList.add("fade-in");

        setTimeout(() => {
          textDisplay.classList.remove("fade-in");
        }, 300);
      });
  }, 300);
  input.focus();
}


function getWordsByMode(words, mode) {
  if (mode === "easy") {
    return words.filter(w => w.length <= 5);
  } else if (mode === "normal") {
    return words.filter(w => w.length <= 10);
  } else {
    return words.filter(w => w.length > 6);
  }
}

let currentMode = "normal"; // default



function setMode(mode) {
  currentMode = mode;
  resetGame(); // biar langsung reload text sesuai mode
}

