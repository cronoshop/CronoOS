// Lock Screen JavaScript - CronoOS 2.1

let isScanning = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeLockScreen();
    updateLockScreenTime();
});

function initializeLockScreen() {
    console.log('CronoOS 2.1 Lock screen initialized');
}

function startFingerprintScan() {
    if (isScanning) return;
    
    isScanning = true;
    const scanner = document.getElementById('fingerprintScanner');
    
    if (scanner) {
        scanner.classList.add('scanning');
        
        // Simulate scanning process
        setTimeout(() => {
            completeFingerprintScan(true);
        }, 1500);
    }
}

function completeFingerprintScan(success) {
    const scanner = document.getElementById('fingerprintScanner');
    
    if (scanner) {
        scanner.classList.remove('scanning');
        
        if (success) {
            scanner.classList.add('success');
            
            // Navigate to home after animation
            setTimeout(() => {
                performUnlock();
            }, 500);
        } else {
            scanner.classList.add('error');
            
            setTimeout(() => {
                scanner.classList.remove('error');
                isScanning = false;
            }, 1000);
        }
    }
}

function performUnlock() {
    const lockscreen = document.querySelector('.lockscreen');
    
    // Add unlock animation
    if (lockscreen) {
        lockscreen.classList.add('unlocking');
    }
    
    // Navigate to home after animation
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
}

function updateLockScreenTime() {
    const timeDisplay = document.getElementById('lockTime');
    const dateDisplay = document.getElementById('lockDate');
    
    if (!timeDisplay || !dateDisplay) return;
    
    function update() {
        const now = new Date();
        
        const timeString = now.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        const dateString = now.toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        
        timeDisplay.textContent = timeString;
        dateDisplay.textContent = dateString;
    }
    
    update();
    setInterval(update, 1000);
}