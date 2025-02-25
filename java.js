document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const newCategoryForm = document.getElementById("newCategoryForm");
    const newCategoryName = document.getElementById("newCategoryName");
    const englishWordsInput = document.getElementById("englishWordsInput");
    const arabicWordsInput = document.getElementById("arabicWordsInput");
    const categorySearch = document.getElementById("categorySearch");

    let wordPairs = [];
    let categoriesData = {};

    // Load categories from JSON and localStorage
    function loadCategories() {
        fetch("words.json")
            .then(response => response.json())
            .then(data => {
                categoriesData = data;
                const savedCategories = JSON.parse(localStorage.getItem("customCategories"));
                if (savedCategories) {
                    categoriesData = { ...categoriesData, ...savedCategories };
                }
                populateCategoryOptions();
            })
            .catch(error => {
                console.error("Error loading categories:", error);
                alert("Failed to load categories. Please try again.");
            });
    }

    function populateCategoryOptions() {
        categorySelect.innerHTML = ""; // Clear existing options
        for (const category in categoriesData) {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }

    // Search functionality for category dropdown
    categorySearch.addEventListener("input", () => {
        const searchText = categorySearch.value.toLowerCase();
        const options = categorySelect.querySelectorAll("option");
        options.forEach(option => {
            option.style.display = option.textContent.toLowerCase().includes(searchText) ? "" : "none";
        });
    });

    // Toggle new category form visibility
    addCategoryBtn.addEventListener("click", () => {
        newCategoryForm.classList.toggle("hidden");
    });

    // Add new category
    newCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const categoryName = newCategoryName.value.trim();
        const englishWords = englishWordsInput.value.trim().split("\n");
        const arabicWords = arabicWordsInput.value.trim().split("\n");

        if (!categoryName || englishWords.length === 0 || arabicWords.length === 0) {
            alert("Please fill out all fields.");
            return;
        }

        if (englishWords.length !== arabicWords.length) {
            alert("Each English word must have a matching Arabic word.");
            return;
        }

        const newWordPairs = [];
        for (let i = 0; i < englishWords.length; i++) {
            newWordPairs.push({ english: englishWords[i], arabic: arabicWords[i] });
        }

        categoriesData[categoryName] = newWordPairs;
        localStorage.setItem("customCategories", JSON.stringify({ ...JSON.parse(localStorage.getItem("customCategories") || "{}"), [categoryName]: newWordPairs }));
        
        newCategoryName.value = "";
        englishWordsInput.value = "";
        arabicWordsInput.value = "";
        newCategoryForm.classList.add("hidden");

        populateCategoryOptions();
        alert("New category added successfully!");
    });

    loadCategories();
});
