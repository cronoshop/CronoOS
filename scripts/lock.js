// Lock Screen JavaScript - CronoOS 2.1

let isUnlocking = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeLockScreen();
    updateLockScreenTime();
    setupUnlockGesture();
});

function initializeLockScreen() {
    console.log('CronoOS 2.1 Lock screen initialized');
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