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

    // Reset quiz state
    function resetQuiz() {
        englishWords = [];
        arabicWords = [];
        currentQuestionIndex = 0;
        score = 0;
        feedbackMode = "";
        correctAnswers = [];
        currentDirection = "";
        quizFeedback.textContent = "";
        finalScore.textContent = "";
        correctAnswersList.innerHTML = "";
        userAnswer.value = "";
    }

    // Show the next question
    function showNextQuestion() {
        quizFeedback.textContent = "";
        submitAnswer.textContent = "Submit";
        submitAnswer.disabled = false;

        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en";
        quizQuestion.textContent =
            currentDirection === "en-ar"
                ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
                : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
        userAnswer.value = "";
    }

    // Finish the quiz
    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");

        finalScore.textContent = `${score} / ${englishWords.length}`;

        if (feedbackMode === "end") {
            const feedbackHTML = correctAnswers
                .map(
                    (item) =>
                        `<li>${item.question}: Correct Answer - ${item.correctAnswer}</li>`
                )
                .join("");
            correctAnswersList.innerHTML = feedbackHTML;
        }
    }

    // Handle the answer submission
    function handleAnswerSubmit() {
        const userInput = userAnswer.value.trim();
        const correctAnswer =
            currentDirection === "en-ar"
                ? arabicWords[currentQuestionIndex]
                : englishWords[currentQuestionIndex];
        const isCorrect = userInput === correctAnswer;

        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";
        } else {
            quizFeedback.textContent = "Wrong!";
            if (feedbackMode === "immediate") {
                quizFeedback.textContent += ` Correct answer: ${correctAnswer}`;
            }
        }

        if (feedbackMode === "end" || feedbackMode === "no-feedback") {
            correctAnswers.push({
                question: quizQuestion.textContent,
                correctAnswer: feedbackMode === "end" ? correctAnswer : null,
            });
        }

        // Move to the next question or finish
        currentQuestionIndex++;
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else if (feedbackMode === "immediate") {
            submitAnswer.textContent = "Next";
            submitAnswer.onclick = showNextQuestion;
        } else {
            showNextQuestion();
        }
    }

    // Start the quiz
    startQuizBtn.addEventListener("click", () => {
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length || englishWords.length === 0) {
            alert("English and Arabic word lists must have the same non-zero length!");
            return;
        }

        feedbackMode = feedbackOption.value;
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        resetQuiz();
        showNextQuestion();
    });

    // Restart the quiz
    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
        resetQuiz();
    });

    // Attach the submit answer handler
    submitAnswer.addEventListener("click", handleAnswerSubmit);
});
