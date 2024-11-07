

function shownav() {
    var show = document.querySelector('.nav4');
    show.style.display = 'flex';
}

function hidenav() {
    var hide = document.querySelector('.nav4');
    hide.style.display = 'none';
}
// Get the input display element
const display = document.querySelector('.input');

// Append a number or operator to the display
function appendToResult(value) {
    display.value += value;
}

// Clear the display
function clearDisplay() {
    display.value = '';
}

// Clear the last entry
function clearLastEntry() {
    display.value = display.value.slice(0, -1);
}

// Calculate the result and update the display
function calculateResult() {
    try {
        display.value = eval(display.value.replace(/x/g, '*').replace(/%/g, '/100'));
    } catch (e) {
        alert("Invalid expression");
    }
}

// Add event listeners to buttons
document.querySelectorAll('.column').forEach(button => {
    button.addEventListener('click', function () {
        const buttonText = this.innerText;

        if (buttonText === '=') {
            calculateResult();
        } else if (buttonText === 'C') {
            clearDisplay();
        } else if (buttonText === 'CE') {
            clearLastEntry();
        } else {
            appendToResult(buttonText);
        }
    });
});

/*
function appendToResult(value) {
    document.getElementById('result').value += value;
  }

  function calculateResult() {
    var result = document.getElementById('result').value;
    var calculatedResult = eval(result);
    document.getElementById('result').value = calculatedResult;
  }

  function clearResult() {
    document.getElementById('result').value = '';
  }
  */