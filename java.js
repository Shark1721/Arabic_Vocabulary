document.addEventListener("DOMContentLoaded", () => {
    const englishInput = document.getElementById("englishWords");
    const arabicInput = document.getElementById("arabicWords");
    const feedbackModeSelect = document.getElementById("feedbackMode");
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
    const incorrectAnswersList = document.getElementById("incorrect-answers");

    let englishWords = [];
    let arabicWords = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentDirection;
    let feedbackMode = "immediate";
    let incorrectAnswers = [];

    // Start quiz button listener
    startQuizBtn.addEventListener("click", () => {
        feedbackMode = feedbackModeSelect.value; // Set feedback mode
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        // Hide setup and show quiz
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        score = 0;
        currentQuestionIndex = 0;
        incorrectAnswers = [];
        showNextQuestion();
    });

    // Submit answer listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault();
        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        if (feedbackMode === "immediate") {
            quizFeedback.textContent = isCorrect
                ? "Correct!"
                : `Incorrect! Correct answer: ${(currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex]}`;
        }

        if (!isCorrect && feedbackMode === "end") {
            incorrectAnswers.push({
                question: currentDirection === "en-ar" 
                    ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}` 
                    : `Translate to English: ${arabicWords[currentQuestionIndex]}`,
                correctAnswer: (currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex],
            });
        }

        if (isCorrect) {
            score++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else {
            showNextQuestion();
        }
    });

    // Restart button listener
    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
        englishInput.value = "";
        arabicInput.value = "";
    });

    function showNextQuestion() {
        quizFeedback.textContent = "";
        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en";
        quizQuestion.textContent = currentDirection === "en-ar"
            ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
            : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
        userAnswer.value = "";
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `${score} / ${englishWords.length}`;
        incorrectAnswersList.innerHTML = "";

        if (feedbackMode === "end" && incorrectAnswers.length > 0) {
            incorrectAnswers.forEach(({ question, correctAnswer }) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${question} - Correct answer: ${correctAnswer}`;
                incorrectAnswersList.appendChild(listItem);
            });
        }
    }
});
