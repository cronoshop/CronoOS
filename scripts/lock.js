// Lock Screen JavaScript - CronoOS 2.1

let isUnlocking = false;
let isAODEnabled = false;
let lockFontStyle = 'default';

document.addEventListener('DOMContentLoaded', function() {
    initializeLockScreen();
    updateLockScreenTime();
    setupUnlockGesture();
    loadLockScreenSettings();
    checkAODMode();
});

function initializeLockScreen() {
    console.log('CronoOS 2.1 Lock screen initialized');
    applyLockScreenSettings();
}

function loadLockScreenSettings() {
    const settings = JSON.parse(localStorage.getItem('cronos_lockscreen_settings') || '{}');
    lockFontStyle = settings.fontStyle || 'default';
    isAODEnabled = settings.aodEnabled || false;
}

function applyLockScreenSettings() {
    const timeDisplay = document.getElementById('lockTime');
    if (timeDisplay) {
        timeDisplay.className = `time-display font-${lockFontStyle}`;
    }
}

function checkAODMode() {
    if (isAODEnabled) {
        document.querySelector('.lockscreen').classList.add('aod-mode');
    }
}

function toggleLockFlashlight() {
    const flashlightBtn = document.getElementById('lockFlashlight');
    const isOn = flashlightBtn.classList.contains('active');
    
    if (isOn) {
        flashlightBtn.classList.remove('active');
        flashlightBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        document.body.style.filter = '';
    } else {
        flashlightBtn.classList.add('active');
        flashlightBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        document.body.style.filter = 'brightness(1.2)';
    }
}

function setupUnlockGesture() {
    const lockscreen = document.querySelector('.lockscreen');
    const unlockPrompt = document.getElementById('unlockPrompt');
    
    if (!lockscreen || !unlockPrompt) return;
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    // Touch events
    unlockPrompt.addEventListener('touchstart', handleStart, { passive: false });
    unlockPrompt.addEventListener('touchmove', handleMove, { passive: false });
    unlockPrompt.addEventListener('touchend', handleEnd, { passive: false });
    
    // Mouse events for desktop
    unlockPrompt.addEventListener('mousedown', handleStart);
    unlockPrompt.addEventListener('mousemove', handleMove);
    unlockPrompt.addEventListener('mouseup', handleEnd);
    
    // Click event as fallback
    unlockPrompt.addEventListener('click', performUnlock);
    
    function handleStart(e) {
        if (isUnlocking) return;
        
        isDragging = true;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        unlockPrompt.style.transition = 'none';
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!isDragging || isUnlocking) return;
        
        currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = startY - currentY;
        
        if (deltaY > 0) {
            const opacity = Math.max(0.3, 1 - (deltaY / 200));
            const translateY = Math.min(0, -deltaY / 2);
            
            unlockPrompt.style.opacity = opacity;
            unlockPrompt.style.transform = `translateY(${translateY}px)`;
        }
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!isDragging || isUnlocking) return;
        
        isDragging = false;
        const deltaY = startY - currentY;
        
        unlockPrompt.style.transition = 'all 0.3s ease';
        
        if (deltaY > 100) {
            // Sufficient swipe up - unlock
            performUnlock();
        } else {
            // Reset position
            unlockPrompt.style.opacity = '1';
            unlockPrompt.style.transform = 'translateY(0)';
        }
        
        e.preventDefault();
    }
}

function performUnlock() {
    if (isUnlocking) return;
    
    isUnlocking = true;
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
// Lock Screen JavaScript - CronoOS Phoenix Pro

document.addEventListener('DOMContentLoaded', function() {
    applyLockScreenSettings();
    updateLockScreenTime();
    setupUnlockGesture();
});

function applyLockScreenSettings() {
    const settings = JSON.parse(localStorage.getItem('crono_lockscreen_settings') || '{}');
    const timeDisplay = document.getElementById('lockTime');
    
    const fontStyle = settings.fontStyle || 'default';

    if (timeDisplay) {
        timeDisplay.className = `time-display font-${fontStyle}`;
    }
}

function setupUnlockGesture() {
    const lockscreen = document.querySelector('.lockscreen');
    lockscreen.addEventListener('click', performUnlock); // Semplificato per compatibilità
}

function performUnlock() {
    const lockscreen = document.querySelector('.lockscreen');
    lockscreen.classList.add('unlocking');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 500); // Durata animazione
}

function updateLockScreenTime() {
    const timeDisplay = document.getElementById('lockTime');
    const dateDisplay = document.getElementById('lockDate');
    
    function update() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
        dateDisplay.textContent = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    update();
    setInterval(update, 1000);
}
