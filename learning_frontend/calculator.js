const expressionInput = document.getElementById("expression");
const result = document.getElementById("result");

const addButton = document.getElementById("add");
const subtractButton = document.getElementById("subtract");
const multiplyButton = document.getElementById("multiply");
const divideButton = document.getElementById("divide");
const powerButton = document.getElementById("power");
const clearButton = document.getElementById("clear");
const showResultButton = document.getElementById("show-result");

function selectOperation(operation) {
    const expression = expressionInput.value.trim();
    const trailingOperators = /(?:[+\-*/^]\s*)+$/;

    if (trailingOperators.test(expression)) {
        expressionInput.value = expression.replace(trailingOperators, ` ${operation} `);
    } else {
        expressionInput.value = `${expression} ${operation} `;
    }

    expressionInput.focus();
}

addButton.addEventListener("click", () => selectOperation("+"));
subtractButton.addEventListener("click", () => selectOperation("-"));
multiplyButton.addEventListener("click", () => selectOperation("*"));
divideButton.addEventListener("click", () => selectOperation("/"));
powerButton.addEventListener("click", () => selectOperation("^"));

showResultButton.addEventListener("click", function () {
    const expression = expressionInput.value.trim();
    const calculation = expression.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/^])\s*(-?\d+(?:\.\d+)?)$/);

    if (!calculation) {
        result.textContent = "Enter two numbers and select an operation.";
        return;
    }

    const number1 = Number(calculation[1]);
    const operation = calculation[2];
    const number2 = Number(calculation[3]);

    let answer;

    switch (operation) {
        case "+":
            answer = number1 + number2;
            break;
        case "-":
            answer = number1 - number2;
            break;
        case "*":
            answer = number1 * number2;
            break;
        case "/":
            if (number2 === 0) {
                result.textContent = "Cannot divide by zero.";
                return;
            }
            answer = number1 / number2;
            break;
        case "^":
            answer = number1 ** number2;
            break;
    }

    result.textContent = answer;
});

clearButton.addEventListener("click", function () {
    expressionInput.value = "";
    result.textContent = "";
});