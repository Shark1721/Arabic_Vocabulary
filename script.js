let categories = {};
let currentCategory = '';
let currentWords = [];
let quizWords = [];
let currentIndex = 0;
let correctCount = 0;
let withAnswers = true;

// Load categories from JSON file
async function loadCategories() {
  try {
    const response = await fetch('categories.json');
    categories = await response.json();
  } catch (error) {
    alert('Error loading categories. Make sure categories.json is available.');
  }
}

// Save categories to JSON file (simulated download)
function saveCategoriesToFile() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "categories.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

function showCategoryMenu() {
  toggleMenu('category-menu');
  const list = document.getElementById('category-list');
  list.innerHTML = '';
  Object.keys(categories).forEach((category) => {
    const li = document.createElement('li');
    li.textContent = category;
    li.onclick = () => selectCategory(category);
    list.appendChild(li);
  });
}

function filterCategories() {
  const search = document.getElementById('category-search').value.toLowerCase();
  document.querySelectorAll('#category-list li').forEach((item) => {
    item.style.display = item.textContent.toLowerCase().includes(search) ? '' : 'none';
  });
}

function selectCategory(category) {
  currentCategory = category;
  currentWords = categories[category];
  document.getElementById('quiz-category').textContent = `Category: ${category}`;
  returnToMainMenu();
}

function startQuiz(showAnswers) {
  if (!currentCategory) return alert('Please select a category first.');
  withAnswers = showAnswers;
  quizWords = shuffle([...currentWords]);
  currentIndex = 0;
  correctCount = 0;
  toggleMenu('quiz-container');
  showQuestion();
}

function showQuestion() {
  const word = quizWords[currentIndex];
  const isEnglishToArabic = Math.random() > 0.5;
  document.getElementById('quiz-question').textContent = isEnglishToArabic ? `Translate to Arabic: ${word.english}` : `Translate to English: ${word.arabic}`;
  document.getElementById('quiz-answer').value = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-answer').focus();
}

function submitAnswer() {
  const answer = document.getElementById('quiz-answer').value.trim();
  const word = quizWords[currentIndex];
  const isEnglishToArabic = document.getElementById('quiz-question').textContent.includes('Arabic');
  const correctAnswer = isEnglishToArabic ? word.arabic : word.english;
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
  saveCategoriesToFile();
  alert('Category saved and downloaded as JSON file!');
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

// Load categories on page load
window.onload = loadCategories;
