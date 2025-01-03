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
    const nextQuestionBtn = document.getElementById("nextQuestion");

    let englishWords = [];
    let arabicWords = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentDirection;
    let answers = [];

    // Start quiz button listener
    startQuizBtn.addEventListener("click", () => {
        // Grab input words and check length
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        // Hide setup section and show quiz section
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");

        // Reset quiz
        score = 0;
        currentQuestionIndex = 0;
        answers = [];
        showNextQuestion();
    });

    // Submit answer button listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent page reload

        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        // Feedback options
        quizFeedback.textContent = isCorrect ? "Correct!" : "Incorrect!";

        // If immediate feedback is selected, show the correct answer
        if (!isCorrect) {
            quizFeedback.textContent += ` Correct answer: ${(currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex]}`;
        }

        // Store the answer (whether correct or incorrect)
        answers.push({
            question: quizQuestion.textContent,
            correctAnswer: currentDirection === "en-ar" ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex],
            userAnswer: userInput,
            isCorrect
        });

        // Update the score if correct
        if (isCorrect) {
            score++;
        }

        // Show next button for immediate feedback
        nextQuestionBtn.classList.remove("hidden");
    });

    // Next Question button listener
    nextQuestionBtn.addEventListener("click", () => {
        currentQuestionIndex++;

        // Hide the next button and feedback message for now
        nextQuestionBtn.classList.add("hidden");
        quizFeedback.textContent = "";

        // Proceed to the next question or finish the quiz if the last question
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else {
            showNextQuestion();
        }
    });

    // Restart quiz button listener
    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
        englishInput.value = "";
        arabicInput.value = "";
    });

    function showNextQuestion() {
        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en"; // Random direction (English to Arabic or vice versa)
        quizQuestion.textContent = currentDirection === "en-ar"
            ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
            : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
        userAnswer.value = "";
        quizFeedback.textContent = ""; // Clear feedback from previous question
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `${score} / ${englishWords.length}`;
    }
});
