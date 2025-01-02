document.addEventListener("DOMContentLoaded", () => {
    const englishInput = document.getElementById("englishWords");
    const arabicInput = document.getElementById("arabicWords");
    const startQuizBtn = document.getElementById("startQuiz");
    const quizSection = document.getElementById("quiz-section");
    const setupSection = document.getElementById("setup-section");
    const resultSection = document.getElementById("result-section");
    const quizQuestion = document.getElementById("quiz-question");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswer = document.getElementById("submitAnswer");
    const quizFeedback = document.getElementById("quiz-feedback");
    const finalScore = document.getElementById("finalScore");
    const restartQuiz = document.getElementById("restartQuiz");

    let englishWords = [];
    let arabicWords = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentDirection;

    startQuizBtn.addEventListener("click", () => {
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        score = 0;
        currentQuestionIndex = 0;
        showNextQuestion();
    });

    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission or page reload

        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";
            quizFeedback.style.color = "green";
        } else {
            quizFeedback.textContent = `Incorrect! Corr
