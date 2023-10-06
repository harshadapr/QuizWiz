// const questions = [
//   {
//     question: "What is 2 + 2?",
//     answers: [
//       { text: "4", correct: true },
//       { text: "5", correct: false },
//       { text: "6", correct: false },
//       { text: "3", correct: false }
//     ]
//   },
//   {
//     question: "Which is NOT a programming language?",
//     answers: [
//       { text: "Python", correct: false },
//       { text: "Java", correct: false },
//       { text: "HTML", correct: true },
//       { text: "C#", correct: false }
//     ]
//   },
//   {
//     question: "Who developed the theory of relativity?",
//     answers: [
//       { text: "Isaac Newton", correct: false },
//       { text: "Albert Einstein", correct: true },
//       { text: "Galileo Galilei", correct: false },
//       { text: "Nikola Tesla", correct: false }
//     ]
//   },
//   {
//     question: "What is the capital of France?",
//     answers: [
//       { text: "Berlin", correct: false },
//       { text: "Madrid", correct: false },
//       { text: "Paris", correct: true },
//       { text: "Lisbon", correct: false }
//     ]
//   },
//   {
//     question: "Which planet is closest to the sun?",
//     answers: [
//       { text: "Earth", correct: false },
//       { text: "Mercury", correct: true },
//       { text: "Venus", correct: false },
//       { text: "Mars", correct: false }
//     ]
//   },
//   {
//     question: 'Which element has the chemical symbol "O"?',
//     answers: [
//       { text: "Osmium", correct: false },
//       { text: "Oxygen", correct: true },
//       { text: "Omnium", correct: false },
//       { text: "Opium", correct: false }
//     ]
//   },
//   {
//     question: "Which country is known as the Land of the Rising Sun?",
//     answers: [
//       { text: "China", correct: false },
//       { text: "Japan", correct: true },
//       { text: "Korea", correct: false },
//       { text: "Thailand", correct: false }
//     ]
//   },
//   {
//     question: 'Who wrote "To be or not to be"?',
//     answers: [
//       { text: "Charles Dickens", correct: false },
//       { text: "Jane Austen", correct: false },
//       { text: "William Shakespeare", correct: true },
//       { text: "Homer", correct: false }
//     ]
//   },
//   {
//     question: "Which ocean is the largest?",
//     answers: [
//       { text: "Atlantic", correct: false },
//       { text: "Indian", correct: false },
//       { text: "Southern", correct: false },
//       { text: "Pacific", correct: true }
//     ]
//   },
//   {
//     question: "Who painted the Mona Lisa?",
//     answers: [
//       { text: "Vincent Van Gogh", correct: false },
//       { text: "Pablo Picasso", correct: false },
//       { text: "Claude Monet", correct: false },
//       { text: "Leonardo da Vinci", correct: true }
//     ]
//   }
// ];

const questions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "4", correct: true },
      { text: "5", correct: false },
      { text: "6", correct: false },
      { text: "3", correct: false }
    ]
  },
  {
    question: "Which is NOT a programming language?",
    answers: [
      { text: "Python", correct: false },
      { text: "Java", correct: false },
      { text: "HTML", correct: true },
      { text: "C#", correct: false }
    ]
  }
];

let gameActive = true;
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const timeLeftDisplay = document.getElementById("time-left");
const liveScoreDisplay = document.getElementById("live-score-value");
const colorPicker = document.getElementById("color-picker");

let shuffledQuestions,
  currentQuestionIndex,
  score = 0,
  questionTimer,
  timeLeft = 10;

function resetState() {
  // Clear previous answers
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }

  // Clear the previous timer if there is one
  clearInterval(questionTimer);

  // Revert the style and re-enable the buttons for each new question
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.disabled = false; // Re-enable buttons for the next question
    button.style.backgroundColor = ""; // Reset color
  });
}

document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
  document.getElementById("start-button").style.display = "none"; // Hide the start button
  document.getElementById("quiz-container").style.display = "block";
  score = 0;
  gameActive = true;
  liveScoreDisplay.innerText = score;
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  timeLeft = 10;
  setNextQuestion();
  setupColorPicker();
}

document.getElementById("restart-button").addEventListener("click", () => {
  document.getElementById("restart-container").style.display = "none";
  startGame();
});

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < shuffledQuestions.length) {
    // Check if there are still questions left
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    timeLeft = 10;
    timeLeftDisplay.innerText = timeLeft;
    questionTimer = setInterval(() => {
      timeLeft--;
      timeLeftDisplay.innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(questionTimer);
        currentQuestionIndex++;
        if (gameActive) {
          // Only show skipped message if the game is active
          showSkippedAnimation();
        }
      }
    }, 1000);
  } else {
    gameActive = false; // Set gameActive to false if there are no questions left
    showScore();
  }
}

function setColor(button, correct, selectedButton) {
  if (button === selectedButton && correct !== "true") {
    button.style.backgroundColor = "var(--incorrect-color)";
  } else if (correct === "true") {
    button.style.backgroundColor = "var(--correct-color)";
  } else {
    button.style.backgroundColor = "var(--disabled-color)";
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;

  Array.from(answerButtonsElement.children).forEach((button) => {
    setColor(button, button.dataset.correct, selectedButton);
    button.disabled = true;
  });

  if (correct === "true") score++;
  liveScoreDisplay.innerText = score;

  // Adding a delay before the animation starts
  setTimeout(() => {
    animateQuestionTransition(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
      } else {
        showScore();
      }
    });
  }, 600);
}

function animateQuestionTransition(callback) {
  questionContainer.classList.add("slide-out-left");

  // Ensure next question slides in after the previous one slides out
  setTimeout(() => {
    questionContainer.classList.remove("slide-out-left");
    questionContainer.classList.add("slide-in-right");

    // Perform callback actions (set next question / show score) and remove the slide-in class afterward
    callback();
    setTimeout(() => {
      questionContainer.classList.remove("slide-in-right");
    }, 500); // should be equal to the duration of the slide-in animation
  }, 500); // should be equal to the duration of the slide-out animation
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.dataset.correct = answer.correct.toString(); // Bind correctness data to the button
    button.addEventListener("click", selectAnswer); // Note: You might modify this line
    answerButtonsElement.appendChild(button);
  });
}

function showScore() {
  gameActive = false;
  document.getElementById("quiz-container").style.display = "none";
  const finalScoreContainer = document.getElementById("final-score-container");
  document.getElementById("final-score-value").innerText = score;
  finalScoreContainer.style.display = "flex";

  setTimeout(() => {
    finalScoreContainer.style.display = "none";
    document.getElementById("restart-container").style.display = "flex";
    document.getElementById("start-button").style.display = "none"; // Show the start button again
  }, 4000); // Hide the score and show restart button after 3 seconds
}

document.getElementById("restart-button").addEventListener("click", () => {
  document.getElementById("restart-container").style.display = "none"; // Hide the restart container
  startGame(); // Start the game again
});

function setupColorPicker() {
  const colors = [
    "--color-2",
    "--color-4",
    "--color-5",
    "--color-6",
    "--color-8",
    "--color-10"
  ];

  const colorPicker = document.getElementById("color-picker");

  // Clear existing color buttons
  while (colorPicker.firstChild) {
    colorPicker.removeChild(colorPicker.firstChild);
  }

  colors.forEach((colorVariable) => {
    const colorButton = document.createElement("button");
    colorButton.style.backgroundColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue(colorVariable);
    colorButton.style.width = "30px";
    colorButton.style.height = "30px";
    colorButton.style.borderRadius = "50%";
    colorButton.style.marginRight = "5px";
    colorButton.addEventListener("click", () =>
      changeColor(
        getComputedStyle(document.documentElement).getPropertyValue(
          colorVariable
        )
      )
    );
    colorPicker.appendChild(colorButton);
  });
}

function changeColor(color) {
  document.documentElement.style.setProperty("--main-color", color);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (gameActive) {
    // Only show skipped message if the game is active
    showSkippedAnimation();
  }
}

function showSkippedAnimation() {
  const skippedMessageContainer = document.getElementById(
    "skipped-message-container"
  );
  const quizContainer = document.getElementById("quiz-container");
  skippedMessageContainer.style.display = "flex";
  quizContainer.style.display = "none";

  setTimeout(() => {
    skippedMessageContainer.style.display = "none";
    quizContainer.style.display = "block";
    if (currentQuestionIndex < shuffledQuestions.length) {
      setNextQuestion();
    } else {
      showScore();
    }
  }, 3000); // Show the message and GIF for 3 seconds
}
