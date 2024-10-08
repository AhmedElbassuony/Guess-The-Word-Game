// setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Ahmed Elbassuony`;

// Setting Game Options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];

// Get Random word
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", giveHint);

// Start Of The Game
function generateInput() {
  const inputsContiner = document.querySelector(".inputs");

  for (let i = 1; i <= numbersOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}<span>`;

    if (i !== 1) tryDiv.classList.add("disabled");

    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", 1);
      tryDiv.appendChild(input);
    }
    inputsContiner.appendChild(tryDiv);
  }
  // Focus On First Input In First Try Element
  inputsContiner.children[0].children[1].focus();

  // Disable All Inputs Except First One
  const inputsInDisabled = document.querySelectorAll(".disabled input");
  inputsInDisabled.forEach((input) => (input.disabled = true));

  // When Enter Number
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // When Enter A Letter
    input.addEventListener("input", function () {
      // Make Letter Uppercase
      this.value = this.value.toUpperCase();
      // target next input
      if (inputs[index + 1]) inputs[index + 1].focus();
    });

    // When Use Keybord
    input.addEventListener("keydown", function (event) {
      // i can use that to get index
      // const currentIndex = Array.from(inputs).indexOf(event.target); // Or this
      if (event.key === "ArrowRight") {
        if (inputs[index + 1]) inputs[index + 1].focus();
      } else if (event.key === "ArrowLeft") {
        if (inputs[index - 1]) inputs[index - 1].focus();
      }
    });
  });
}
// Manage Guess
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const reallLetter = wordToGuess[i - 1];
    // console.log(letter, reallLetter);

    if (letter === reallLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check If User Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

    // Add Class Disabled On All Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((e) => {
      e.classList.add("disabled");
      e.disabled = true;
    });

    // Disabled Guess Button
    guessButton.disabled = true;
    hintButton.disabled = true;
  } else {
    // make this try disabled
    let previousTryDiv = document.querySelector(`.try-${currentTry}`);
    previousTryDiv.classList.add("disabled");
    for (let i = 1; i < numbersOfLetters; i++) {
      previousTryDiv.children[i].disabled = true;
    }
    // End Of Game
    if (currentTry == numbersOfTries) {
      messageArea.innerHTML = `Sorry You Lose The Word Is <span>${wordToGuess}</span>`;
      // Disabled Guess Button
      guessButton.disabled = true;
      hintButton.disabled = true;
    }
    // Take Another Try
    else {
      currentTry++;
      let nextTryDiv = document.querySelector(`.try-${currentTry}`);
      nextTryDiv.classList.remove("disabled");
      nextTryDiv.disabled = false;
      // make input not disabled
      let inputsOfNextTry = document.querySelectorAll(
        `.try-${currentTry} input`
      );
      inputsOfNextTry.forEach((e) => (e.disabled = false));
      // Focus On First Input In First Try Element
      nextTryDiv.children[1].focus();
    }
  }
}

// Give Hint Logic
function giveHint() {
  // Use One Hint
  numberOfHints--;
  document.querySelector(".hint span").innerHTML = numberOfHints;
  if (numberOfHints === 0) {
    hintButton.disabled = true;
  }

  // Get Current Inputs Fields
  const currentInputs = document.querySelectorAll("input:not([disabled])"); // not array
  // Get the Empty Fields
  const emptyInputs = Array.from(currentInputs).filter(
    (input) => input.value === ""
  );
  if (emptyInputs.length > 0) {
    // Get Randome Index To Show it
    const randomeIndex = Math.floor(Math.random() * emptyInputs.length);
    const randomInputField = emptyInputs[randomeIndex];
    const indexOfLetter =
      randomInputField.id[randomInputField.id.length - 1] - 1;
    const letter = wordToGuess[indexOfLetter];

    // set The Letter
    randomInputField.value = letter.toUpperCase();
  } else {
    numberOfHints++;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
}

// Handle Backspace
document.addEventListener("keydown", handleBackspace);
function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    const currentInput = inputs[currentIndex];
    if (currentIndex > 0) {
      previousInput = inputs[currentIndex - 1];
      if (currentInput.value === "") {
        previousInput.value = "";
        previousInput.focus();
      } else {
        currentInput.value = "";
      }
    }
  }
}

window.onload = function () {
  generateInput();
};
