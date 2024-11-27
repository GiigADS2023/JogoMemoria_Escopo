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

const topicExplanations = {
    "Exclusões": "Aspectos que não estão incluindo no escopo e não serão entregues",
    "Controle": "Processo de monitorar e gerenciar mudanças para evitar o 'scope creep'",
    "Verificação": "Processo de obter aceitação formal das entregas do projeto pelos stakeholders",
    "Refinamento": "Ajuste detalhado dos requisitos para definir o escopo com precisão",
    "Planejamento": "Processo de desenvolver uma abordagem para o gerenciamento de escopo",
    "Mudanças": "Alterações que precisam de aprovação formal para serem incluídas no projeto",
    "Revisão": "A avaliação periódica do escopo para garantir que está sendo seguido conforme planejado",
    "Limitações": "Restrições específicas do projeto que limitam a execução do escopo",
};

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

  setTimeout(checkForMatch, 1000); 
}

function checkForMatch() {
  const textOne = cardOne.querySelector(".back-view h4").innerText;
  const textTwo = cardTwo.querySelector(".back-view h4").innerText;
  const isMatch = textOne === textTwo;

  if (isMatch) {
    alert(topicExplanations[textOne]);
    disableCards();
  } else {
    unflipCards();
  }
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
  const allFlipped = [...cards].every(card => card.classList.contains("flip"));
  if (allFlipped) {
    stopGame();
    alert("Parabéns! Você encontrou todas as cartas! "); 
  }
}

stopGame();