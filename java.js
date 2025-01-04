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
    const nextQuestionBtn = document.getElementById("nextQuestion");

    let englishWords = [];
    let arabicWords = [];
    let score = 0;
    let answers = [];
    let questionOrder = [];
    let currentQuestionIndex = 0;

    // Utility to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Start quiz button listener
    startQuizBtn.addEventListener("click", () => {
        // Grab input words and check length
        englishWords = englishInput.value.trim().split("\n");
        arabicWords = arabicInput.value.trim().split("\n");

        if (englishWords.length !== arabicWords.length) {
            alert("English and Arabic word lists must have the same length!");
            return;
        }

        // Generate randomized question order
        questionOrder = [];
        for (let i = 0; i < englishWords.length; i++) {
            questionOrder.push({ index: i, direction: "en-ar" }); // English to Arabic
            questionOrder.push({ index: i, direction: "ar-en" }); // Arabic to English
        }
        questionOrder = shuffleArray(questionOrder); // Shuffle the questions

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
        const { index, direction } = questionOrder[currentQuestionIndex];
        let isCorrect = false;
        let correctAnswer = "";

        if (direction === "en-ar") {
            correctAnswer = arabicWords[index];
            isCorrect = userInput === correctAnswer;
        } else if (direction === "ar-en") {
            correctAnswer = englishWords[index];
            isCorrect = userInput === correctAnswer;
        }

        // Feedback
        quizFeedback.textContent = isCorrect ? "Correct!" : "Incorrect!";
        if (!isCorrect) {
            quizFeedback.textContent += ` Correct answer: ${correctAnswer}`;
        }

        // Store the answer (whether correct or incorrect)
        answers.push({
            question: quizQuestion.textContent,
            correctAnswer: correctAnswer,
            userAnswer: userInput,
            isCorrect
        });

        // Update the score if correct
        if (isCorrect) {
            score++;
        }

        // Show next button
        nextQuestionBtn.classList.remove("hidden");
    });

    // Next Question button listener
    nextQuestionBtn.addEventListener("click", () => {
        currentQuestionIndex++;

        // Hide the next button and feedback message for now
        nextQuestionBtn.classList.add("hidden");
        quizFeedback.textContent = "";

        // Proceed to the next question or finish the quiz if the last question
        if (currentQuestionIndex >= questionOrder.length) {
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
        const { index, direction } = questionOrder[currentQuestionIndex];

        quizQuestion.textContent = direction === "en-ar"
            ? `Translate to Arabic: ${englishWords[index]}`
            : `Translate to English: ${arabicWords[index]}`;
        
        userAnswer.value = "";
        quizFeedback.textContent = ""; // Clear feedback from previous question
    }

    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `${score} / ${questionOrder.length}`;

        // Display corrected answers
        answers.forEach(answer => {
            const li = document.createElement("li");
            li.textContent = `Question: ${answer.question} - Your answer: ${answer.userAnswer} - Correct answer: ${answer.correctAnswer}`;
            correctAnswersList.appendChild(li);
        });
    }
});
