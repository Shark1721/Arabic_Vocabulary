document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");
    const wordsInput = document.getElementById("wordsInput");
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

    const correctResponses = ["Well done!", "Great job!", "You're amazing!"];
    const incorrectResponses = ["Oops! Try again.", "Better luck next time!", "Not quite right."];

    // Load categories from JSON
    fetch("words.json")
        .then(response => response.json())
        .then(data => {
            for (const category in data) {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error("Error loading categories:", error);
            alert("Failed to load categories. Please try again.");
        });

    // Handle category selection
    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;

        if (!selectedCategory) return;

        // Fetch word pairs for the selected category
        fetch("words.json")
            .then(response => response.json())
            .then(data => {
                wordPairs = data[selectedCategory];
                if (!wordPairs || wordPairs.length === 0) {
                    alert("No words available for this category.");
                    return;
                }
                startQuiz();
            })
            .catch(error => {
                console.error("Error loading word pairs:", error);
                alert("Failed to load words. Please try again.");
            });
    });

    // Start Quiz
    function startQuiz() {
        // Generate questions randomly
        questions = [];
        wordPairs.forEach(pair => {
            questions.push({ question: `Translate to Arabic: ${pair.english}`, correctAnswer: pair.arabic });
            questions.push({ question: `Translate to English: ${pair.arabic}`, correctAnswer: pair.english });
        });
        questions = shuffleArray(questions);

        // Initialize quiz
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");
        resultSection.classList.add("hidden");
        currentQuestionIndex = 0;
        score = 0;
        showNextQuestion();
    }

    // Show Next Question
    function showNextQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        quizQuestion.textContent = currentQuestion.question;
        userAnswer.value = "";
        quizFeedback.textContent = "";
        nextQuestionBtn.classList.add("hidden");
    }

    // Handle Answer Submission
    submitAnswer.addEventListener("click", () => {
        const currentQuestion = questions[currentQuestionIndex];
        const userResponse = userAnswer.value.trim();
        if (!userResponse) {
            alert("Please enter an answer.");
            return;
        }

        if (userResponse.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
            score++;
            quizFeedback.textContent = getRandomResponse(correctResponses);
            quizFeedback.style.color = "green";
        } else {
            quizFeedback.textContent = `${getRandomResponse(incorrectResponses)} Correct answer: ${currentQuestion.correctAnswer}`;
            quizFeedback.style.color = "red";
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            nextQuestionBtn.classList.remove("hidden");
        } else {
            finishQuiz();
        }
    });

    // Show Next Question on Button Click
    nextQuestionBtn.addEventListener("click", showNextQuestion);

    // Restart Quiz
    restartQuiz.addEventListener("click", () => {
        setupSection.classList.remove("hidden");
        quizSection.classList.add("hidden");
        resultSection.classList.add("hidden");
    });

    // Finish Quiz
    function finishQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `Your Score: ${score} / ${questions.length}`;
    }

    // Utility Functions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
});
