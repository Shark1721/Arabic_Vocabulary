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

    let englishWords = [];
    let arabicWords = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentDirection;
    let correctAnswers = [];
    let feedbackMode;

    // Start quiz button listener
    startQuizBtn.addEventListener("click", () => {
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        feedbackMode = feedbackOption.value;

        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        score = 0;
        currentQuestionIndex = 0;
        correctAnswers = [];
        showNextQuestion();
    });

    // Submit answer button listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault();

        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";
        } else {
            quizFeedback.textContent = "Incorrect!";
        }

        if (feedbackMode === "immediate") {
            const correctAnswer = currentDirection === "en-ar"
                ? arabicWords[currentQuestionIndex]
                : englishWords[currentQuestionIndex];
            quizFeedback.textContent += ` Correct answer: ${correctAnswer}`;
        }

        // Add correct answers for end feedback if needed
        if (!isCorrect || feedbackMode === "end") {
            const correctAnswer = currentDirection === "en-ar"
                ? arabicWords[currentQuestionIndex]
                : englishWords[currentQuestionIndex];
            correctAnswers.push({
                question: quizQuestion.textContent,
                correctAnswer,
            });
        }

        // Handle modes
        if (feedbackMode === "immediate") {
            submitAnswer.textContent = "Next";
            submitAnswer.onclick = () => {
                currentQuestionIndex++;
                handleNextQuestion();
            };
        } else {
            currentQuestionIndex++;
            handleNextQuestion();
        }
    });

    // Restart quiz button listener
    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
        englishInput.value = "";
        arabicInput.value = "";
        quizFeedback.textContent = ""; // Clear any lingering feedback
    });

    function showNextQuestion() {
        quizFeedback.textContent = "";
        submitAnswer.textContent = "Submit";
        submitAnswer.onclick = (event) => {
            event.preventDefault();
            handleAnswerSubmit();
        };

        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en";
        quizQuestion.textContent = currentDirection === "en-ar"
            ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
            : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
        userAnswer.value = "";
    }

    function handleNextQuestion() {
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else {
            showNextQuestion();
        }
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `${score} / ${englishWords.length}`;

        if (feedbackMode === "end") {
            const feedbackList = correctAnswers
                .map((item) => `<li>Question: ${item.question}, Correct Answer: ${item.correctAnswer}</li>`)
                .join("");
            document.getElementById("correctAnswersList").innerHTML = feedbackList;
        } else {
            document.getElementById("correctAnswersList").innerHTML = "";
        }
    }

    function handleAnswerSubmit() {
        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";
        } else {
            quizFeedback.textContent = "Incorrect!";
        }

        if (feedbackMode === "immediate") {
            const correctAnswer = currentDirection === "en-ar"
                ? arabicWords[currentQuestionIndex]
                : englishWords[currentQuestionIndex];
            quizFeedback.textContent += ` Correct answer: ${correctAnswer}`;
        }

        currentQuestionIndex++;
        handleNextQuestion();
    }
});
