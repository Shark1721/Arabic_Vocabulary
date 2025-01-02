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
    let incorrectAnswers = [];
    let feedbackMode = "immediate";

    startQuizBtn.addEventListener("click", () => {
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");
        feedbackMode = feedbackModeSelect.value;

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        score = 0;
        currentQuestionIndex = 0;
        incorrectAnswers = [];
        showNextQuestion();
    });

    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault();

        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        if (isCorrect) {
            score++;
            if (feedbackMode === "immediate") {
                quizFeedback.textContent = "Correct!";
            }
        } else {
            if (feedbackMode === "immediate") {
                quizFeedback.textContent = `Incorrect! Correct answer: ${(currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex]}`;
            }
            incorrectAnswers.push({
                question: quizQuestion.textContent,
                correctAnswer: (currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex],
            });
        }

        currentQuestionIndex++;
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else {
            showNextQuestion();
        }
    });

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

        if (feedbackMode === "end") {
            incorrectAnswersList.innerHTML = incorrectAnswers
                .map(item => `<li>${item.question} - Correct Answer: ${item.correctAnswer}</li>`)
                .join("");
        } else {
            incorrectAnswersList.innerHTML = "";
        }
    }
});
