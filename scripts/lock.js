// Lock Screen JavaScript - CronoOS 2.0

let isScanning = false;
let scanTimeout;

document.addEventListener('DOMContentLoaded', function() {
    initializeLockScreen();
    updateLockScreenTime();
    initializeDynamicWallpaper();
});

function initializeLockScreen() {
    // Add dynamic background animation
    initializeDynamicBackground();
    
    // Initialize notifications
    initializeLockNotifications();
    
    // Add ambient animations
    initializeAmbientAnimations();
    
    console.log('CronoOS 2.0 Lock screen initialized');
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

function initializeDynamicWallpaper() {
    const wallpaper = document.getElementById('lockWallpaper');
    if (!wallpaper) return;
    
    // Apply current theme colors
    const savedTheme = localStorage.getItem('cronos_theme_color') || 'theme-blue';
    applyWallpaperTheme(savedTheme);
}

function applyWallpaperTheme(themeName) {
    const wallpaper = document.getElementById('lockWallpaper');
    if (!wallpaper) return;
    
    const themes = {
        'theme-blue': ['#007AFF', '#5AC8FA', '#0051D5'],
        'theme-purple': ['#5856D6', '#AF52DE', '#7B68EE'],
        'theme-pink': ['#FF2D92', '#FF69B4', '#C71585'],
        'theme-green': ['#30D158', '#32D74B', '#228B22'],
        'theme-orange': ['#FF9500', '#FFCC00', '#FF6B35'],
        'theme-red': ['#FF3B30', '#FF6B6B', '#DC143C'],
        'theme-teal': ['#5AC8FA', '#40E0D0', '#008B8B'],
        'theme-indigo': ['#5856D6', '#6366F1', '#4338CA']
    };
    
    const colors = themes[themeName] || themes['theme-blue'];
    
    wallpaper.style.background = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
}

function createFloatingParticles() {
    const wallpaper = document.querySelector('.wallpaper-lock');
    if (!wallpaper) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 15}s infinite linear;
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
    
    // Only apply time-based gradient if no theme is set
    const savedTheme = localStorage.getItem('cronos_theme_color');
    if (!savedTheme) {
        wallpaper.style.background = gradient;
    }
}

function initializeLockNotifications() {
    // Add click handlers for notifications
    const notifications = document.querySelectorAll('.lock-notification');
    notifications.forEach(notification => {
        notification.addEventListener('click', function() {
            this.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => this.remove(), 300);
        });
    });
}

function initializeAmbientAnimations() {
    const timeDisplay = document.querySelector('.time-display');
    
    // Add breathing animation to time
    if (timeDisplay) {
        setInterval(() => {
            timeDisplay.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                timeDisplay.style.animation = '';
            }, 2000);
        }, 10000);
    }
}

function startFingerprintScan() {
    if (isScanning) return;
    
    isScanning = true;
    const scanner = document.getElementById('fingerprintScanner');
    
    if (scanner) {
        scanner.classList.add('scanning');
        
        // Simulate scanning process
        scanTimeout = setTimeout(() => {
            completeFingerprintScan(true);
        }, 2000);
        
        hapticFeedback('medium');
    }
}

function completeFingerprintScan(success) {
    const scanner = document.getElementById('fingerprintScanner');
    
    if (scanner) {
        scanner.classList.remove('scanning');
        
        if (success) {
            scanner.classList.add('success');
            hapticFeedback('heavy');
            
            // Show unlock success feedback
            showUnlockSuccess();
            
            // Navigate to home after animation
            setTimeout(() => {
                performUnlock();
            }, 800);
        } else {
            scanner.classList.add('error');
            hapticFeedback('heavy');
            
            setTimeout(() => {
                scanner.classList.remove('error');
                isScanning = false;
            }, 1000);
        }
    }
}

function showUnlockSuccess() {
    const scanner = document.getElementById('fingerprintScanner');
    if (!scanner) return;
    
    // Add success glow
    scanner.style.background = 'rgba(76, 175, 80, 0.3)';
    scanner.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
    scanner.style.borderRadius = '50%';
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
        
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric'
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

// Listen for theme changes
window.addEventListener('message', function(event) {
    if (event.data.type === 'theme-change') {
        applyWallpaperTheme(event.data.theme);
    }
});

// Accessibility for lock screen
function initializeLockAccessibility() {
    const scanner = document.getElementById('fingerprintScanner');
    
    if (scanner) {
        scanner.setAttribute('role', 'button');
        scanner.setAttribute('aria-label', 'Scan fingerprint to unlock device');
        scanner.setAttribute('tabindex', '0');
        
        scanner.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startFingerprintScan();
            }
        });
    }
}

// Initialize accessibility
document.addEventListener('DOMContentLoaded', initializeLockAccessibility);

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