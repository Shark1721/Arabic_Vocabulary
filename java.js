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
    const correctAnswersList = document.getElementById("correctAnswersList");
    const restartQuiz = document.getElementById("restartQuiz");
    const nextQuestionBtn = document.getElementById("nextQuestion");
    const feedbackOption = document.getElementById("feedbackOption");

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
        
        // Show feedback
        quizFeedback.textContent = isCorrect ? "Correct!" : "Incorrect!";
        
        // Store the answer (whether correct or incorrect)
        answers.push({
            question: quizQuestion.textContent,
            correctAnswer: currentDirection === "en-ar" ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex],
            userAnswer: userInput,
            isCorrect
        });

        // If feedback option is "immediate", show the correct answer if incorrect
        if (feedbackOption.value === "immediate" && !isCorrect) {
            quizFeedback.textContent += ` Correct answer: ${(currentDirection === "en-ar") ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex]}`;
            nextQuestionBtn.classList.remove("hidden"); // Show next button
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex >= englishWords.length) {
                finishQuiz();
            } else {
                showNextQuestion();
            }
        }
    });

    // Next Question button listener (only visible for "immediate feedback")
    nextQuestionBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex >= englishWords.length) {
            finishQuiz();
        } else {
            showNextQuestion();
            nextQuestionBtn.classList.add("hidden"); // Hide "Next" button
            quizFeedback.textContent = ""; // Clear previous feedback
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

        if (feedbackOption.value === "end") {
            // Show list of corrected answers for Option 2 (Feedback at the end)
            correctAnswersList.innerHTML = "";
            answers.forEach(answer => {
                const li = document.createElement("li");
                li.textContent = `${answer.question} - Your answer: ${answer.userAnswer} - Correct answer: ${answer.correctAnswer}`;
                correctAnswersList.appendChild(li);
            });
        } else if (feedbackOption.value === "none") {
            // Do nothing for feedback
        } else if (feedbackOption.value === "immediate") {
            // Show nothing extra for feedback option 1
        }
    }
});
