const emojis = ["🐶", "🐱", "🦊", "🐻", "🐼", "🦁"];

const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let seconds = 0;
let timerId = null;
let started = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  if (started) return;
  started = true;
  timerId = setInterval(() => {
    seconds += 1;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function createCard(value, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.value = value;
  card.dataset.index = index;
  card.innerHTML = `
    <span class="card-inner">
      <span class="face front">?</span>
      <span class="face back">${value}</span>
    </span>
  `;
  card.addEventListener("click", onCardClick);
  return card;
}

function onCardClick(e) {
  const card = e.currentTarget;
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;

  if (!started) startTimer();

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  movesEl.textContent = moves;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches += 1;
    resetTurn();

    if (matches === emojis.length) {
      stopTimer();
      statusEl.textContent = `🎉 Tebrikler! ${moves} hamlede ${formatTime(seconds)} sürede bitirdin.`;
    }
    return;
  }

  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 700);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function initGame() {
  stopTimer();
  const deck = shuffle([...emojis, ...emojis]);
  cards = [];
  board.innerHTML = "";
  moves = 0;
  matches = 0;
  seconds = 0;
  started = false;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  movesEl.textContent = "0";
  timerEl.textContent = "00:00";
  statusEl.textContent = "";

  deck.forEach((emoji, index) => {
    const card = createCard(emoji, index);
    cards.push(card);
    board.appendChild(card);
  });
}

restartBtn.addEventListener("click", initGame);
initGame();
