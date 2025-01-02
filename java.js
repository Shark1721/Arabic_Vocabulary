let incorrectWords = []; // To store incorrect answers
let answerDisplayOption = 'immediately'; // Default value
let currentQuestionIndex = 0;
let score = 0;
let englishWords = []; // Store English words
let arabicWords = []; // Store Arabic words
const setupSection = document.getElementById("setup-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const answerDisplaySelect = document.getElementById("answerDisplayOption");
const submitAnswer = document.getElementById("submitAnswer");
const userAnswer = document.getElementById("userAnswer");
const quizFeedback = document.getElementById("quiz-feedback");
const quizQuestion = document.getElementById("quiz-question");
const finalScore = document.getElementById("finalScore");
const restartQuiz = document.getElementById("restartQuiz");
const startQuizButton = document.getElementById("startQuiz");

startQuizButton.addEventListener("click", () => {
    // Get the words from the textareas
    englishWords = document.getElementById("englishWords").value.trim().split('\n');
    arabicWords = document.getElementById("arabicWords").value.trim().split('\n');
    
    // Make sure there are words entered
    if (englishWords.length === 0 || arabicWords.length === 0) {
        alert("Please enter both English and Arabic words!");
        return;
    }

    // Hide the setup section and show the quiz section
    setupSection.classList.add("hidden");
    quizSection.classList.remove("hidden");

    // Start the quiz
    currentQuestionIndex = 0;
    score = 0;
    incorrectWords = [];
    showNextQuestion();
});

submitAnswer.addEventListener("click", () => {
    const userInput = userAnswer.value.trim();
    const correctAnswer = (currentDirection === "en-ar")
        ? arabicWords[currentQuestionIndex]
        : englishWords[currentQuestionIndex];

    const isCorrect = userInput === correctAnswer;

    if (isCorrect) {
        score++;
        quizFeedback.textContent = "Correct!";
        // Reset the question (no need to save incorrect answers)
        currentQuestionIndex++;
    } else {
        quizFeedback.textContent = `Incorrect! The correct answer was: ${correctAnswer}`;

        // Store the incorrect word and pick it again randomly later if needed
        incorrectWords.push({
            question: currentDirection === "en-ar" ? englishWords[currentQuestionIndex] : arabicWords[currentQuestionIndex],
            correctAnswer: correctAnswer
        });
    }

    if (currentQuestionIndex >= englishWords.length) {
        finishQuiz();
    } else {
        showNextQuestion();
    }
});

// This function will be called to show the next question
function showNextQuestion() {
    quizFeedback.textContent = "";
    let allWords = [...englishWords, ...incorrectWords.map(item => item.question)];
    currentQuestionIndex = Math.floor(Math.random() * allWords.length);

    let currentWord = allWords[currentQuestionIndex];

    if (Math.random() < 0.5) {
        // English to Arabic
        quizQuestion.textContent = `Translate to Arabic: ${currentWord}`;
    } else {
        // Arabic to English
        quizQuestion.textContent = `Translate to English: ${currentWord}`;
    }

    userAnswer.value = "";
}

function finishQuiz() {
    if (answerDisplayOption === 'end') {
        // Show incorrect answers and their correct answers at the end
        quizFeedback.textContent = "Here are your incorrect answers:";
        incorrectWords.forEach((item) => {
            quizFeedback.textContent += `\nQuestion: ${item.question}, Correct Answer: ${item.correctAnswer}`;
        });
    }
    finalScore.textContent = `${score} / ${englishWords.length}`;
}

// Handle the option change for how answers are displayed
answerDisplaySelect.addEventListener('change', (e) => {
    answerDisplayOption = e.target.value;
});

// Handle restart quiz logic
restartQuiz.addEventListener("click", () => {
    setupSection.classList.remove("hidden");
    quizSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    englishInput.value = "";
    arabicInput.value = "";
});
