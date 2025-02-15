import { questions } from "./questions.js";

const startQuizBtn = document.querySelector(".start-quiz-btn");
const answerOptions = document.querySelector(".answer-options");

// 取得被選取的類別
const quizCategory = document.querySelector(".category-options .active").dataset
  .category;

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

// 渲染問題
const renderQuestion = () => {
  // 將隨機的題目賦值給 currentQuestion
  const currentQuestion = getRandomQuestions();

  if (!currentQuestion) return;

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
};
renderQuestion();
