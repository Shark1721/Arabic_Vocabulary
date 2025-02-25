let categoriesData = {};
const categoryDropdown = document.getElementById("categoryDropdown");
const startQuizButton = document.getElementById("startQuiz");
const quizContainer = document.getElementById("quizContainer");
const quizQuestion = document.getElementById("quizQuestion");
const answerInput = document.getElementById("answerInput");
const submitAnswerButton = document.getElementById("submitAnswer");
const quizFeedback = document.getElementById("quizFeedback");
const addNewCategoryButton = document.getElementById("addNewCategory");
const newCategoryForm = document.getElementById("newCategoryForm");
const newCategoryName = document.getElementById("newCategoryName");
const englishWordsInput = document.getElementById("englishWordsInput");
const arabicWordsInput = document.getElementById("arabicWordsInput");
const saveNewCategory = document.getElementById("saveNewCategory");
const cancelNewCategory = document.getElementById("cancelNewCategory");
const clearCustomCategories = document.getElementById("clearCustomCategories");
const categorySearch = document.getElementById('categorySearch');

let currentQuizWords = [];
let currentIndex = 0;

// Load Categories from Local Storage and words.json
function loadCategories() {
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            categoriesData = data;
            const savedCategories = JSON.parse(localStorage.getItem('customCategories')) || {};
            categoriesData = { ...categoriesData, ...savedCategories };
            populateCategoryOptions();
        })
        .catch(error => console.error('Error loading categories:', error));
}

// Populate Categories Dropdown
function populateCategoryOptions() {
    categoryDropdown.innerHTML = '';
    for (const category in categoriesData) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    }
}

// Start Quiz
startQuizButton.addEventListener("click", () => {
    const selectedCategory = categoryDropdown.value;
    if (!selectedCategory) {
        alert("Please select a category first.");
        return;
    }
    currentQuizWords = categoriesData[selectedCategory];
    currentIndex = 0;
    quizContainer.classList.remove("hidden");
    showNextQuestion();
});

// Show Next Question
function showNextQuestion() {
    if (currentIndex >= currentQuizWords.length) {
        quizFeedback.textContent = "Quiz Completed!";
        return;
    }
    quizQuestion.textContent = currentQuizWords[currentIndex].english;
    answerInput.value = '';
    quizFeedback.textContent = '';
}

// Submit Answer
submitAnswerButton.addEventListener("click", () => {
    const userAnswer = answerInput.value.trim();
    const correctAnswer = currentQuizWords[currentIndex].arabic;
    if (userAnswer === correctAnswer) {
        quizFeedback.textContent = "Correct!";
    } else {
        quizFeedback.textContent = `Wrong! Correct answer: ${correctAnswer}`;
    }
    currentIndex++;
    setTimeout(showNextQuestion, 1000);
});

// Add New Category
addNewCategoryButton.addEventListener("click", () => {
    newCategoryForm.classList.remove("hidden");
});

saveNewCategory.addEventListener("click", () => {
    const categoryName = newCategoryName.value.trim();
    const englishWords = englishWordsInput.value.trim().split("\n");
    const arabicWords = arabicWordsInput.value.trim().split("\n");

    if (englishWords.length !== arabicWords.length) {
        alert("Each English word must have a matching Arabic word.");
        return;
    }

    const newWordPairs = englishWords.map((word, index) => ({
        english: word,
        arabic: arabicWords[index]
    }));

    let savedCategories = JSON.parse(localStorage.getItem('customCategories')) || {};
    savedCategories[categoryName] = newWordPairs;
    localStorage.setItem('customCategories', JSON.stringify(savedCategories));

    alert('New category added!');
    loadCategories();
    newCategoryForm.classList.add("hidden");
});

// Clear Custom Categories
clearCustomCategories.addEventListener("click", () => {
    localStorage.removeItem('customCategories');
    alert('Custom categories cleared.');
    loadCategories();
});

// Search Categories
categorySearch.addEventListener('input', () => {
    const searchText = categorySearch.value.toLowerCase();
    const options = categoryDropdown.options;
    for (let i = 0; i < options.length; i++) {
        const optionText = options[i].text.toLowerCase();
        options[i].style.display = optionText.includes(searchText) ? 'block' : 'none';
    }
});

loadCategories();
