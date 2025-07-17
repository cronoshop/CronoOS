// Lock Screen JavaScript - One UI OS

let isUnlocking = false;
let unlockStartY = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeLockScreen();
    initializeUnlockGesture();
    updateLockScreenTime();
});

function initializeLockScreen() {
    // Add dynamic background animation
    initializeDynamicBackground();
    
    // Initialize notifications
    initializeLockNotifications();
    
    // Add ambient animations
    initializeAmbientAnimations();
    
    console.log('Lock screen initialized');
}

function initializeDynamicBackground() {
    const wallpaper = document.querySelector('.wallpaper-lock');
    if (!wallpaper) return;
    
    // Create floating particles effect
    createFloatingParticles();
    
    // Add time-based color changes
    updateBackgroundByTime();
    setInterval(updateBackgroundByTime, 60000); // Update every minute
}

function createFloatingParticles() {
    const wallpaper = document.querySelector('.wallpaper-lock');
    if (!wallpaper) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite linear;
            pointer-events: none;
        `;
        wallpaper.appendChild(particle);
    }
    
    // Add floating animation
    const floatKeyframes = `
        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = floatKeyframes;
    document.head.appendChild(style);
}

function updateBackgroundByTime() {
    const wallpaper = document.querySelector('.wallpaper-lock');
    if (!wallpaper) return;
    
    const hour = new Date().getHours();
    let gradient;
    
    if (hour >= 5 && hour < 8) {
        // Dawn
        gradient = 'linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef)';
    } else if (hour >= 8 && hour < 12) {
        // Morning
        gradient = 'linear-gradient(45deg, #a8edea, #fed6e3)';
    } else if (hour >= 12 && hour < 17) {
        // Afternoon
        gradient = 'linear-gradient(45deg, #667eea, #764ba2)';
    } else if (hour >= 17 && hour < 20) {
        // Evening
        gradient = 'linear-gradient(45deg, #f093fb, #f5576c)';
    } else if (hour >= 20 && hour < 23) {
        // Dusk
        gradient = 'linear-gradient(45deg, #4b6cb7, #182848)';
    } else {
        // Night
        gradient = 'linear-gradient(45deg, #2c3e50, #000428)';
    }
    
    wallpaper.style.background = gradient;
}

function initializeLockNotifications() {
    const notificationsContainer = document.querySelector('.lock-notifications');
    if (!notificationsContainer) return;
    
    // Simulate incoming notifications
    setTimeout(() => {
        addLockNotification('📱', 'Nuovo messaggio da Anna');
    }, 3000);
    
    setTimeout(() => {
        addLockNotification('📧', '2 nuove email');
    }, 8000);
}

function addLockNotification(icon, text) {
    const notificationsContainer = document.querySelector('.lock-notifications');
    if (!notificationsContainer) return;
    
    const notification = document.createElement('div');
    notification.className = 'lock-notification';
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">${text}</div>
    `;
    
    notification.style.animation = 'slideInUp 0.5s ease';
    notificationsContainer.appendChild(notification);
    
    // Add click handler
    notification.addEventListener('click', function() {
        this.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => this.remove(), 300);
    });
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 10000);
}

function initializeAmbientAnimations() {
    const timeDisplay = document.querySelector('.time-display');
    const unlockHandle = document.querySelector('.unlock-handle');
    
    // Add breathing animation to time
    if (timeDisplay) {
        setInterval(() => {
            timeDisplay.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                timeDisplay.style.animation = '';
            }, 2000);
        }, 10000);
    }
    
    // Add shimmer effect to unlock handle
    if (unlockHandle) {
        setInterval(() => {
            unlockHandle.style.animation = 'shimmer 3s ease-in-out';
            setTimeout(() => {
                unlockHandle.style.animation = '';
            }, 3000);
        }, 15000);
    }
}

function initializeUnlockGesture() {
    const unlockHandle = document.getElementById('unlockHandle');
    const lockscreen = document.querySelector('.lockscreen');
    
    if (!unlockHandle || !lockscreen) return;
    
    // Mouse events
    unlockHandle.addEventListener('mousedown', startUnlock);
    document.addEventListener('mousemove', handleUnlockMove);
    document.addEventListener('mouseup', endUnlock);
    
    // Touch events
    unlockHandle.addEventListener('touchstart', startUnlock);
    document.addEventListener('touchmove', handleUnlockMove);
    document.addEventListener('touchend', endUnlock);
    
    // Click to unlock (simple version)
    unlockHandle.addEventListener('click', function(e) {
        if (!isUnlocking) {
            performUnlock();
        }
    });
}

function startUnlock(e) {
    e.preventDefault();
    isUnlocking = true;
    unlockStartY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const unlockHandle = document.getElementById('unlockHandle');
    if (unlockHandle) {
        unlockHandle.classList.add('swiping');
        unlockHandle.style.transform = 'scale(1.1)';
    }
    
    hapticFeedback('light');
}

function handleUnlockMove(e) {
    if (!isUnlocking) return;
    
    e.preventDefault();
    const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const deltaY = unlockStartY - currentY;
    
    const unlockHandle = document.getElementById('unlockHandle');
    if (unlockHandle && deltaY > 0) {
        const progress = Math.min(deltaY / 100, 1);
        unlockHandle.style.transform = `scale(${1.1 + progress * 0.2}) translateY(${-deltaY * 0.5}px)`;
        unlockHandle.style.opacity = 1 - progress * 0.3;
        
        // Add glow effect based on progress
        unlockHandle.style.boxShadow = `0 0 ${progress * 30}px rgba(255, 255, 255, ${progress * 0.8})`;
        
        // Trigger unlock if swiped far enough
        if (deltaY > 80) {
            performUnlock();
        }
    }
}

function endUnlock(e) {
    if (!isUnlocking) return;
    
    isUnlocking = false;
    const unlockHandle = document.getElementById('unlockHandle');
    
    if (unlockHandle) {
        unlockHandle.classList.remove('swiping');
        unlockHandle.style.transform = 'scale(1)';
        unlockHandle.style.opacity = '1';
        unlockHandle.style.boxShadow = '';
    }
}

function performUnlock() {
    const lockscreen = document.querySelector('.lockscreen');
    const unlockHandle = document.getElementById('unlockHandle');
    
    if (unlockHandle) {
        unlockHandle.style.animation = 'bounce 0.5s ease';
    }
    
    hapticFeedback('medium');
    
    // Add unlock animation
    if (lockscreen) {
        lockscreen.classList.add('unlocking');
    }
    
    // Show unlock success feedback
    showUnlockSuccess();
    
    // Navigate to home after animation
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 800);
}

function showUnlockSuccess() {
    const unlockHandle = document.getElementById('unlockHandle');
    if (!unlockHandle) return;
    
    // Change icon to checkmark
    const unlockIcon = unlockHandle.querySelector('.unlock-icon');
    if (unlockIcon) {
        unlockIcon.textContent = '✓';
        unlockIcon.style.color = '#4CAF50';
    }
    
    // Add success glow
    unlockHandle.style.background = 'rgba(76, 175, 80, 0.3)';
    unlockHandle.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
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

// Quick actions
function initializeQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');
    
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const icon = this.querySelector('.action-icon').textContent;
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            hapticFeedback('light');
        });
    });
    
    // Add ripple animation
    const rippleKeyframes = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rippleKeyframes;
    document.head.appendChild(style);
}

// Initialize quick actions
document.addEventListener('DOMContentLoaded', initializeQuickActions);

// Emergency call functionality
function initializeEmergencyCall() {
    let tapCount = 0;
    let tapTimer;
    
    document.addEventListener('click', function(e) {
        tapCount++;
        
        if (tapCount === 1) {
            tapTimer = setTimeout(() => {
                tapCount = 0;
            }, 2000);
        } else if (tapCount === 5) {
            clearTimeout(tapTimer);
            tapCount = 0;
            showEmergencyOptions();
        }
    });
}

function showEmergencyOptions() {
    const emergencyModal = document.createElement('div');
    emergencyModal.className = 'emergency-modal';
    emergencyModal.innerHTML = `
        <div class="emergency-content">
            <h3>Chiamata di Emergenza</h3>
            <div class="emergency-buttons">
                <button onclick="callEmergency('112')">112</button>
                <button onclick="callEmergency('113')">113</button>
                <button onclick="callEmergency('115')">115</button>
                <button onclick="callEmergency('118')">118</button>
            </div>
            <button onclick="closeEmergency()" class="close-emergency">Annulla</button>
        </div>
    `;
    
    emergencyModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(emergencyModal);
}

function callEmergency(number) {
    showToast(`Chiamata a ${number} - Simulazione`, 3000);
    closeEmergency();
}

function closeEmergency() {
    const modal = document.querySelector('.emergency-modal');
    if (modal) {
        modal.remove();
    }
}

// Initialize emergency call
document.addEventListener('DOMContentLoaded', initializeEmergencyCall);

// Accessibility for lock screen
function initializeLockAccessibility() {
    const unlockHandle = document.getElementById('unlockHandle');
    
    if (unlockHandle) {
        unlockHandle.setAttribute('role', 'button');
        unlockHandle.setAttribute('aria-label', 'Scorri per sbloccare il dispositivo');
        unlockHandle.setAttribute('tabindex', '0');
        
        unlockHandle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                performUnlock();
            }
        });
    }
}

// Initialize accessibility
document.addEventListener('DOMContentLoaded', initializeLockAccessibility);