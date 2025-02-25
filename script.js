let categories = [];

// Load categories from words.json
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        categories = data.categories;
    })
    .catch(error => console.error('Error loading JSON data:', error));

let currentCategory;
let currentQuestionIndex = 0;
let score = 0;
let quizMode = 'withAnswers';

document.getElementById('chooseCategoryBtn').addEventListener('click', chooseCategory);
document.getElementById('startWithAnswersBtn').addEventListener('click', startQuizWithAnswers);
document.getElementById('startWithoutAnswersBtn').addEventListener('click', startQuizWithoutAnswers);
document.getElementById('addCategoryBtn').addEventListener('click', openAddCategoryMenu);
document.getElementById('addCategoryFormBtn').addEventListener('click', addCategory);
document.getElementById('submitAnswerBtn').addEventListener('click', submitAnswer);
document.getElementById('nextBtn').addEventListener('click', showNextQuestion);
document.getElementById('resetBtn').addEventListener('click', resetQuiz);

function chooseCategory() {
    let categoryNames = categories.map(category => category.name).join(', ');
    let category = prompt(`Choose a Category: ${categoryNames}`);
    currentCategory = categories.find(cat => cat.name.toLowerCase() === category.toLowerCase());

    if (currentCategory) {
        document.getElementById('quizContainer').classList.remove('hidden');
        startQuiz();
    } else {
        alert('Category not found!');
    }
}

function startQuizWithAnswers() {
    quizMode = 'withAnswers';
    startQuiz();
}

function startQuizWithoutAnswers() {
    quizMode = 'withoutAnswers';
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('scoreDisplay').classList.add('hidden');
    document.getElementById('nextBtn').classList.add('hidden');
    showNextQuestion();
}

function showNextQuestion() {
    if (currentQuestionIndex < currentCategory.words.length) {
        let currentQuestion = currentCategory.words[currentQuestionIndex];
        document.getElementById('question').textContent = `Translate to Arabic: ${currentQuestion.english}`;
        document.getElementById('answerInput').value = '';
        document.getElementById('feedback').textContent = '';
    } else {
        showScore();
    }
}

function submitAnswer() {
    let userAnswer = document.getElementById('answerInput').value.trim();
    let currentQuestion = currentCategory.words[currentQuestionIndex];
    let correctAnswer = currentQuestion.arabic;

    if (userAnswer === correctAnswer) {
        score++;
        showFeedback(true);
    } else {
        showFeedback(false, correctAnswer);
    }

    currentQuestionIndex++;
    document.getElementById('nextBtn').classList.remove('hidden');
}

function showFeedback(correct, correctAnswer) {
    let feedback = correct ? 'Correct!' : `Incorrect! The correct answer is: ${correctAnswer}`;
    document.getElementById('feedback').textContent = feedback;

    if (quizMode === 'withoutAnswers' && !correct) {
        document.getElementById('feedback').textContent = 'Incorrect!';
    }
}

function showScore() {
    document.getElementById('scoreDisplay').textContent = `Your score: ${score}/${currentCategory.words.length}`;
    document.getElementById('scoreDisplay').classList.remove('hidden');
    document.getElementById('resetBtn').classList.remove('hidden');
}

function openAddCategoryMenu() {
    document.getElementById('addCategoryContainer').classList.remove('hidden');
}

function addCategory() {
    let name = document.getElementById('categoryName').value;
    let englishWords = document.getElementById('englishWords').value.split('\n');
    let arabicWords = document.getElementById('arabicWords').value.split('\n');

    let words = englishWords.map((eng, index) => ({
        english: eng.trim(),
        arabic: arabicWords[index].trim()
    }));

    categories.push({ name, words });

    // Save to the local JSON file or storage (this is for simplicity, typically server-side would handle it)
    alert('Category added!');
    document.getElementById('addCategoryContainer').classList.add('hidden');
}

function resetQuiz() {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('scoreDisplay').classList.add('hidden');
    document.getElementById('resetBtn').classList.add('hidden');
    document.getElementById('chooseCategoryBtn').click();
}
