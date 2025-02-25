let categories = {};
let currentCategory = '';
let quizWords = [];
let currentIndex = 0;
let correctCount = 0;
let withAnswers = true;

async function loadCategories() {
  try {
    const response = await fetch('categories.json');
    categories = await response.json();
  } catch (error) {
    alert('Error loading categories. Make sure categories.json is available.');
  }
}

function showCategoryMenu() {
  toggleMenu('category-menu');
  const list = document.getElementById('category-list');
  list.innerHTML = '';
  Object.keys(categories).forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    li.onclick = () => selectCategory(category);
    list.appendChild(li);
  });
}

function filterCategories() {
  const search = document.getElementById('category-search').value.toLowerCase();
  document.querySelectorAll('#category-list li').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(search) ? '' : 'none';
  });
}

function selectCategory(category) {
  currentCategory = category;
  const words = categories[category];
  quizWords = shuffle([
    ...words.map(w => ({ question: w.english, answer: w.arabic, direction: 'enToAr' })),
    ...words.map(w => ({ question: w.arabic, answer: w.english, direction: 'arToEn' }))
  ]);
  document.getElementById('quiz-category').textContent = `Category: ${category}`;
  returnToMainMenu();
}

function startQuiz(showAnswers) {
  if (!currentCategory) return alert('Please select a category first.');
  withAnswers = showAnswers;
  currentIndex = 0;
  correctCount = 0;
  toggleMenu('quiz-container');
  showQuestion();
}

function showQuestion() {
  const { question, direction } = quizWords[currentIndex];
  document.getElementById('quiz-question').textContent = direction === 'enToAr' ? `Translate to Arabic: ${question}` : `Translate to English: ${question}`;
  document.getElementById('quiz-answer').value = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-answer').focus();
}

function submitAnswer() {
  const answer = document.getElementById('quiz-answer').value.trim();
  const { answer: correctAnswer } = quizWords[currentIndex];
  const feedback = document.getElementById('quiz-feedback');

  if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
    correctCount++;
    feedback.textContent = 'Correct!';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = withAnswers ? `Incorrect! Correct: ${correctAnswer}` : 'Incorrect!';
    feedback.style.color = 'red';
  }

  currentIndex++;
  setTimeout(() => {
    currentIndex < quizWords.length ? showQuestion() : showResults();
  }, 1000);
}

function showResults() {
  document.getElementById('quiz-score').textContent = `Score: ${correctCount} / ${quizWords.length}`;
  toggleMenu('result-container');
}

function showAddCategory() {
  toggleMenu('add-category-menu');
}

function saveCategory() {
  const name = document.getElementById('new-category-name').value.trim();
  const englishWords = document.getElementById('english-words').value.trim().split('\n');
  const arabicWords = document.getElementById('arabic-words').value.trim().split('\n');

  if (!name || englishWords.length !== arabicWords.length) {
    return alert('Please enter a valid category name and equal number of words.');
  }

  categories[name] = englishWords.map((eng, i) => ({ english: eng, arabic: arabicWords[i] }));
  alert('Category saved!');
  returnToMainMenu();
}

function returnToMainMenu() {
  toggleMenu('main-menu');
}

function toggleMenu(menuId) {
  document.querySelectorAll('.menu').forEach(menu => menu.classList.add('hidden'));
  document.getElementById(menuId).classList.remove('hidden');
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

window.onload = loadCategories;
