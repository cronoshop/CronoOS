// Clock App - CronoOS 3.0

let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;

let timerInterval = null;
let timerTime = 300; // 5 minutes in seconds
let timerRunning = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeClockApp();
    setupTabSwitching();
    updateWorldClocks();
    setInterval(updateWorldClocks, 1000);
});

function initializeClockApp() {
    console.log('Clock app initialized - CronoOS 3.0');
    updateStopwatchDisplay();
    updateTimerDisplay();
}

function setupTabSwitching() {
    document.querySelectorAll('.clock-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchClockTab(tabName);
        });
    });
}

function switchClockTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.clock-tabs .tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabName);
    });
    
    showToast(`${getTabDisplayName(tabName)} selezionato`);
}

function getTabDisplayName(tabName) {
    const names = {
        'world-clock': 'Orologio Mondiale',
        'alarm': 'Sveglia',
        'stopwatch': 'Cronometro',
        'timer': 'Timer'
    };
    return names[tabName] || tabName;
}

function updateWorldClocks() {
    const now = new Date();
    
    // Milan (local time)
    const milanTime = document.getElementById('milanTime');
    if (milanTime) {
        milanTime.textContent = now.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
    
    // New York (UTC-5)
    const nyTime = document.getElementById('nyTime');
    if (nyTime) {
        const ny = new Date(now.getTime() - (6 * 60 * 60 * 1000));
        nyTime.textContent = ny.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
    
    // Tokyo (UTC+9)
    const tokyoTime = document.getElementById('tokyoTime');
    if (tokyoTime) {
        const tokyo = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        tokyoTime.textContent = tokyo.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
    
    // London (UTC+1)
    const londonTime = document.getElementById('londonTime');
    if (londonTime) {
        const london = new Date(now.getTime() - (1 * 60 * 60 * 1000));
        londonTime.textContent = london.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
}

// Stopwatch Functions
function toggleStopwatch() {
    if (stopwatchRunning) {
        pauseStopwatch();
    } else {
        startStopwatch();
    }
}

function startStopwatch() {
    stopwatchRunning = true;
    const startBtn = document.getElementById('startStopBtn');
    
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausa';
        startBtn.classList.add('primary');
    }
    
    stopwatchInterval = setInterval(() => {
        stopwatchTime += 10; // Increment by 10ms
        updateStopwatchDisplay();
    }, 10);
    
    showToast('Cronometro avviato');
}

function pauseStopwatch() {
    stopwatchRunning = false;
    const startBtn = document.getElementById('startStopBtn');
    
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Riprendi';
    }
    
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
    
    showToast('Cronometro in pausa');
}

function resetStopwatch() {
    stopwatchRunning = false;
    stopwatchTime = 0;
    
    const startBtn = document.getElementById('startStopBtn');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Avvia';
        startBtn.classList.remove('primary');
    }
    
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
    
    updateStopwatchDisplay();
    showToast('Cronometro resettato');
}

function updateStopwatchDisplay() {
    const display = document.getElementById('stopwatchTime');
    if (!display) return;
    
    const totalMs = stopwatchTime;
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = Math.floor((totalMs % 1000) / 10);
    
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
}

// Timer Functions
function toggleTimer() {
    if (timerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timerTime <= 0) {
        timerTime = 300; // Reset to 5 minutes
        updateTimerDisplay();
    }
    
    timerRunning = true;
    const startBtn = document.getElementById('timerStartBtn');
    
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausa';
        startBtn.classList.add('primary');
    }
    
    timerInterval = setInterval(() => {
        timerTime--;
        updateTimerDisplay();
        
        if (timerTime <= 0) {
            timerFinished();
        }
    }, 1000);
    
    showToast('Timer avviato');
}

function pauseTimer() {
    timerRunning = false;
    const startBtn = document.getElementById('timerStartBtn');
    
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Riprendi';
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    showToast('Timer in pausa');
}

function resetTimer() {
    timerRunning = false;
    timerTime = 300; // 5 minutes
    
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Avvia';
        startBtn.classList.remove('primary');
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    updateTimerDisplay();
    showToast('Timer resettato');
}

function updateTimerDisplay() {
    const display = document.getElementById('timerTime');
    if (!display) return;
    
    const minutes = Math.floor(timerTime / 60);
    const seconds = timerTime % 60;
    
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function timerFinished() {
    timerRunning = false;
    timerTime = 0;
    
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Avvia';
        startBtn.classList.remove('primary');
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    updateTimerDisplay();
    showToast('⏰ Timer terminato!');
    
    // Add visual feedback
    document.body.style.animation = 'flash 0.5s ease-in-out 3';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 1500);
}

// Make functions globally available
window.toggleStopwatch = toggleStopwatch;
window.resetStopwatch = resetStopwatch;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.switchClockTab = switchClockTab;