// Seleciona os elementos principais da calculadora
const display = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn-number");
const operators = ["+", "-", "*", "/"];
const history = document.querySelector("#history");
const MAX_LENGTH = 15; // limite de caracteres no visor
let resultCalculated = false; // controla se o último clique foi um "="

// Calcula a expressão digitada de forma segura (sem usar eval)
function calculate(expression) {
    // Bloqueia qualquer caractere que não seja número/operador
    if (!/^[0-9+\-*/.\s]+$/.test(expression)) {
        return "Erro";
    }
    try {
        return new Function("return " + expression)();
    } catch (error) {
        return "Erro";
    }
}

// Adiciona um número/operador/ponto ao visor
function addCharacter(value) {
    // Se o último clique foi "=", começa uma conta nova
    if (resultCalculated) {
        display.value = "";
        resultCalculated = false;
    }
    display.classList.remove("error");

    const lastCharacter = display.value.slice(-1);

    // Evita operadores duplicados (ex: "5++")
    if (operators.includes(value)) {
        if (display.value === "") {
            return;
        }
        if (operators.includes(lastCharacter)) {
            display.value = display.value.slice(0, -1) + value;
            return;
        }
    }

    // Evita mais de um ponto decimal no mesmo número
    if (value === ".") {
        const currentSegment = display.value.split(/[+\-*/]/).pop();
        if (currentSegment.includes(".")) {
            return;
        }
    }

    // Impede ultrapassar o limite de caracteres do visor
    if (display.value.length >= MAX_LENGTH) {
        return;
    }

    display.value += value;
}

// Executa as ações especiais: limpar, apagar e calcular
function executeAction(action) {
    if (action === "clear") {
        display.value = "";
        history.textContent = "";
        resultCalculated = false;
        display.classList.remove("error");
    } else if (action === "backspace") {
        display.value = display.value.slice(0, -1);
    } else if (action === "calculate") {
        // Formata a expressão para exibir no histórico (ex: "2 + 3 =")
        const formattedExpression = display.value
            .replace(/([+\-*/])/g, " $1 ")
            .trim();

        const result = calculate(display.value);
        history.textContent = formattedExpression + " =";
        display.value = result;
        resultCalculated = true;

        if (result === "Erro") {
            display.classList.add("error");
        } else {
            display.classList.remove("error");
        }
    }
}

// Conecta cada botão da calculadora ao clique do mouse
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.value) {
            addCharacter(button.dataset.value);
        } else {
            executeAction(button.dataset.action);
        }
    });
});

// Permite usar a calculadora também pelo teclado físico
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (!isNaN(key) && key !== " ") {
        addCharacter(key);
    } else if (operators.includes(key) || key === ".") {
        addCharacter(key);
    } else if (key === "Enter") {
        event.preventDefault();
        executeAction("calculate");
    } else if (key === "Backspace") {
        executeAction("backspace");
    } else if (key === "Escape") {
        executeAction("clear");
    }
});