// Global JavaScript Functions - One UI OS

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
});

function initializeSystem() {
    // Load saved settings
    loadSettings();
    
    // Apply theme
    applyTheme();
    
    // Initialize gesture handlers
    initializeGestures();
    
    console.log('One UI OS initialized');
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
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10000;
        animation: toastSlideIn 0.3s ease;
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
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes toastSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
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
    
    localStorage.setItem('oneui_settings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('oneui_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        isDarkModeEnabled = settings.isDarkModeEnabled || false;
        isWifiEnabled = settings.isWifiEnabled !== false;
        isBluetoothEnabled = settings.isBluetoothEnabled !== false;
        brightnessLevel = settings.brightnessLevel || 50;
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
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
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
}

// Add click feedback to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .btn, .app-icon, .dock-item')) {
        hapticFeedback('light');
    }
});

// Brightness Control
function updateBrightness(value) {
    brightnessLevel = value;
    document.body.style.filter = `brightness(${value}%)`;
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
    console.error('One UI OS Error:', e.error);
    showToast('Si è verificato un errore', 3000);
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}