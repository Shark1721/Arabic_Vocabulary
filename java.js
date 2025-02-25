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

    const newCategoryName = document.getElementById("newCategoryName");
    const newWordsEnglish = document.getElementById("newWordsEnglish");
    const newWordsArabic = document.getElementById("newWordsArabic");
    const addCategoryButton = document.getElementById("addCategoryButton");

    const categorySearch = document.getElementById("categorySearch");

    let wordPairs = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let categories = {};

    // Load categories from JSON and local storage
    fetch("words.json")
        .then(response => response.json())
        .then(data => {
            categories = data;
            loadCustomCategories();
            populateCategoryOptions();
        })
        .catch(error => {
            console.error("Error loading categories:", error);
        });

    function loadCustomCategories() {
        const storedCategories = JSON.parse(localStorage.getItem("customCategories"));
        if (storedCategories) {
            categories = { ...categories, ...storedCategories };
        }
    }

    function saveCustomCategories() {
        localStorage.setItem("customCategories", JSON.stringify(categories));
    }

    function populateCategoryOptions() {
        categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>';
        for (const category in categories) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }

    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;
        wordPairs = categories[selectedCategory];
    });

    // Add new category
    addCategoryButton.addEventListener("click", () => {
        const categoryName = newCategoryName.value.trim();
        const englishWords = newWordsEnglish.value.trim().split("\n");
        const arabicWords = newWordsArabic.value.trim().split("\n");

        if (!categoryName || englishWords.length === 0 || arabicWords.length === 0) {
            alert("Please fill in all fields.");
            return;
        }

        if (englishWords.length !== arabicWords.length) {
            alert("Please ensure both columns have the same number of lines.");
            return;
        }

        const newPairs = englishWords.map((eng, i) => ({ english: eng, arabic: arabicWords[i] }));
        categories[categoryName] = newPairs;
        saveCustomCategories();
        populateCategoryOptions();
        newCategoryName.value = "";
        newWordsEnglish.value = "";
        newWordsArabic.value = "";
    });

    categorySearch.addEventListener("input", () => {
        const searchText = categorySearch.value.toLowerCase();
        for (let option of categorySelect.options) {
            const isVisible = option.textContent.toLowerCase().includes(searchText);
            option.style.display = isVisible ? "block" : "none";
        }
    });
});
