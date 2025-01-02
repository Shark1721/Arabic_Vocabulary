// Variables to hold word lists and state
let incorrectWords = []; // To store incorrect answers
let englishWords = []; // Store English words
let arabicWords = []; // Store Arabic words
let score = 0;
let currentQuestionIndex = 0;
let answerDisplayOption = 'immediately'; // Default value

// DOM Elements
const setupSection = document.getElementById("setup-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const quizFeedback = document.getElementById("quiz-feedback");
const quizQuestion = document.getElementById("quiz-question");
const finalScore = document.getElementById("finalScore");
const startQuizButton = document.getElementById("startQuiz");
const submitAnswerButton = document.getElementById("submitAnswer");
const userAnswerInput = document.getElementById("userAnswer");
const restartQuizButton = document.getElementById("restartQuiz");
const answerDisplaySelect = document.getElementById("answerDisplayOption");

// Start Quiz Button click event
startQuizButton.addEventListener("click", () => {
    // Get words from the textareas
    englishWords = document.getElementById("englishWords").value.trim().split('\n');
    arabicWords = document.getElementById("arabicWords").value.trim().split('\n');
    
    if (englishWords.length === 0 || arabicWords.length === 0) {
        alert("Please enter both English and Arabic words!");
        return;
    }

    // Hide setup section and show quiz section
    setupSection.classList.add("hidden");
    quizSection.classList.remove("hidden");

    // Initialize quiz state
    score = 0;
    currentQuestionIndex = 0;
    incorrectWords = [];
    showNextQuestion();
});

// Function to display the next question
function showNextQuestion() {
    quizFeedback.textContent = "";
    let allWords = [...englishWords, ...incorrectWords.map(item => item.question)];
    currentQuestionIndex = Math.floor(Math.random() * allWords.length);

    let currentWord = allWords[currentQuestionIndex];

    if (Math.random() < 0.5) {
        quizQuestion.textContent = `Translate to Arabic: ${currentWord}`;
    } else {
        quizQuestion.textContent = `Translate to English: ${currentWord}`;
    }

    userAnswerInput.value = "";
}

// Submit Answer Button click event
submitAnswerButton.addEventListener("click", () => {
    const userInput = userAnswerInput.value.trim();
    const correctAnswer = (currentQuestionIndex % 2 === 0) ? arabicWords[currentQuestionIndex] : englishWords[currentQuestionIndex];

    const isCorrect = userInput === correctAnswer;

    if (isCorrect) {
        score++;
        quizFeedback.textContent = "Correct!";
        currentQuestionIndex++;
    } else {
        quizFeedback.textContent = `Incorrect! The correct answer was: ${correctAnswer}`;
        incorrectWords.push({
            question: (currentQuestionIndex % 2 === 0) ? englishWords[currentQuestionIndex] : arabicWords[currentQuestionIndex],
            correctAnswer: correctAnswer
        });
    }

    if (currentQuestionIndex >= englishWords.length) {
        finishQuiz();
    } else {
        showNextQuestion();
    }
});

// Finish Quiz and show score
function finishQuiz() {
    if (answerDisplayOption === 'end') {
        quizFeedback.textContent = "Incorrect answers:";
        incorrectWords.forEach((item) => {
            quizFeedback.textContent += `\n${item.question} - Correct Answer: ${item.correctAnswer}`;
        });
    }

    finalScore.textContent = `${score} / ${englishWords.length}`;
    resultSection.classList.remove("hidden");
}

// Restart Quiz Button
restartQuizButton.addEventListener("click", () => {
    setupSection.classList.remove("hidden");
    quizSection.classList.add("hidden");
    resultSection.classList.add("hidden");
});
