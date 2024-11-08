const cards = document.querySelectorAll(".card");
let cardOne = null;
let cardTwo = null;
let lockBoard = false;
let attempts = 0;
let timerInterval;
let isGameActive = false;
let seconds = 0;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const restartBtn = document.getElementById("restartBtn");
const timeDisplay = document.getElementById("time");
const attemptsDisplay = document.getElementById("attempts");

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
restartBtn.addEventListener("click", restartGame);

function startGame() {
    if (isGameActive) return;
    isGameActive = true;
    lockBoard = false;
    shuffleCards();
    startTimer();
    cards.forEach(card => card.addEventListener("click", flipCard));
}

function stopGame() {
    isGameActive = false;
    clearInterval(timerInterval);
    cards.forEach(card => card.removeEventListener("click", flipCard));
}

function restartGame() {
    stopGame();
    attempts = 0;
    seconds = 0;
    timeDisplay.textContent = "00:00";
    attemptsDisplay.textContent = attempts;
    cards.forEach(card => card.classList.remove("flip"));
    shuffleCards();
    startGame();
}

function flipCard(e) {
    if (!isGameActive || lockBoard) return;
    let clickedCard = e.target.closest(".card");

    if (!clickedCard || clickedCard.classList.contains("flip") || clickedCard === cardOne) return;

    clickedCard.classList.add("flip");

    if (!cardOne) {
        cardOne = clickedCard;
        return;
    }

    cardTwo = clickedCard;
    lockBoard = true;
    attempts++;
    attemptsDisplay.textContent = attempts;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = cardOne.querySelector(".back-view h4").innerText === cardTwo.querySelector(".back-view h4").innerText;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    resetBoard();
    checkForCompletion();
}

function unflipCards() {
    setTimeout(() => {
        cardOne.classList.remove("flip");
        cardTwo.classList.remove("flip");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [cardOne, cardTwo] = [null, null];
    lockBoard = false;
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function shuffleCards() {
    cards.forEach(card => {
        const randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

function checkForCompletion() {
    const flippedCards = document.querySelectorAll(".card.flip");
    if (flippedCards.length === cards.length) {
        setTimeout(() => {
            alert("Parabéns! Você completou o jogo!");
            restartGame();
        }, 500);
    }
}

stopGame();
