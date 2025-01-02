document.addEventListener("DOMContentLoaded", () => {
    const englishInput = document.getElementById("englishWords");
    const arabicInput = document.getElementById("arabicWords");
    const feedbackOption = document.getElementById("feedbackOption");
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
    let feedbackList = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentDirection;
    let feedbackMode;

    // Start quiz button listener
    startQuizBtn.addEventListener("click", () => {
        console.log('Start quiz button clicked'); // Debugging log

        // Grab input words and check length
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");
        feedbackMode = feedbackOption.value;

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
        feedbackList = [];
        showNextQuestion();
    });

    // Submit answer button listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent page reload
        console.log('Submit answer button clicked'); // Debugging log

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
            const correctAnswer = (currentDirection === "en-ar") 
                ? arabicWords[currentQuestionIndex] 
                : englishWords[currentQuestionIndex];
            
            if (feedbackMode === "immediate") {
                quizFeedback.textContent = `Incorrect! Correct answer: ${correctAnswer}`;
            }
            feedbackList.push({
                question: quizQuestion.textContent,
                userAnswer: userInput,
                correctAnswer: correctAnswer
            });
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
        console.log('Restart quiz button clicked'); // Debugging log
    });

    function showNextQuestion() {
        quizFeedback.textContent = ""; // Clear previous feedback
        currentDirection = Math.random() < 0.5 ? "en-ar" : "ar-en"; // Random direction (English to Arabic or vice versa)
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
            feedbackList.forEach(feedback => {
                const feedbackItem = document.createElement("p");
                feedbackItem.textContent = `${feedback.question} Your answer: ${feedback.userAnswer}, Correct answer: ${feedback.correctAnswer}`;
                resultSection.appendChild(feedbackItem);
            });
        }
    }
});
