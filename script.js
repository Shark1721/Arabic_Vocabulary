let categories = []; // Will store categories from JSON or a static array for now
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

function showCategoryList() {
    document.getElementById('main-menu').style.display = 'none';
    // Load and display categories dynamically
    document.getElementById('category-list').innerHTML = categories.map(category => 
        `<div class="category-item" onclick="startQuiz('${category.name}')">${category.name}</div>`
    ).join('');
}

function startQuiz(categoryName) {
    currentCategory = categories.find(c => c.name === categoryName);
    currentQuestionIndex = 0;
    score = 0;
    showQuizScreen();
}

function showQuizScreen() {
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('question').innerText = getNextQuestion();
}

function getNextQuestion() {
    if (currentQuestionIndex >= currentCategory.words.length) {
        showResultsScreen();
        return '';
    }

    const question = currentCategory.words[currentQuestionIndex];
    currentQuestionIndex++;
    return question.english; // Show English first
}

function submitAnswer() {
    const answer = document.getElementById('answer').value;
    const correctAnswer = currentCategory.words[currentQuestionIndex - 1].arabic;
    
    if (answer === correctAnswer) {
        score++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        document.getElementById('feedback').innerText = `Incorrect! Correct answer: ${correctAnswer}`;
    }

    document.getElementById('question').innerText = getNextQuestion();
    document.getElementById('answer').value = ''; // Clear the answer input
}

function showResultsScreen() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    document.getElementById('score').innerText = `${score}/${currentCategory.words.length}`;
}

function reset() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function showAddCategoryScreen() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('add-category-screen').style.display = 'block';
}

function saveCategory() {
    const categoryName = document.getElementById('category-name').value;
    // Fetch words from table, process, and save
    const words = [];
    const rows = document.querySelectorAll('#category-table tbody tr');
    rows.forEach(row => {
        const english = row.cells[0].querySelector('input').value;
        const arabic = row.cells[1].querySelector('input').value;
        if (english && arabic) {
            words.push({ english, arabic });
        }
    });
    
    categories.push({ name: categoryName, words });
    document.getElementById('add-category-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}
