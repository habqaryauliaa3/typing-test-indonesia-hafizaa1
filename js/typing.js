// typing.js

function handleTyping(event){
  if (settings.soundTyping) {
    playTyping();
  }
  const value = event.target.value;

  const typedWords = value.trim().split(" ").filter(w => w !== "");

  characters.forEach((charSpan, index) => {
    const typedChar = value[index];
    const expectedChar = charSpan.innerText;



    charSpan.classList.remove(
      "typing-current",
      "typing-correct",
      "typing-wrong",
      "typing-fixed"
    );

    if (typedChar == null) {
      // belum diketik
    } else if (typedChar === expectedChar) {

      if (charStatus[index].wrong) {
        charSpan.classList.add("typing-fixed");
        charStatus[index].corrected = true;

      } else {
        charSpan.classList.add("typing-correct");

          // 🔊 cuma di sini!
          if (settings.soundCorrect) {
            playCorrect();
        }
      }

    } else {
      charSpan.classList.add("typing-wrong");

      if (!charStatus[index].wrong) {
        charStatus[index].wrong = true;
        charStatus[index].originalWrongChar = typedChar;
      }
    }


  });
  
  // ===== DETEKSI KATA =====
  if (value.endsWith(" ")) {
    const words = typedWords;
    const lastWordIndex = words.length - 1;
    if (lastWordIndex === lastCheckedWordIndex) return;
    lastCheckedWordIndex = lastWordIndex;
    const typedWord = words[lastWordIndex];

    const originalText = characters.map(c => c.innerText).join("");
    const originalWords = originalText.split(" ");

    if (lastWordIndex >= originalWords.length) return;

    const expectedWord = originalWords[lastWordIndex];
    if (!expectedWord) return; // 🔥 STOP kalau undefined

    // cari posisi awal kata
    let charPointer = 0;
    for (let i = 0; i < lastWordIndex; i++) {
      charPointer += originalWords[i].length + 1;
    }

    // 🔥 cek apakah kata ini PERNAH SALAH
    let wordHadError = false;

    for (let i = 0; i < expectedWord.length; i++) {
      const idx = charPointer + i;

      if (charStatus[idx].wrong) {
        wordHadError = true;
        break;
      }
    }

    // 🔥 LOGIC STREAK BARU
    if (typedWord === expectedWord && !wordHadError) {
      // ✅ PERFECT (tanpa salah sama sekali)
      streak++;

      if (streak > maxStreak) {
        maxStreak = streak;
      }

    } else {
      // ❌ ada salah ATAU diperbaiki
      streak = 0;

      if (typedWord !== expectedWord) {
        mistakes.push({
          word: typedWord,
          expected: expectedWord,
          type: "error"
        });
      }
    }
  

    // 🔥 tetap catat correction (ini jangan hilang)
    for (let i = 0; i < expectedWord.length; i++) {
      const idx = charPointer + i;

      if (charStatus[idx].corrected && !charStatus[idx].reported) {
        charStatus[idx].reported = true;

        mistakes.push({
          word: expectedWord,
          detail: `huruf "${expectedWord[i]}" diperbaiki dari "${charStatus[idx].originalWrongChar}" ke "${expectedWord[i]}"`,
          type: "correction"
        });
      }
    }
  }


  // 🔵 current
  const currentIndex = value.length;
  if (characters[currentIndex]) {
    characters[currentIndex].classList.add("typing-current");
  } 
}

function checkLastWord() {
  const value = input.value.trim();
  const words = value.split(" ").filter(w => w !== "");

  const lastWordIndex = words.length - 1;
  const typedWord = words[lastWordIndex];

  const originalText = characters.map(c => c.innerText).join("");
  const originalWords = originalText.split(" ");

  if (lastWordIndex >= originalWords.length) return;

  const expectedWord = originalWords[lastWordIndex];

  if (!expectedWord) return;

  let charPointer = 0;
  for (let i = 0; i < lastWordIndex; i++) {
    charPointer += originalWords[i].length + 1;
  }

  let wordHadError = false;

  for (let i = 0; i < expectedWord.length; i++) {
    const idx = charPointer + i;
    if (charStatus[idx].wrong) {
      wordHadError = true;
      break;
    }
  }

  if (typedWord === expectedWord && !wordHadError) {
    streak++;
    if (streak > maxStreak) {
      maxStreak = streak;
    }
  }
}

// ===== GLOBAL =====
let lastCheckedWordIndex = -1;
let characters = [];
let charStatus = [];
let mistakes = [];
let streak = 0;
let maxStreak = 0;

// ===== RENDER =====
function renderText(text) {
  textDisplay.innerHTML = "";

  characters = [];
  charStatus = [];
  mistakes = [];

  characters = text.split("").map((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);

    charStatus[index] = {
      wrong: false,
      corrected: false,
      originalWrongChar: null,
      reported: false // 🔥 tambahan
    };

    return span;
  });

  if (characters.length > 0) {
    characters[0].classList.add("typing-current");
  }
}

