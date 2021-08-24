const answerList = document.querySelector(".answer-list");

const questionList = [];
let answers;

let qIdx = 0;
let correctAnswers = 0;

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

function printQuestion() {
  const category = document.querySelector(".category");
  const level = document.querySelector(".level");
  const questions = document.querySelector(".question");

  category.innerText = questionList[qIdx].category;
  level.innerText = questionList[qIdx].difficulty;
  questions.innerHTML = questionList[qIdx].question;

  let progress = document.querySelector(".progress");
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
    answerList.appendChild(answer);
    answer.innerHTML = ans;
    answer.addEventListener("click", nextQ);
  });
}

function nextQ(e) {
  if (e.target.innerHTML === questionList[qIdx].correct_answer) {
    correctAnswers++;
  }
  if (qIdx >= 9) {
    printResult();
  } else {
    qIdx++;
    answerList.innerHTML = "";
    printQuestion();
    printAnswer();
  }
}

function printResult() {
  let totalScore = (correctAnswers / 10) * 100;
  document.write(`최종 점수는 ${totalScore}점입니다.`);
}
