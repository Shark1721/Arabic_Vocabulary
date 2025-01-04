document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");
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
    let selectedFeedbackOption = 1;
    let categories = {};

    // Fetch categories from the JSON file
    fetch("words.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load word categories");
            }
            return response.json();
        })
        .then(data => {
            categories = data;

            // Populate category dropdown
            Object.keys(categories).forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error(error));

    // Event listeners for starting the quiz
    feedbackOption1.addEventListener("click", () => {
        selectedFeedbackOption = 1;
        startQuiz();
    });

    feedbackOption2.addEventListener("click", () => {
        selectedFeedbackOption = 2;
        startQuiz();
    });

    function startQuiz() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory || !categories[selectedCategory]) {
            alert("Please select a valid category.");
            return;
        }

        // Load word pairs for the selected category
        wordPairs = categories[selectedCategory];

        // Generate questions randomly
        questions = [];
        wordPairs.forEach(pair => {
            questions.push({ question: `Translate: ${pair.english}`, correctAnswer: pair.arabic });
            questions.push({ question: `Translate: ${pair.arabic}`, correctAnswer: pair.english });
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

    // Submit answer button listener
    submitAnswer.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        const userInput = userAnswer.value.trim();
        if (!userInput) {
            alert("Please provide an answer.");
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];

        if (selectedFeedbackOption === 1) {
            const isCorrect = userInput === currentQuestion.correctAnswer;
            quizFeedback.textContent = isCorrect ? "Awesome!" : `Not awesome! Correct answer: ${currentQuestion.correctAnswer}`;
            if (isCorrect) score++;
        } else if (selectedFeedbackOption === 2) {
            const isCorrect = userInput.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
            quizFeedback.textContent = isCorrect ? "Awesomesauce!" : "Evilsauce.";
            if (isCorrect) score++;
        }

        nextQuestionBtn.classList.remove("hidden");
        submitAnswer.disabled = true; // Disable submit button until the next question
    });

    // Next Question button listener
    nextQuestionBtn.addEventListener("click", () => {
        currentQuestionIndex++;

        // Reset for the next question
        nextQuestionBtn.classList.add("hidden");
        quizFeedback.textContent = "";
        submitAnswer.disabled = false;

        if (currentQuestionIndex >= questions.length) {
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
        categorySelect.value = ""; // Reset category selection
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
