let categories = [];

const defaultCategories = [
    {
        "name": "Basic Words",
        "words": [
            { "english": "Hello", "arabic": "مرحبا" },
            { "english": "Goodbye", "arabic": "وداعا" }
        ]
    },
    {
        "name": "Numbers",
        "words": [
            { "english": "One", "arabic": "واحد" },
            { "english": "Two", "arabic": "اثنين" }
        ]
    }
];

// Load categories on start
window.addEventListener('load', () => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    } else {
        categories = defaultCategories;
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    showCategoryList();
});

let currentCategory;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let showAnswers = false;

document.getElementById('start-quiz').addEventListener('click', () => {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('categories-menu').style.display = 'block';
});

document.getElementById('add-category').addEventListener('click', () => {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('add-category-screen').style.display = 'block';
});

document.getElementById('save-category').addEventListener('click', () => {
    saveCategory();
});

document.getElementById('submit-answer').addEventListener('click', () => {
    submitAnswer();
});

document.getElementById('reset').addEventListener('click', () => {
    reset();
});

document.getElementById('toggle-menu').addEventListener('click', () => {
    const menu = document.getElementById('categories-menu');
    menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
});

document.getElementById('category-search').addEventListener('input', () => {
    showCategoryList();
});

function showCategoryList() {
    const searchTerm = document.getElementById('category-search').value.toLowerCase();
    document.getElementById('category-list').innerHTML = categories
        .filter(category => category.name.toLowerCase().includes(searchTerm))
        .map(category => `<div class="category-item" onclick="startQuiz('${category.name}')">${category.name}</div>`)
        .join('');
}

function startQuiz(categoryName) {
    currentCategory = categories.find(c => c.name === categoryName);
    questions = [];

    // Pair each word twice: English → Arabic and Arabic → English
    currentCategory.words.forEach(word => {
        questions.push({ question: word.english, answer: word.arabic });
        questions.push({ question: word.arabic, answer: word.english });
    });

    // Randomize order
    questions = questions.sort(() => Math.random() - 0.5);

    currentQuestionIndex = 0;
    score = 0;
    showAnswers = confirm("Do you want to see correct answers during the quiz?");
    
    showQuizScreen();
}

function showQuizScreen() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('categories-menu').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('feedback').innerText = '';
    document.getElementById('question').innerText = questions[currentQuestionIndex].question;
}

function submitAnswer() {
    const answer = document.getElementById('answer').value.trim();
    const currentQuestion = questions[currentQuestionIndex];

    if (answer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
        score++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        if (showAnswers) {
            document.getElementById('feedback').innerText = `Incorrect! Correct answer: ${currentQuestion.answer}`;
        } else {
            document.getElementById('feedback').innerText = 'Incorrect!';
        }
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        document.getElementById('question').innerText = questions[currentQuestionIndex].question;
        document.getElementById('answer').value = '';
    } else {
        showResultsScreen();
    }
}

function showResultsScreen() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    document.getElementById('score').innerText = `You scored ${score}/${questions.length}`;
}

function reset() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function saveCategory() {
    const categoryName = document.getElementById('category-name').value.trim();
    const englishInput = document.getElementById('english-words').value.trim();
    const arabicInput = document.getElementById('arabic-words').value.trim();
    const words = [];

    // Split input into lines
    const englishLines = englishInput.split('\n');
    const arabicLines = arabicInput.split('\n');

    // Debugging: Log the inputs to see the split lines
    console.log('English Lines:', englishLines);
    console.log('Arabic Lines:', arabicLines);

    // Pair each line from English with the corresponding Arabic line
    for (let i = 0; i < Math.min(englishLines.length, arabicLines.length); i++) {
        const eng = englishLines[i].trim();
        const arabic = arabicLines[i].trim();

        // Only add if both lines are non-empty
        if (eng && arabic) {
            words.push({ english: eng, arabic: arabic });
        }
    }

    // Check if category name and at least one word pair exist
    if (categoryName && words.length > 0) {
        const newCategory = {
            name: categoryName,
            words: words
        };

        // Add new category to existing categories
        categories.push(newCategory);
        
        // Save to localStorage
        localStorage.setItem('categories', JSON.stringify(categories));

        // Debugging: Confirm the new category is saved
        console.log('New Category:', newCategory);
        console.log('All Categories:', categories);

        alert('Category saved successfully!');

        // Clear inputs after saving
        document.getElementById('category-name').value = '';
        document.getElementById('english-words').value = '';
        document.getElementById('arabic-words').value = '';

        // Go back to main menu and update category list
        document.getElementById('add-category-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        showCategoryList();
    } else {
        alert('Please enter a category name and at least one pair of words.');
    }
}




