// Phone App JavaScript - CronoOS 2.1

let currentNumber = '';

document.addEventListener('DOMContentLoaded', function() {
    initializePhoneApp();
});

function initializePhoneApp() {
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.value = currentNumber;
    }
    
    console.log('Phone app initialized');
}

function addNumber(digit) {
    currentNumber += digit;
    updateNumberDisplay();
}

function deleteNumber() {
    if (currentNumber.length > 0) {
        currentNumber = currentNumber.slice(0, -1);
        updateNumberDisplay();
    }
}

function updateNumberDisplay() {
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.value = formatPhoneNumber(currentNumber);
    }
}

function formatPhoneNumber(number) {
    if (number.length === 0) return '';
    
    let formatted = number;
    
    if (number.startsWith('39') && number.length > 2) {
        formatted = '+39 ' + number.substring(2);
    } else if (number.startsWith('3') && number.length > 3) {
        formatted = number.substring(0, 3) + ' ' + number.substring(3);
    }
    
    return formatted;
}

function makeCall() {
    if (currentNumber.length === 0) {
        showToast('Inserisci un numero di telefono');
        return;
    }
    
    showToast(`Chiamata a ${formatPhoneNumber(currentNumber)}`);
    
    // Clear current number after call
    setTimeout(() => {
        currentNumber = '';
        updateNumberDisplay();
    }, 2000);
}

function callBack(number) {
    currentNumber = number.replace(/\D/g, '');
    updateNumberDisplay();
    makeCall();
}

function callContact(number) {
    callBack(number);
}