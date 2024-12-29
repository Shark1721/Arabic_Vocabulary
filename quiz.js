let englishWords, arabicWords, showImmediately;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

function startQuiz() {
    // Get English and Arabic words from textareas
    englishWords = document.getElementById('englishWords').value.trim().split('\n');
    arabicWords = document.getElementById('arabicWords').value.trim().split('\n');

    // Check if the lists are the same length
    if (englishWords.length !== arabicWords.length) {
        alert("The number of English and Arabic words must be the same.");
        return;
    }

    // Get answer option
    showImmediately = document.querySelector('input[name="answerOption"]:checked').value === 'immediate';

    // Hide input section and show quiz section
    document.querySelector('.input-section').style.display = 'none';
    document.querySelector('.quiz-section').style.display = 'block';

    // Initialize score and update the total questions count
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

    // Display question and reset feedback
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

    // Check the correct answer based on the direction of the question
    if (document.getElementById('question').textContent.includes('English')) {
        correctAnswer = arabicWords[currentQuestionIndex - 1];
    } else {
        correctAnswer = englishWords[currentQuestionIndex - 1];
    }

    // Check if the user's answer is correct
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) {
        score++;
        document.getElementById('feedback').textContent = "Correct!";
    } else {
        document.getElementById('feedback').textContent = "Incorrect!";
    }

    // Store the user's answer
    userAnswers.push({ question: document.getElementById('question').textContent, userAnswer, correctAnswer, isCorrect });

    // Show answer immediately if selected
    if (showImmediately) {
        document.getElementById('feedback').textContent += ` Correct answer: ${correctAnswer}`;
    }

    // Update score
    document.getElementById('score').textContent = score;

    // Move to next question
    setTimeout(showNextQuestion, 1000);
}

function showResults() {
    // Hide quiz section and show result section
    document.querySelector('.quiz-section').style.display = 'none';
    document.querySelector('.result-section').style.display = 'block';

    // Display final score
    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestionsResult').textContent = englishWords.length;

    // Display the list of answers
    const answerList = document.getElementById('answerList');
    userAnswers.forEach(answer => {
        const listItem = document.createElement('li');
        listItem.textContent = `${answer.question} Your answer: ${answer.userAnswer} Correct answer: ${answer.correctAnswer}`;
        answerList.appendChild(listItem);
    });
}

function resetQuiz() {
    // Reset quiz
    document.querySelector('.result-section').style.display = 'none';
    document.querySelector('.input-section').style.display = 'block';

    document.getElementById('englishWords').value = '';
    document.getElementById('arabicWords').value = '';
}
