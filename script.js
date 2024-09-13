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

// -- //

// Constants
const MAX_DIGIT = 10;

// States
let lastOperand = "";
let currentOperand = "";
let currentOperation;

function parseOperandToDisplay(operand) {
  let textContent;

  // Check if currently doing decimal calculations
  if (operand.match(/\./g)) {
    // Split the operand into two strings:
    const decimalPosition = operand.search(/\./g);
    const beforeDecimal = operand.slice(0, decimalPosition);
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
  if (result) {
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

    let resultStr = result.toLocaleString("en-US");
    if (resultStr.length > MAX_DIGIT) {
      resultStr = result.toPrecision(MAX_DIGIT / 2);
    }
    currentOperandDisplay.textContent = resultStr;

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
  if (currentOperand.length > MAX_DIGIT) {
    return;
  }

  currentOperand += operand;
  updateDisplay();
}

function setOperator(operator) {
  if (!operations[operator]) {
    return;
  }

  if (lastOperand.length > 0) {
    operate();
  }

  currentOperation = operator;

  if (currentOperand.length > 0) {
    lastOperand = currentOperand;
    currentOperand = "";
  }

  updateDisplay();
}

function toggleSign() {
  if (currentOperand.length === 0) {
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
  if (currentOperand.match(/\./g)) {
    return;
  }

  currentOperand += ".";
  updateDisplay();
}

function operate() {
  if ((lastOperand.length === 0) | !currentOperation) {
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
}

function backspace() {
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
