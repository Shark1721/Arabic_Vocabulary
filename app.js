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
    document.getElementById('add-category').addEventListener('click', () => {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('add-category-screen').style.display = 'block';
    });

    document.getElementById('save-category').addEventListener('click', saveCategory);
    document.getElementById('save-edit').addEventListener('click', saveEdit);
    document.getElementById('delete-category').addEventListener('click', deleteCategory);
    document.getElementById('cancel-edit').addEventListener('click', cancelEdit);

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
        .map(category => `
            <div class="category-item">
                <span onclick="startQuiz('${category.name}')">${category.name}</span>
                <button onclick="editCategory('${category.name}')">Edit</button>
            </div>
        `)
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

function saveCategory() {
    const categoryName = document.getElementById('category-name').value.trim();
    const wordPairs = document.getElementById('word-pairs').value.trim().split('\n');
    const words = [];

    wordPairs.forEach(pair => {
        const parts = pair.split(',');
        if (parts.length === 2) {
            const english = parts[0].trim();
            const arabic = parts[1].trim();
            if (english && arabic) {
                words.push({ english: english, arabic: arabic });
            }
        }
    });

    if (categoryName && words.length > 0) {
        categories.push({ name: categoryName, words });
        localStorage.setItem('categories', JSON.stringify(categories));
        alert('Category saved!');
        document.getElementById('add-category-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        showCategoryList();
    } else {
        alert('Please enter a category name and at least one valid word pair.');
    }
}

function editCategory(name) {
    const category = categories.find(c => c.name === name);
    document.getElementById('edit-category-name').value = category.name;
    document.getElementById('edit-word-pairs').value = category.words.map(w => `${w.english}, ${w.arabic}`).join('\n');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('edit-category-screen').style.display = 'block';
    currentCategory = category;
}

function saveEdit() {
    currentCategory.name = document.getElementById('edit-category-name').value.trim();
    currentCategory.words = document.getElementById('edit-word-pairs').value.trim().split('\n').map(line => {
        const [english, arabic] = line.split(',');
        return { english: english.trim(), arabic: arabic.trim() };
    });
    localStorage.setItem('categories', JSON.stringify(categories));
    alert('Changes saved!');
    document.getElementById('edit-category-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    showCategoryList();
}

function deleteCategory() {
    categories = categories.filter(c => c !== currentCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    alert('Category deleted!');
    document.getElementById('edit-category-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    showCategoryList();
}

function cancelEdit() {
    document.getElementById('edit-category-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}
