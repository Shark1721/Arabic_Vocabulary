document.addEventListener("DOMContentLoaded", () => {
    const wordsInput = document.getElementById("wordsInput");
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

    let wordPairs = [];
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
        // Grab input and process word pairs
        const lines = wordsInput.value.trim().split("\n");
        wordPairs = lines.map(line => {
            const [english, arabic] = line.split(",").map(word => word.trim());
            if (!english || !arabic) {
                throw new Error("Each line must contain exactly one English and one Arabic word, separated by a comma.");
            }
            return { english, arabic };
        });

        // Generate randomized question order
        questionOrder = [];
        wordPairs.forEach((_, index) => {
            questionOrder.push({ index, direction: "en-ar" }); // English to Arabic
            questionOrder.push({ index, direction: "ar-en" }); // Arabic to English
        });
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
            correctAnswer = wordPairs[index].arabic;
            isCorrect = userInput === correctAnswer;
        } else if (direction === "ar-en") {
            correctAnswer = wordPairs[index].english;
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
        wordsInput.value = "";
    });

    function showNextQuestion() {
        const { index, direction } = questionOrder[currentQuestionIndex];

        quizQuestion.textContent = direction === "en-ar"
            ? `Translate to Arabic: ${wordPairs[index].english}`
            : `Translate to English: ${wordPairs[index].arabic}`;
        
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
