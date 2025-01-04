document.addEventListener("DOMContentLoaded", () => {
    const wordsInput = document.getElementById("wordsInput");
    const feedbackOption1 = document.getElementById("feedbackOption1");
    const feedbackOption2 = document.getElementById("feedbackOption2");
    const quizSection = document.getElementById("quiz-section");
    const setupSection = document.getElementById("setup-section");
    const resultSection = document.getElementById("result-section");
    const quizQuestion = document.getElementById("quiz-question");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswer = document.getElementById("submitAnswer");
    const quizFeedback = document.getElementById("quiz-feedback");
    const nextQuestionBtn = document.getElementById("nextQuestion");
    const finalScore = document.getElementById("finalScore");
    const restartQuiz = document.getElementById("restartQuiz");

    let wordPairs = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Start Quiz Button (Feedback Option 1)
    feedbackOption1.addEventListener("click", () => {
        startQuiz();
    });

    // Start Quiz Button (Feedback Option 2)
    feedbackOption2.addEventListener("click", () => {
        startQuiz();
    });

    function startQuiz() {
        const inputText = wordsInput.value.trim();
        if (!inputText) {
            alert("Please enter word pairs.");
            return;
        }

        // Parse word pairs
        wordPairs = inputText.split("\n").map(line => {
            const [english, arabic] = line.split(",").map(word => word.trim());
            if (!english || !arabic) {
                alert("Invalid format. Ensure each line has an English and Arabic word separated by a comma.");
                throw new Error("Invalid input format.");
            }
            return { english, arabic };
        });

        // Generate questions randomly
        questions = [];
        wordPairs.forEach(pair => {
            questions.push({ question: `Translate to Arabic: ${pair.english}`, correctAnswer: pair.arabic });
            questions.push({ question: `Translate to English: ${pair.arabic}`, correctAnswer: pair.english });
        });
        questions = shuffleArray(questions);

        // Start quiz
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");
        resultSection.classList.add("hidden");
        currentQuestionIndex = 0;
        score = 0;
        showNextQuestion();
    }

    // Submit Answer Button
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault();
        const userInput = userAnswer.value.trim();
        const currentQuestion = questions[currentQuestionIndex];

        const isCorrect = userInput === currentQuestion.correctAnswer;
        quizFeedback.textContent = isCorrect ? "Correct!" : `Incorrect! Correct answer: ${currentQuestion.correctAnswer}`;
        if (isCorrect) score++;

        // Show Next button
        nextQuestionBtn.classList.remove("hidden");
    });

    // Next Question Button
    nextQuestionBtn.addEventListener("click", () => {
        currentQuestionIndex++;

        // Hide the next button and feedback message for now
        nextQuestionBtn.classList.add("hidden");
        quizFeedback.textContent = "";

        // Proceed to the next question or finish the quiz
        if (currentQuestionIndex >= questions.length) {
            finishQuiz();
        } else {
            showNextQuestion();
        }
    });

    // Restart Quiz Button
    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
        wordsInput.value = "";
    });

    function showNextQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        quizQuestion.textContent = currentQuestion.question;
        userAnswer.value = "";
        quizFeedback.textContent = "";
        nextQuestionBtn.classList.add("hidden");
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `Your Score: ${score} / ${questions.length}`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
