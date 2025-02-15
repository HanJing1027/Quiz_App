import { questions } from "./questions.js";

const startQucizBtn = document.querySelector(".start-quiz-btn");
const nexQuestionBtn = document.querySelector(".next-question-btn");
const answerOptions = document.querySelector(".answer-options");

// 取得被選取的類別
const quizCategory = document.querySelector(".category-options .active").dataset
  .category;

// 計算正確與錯誤的答案
let asCorrect = 0;
let asIncorrect = 0;

// 取得選取的題庫與隨機題目
const getRandomQuestions = () => {
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

  checkedAnswer(correctAnswerText);
};

// 檢查答案
const checkedAnswer = (correctAnswerText) => {
  // 取得所有選項
  const answerOptions = document.querySelectorAll(".answer-option");
  answerOptions.forEach((option) => {
    option.addEventListener("click", (elem) => {
      // 取得user選取的選項
      const selectedOption = elem.target.textContent;

      // 判斷是否為正確答案
      if (selectedOption == correctAnswerText) {
        asCorrect++;
      } else {
        asIncorrect++;
        elem.target.parentElement.classList.add("incorrect");
        elem.target.innerHTML += `<i class="bx bx-x-circle"></i>`;
      }

      answerOptions.forEach((opt) => {
        // 正確答案加上樣式
        if (opt.textContent == correctAnswerText) {
          opt.classList.add("correct");
          document.querySelector(
            ".correct p"
          ).innerHTML += `<i class="bx bx-check-circle"></i>`;
        }

        // 避免再次點擊
        opt.style.pointerEvents = "none";
        // 解鎖按鈕
        nexQuestionBtn.style.opacity = "1";
        nexQuestionBtn.style.pointerEvents = "auto";
      });
    });
  });
};
renderQuestion();

nexQuestionBtn.addEventListener("click", renderQuestion);
