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
    const feedbackOption = document.getElementById("feedbackOption");
    const correctAnswersList = document.getElementById("correctAnswersList");

    let englishWords = [];
    let arabicWords = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let feedbackMode = "";
    let correctAnswers = [];
    let currentDirection = "";

    function resetQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = [];
        quizFeedback.textContent = "";
        finalScore.textContent = "";
        correctAnswersList.innerHTML = "";
        userAnswer.value = "";
    }

    function showNextQuestion() {
        quizFeedback.textContent = "";
        userAnswer.value = "";
        submitAnswer.textContent = feedbackMode === "immediate" ? "Next" : "Submit";

        // Randomly determine the question direction
        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en";
        quizQuestion.textContent =
            currentDirection === "en-ar"
                ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
                : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
    }

    function handleAnswerSubmit() {
        const userInput = userAnswer.value.trim();
        const correctAnswer =
            currentDirection === "en-ar"
                ? arabicWords[currentQuestionIndex]
                : englishWords[currentQuestionIndex];
        const isCorrect = userInput === correctAnswer;

        // Update score and feedback
        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";
        } else {
            quizFeedback.textContent = "Wrong!";
            if (feedbackMode === "immediate") {
                quizFeedback.textContent += ` Correct answer: ${correctAnswer}`;
            }
        }

        // Record incorrect answers if needed
        if (feedbackMode === "end" || feedbackMode === "no-feedback") {
            correctAnswers.push({
                question: quizQuestion.textContent,
                correctAnswer: feedbackMode === "end" ? correctAnswer : null,
            });
        }

        // Handle progression
        currentQuestionIndex++;
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else if (feedbackMode === "immediate" && !isCorrect) {
            submitAnswer.textContent = "Next";
            submitAnswer.onclick = showNextQuestion;
        } else {
            showNextQuestion();
        }
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");

        finalScore.textContent = `${score} / ${englishWords.length}`;

        if (feedbackMode === "end") {
            correctAnswersList.innerHTML = correctAnswers
                .map(
                    (item) =>
                        `<li>${item.question}: Correct Answer - ${item.correctAnswer}</li>`
                )
                .join("");
        } else if (feedbackMode === "no-feedback") {
            correctAnswersList.innerHTML = ""; // No feedback required
        }
    }

    startQuizBtn.addEventListener("click", () => {
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length || englishWords.length === 0) {
            alert("Both English and Arabic word lists must have the same non-zero length!");
            return;
        }

        feedbackMode = feedbackOption.value;
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        resetQuiz();
        showNextQuestion();
    });

    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
        resetQuiz();
    });

    submitAnswer.addEventListener("click", handleAnswerSubmit);
});
