// utils.js

// Fungsi untuk mengacak array (shuffle)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Fungsi untuk ambil kata random
function getRandomWords(words, jumlah) {
  const shuffled = shuffle(words);
  return shuffled.slice(0, jumlah);
}