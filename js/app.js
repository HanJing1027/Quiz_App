import { questions } from "./questions.js";

const configContainer = document.querySelector(".config-container");
const startQucizBtn = document.querySelector(".start-quiz-btn");
const categoryOptions = document.querySelectorAll(".category-option");
const questionOptions = document.querySelectorAll(".question-option");

const quizContainer = document.querySelector(".quiz-container");
const timeDuration = document.querySelector(".time-duration");
const answerOptions = document.querySelector(".answer-options");
const nexQuestionBtn = document.querySelector(".next-question-btn");

const resultContainer = document.querySelector(".result-container");
const resultMessage = document.querySelector(".result-message");
const tryAgainBtn = document.querySelector(".try-again-btn");

let questionCount = 0; // 選擇的題目數量
let questionsCount = 1; // 已答題的數量

// 計算正確與錯誤的答案
let asCorrect = 0;
let asInCorrect = 0;

// 計時器
let countdown;
let timeLeft = 0;

categoryOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeCategory(categoryOptions, btn);
  });
});

questionOptions.forEach((btn) => {
  btn.addEventListener("click", () => {
    changeCategory(questionOptions, btn);

    questionCount = parseInt(btn.dataset.quantity);
  });
});

// 類別選項
const changeCategory = (options, activeBtn) => {
  options.forEach((btn) => {
    btn.classList.remove("active");
  });
  activeBtn.classList.add("active");
};

// 取得選取的題庫與隨機題目
const getRandomQuestions = () => {
  // 取得被選取的類別
  const quizCategory = document.querySelector(".category-options .active")
    .dataset.category;

  // 取得題庫中的題目
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() == quizCategory.toLowerCase()
    ).questions || [];

  // 取得題庫中隨機的題目
  const randomQuestion =
    categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

  // 回傳隨機的題目
  return randomQuestion;
};

// 渲染題目
const renderQuestion = () => {
  // 畫面切換
  configContainer.style.display = "none";
  quizContainer.style.display = "block";

  // 重置計時器
  clearInterval(countdown);
  timeLeft = 15;
  timeDuration.textContent = `${timeLeft}s`;

  // 鎖上按鈕
  nexQuestionBtn.style.opacity = ".5";
  nexQuestionBtn.style.pointerEvents = "none";

  // 將隨機的題目賦值給 currentQuestion
  const currentQuestion = getRandomQuestions();

  if (!currentQuestion) return;

  // 清空避免下一次渲染時重複
  answerOptions.innerHTML = "";

  // 題目渲染到畫面上
  document.querySelector(".question-text").textContent =
    currentQuestion.question;

  currentQuestion.options.forEach((option) => {
    // 創建選項元素
    const liHTML = `
      <li class="answer-option"><p>${option}</p></li>
    `;
    answerOptions.insertAdjacentHTML("beforeend", liHTML);
  });

  // 取得正確答案選項
  const correctAnswerText =
    currentQuestion.options[currentQuestion.correctAnswer];
  console.log(`正確答案:${correctAnswerText}`);

  // 答題進度
  document.querySelector(
    ".question-status"
  ).innerHTML = `<p class="question-status"><b>${questionsCount}</b> of <b>${questionCount}</b> Question</p>`;

  // 啟動計時器
  countdown = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeDuration.textContent = `${timeLeft}s`;
    } else if (timeLeft == 0) {
      asInCorrect++;
      showCorrectAnswer(
        document.querySelectorAll(".answer-option"),
        correctAnswerText
      );
      lockOptions(document.querySelectorAll(".answer-option"));
      nexQuestionBtn.style.opacity = "1";
      nexQuestionBtn.style.pointerEvents = "auto";
      clearInterval(countdown);
    }
  }, 1000);

  checkedAnswer(correctAnswerText);

  if (questionsCount == questionCount + 1) {
    clearInterval(countdown);
  }
};

// 檢查答案
const checkedAnswer = (correctAnswerText) => {
  // 答題數量
  questionsCount++;

  // 取得所有選項
  const answerOptions = document.querySelectorAll(".answer-option");
  answerOptions.forEach((option) => {
    option.addEventListener("click", (elem) => {
      // 取得user選取的選項
      const selectedOption = elem.target.textContent;

      // 判斷是否為正確答案
      if (selectedOption == correctAnswerText) {
        asCorrect++;
        markAsCorrect(elem.target);
      } else {
        asInCorrect++;
        markAsIncorrect(elem.target);
        showCorrectAnswer(answerOptions, correctAnswerText);
      }

      // 避免再次點擊
      lockOptions(answerOptions);
      // 解鎖按鈕
      nexQuestionBtn.style.opacity = "1";
      nexQuestionBtn.style.pointerEvents = "auto";

      clearInterval(countdown);
    });
  });
};

const markAsCorrect = (elem) => {
  elem.parentElement.classList.add("correct");
  elem.innerHTML += `<i class="bx bx-check-circle"></i>`;
};

const markAsIncorrect = (elem) => {
  elem.parentElement.classList.add("incorrect");
  elem.innerHTML += `<i class="bx bx-x-circle"></i>`;
};

const showCorrectAnswer = (answerOptions, correctAnswerText) => {
  answerOptions.forEach((option) => {
    if (option.textContent == correctAnswerText) {
      option.classList.add("correct");
      document.querySelector(
        ".correct p"
      ).innerHTML += `<i class="bx bx-check-circle"></i>`;
    }
  });
};

const lockOptions = (answerOptions) => {
  answerOptions.forEach((option) => {
    option.style.pointerEvents = "none";
  });
};

const showResult = () => {
  // 畫面切換
  resultContainer.style.display = "block";
  quizContainer.style.display = "none";

  // 渲染結果
  resultMessage.innerHTML = `
    <p class="result-message">
      總題數為 <b>${questionCount}</b> 題、答對了 <b>${asCorrect}</b> 題、答錯了 <b>${asInCorrect}</b> 題，表現不錯！
    </p>
  `;

  tryAgainBtn.addEventListener("click", () => {
    resultContainer.style.display = "none";
    configContainer.style.display = "block";

    questionsCount = 0; // 重置已答題數量
    asCorrect = 0;
    asInCorrect = 0;
  });
};

startQucizBtn.addEventListener("click", () => {
  getRandomQuestions();
  renderQuestion();
});

nexQuestionBtn.addEventListener("click", () => {
  if (questionsCount == questionCount + 1) {
    showResult();
  } else {
    renderQuestion();
  }
});
