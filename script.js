const display = document.getElementById('display');
let input = "";

document.querySelectorAll(".btn-number, .btn-operator:not(#equal):not(#backspace)").forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;
        if (id !== 'clear' && id !== 'equal' && id !== 'backspace') {
            input += button.dataset.value || button.innerText;
            display.textContent = input;
        }
    })
})

document.getElementById('clear').addEventListener('click', () => {
    input = "";
    display.textContent = '';
})

document.getElementById('backspace').addEventListener('click', () => {
    input = input.slice(0, -1);
    display.textContent = input;
})

document.getElementById('equal').addEventListener('click', () => {
    try {
        const postfix = infixToPostfix(input);
        const result = evaluatePostfix(postfix);
        display.textContent = result;
        input = result.toString();
    } catch (e) {
        display.textContent = 'Error';
    }
})

function getPrec(op) {
    switch (op) {
        case "+": case "-": return 1;
        case "*": case "/": return 2;
        default: return 0;
    }
}

function infixToPostfix(expr) {
    if (!expr) return [];
    const tokens = expr.match(/\d+(\.\d+)?|[()+\-*/]/g);
    if (!tokens) return [];

    const output = [];
    const stack = [];

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] != "(") {
                output.push(stack.pop());
            }
            stack.pop();
        } else {
            while (
                stack.length &&
                getPrec(stack[stack.length - 1]) >= getPrec(token)
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        output.push(stack.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    const stack = [];

    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token))
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
            }
        }
    }
    return stack[0];
}