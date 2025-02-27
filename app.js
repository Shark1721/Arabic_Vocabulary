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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-quiz').addEventListener('click', () => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('categories-menu').style.display = 'block';
    });

    document.getElementById('add-category').addEventListener('click', () => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('add-category-screen').style.display = 'block';
    });

    document.getElementById('save-category').addEventListener('click', saveCategory);

    document.getElementById('submit-answer').addEventListener('click', submitAnswer);

    document.getElementById('reset').addEventListener('click', reset);

    document.getElementById('toggle-menu').addEventListener('click', () => {
        const menu = document.getElementById('categories-menu');
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    });

    document.getElementById('category-search').addEventListener('input', showCategoryList);
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

    currentCategory.words.forEach(word => {
        questions.push({ question: word.english, answer: word.arabic });
        questions.push({ question: word.arabic, answer: word.english });
    });

    questions = questions.sort(() => Math.random() - 0.5);

    currentQuestionIndex = 0;
    score = 0;
    showAnswers = confirm("Do you want to see correct answers during the quiz?");
    showQuizScreen();
}

function showQuizScreen() {
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
        document.getElementById('feedback').innerText = showAnswers ? 
            `Incorrect! Correct answer: ${currentQuestion.answer}` : 
            'Incorrect!';
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
