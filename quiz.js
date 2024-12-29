let englishWords, arabicWords, showImmediately;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

function startQuiz() {
    englishWords = document.getElementById('englishWords').value.trim().split('\n');
    arabicWords = document.getElementById('arabicWords').value.trim().split('\n');

    if (englishWords.length !== arabicWords.length) {
        alert("The number of English and Arabic words must be the same.");
        return;
    }

    showImmediately = document.querySelector('input[name="answerOption"]:checked').value === 'immediate';

    document.querySelector('.input-section').style.display = 'none';
    document.querySelector('.quiz-section').style.display = 'block';

    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('totalQuestions').textContent = englishWords.length;
    document.getElementById('totalQuestionsCount').textContent = englishWords.length;

    showNextQuestion();
}

function showNextQuestion() {
    if (currentQuestionIndex >= englishWords.length) {
        showResults();
        return;
    }

    const question = Math.random() < 0.5 ? englishWords[currentQuestionIndex] : arabicWords[currentQuestionIndex];
    document.getElementById('question').textContent = `Translate: ${question}`;

    document.getElementById('answer').value = '';
    document.getElementById('feedback').textContent = '';

    currentQuestionIndex++;
    document.getElementById('currentQuestionNumber').textContent = currentQuestionIndex;
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    let correctAnswer;

    if (document.getElementById('question').textContent.includes('Translate:')) {
        correctAnswer = (document.getElementById('question').textContent.includes('English'))
            ? arabicWords[currentQuestionIndex - 1]
            : englishWords[currentQuestionIndex - 1];
    }

    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
        score++;
        document.getElementById('feedback').textContent = "Correct!";
    } else {
        document.getElementById('feedback').textContent = "Incorrect!";
    }

    userAnswers.push({ question: document.getElementById('question').textContent, userAnswer, correctAnswer, isCorrect });

    if (showImmediately) {
        document.getElementById('feedback').textContent += ` Correct answer: ${correctAnswer}`;
    }

    document.getElementById('score').textContent = score;
    setTimeout(showNextQuestion, 1000);
}

function showResults() {
    document.querySelector('.quiz-section').style.display = 'none';
    document.querySelector('.result-section').style.display = 'block';

    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestionsResult').textContent = englishWords.length;

    const answerList = document.getElementById('answerList');
    answerList.innerHTML = '';
    userAnswers.forEach(answer => {
        const listItem = document.createElement('li');
        listItem.textContent = `${answer.question} Your answer: ${answer.userAnswer} Correct answer: ${answer.correctAnswer}`;
        answerList.appendChild(listItem);
    });
}

function resetQuiz() {
    document.querySelector('.result-section').style.display = 'none';
    document.querySelector('.input-section').style.display = 'block';

    document.getElementById('englishWords').value = '';
    document.getElementById('arabicWords').value = '';

    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
}
