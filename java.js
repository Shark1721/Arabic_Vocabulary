let incorrectWords = []; // To store incorrect answers

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
        // Store the incorrect word and pick it again randomly later
        incorrectWords.push({ question: currentDirection === "en-ar" ? englishWords[currentQuestionIndex] : arabicWords[currentQuestionIndex], correctAnswer: correctAnswer });
    }

    if (currentQuestionIndex >= englishWords.length) {
        finishQuiz();
    } else {
        showNextQuestion();
    }
});

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
