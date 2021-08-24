const answerList = document.querySelector(".answer-list");
const startScreen = document.querySelector(".main-screen ");
const mainScreen = document.querySelector(".quiz");
const resultScreen = document.querySelector(".result-screen");

let questionList = [];
let wrongAnswers = [];

let qIdx = 0;
let correctAnswers = 0;
let answers;

function getQuestions() {
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      for (let i = 0; i < data.results.length; i++) {
        questionList.push(data.results[i]);
      }
      printQuestion();
      printAnswer();
    });
}

function printQuestion() {
  const category = document.querySelector(".category");
  const level = document.querySelector(".level");
  const questions = document.querySelector(".question");

  category.innerText = questionList[qIdx].category;
  level.innerText = questionList[qIdx].difficulty;
  questions.innerHTML = questionList[qIdx].question;

  let progress = document.querySelector(".progress");
  progress.classList.add("animate");
  progress.style.width = (100 / 10) * (qIdx + 1) + "%";
}

function suffleAnswers(arr) {
  arr.sort(() => Math.random() - 0.5);
}

function printAnswer() {
  answers = [];
  answers.push(questionList[qIdx].correct_answer);
  console.log(questionList[qIdx].correct_answer);
  for (let i = 0; i < 3; i++) {
    answers.push(questionList[qIdx].incorrect_answers[i]);
  }
  suffleAnswers(answers);

  answers.forEach((ans) => {
    let answer = document.createElement("button");
    answer.classList.add("answer-button");
    answer.classList.add("animate");
    answerList.appendChild(answer);
    answer.innerHTML = ans;
    answer.addEventListener("click", nextQ);
  });
}

function nextQ(e) {
  if (e.target.innerHTML === questionList[qIdx].correct_answer) {
    correctAnswers++;
    console.log(correctAnswers);
  } else {
    wrongAnswers.push(questionList[qIdx]);
  }
  if (qIdx >= 9) {
    mainScreen.classList.add("hidden");
    printResult();
  } else {
    qIdx++;
    answerList.innerHTML = "";
    printQuestion();
    printAnswer();
  }
}

function printResult() {
  let result = document.querySelector(".results");
  let score = correctAnswers;
  resultScreen.classList.remove("hidden");
  result.innerText = score;
}

let startBtn = document.querySelector(".start-button");

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  startScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");
}

let restartBtn = document.querySelector(".restart-button");
restartBtn.addEventListener("click", reStart);

function reStart() {
  const loading = document.querySelector(".loading-container");
  loading.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
  }, 2000);

  qIdx = 0;
  questionList = [];
  answers = [];
  wrongAnswers = [];
  correctAnswers = 0;
  answerList.innerHTML = "";

  getQuestions();
  startQuiz();
}

function init() {
  getQuestions();
  startScreen.classList.remove("hidden");
  mainScreen.classList.add("hidden");
}
init();
