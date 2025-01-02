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
    const feedbackMode = document.getElementById("feedbackMode"); // Feedback mode dropdown

    let englishWords = [];
    let arabicWords = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentDirection;
    let feedbackOption = "immediate"; // Default feedback option
    let userAnswers = []; // Store answers for feedback at the end
    let correctAnswers = [];

    // Start quiz button listener
    startQuizBtn.addEventListener("click", () => {
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        feedbackOption = feedbackMode.value; // Get selected feedback option
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");
        score = 0;
        currentQuestionIndex = 0;
        userAnswers = [];
        correctAnswers = [];
        showNextQuestion();
    });

    // Submit answer button listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault();

        const userInput = userAnswer.value.trim();
        const correctAnswer = (currentDirection === "en-ar")
            ? arabicWords[currentQuestionIndex]
            : englishWords[currentQuestionIndex];

        const isCorrect = userInput === correctAnswer;

        if (feedbackOption === "immediate") {
            // Immediate feedback
            if (isCorrect) {
                quizFeedback.textContent = "Correct!";
                score++;
            } else {
                quizFeedback.textContent = `Incorrect! Correct answer: ${correctAnswer}`;
            }
            // Wait for user to click submit to go to the next question
        } else {
            // Store the user answer and correctness for the end feedback
            userAnswers.push({ userInput, isCorrect, correctAnswer });
            if (isCorrect) {
                score++;
            }
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
        quizFeedback.textContent = ""; // Clear previous feedback

        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en";
        quizQuestion.textContent = currentDirection === "en-ar"
            ? `Translate to Arabic: ${englishWords[currentQuestionIndex]}`
            : `Translate to English: ${arabicWords[currentQuestionIndex]}`;
        userAnswer.value = "";
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");

        // Show final score
        finalScore.textContent = `${score} / ${englishWords.length}`;

        // Handle different feedback modes
        if (feedbackOption === "end") {
            // Show incorrect answers at the end, with the correct answers
            let incorrectAnswersList = userAnswers
                .filter(answer => !answer.isCorrect)
                .map(answer => `Question: ${quizQuestion.textContent} - Your answer: ${answer.userInput} - Correct answer: ${answer.correctAnswer}`)
                .join("\n");
            quizFeedback.textContent = incorrectAnswersList;
        } else if (feedbackOption === "none") {
            // Show no feedback at the end
            quizFeedback.textContent = "No feedback shown.";
        }
    }
});
