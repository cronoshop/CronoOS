// Global JavaScript Functions - CronoOS

// Global state
let currentTheme = 'light';
let isWifiEnabled = true;
let isBluetoothEnabled = true;
let isDarkModeEnabled = false;
let brightnessLevel = 50;

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    updateTime();
    setInterval(updateTime, 1000);
    setupGestureHandling();
    initializeThemeSystem();
});

function initializeSystem() {
    // Load saved settings
    loadSettings();
    
    // Apply theme
    applyTheme();
    
    // Initialize gesture handlers
    initializeGestures();
    
    console.log('CronoOS initialized');
}

function initializeThemeSystem() {
    // Apply saved theme immediately
    const savedTheme = localStorage.getItem('cronos_theme');
    if (savedTheme === 'dark') {
        isDarkModeEnabled = true;
        applyTheme();
    }
}

function setupGestureHandling() {
    let startY = 0;
    let startX = 0;
    let isGesturing = false;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isGesturing = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isGesturing) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = startY - currentY;
        const diffX = startX - currentX;
        
        // Prevent default scrolling for gesture areas
        if (Math.abs(diffY) > 50 && (startY < 100 || startY > window.innerHeight - 100)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (!isGesturing) return;
        
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const diffY = startY - endY;
        const diffX = startX - endX;
        
        // Swipe down from top
        if (startY < 100 && diffY < -100) {
            if (endX < window.innerWidth / 2) {
                toggleNotifications();
            } else {
                toggleQuickPanel();
            }
        }
        
        // Swipe up from bottom
        if (startY > window.innerHeight - 100 && diffY > 100) {
            // Could implement app switcher
            showToast('Gesture riconosciuto');
        }
        
        isGesturing = false;
    }, { passive: true });
}

// Time and Date Functions
function updateTime() {
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
    
    // Update status bar time
    const statusTime = document.getElementById('statusTime');
    if (statusTime) {
        statusTime.textContent = timeString;
    }
    
    // Update lock screen time
    const lockTime = document.getElementById('lockTime');
    if (lockTime) {
        lockTime.textContent = timeString;
    }
    
    // Update lock screen date
    const lockDate = document.getElementById('lockDate');
    if (lockDate) {
        lockDate.textContent = dateString;
    }
}

// Navigation Functions
function goHome() {
    window.location.href = 'home.html';
}

function openApp(appName) {
    // Add transition animation
    document.body.style.transform = 'scale(0.95)';
    document.body.style.opacity = '0.8';
    
    setTimeout(() => {
        window.location.href = `${appName}.html`;
    }, 200);
}

function goToLockScreen() {
    // Add transition animation
    document.body.style.transform = 'scale(1.1)';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = 'lock.html';
    }, 300);
}

// Quick Panel Functions
function toggleQuickPanel() {
    const quickPanel = document.getElementById('quickPanel');
    const overlay = document.getElementById('overlay');
    
    if (quickPanel && overlay) {
        quickPanel.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function toggleNotifications() {
    const notificationsPanel = document.getElementById('notificationsPanel');
    const overlay = document.getElementById('overlay');
    
    if (notificationsPanel && overlay) {
        notificationsPanel.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function closePanels() {
    const quickPanel = document.getElementById('quickPanel');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const overlay = document.getElementById('overlay');
    
    if (quickPanel) quickPanel.classList.remove('active');
    if (notificationsPanel) notificationsPanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Toggle Functions
function toggleWifi() {
    isWifiEnabled = !isWifiEnabled;
    const wifiToggle = document.getElementById('wifiToggle');
    const wifiToggleItem = wifiToggle?.closest('.toggle-item');
    
    if (wifiToggleItem) {
        wifiToggleItem.classList.toggle('active', isWifiEnabled);
    }
    
    showToast(isWifiEnabled ? 'Wi-Fi attivato' : 'Wi-Fi disattivato');
    saveSettings();
}

function toggleBluetooth() {
    isBluetoothEnabled = !isBluetoothEnabled;
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const bluetoothToggleItem = bluetoothToggle?.closest('.toggle-item');
    
    if (bluetoothToggleItem) {
        bluetoothToggleItem.classList.toggle('active', isBluetoothEnabled);
    }
    
    showToast(isBluetoothEnabled ? 'Bluetooth attivato' : 'Bluetooth disattivato');
    saveSettings();
}

function toggleDarkMode() {
    isDarkModeEnabled = !isDarkModeEnabled;
    const darkToggle = document.getElementById('darkToggle');
    const darkToggleItem = darkToggle?.closest('.toggle-item');
    
    if (darkToggleItem) {
        darkToggleItem.classList.toggle('active', isDarkModeEnabled);
    }
    
    applyTheme();
    showToast(isDarkModeEnabled ? 'Modalità scura attivata' : 'Modalità chiara attivata');
    saveSettings();
}

// Theme Functions
function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDarkModeEnabled ? 'dark' : 'light');
    
    // Update dark mode toggle in settings
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkModeEnabled;
    }
}

// Gesture Handlers
function initializeGestures() {
    let startY = 0;
    let startX = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', function(e) {
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const diffY = startY - endY;
        const diffX = startX - endX;
        
        // Swipe down from top
        if (startY < 50 && diffY < -100) {
            if (endX < window.innerWidth / 2) {
                toggleNotifications();
            } else {
                toggleQuickPanel();
            }
        }
        
        // Swipe up from bottom
        if (startY > window.innerHeight - 50 && diffY > 100) {
            // Could implement app switcher here
        }
    });
}

function handleSwipeDown() {
    // Handle swipe down gesture
    const rect = event.target.getBoundingClientRect();
    if (rect.left < window.innerWidth / 2) {
        toggleNotifications();
    } else {
        toggleQuickPanel();
    }
}

function handleSwipeUp() {
    // Handle swipe up gesture
    // Could implement recent apps or other functionality
}

// Utility Functions
function showToast(message, duration = 2000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: white;
        padding: 14px 28px;
        border-radius: 25px;
        font-size: var(--font-size-sm);
        font-weight: 500;
        z-index: 10000;
        animation: toastSlideIn 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        max-width: 80%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add toast animations to global CSS
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes toastSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(30px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
    }
    
    @keyframes toastSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(30px) scale(0.9);
        }
    }
`;
document.head.appendChild(toastStyles);

// Settings Functions
function saveSettings() {
    const settings = {
        isDarkModeEnabled,
        isWifiEnabled,
        isBluetoothEnabled,
        brightnessLevel
    };
    
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('cronos_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        isDarkModeEnabled = settings.isDarkModeEnabled || false;
        isWifiEnabled = settings.isWifiEnabled !== false;
        isBluetoothEnabled = settings.isBluetoothEnabled !== false;
        brightnessLevel = settings.brightnessLevel || 50;
    }
    
    // Load theme from separate storage for immediate application
    const savedTheme = localStorage.getItem('cronos_theme');
    if (savedTheme === 'dark') {
        isDarkModeEnabled = true;
    }
}

// Tab Functions (used across multiple apps)
function switchTab(tabName) {
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(tabName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked tab
    const clickedTab = event.target;
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    hapticFeedback('light');
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Add backdrop blur
        document.body.style.filter = 'blur(2px)';
        
        hapticFeedback('medium');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        
        // Remove backdrop blur
        document.body.style.filter = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        hapticFeedback('light');
    }
}

// Haptic Feedback Simulation
function hapticFeedback(type = 'light') {
    if (navigator.vibrate) {
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
        }
    }
    
    // Visual feedback for devices without vibration
    if (!navigator.vibrate) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            pointer-events: none;
            z-index: 9999;
            animation: flashFeedback 0.1s ease;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 100);
    }
}

// Add click feedback to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .btn, .app-icon, .dock-item')) {
        hapticFeedback('light');
        
        // Add visual click feedback
        const element = e.target.closest('button, .btn, .app-icon, .dock-item, .toggle-item');
        if (element) {
            element.style.transform = 'scale(0.97)';
            setTimeout(() => {
                element.style.transform = '';
            }, 100);
        }
    }
});

// Brightness Control
function updateBrightness(value) {
    brightnessLevel = value;
    
    // Apply brightness filter
    const brightness = Math.max(30, value); // Minimum 30% brightness
    document.body.style.filter = `brightness(${brightness}%)`;
    
    saveSettings();
}

// Initialize brightness slider
document.addEventListener('DOMContentLoaded', function() {
    const brightnessSlider = document.getElementById('brightnessSlider');
    if (brightnessSlider) {
        brightnessSlider.value = brightnessLevel;
        brightnessSlider.addEventListener('input', function() {
            updateBrightness(this.value);
        });
    }
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for better UX
function smoothScrollTo(element, duration = 300) {
    const start = window.pageYOffset;
    const target = element.offsetTop;
    const distance = target - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('CronoOS Error:', e.error);
    showToast('Si è verificato un errore', 3000);
});

// Add CSS for visual feedback
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    @keyframes flashFeedback {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    /* Smooth transitions for all interactive elements */
    .app-icon, .dock-item, .toggle-item, button, .btn {
        transition: transform 0.1s ease, box-shadow 0.2s ease;
    }
    
    /* Enhanced focus states */
    .app-icon:focus,
    .dock-item:focus,
    button:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    /* Improved accessibility */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(globalStyles);

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Future PWA implementation
        console.log('CronoOS ready for PWA features');
    });
}

// Export global functions for cross-frame communication
window.cronosGlobal = {
    showToast,
    hapticFeedback,
    toggleDarkMode,
    applyTheme,
    saveSettings,
    loadSettings
};