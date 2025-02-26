let categories = []; // To store categories

// Embedded JSON data (instead of fetching from file)
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

// Load categories when the app starts
window.addEventListener('load', () => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    } else {
        // Use embedded JSON data if Local Storage is empty
        categories = defaultCategories;
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    showCategoryList();
});

let currentCategory;
let currentQuestionIndex = 0;
let score = 0;
let showAnswers = false;

document.getElementById('start-quiz').addEventListener('click', () => {
    showCategoryList();
});

document.getElementById('add-category').addEventListener('click', () => {
    showAddCategoryScreen();
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

function showCategoryList() {
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('category-list').innerHTML = categories.map(category => 
        `<div class="category-item" onclick="startQuiz('${category.name}')">${category.name}</div>`
    ).join('');
}

function startQuiz(categoryName) {
    currentCategory = categories.find(c => c.name === categoryName);
    currentQuestionIndex = 0;
    score = 0;
    
    showAnswers = confirm("Do you want to see correct answers during the quiz?");
    
    showQuizScreen();
}

function showQuizScreen() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('feedback').innerText = '';
    document.getElementById('question').innerText = getNextQuestion();
}

function getNextQuestion() {
    if (currentQuestionIndex >= currentCategory.words.length) {
        showResultsScreen();
        return '';
    }

    const question = currentCategory.words[currentQuestionIndex];
    const showEnglish = Math.random() < 0.5;

    if (showEnglish) {
        question.current = question.english;
        question.correct = question.arabic;
    } else {
        question.current = question.arabic;
        question.correct = question.english;
    }
    
    currentQuestionIndex++;
    return question.current;
}

function submitAnswer() {
    const answer = document.getElementById('answer').value.trim();
    const currentQuestion = currentCategory.words[currentQuestionIndex - 1];
    
    if (answer.toLowerCase() === currentQuestion.correct.toLowerCase()) {
        score++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        if (showAnswers) {
            document.getElementById('feedback').innerText = `Incorrect! Correct answer: ${currentQuestion.correct}`;
        } else {
            document.getElementById('feedback').innerText = 'Incorrect!';
        }
    }

    document.getElementById('question').innerText = getNextQuestion();
    document.getElementById('answer').value = '';
}

function showResultsScreen() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    document.getElementById('score').innerText = `You scored ${score}/${currentCategory.words.length}`;
}

function reset() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function showAddCategoryScreen() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('add-category-screen').style.display = 'block';
    document.querySelector('#category-table tbody').innerHTML = `
        <tr>
            <td><input type="text" placeholder="English" /></td>
            <td><input type="text" placeholder="Arabic" /></td>
        </tr>
    `;
}

function saveCategory() {
    const categoryName = document.getElementById('category-name').value;
    const words = [];
    const rows = document.querySelectorAll('#category-table tbody tr');

    rows.forEach(row => {
        const english = row.cells[0].querySelector('input').value;
        const arabic = row.cells[1].querySelector('input').value;
        if (english && arabic) {
            words.push({ english, arabic });
        }
    });

    const newCategory = {
        name: categoryName,
        words: words
    };

    categories.push(newCategory);

    localStorage.setItem('categories', JSON.stringify(categories));

    alert('Category saved successfully!');
    document.getElementById('add-category-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    showCategoryList();
}
