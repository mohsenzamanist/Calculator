const keyboardButtons = document.querySelectorAll(".keyboard button");
const memoryButtons = document.querySelectorAll(".memory button");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const memoryDeactiveButtons = document.querySelectorAll(
  ".memory-deactive-button"
);

const memory = [];
const clickOrder = [];
const operators = ["+", "-", "*", "/"];

// Updates the string shown on output field in screen section
function updateResultOutput() {
  resultEl.textContent = clickOrder[clickOrder.length - 1];
}

// Does the basic arithmetic calculations
function doCalculation() {
  const operatorsFuntion = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };
  return operatorsFuntion[clickOrder[clickOrder.length - 3]](
    Number(clickOrder[clickOrder.length - 4]),
    Number(clickOrder[clickOrder.length - 2])
  );
}

// Makes MC and MR buttons active or deactive
function changeToActiveClass() {
  if (memory.length !== 0) {
    memoryDeactiveButtons.forEach((button) =>
      button.classList.add("memory-active")
    );
  } else
    memoryDeactiveButtons.forEach((button) =>
      button.classList.remove("memory-active")
    );
}
let memoryFlag = false;
memoryButtons.forEach((memoryButton) => {
  memoryButton.addEventListener("click", (event) => {
    const value = event.currentTarget.value;
    if (value === "add") {
      memoryFlag = !memoryFlag;
      memory.push(clickOrder[clickOrder.length - 1]);
    } else if (value === "subtract") {
      memoryFlag = !memoryFlag;
      memory.push(Number(clickOrder[clickOrder.length - 1]) * -1);
    } else if (value === "recall") {
      const sum = memory.reduce((acc, curr) => acc + Number(curr), 0);
      clickOrder.push(sum);
      memoryFlag = !memoryFlag;
      updateResultOutput();
    } else if (value === "clear") {
      memory.length = 0;
      if (memoryFlag) memoryFlag = !memoryFlag;
    }
    changeToActiveClass();
  });
});

let ce = false;
let lastNumber = 0;
let lastOperator = "";
keyboardButtons.forEach((keyboardButton) => {
  keyboardButton.addEventListener("click", (event) => {
    const value = event.currentTarget.value;
    if (value === "%") {
      if (
        clickOrder[clickOrder.length - 2] === "+" ||
        clickOrder[clickOrder.length - 2] === "-"
      ) {
        const lastNumber = Number(clickOrder.pop());
        const operator = clickOrder.pop();
        const base = Number(clickOrder.pop());
        clickOrder.push(base, operator, (base * lastNumber) / 100);
      } else if (
        clickOrder[clickOrder.length - 2] === "*" ||
        clickOrder[clickOrder.length - 2] === "/"
      ) {
        clickOrder.push(clickOrder.pop() / 100);
      }
    } else if (memoryFlag && Number(value)) {
      clickOrder.push(value);
      memoryFlag = !memoryFlag;
    } else if (memoryFlag && operators.includes(value)) {
      clickOrder.push(value);
    } else if (value === "invert") {
      clickOrder[clickOrder.length - 1] = 1 / clickOrder[clickOrder.length - 1];
    } else if (value === "root") {
      if (clickOrder[clickOrder.length - 1] < 0) {
        resultEl.textContent = "Invalid input";
        clickOrder.length = 0;
      } else {
        clickOrder[clickOrder.length - 1] = Math.sqrt(
          clickOrder[clickOrder.length - 1]
        );
      }
    } else if (value === "square") {
      clickOrder[clickOrder.length - 1] *= clickOrder[clickOrder.length - 1];
    } else if (value === "negate") {
      clickOrder[clickOrder.length - 1] =
        Number(clickOrder[clickOrder.length - 1]) * -1;
    } else if (ce && Number(value)) {
      ce = !ce;
      clickOrder[clickOrder.length - 1] = value;
    } else if (value === "C") {
      clickOrder.length = 0;
      resultEl.textContent = "0";
      console.log(resultEl);
    } else if (value === "CE") {
      ce = !ce;
      clickOrder.pop();
      clickOrder.push(0);
    } else if (
      operators.includes(value) &&
      operators.includes(clickOrder[clickOrder.length - 2])
    ) {
      clickOrder.push("=");
      clickOrder.push(doCalculation());
      clickOrder.push(value);
    } else if (value === "=") {
      clickOrder.push("=");
      clickOrder.push(doCalculation());
    } else if (operators.includes(value)) {
      if (clickOrder.length === 0) clickOrder.push("0");
      if (operators.includes(clickOrder[clickOrder.length - 1]))
        clickOrder[clickOrder.length - 1] = value;
      else clickOrder.push(value);
    } else if (value === "backspace") {
      if (!operators.includes(clickOrder[clickOrder.length - 1])) {
        if (clickOrder[clickOrder.length - 1] < 10) {
          clickOrder[clickOrder.length - 1] = 0;
        } else {
          clickOrder[clickOrder.length - 1] = clickOrder[
            clickOrder.length - 1
          ].slice(0, -1);
        }
      }
    } else {
      if (
        clickOrder[clickOrder.length - 1] &&
        Number(clickOrder[clickOrder.length - 1])
      ) {
        clickOrder[clickOrder.length - 1] += value;
      } else clickOrder.push(value);
    }
    updateResultOutput();
  });
});
