// DOM Elements
// Display
const lastOperandDisplay = document.getElementById("last-operand");
const currentOperandDisplay = document.getElementById("current-operand");
// Buttons
const clearButton = document.getElementById("clear");
const changeSignButton = document.getElementById("change-sign");
const setDecimalButton = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");
const operatorButtons = document.querySelectorAll(".operator");
const operandButtons = document.querySelectorAll(".operand");
const operateButton = document.getElementById("operate");

// -- //

// Operation Functions

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Impossible.";
  }

  return a / b;
}

const operations = {
  add,
  subtract,
  multiply,
  divide,
};

const operationSymbols = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/",
};

const reversedOperationSymbols = Object.fromEntries(
  Object.entries(operationSymbols).map(([key, value]) => [value, key])
);

// -- //

// Constants
const MAX_DIGIT = 10;

// States
let lastOperand = "";
let currentOperand = "";
let currentOperation;

function parseOperandToDisplay(operand) {
  if (operand.length > MAX_DIGIT) {
    return Number.parseFloat(operand).toPrecision(MAX_DIGIT / 2);
  }

  let textContent;

  // Check if currently doing decimal calculations
  if (operand.match(/\./g)) {
    // Split the operand into two strings:
    const decimalPosition = operand.search(/\./g);
    const beforeDecimal = operand.slice(0, decimalPosition) || "0";
    const afterDecimal = operand.slice(decimalPosition, operand.length);

    // beforeDecimal will be turned to LocaleString
    // while afterDecimal will stay as it is
    textContent =
      Number.parseInt(beforeDecimal).toLocaleString() + afterDecimal;
    // This is done to prevent the numbers after the decimal from truncating
  } else {
    textContent = Number.parseInt(operand).toLocaleString("en-US");
  }

  return textContent;
}

function updateDisplay(result) {
  if (result || result === 0) {
    lastOperandDisplay.textContent =
      parseOperandToDisplay(lastOperand) +
      " " +
      operationSymbols[currentOperation] +
      " " +
      parseOperandToDisplay(currentOperand) +
      " =";

    if (typeof result === "string") {
      currentOperandDisplay.textContent = result;
      return;
    }

    currentOperandDisplay.textContent = parseOperandToDisplay(
      result.toString()
    );

    return;
  }

  if (currentOperand.length === 0) {
    currentOperandDisplay.textContent = "0";
  } else {
    currentOperandDisplay.textContent = parseOperandToDisplay(currentOperand);
  }

  if (lastOperand.length === 0) {
    lastOperandDisplay.textContent = "";
  } else {
    lastOperandDisplay.textContent =
      parseOperandToDisplay(lastOperand) +
      " " +
      operationSymbols[currentOperation];
  }
}

function inputOperand(operand) {
  if (lastOperand.length > 0 && !currentOperation) {
    lastOperand = "";
    currentOperand = "";
  }

  if (
    currentOperand.length >= MAX_DIGIT ||
    (operand === "0" && currentOperand.length === 0)
  ) {
    return;
  }

  currentOperand += operand;
  updateDisplay();
}

function setOperator(operator) {
  if (
    !operations[operator] ||
    (currentOperand.length > 0 && !Number.parseFloat(currentOperand))
  ) {
    return;
  }

  if (lastOperand.length > 0 && currentOperand.length > 0 && currentOperation) {
    operate();
  }

  currentOperation = operator;

  if (currentOperand.length > 0) {
    lastOperand = currentOperand;
    currentOperand = "";
  } else if (lastOperand.length === 0) {
    lastOperand = "0";
    currentOperand = "";
  }

  updateDisplay();
}

function toggleSign() {
  if (
    currentOperand.length === 0 ||
    (lastOperand.length > 0 && !currentOperation)
  ) {
    return;
  }

  if (currentOperand.charAt(0) !== "-") {
    currentOperand = "-" + currentOperand;
  } else {
    currentOperand = currentOperand.replace("-", "");
  }

  updateDisplay();
}

function setDecimal() {
  if (
    currentOperand.match(/\./g) !== null ||
    (lastOperand.length > 0 && !currentOperation)
  ) {
    return;
  }

  currentOperand += ".";
  updateDisplay();
}

function operate() {
  if (lastOperand.length === 0 || !currentOperation) {
    return;
  }

  let operand = Number.parseFloat(currentOperand);
  if (!operand) {
    currentOperand = "0";
    operand = 0;
  }

  const result = operations[currentOperation](
    Number.parseFloat(lastOperand),
    operand
  );
  updateDisplay(result);

  currentOperand = result.toString();
  currentOperation = null;
}

function backspace() {
  if (lastOperand.length > 0 && !currentOperation) {
    return;
  }

  if (currentOperand.length === 0) {
    currentOperation = null;

    currentOperand = lastOperand;
    lastOperand = "";
  } else {
    currentOperand = currentOperand.substring(0, currentOperand.length - 1);
  }

  if (currentOperand.length === 1 && currentOperand === "-") {
    currentOperand = "";
  }

  updateDisplay();
}

function clear() {
  lastOperand = "";
  currentOperand = "";
  currentOperation = null;

  updateDisplay();
}

// -- //

// Event listeners
operandButtons.forEach((button) =>
  button.addEventListener("click", () => inputOperand(button.value))
);

operatorButtons.forEach((button) =>
  button.addEventListener("click", () => setOperator(button.value))
);

changeSignButton.addEventListener("click", toggleSign);
setDecimalButton.addEventListener("click", setDecimal);
operateButton.addEventListener("click", operate);
backspaceButton.addEventListener("click", backspace);
clearButton.addEventListener("click", clear);

// Keyboard support
const miscButtons = {
  "=": operateButton,
  Enter: operateButton,
  Backspace: backspaceButton,
  Escape: clearButton,
};

document.addEventListener("keydown", (event) => {
  const key = event.key;
  let button;

  if (reversedOperationSymbols[key]) {
    button = document.querySelector(
      `.operator[value="${reversedOperationSymbols[key]}"]`
    );
  } else if (miscButtons[key]) {
    button = miscButtons[key];
  } else if (key.match(/^\d$/g)) {
    button = document.querySelector(`.operand[value="${key}"]`);
  } else {
    return;
  }

  button.click();
});
