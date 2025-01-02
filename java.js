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
        showNextQuestion();
    });

    // Submit answer button listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault();  // Prevent page reload

        const userInput = userAnswer.value.trim();
        const isCorrect = (currentDirection === "en-ar")
            ? userInput === arabicWords[currentQuestionIndex]
            : userInput === englishWords[currentQuestionIndex];

        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";  // Correct answer feedback
            quizFeedback.style.color = "green";  // Optional: color green for correct
        } else {
            quizFeedback.textContent = `Incorrect! The correct answer is: ${(currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex]}`;
            quizFeedback.style.color = "red";  // Optional: color red for incorrect
        }

        currentQuestionIndex++;
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
        quizFeedback.textContent = "";  // Clear previous feedback
        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en";
        quizQuestion.textContent = currentDirection === "en-ar"
            ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
            : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
        userAnswer.value = "";  // Clear the input field for next question
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `${score} / ${englishWords.length}`;  // Display score
    }
});
