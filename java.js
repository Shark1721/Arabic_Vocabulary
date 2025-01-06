document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");
    const quizSection = document.getElementById("quiz-section");
    const setupSection = document.getElementById("setup-section");
    const quizQuestion = document.getElementById("quiz-question");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswer = document.getElementById("submitAnswer");
    const quizFeedback = document.getElementById("quiz-feedback");
    const nextQuestionBtn = document.getElementById("nextQuestion");
    const finalScore = document.getElementById("finalScore");
    const resultSection = document.getElementById("result-section");

    let wordPairs = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Load categories from JSON
    fetch("words.json")
        .then(response => response.json())
        .then(data => {
            populateCategoryOptions(data);
        })
        .catch(error => {
            console.error("Error loading categories:", error);
            alert("Failed to load categories. Please try again.");
        });

    function populateCategoryOptions(data) {
        for (const category in data) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }

    // Handle category selection
    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;

        if (!selectedCategory) {
            alert("Please select a valid category.");
            return;
        }

        // Fetch word pairs for the selected category
        fetch("categories.json")
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

    function startQuiz() {
        // Prepare quiz questions
        questions = [];
        wordPairs.forEach(pair => {
            questions.push({ question: `Translate to Arabic: ${pair.english}`, correctAnswer: pair.arabic });
            questions.push({ question: `Translate to English: ${pair.arabic}`, correctAnswer: pair.english });
        });
        questions = shuffleArray(questions);

        // Show quiz section
        setupSection.classList.add("hidden");
        quizSection.classList.remove("hidden");
        resultSection.classList.add("hidden");
        currentQuestionIndex = 0;
        score = 0;
        showNextQuestion();
    }

    function showNextQuestion() {
        if (currentQuestionIndex >= questions.length) {
            finishQuiz();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        quizQuestion.textContent = currentQuestion.question;
        userAnswer.value = "";
        quizFeedback.textContent = "";
        nextQuestionBtn.classList.add("hidden");
    }

    submitAnswer.addEventListener("click", () => {
        const currentQuestion = questions[currentQuestionIndex];
        const answer = userAnswer.value.trim();

        if (answer === currentQuestion.correctAnswer) {
            quizFeedback.textContent = "Correct!";
            quizFeedback.style.color = "green";
            score++;
        } else {
            quizFeedback.textContent = `Incorrect! The correct answer is: ${currentQuestion.correctAnswer}`;
            quizFeedback.style.color = "red";
        }

        currentQuestionIndex++;
        nextQuestionBtn.classList.remove("hidden");
    });

    nextQuestionBtn.addEventListener("click", () => {
        showNextQuestion();
    });

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
