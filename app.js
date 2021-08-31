const answerList = document.querySelector(".answer-list");
const startScreen = document.querySelector(".main-screen ");
const mainScreen = document.querySelector(".quiz-screen");
const resultScreen = document.querySelector(".result-screen");
const settingScreen = document.querySelector(".setting-screen");
const settingForm = document.querySelector(".setting-form");

let questionList = [];
let wrongAnswers = [];

let qIdx = 0;
let correctAnswers = 0;
let answers;

function setQuiz(e) {
  e.preventDefault();

  let Qcategory = settingForm.querySelector("#q-category");
  let Qdiff = settingForm.querySelector("#q-diff");
  getQuestions(Qcategory.value, Qdiff.value);
}

settingForm.addEventListener("submit", setQuiz);

function getQuestions(category, difficulty) {
  let link;
  if (category === "any" && difficulty === "any") {
    link = `https://opentdb.com/api.php?amount=10&type=multiple`;
  } else if (category === "any" && difficulty !== "any") {
    link = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`;
  } else if (category !== "any" && difficulty === "any") {
    link = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;
  } else {
    link = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
  }

  fetch(link)
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
  startQuiz();
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
  } else {
    wrongAnswers.push(questionList[qIdx]);
  }
  if (qIdx >= 9) {
    resultScreen.classList.remove("hidden");
    mainScreen.classList.add("hidden");
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
  result.innerText = score;
}
let startSettingBtn = document.querySelector(".start-button");

startSettingBtn.addEventListener("click", startSetting);

function startSetting() {
  startScreen.classList.add("hidden");
  settingScreen.classList.remove("hidden");
  settingForm.classList.remove("hidden");
  resultScreen.classList.add("hidden");
}

let startBtn = document.querySelector(".start-quiz");

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  const loading = document.querySelector(".loading-container");
  loading.classList.remove("hidden");
  settingScreen.classList.add("hidden");
  settingForm.classList.add("hidden");
  mainScreen.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
  }, 1000);

  // startScreen.classList.add("hidden");
  // settingForm.classList.add("hidden");
  // settingScreen.style.opacity = "0";
  // mainScreen.classList.remove("hidden");
  // resultScreen.classList.add("hidden");
}

let restartBtn = document.querySelector(".restart-button");
restartBtn.addEventListener("click", reStart);

function reStart() {
  const loading = document.querySelector(".loading-container");
  loading.classList.remove("hidden");

  setTimeout(() => {
    loading.classList.add("hidden");
  }, 1000);

  qIdx = 0;
  questionList = [];
  answers = [];
  wrongAnswers = [];
  correctAnswers = 0;
  answerList.innerHTML = "";

  startSetting();
}

restartBtn.addEventListener("submit", setQuiz);

function init() {
  startScreen.classList.remove("hidden");
  mainScreen.classList.add("hidden");
  settingScreen.classList.add("hidden");
}
init();
