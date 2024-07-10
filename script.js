class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-operation="="]');
const deleteButton = document.getElementById('del');
const allClearButton = document.getElementById('ac');
const previousOperandTextElement = document.querySelector('.previous-operand');
const currentOperandTextElement = document.querySelector('.current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

function handleButtonClick(button) {
    button.classList.add('button-press');
    setTimeout(() => button.classList.remove('button-press'), 100);
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleButtonClick(button);
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleButtonClick(button);
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    handleButtonClick(equalsButton);
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    handleButtonClick(allClearButton);
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    handleButtonClick(deleteButton);
    calculator.delete();
    calculator.updateDisplay();
});

document.addEventListener('keydown', (event) => {
    let key = event.key;
    const button = document.querySelector(`button[data-number="${key}"], button[data-operation="${key}"]`);
    
    if (button) {
        handleButtonClick(button);
        if (button.classList.contains('number')) {
            calculator.appendNumber(key);
        } else if (button.classList.contains('operator')) {
            calculator.chooseOperation(key);
        }
        calculator.updateDisplay();
    } else if (key === 'Enter') {
        handleButtonClick(equalsButton);
        calculator.compute();
        calculator.updateDisplay();
    } else if (key === 'Backspace') {
        handleButtonClick(deleteButton);
        calculator.delete();
        calculator.updateDisplay();
    } else if (key === 'Escape') {
        handleButtonClick(allClearButton);
        calculator.clear();
        calculator.updateDisplay();
    }
});

const calculatorContainer = document.querySelector('.calculator-container');
const calculator3D = document.querySelector('.calculator');

document.addEventListener('mousemove', (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    calculatorContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

calculator3D.addEventListener('mouseenter', (e) => {
    calculator3D.style.transition = 'none';
});

calculator3D.addEventListener('mouseleave', (e) => {
    calculator3D.style.transition = 'all 0.5s ease';
    calculator3D.style.transform = 'rotateY(0deg) rotateX(0deg)';
});