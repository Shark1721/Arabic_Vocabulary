document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");
    const categorySearch = document.getElementById("categorySearch");
    const quizSection = document.getElementById("quiz-section");
    const mainMenu = document.getElementById("main-menu");
    const quizQuestion = document.getElementById("quiz-question");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswer = document.getElementById("submitAnswer");
    const quizFeedback = document.getElementById("quiz-feedback");
    const resultSection = document.getElementById("result-section");
    const finalScore = document.getElementById("finalScore");
    const restartQuiz = document.getElementById("restartQuiz");
    const addCategorySection = document.getElementById("add-category-section");
    const saveNewCategory = document.getElementById("saveNewCategory");

    let categories = {};
    let wordPairs = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let showAnswers = true;

    // Fetch categories from JSON
    fetch("words.json")
        .then(response => response.json())
        .then(data => {
            categories = data;
            populateCategoryOptions();
        })
        .catch(error => console.error("Error loading categories:", error));

    function populateCategoryOptions() {
        categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';
        for (const category in categories) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }

    categorySearch.addEventListener("input", () => {
        const searchText = categorySearch.value.toLowerCase();
        for (let option of categorySelect.options) {
            const isVisible = option.textContent.toLowerCase().includes(searchText);
            option.style.display = isVisible ? "block" : "none";
        }
    });

    document.getElementById("withAnswers").addEventListener("click", () => {
        showAnswers = true;
        startQuiz();
    });

    document.getElementById("withoutAnswers").addEventListener("click", () => {
        showAnswers = false;
        startQuiz();
    });

    function startQuiz() {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory) {
            alert("Please select a category.");
            return;
        }
        wordPairs = categories[selectedCategory];
        questions = wordPairs.flatMap(pair => [
            { question: pair.english, answer: pair.arabic },
            { question: pair.arabic, answer: pair.english }
        ]);
        questions = questions.sort(() => Math.random() - 0.5);
        score = 0;
        currentQuestionIndex = 0;
        mainMenu.classList.add("hidden");
        quizSection.classList.remove("hidden");
        showQuestion();
    }

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        quizQuestion.textContent = `Translate: ${currentQuestion.question}`;
        userAnswer.value = "";
        quizFeedback.textContent = "";
    }

    submitAnswer.addEventListener("click", () => {
        const currentQuestion = questions[currentQuestionIndex];
        const answer = userAnswer.value.trim();
        if (answer === currentQuestion.answer) {
            quizFeedback.textContent = "Correct!";
            score++;
        } else {
            quizFeedback.textContent = showAnswers ? `Incorrect! Correct answer: ${currentQuestion.answer}` : "Incorrect!";
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(showQuestion, 1000);
        } else {
            endQuiz();
        }
    });

    function endQuiz() {
        quizSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        finalScore.textContent = `Your score: ${score}/${questions.length}`;
    }

    restartQuiz.addEventListener("click", () => {
        resultSection.classList.add("hidden");
        mainMenu.classList.remove("hidden");
    });
});
