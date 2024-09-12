// DOM Elements
// Display
const lastOperandDisplay = document.getElementById("last-operand");
const currentOperandDisplay = document.getElementById("current-operand");
// Buttons
const clearButton = document.getElementById("clear");
const changeSignButton = document.getElementById("change-sign");
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

// -- //

// States
let lastOperand = "";
let currentOperand = "";
let currentOperation;

function updateDisplay(result) {
  if (result) {
    lastOperandDisplay.textContent =
      Number.parseInt(lastOperand).toLocaleString("en-US") +
      " " +
      operationSymbols[currentOperation] +
      " " +
      Number.parseInt(currentOperand).toLocaleString("en-US") +
      " =";

    currentOperandDisplay.textContent = result.toLocaleString("en-US");

    return;
  }

  if (currentOperand.length === 0) {
    currentOperandDisplay.textContent = "0";
  } else {
    currentOperandDisplay.textContent =
      Number.parseInt(currentOperand).toLocaleString("en-US");
  }

  if (lastOperand.length === 0) {
    lastOperandDisplay.textContent = "";
  } else {
    lastOperandDisplay.textContent =
      Number.parseInt(lastOperand).toLocaleString("en-US") +
      " " +
      operationSymbols[currentOperation];
  }
}

function inputOperand(operand) {
  if (currentOperand.length > 10) {
    return;
  }

  currentOperand += operand;
  updateDisplay();
}

function setOperator(operator) {
  if (!operations[operator]) {
    return;
  }

  currentOperation = operator;

  if (currentOperand.length > 0) {
    lastOperand = currentOperand;
    currentOperand = "";
  }

  updateDisplay();
}

function toggleSign() {
  if (currentOperand.charAt(0) !== "-") {
    currentOperand = "-" + currentOperand;
  } else {
    currentOperand = currentOperand.replace("-", "");
  }

  updateDisplay();
}

function operate() {
  if ((lastOperand.length === 0) | !currentOperand) {
    return;
  }

  const result = operations[currentOperation](
    Number.parseInt(lastOperand),
    Number.parseInt(currentOperand) ?? 0
  );
  updateDisplay(result);

  currentOperand = result.toString();
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
operateButton.addEventListener("click", operate);
clearButton.addEventListener("click", clear);
