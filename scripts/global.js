// Global JavaScript Functions - CronoOS 2.4.3

// Global state
let currentTheme = 'light';
let isWifiEnabled = true;
let isBluetoothEnabled = true;
let isDarkModeEnabled = false;
let isFlashlightEnabled = false;
let brightnessLevel = 50;
let quickPanelOpen = false;

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    updateTime();
    setInterval(updateTime, 1000);
    loadSettings();
    setupQuickPanel();
    loadCustomWallpaper();
});

function initializeSystem() {
    applyTheme();
    console.log('CronoOS 2.4 initialized');
}

function loadCustomWallpaper() {
    const customWallpaper = localStorage.getItem('cronos_custom_wallpaper');
    if (customWallpaper) {
        document.documentElement.style.setProperty('--custom-wallpaper', `url(${customWallpaper})`);
    }
}

function setupQuickPanel() {
    // Create quick panel if it doesn't exist
    if (!document.getElementById('quickPanel')) {
        const quickPanel = document.createElement('div');
        quickPanel.id = 'quickPanel';
        quickPanel.className = 'quick-panel';
        quickPanel.innerHTML = `
            <div class="quick-toggles">
                <button class="quick-toggle" id="quickWifi" onclick="toggleWifi()">
                    <i class="fas fa-wifi"></i>
                    <span>Wi-Fi</span>
                </button>
                <button class="quick-toggle" id="quickBluetooth" onclick="toggleBluetooth()">
                    <i class="fas fa-bluetooth"></i>
                    <span>Bluetooth</span>
                </button>
                <button class="quick-toggle" id="quickAirplane" onclick="toggleAirplaneMode()">
                    <i class="fas fa-plane"></i>
                    <span>Aereo</span>
                </button>
                <button class="quick-toggle" id="quickFlashlight" onclick="toggleFlashlight()">
                    <i class="fas fa-flashlight"></i>
                    <span>Torcia</span>
                </button>
                <button class="quick-toggle" id="quickDark" onclick="toggleDarkMode()">
                    <i class="fas fa-moon"></i>
                    <span>Scuro</span>
                </button>
                <button class="quick-toggle" id="quickAOD" onclick="toggleQuickAOD()">
                    <i class="fas fa-clock"></i>
                    <span>AOD</span>
                </button>
                <button class="quick-toggle" id="quickSilent" onclick="toggleSilentMode()">
                    <i class="fas fa-volume-mute"></i>
                    <span>Silenzioso</span>
                </button>
                <button class="quick-toggle" onclick="openApp('settings.html')">
                    <i class="fas fa-gear"></i>
                    <span>Impostazioni</span>
                </button>
            </div>
        `;
        document.body.appendChild(quickPanel);
    }
    
    // Setup swipe down gesture
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientY < 100) { // Only from top area
            startY = e.touches[0].clientY;
            isDragging = true;
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 50 && !quickPanelOpen) {
            openQuickPanel();
        }
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        const quickPanel = document.getElementById('quickPanel');
        if (quickPanelOpen && !quickPanel.contains(e.target)) {
            closeQuickPanel();
        }
    });
}

function openQuickPanel() {
    const quickPanel = document.getElementById('quickPanel');
    if (quickPanel) {
        quickPanel.classList.add('active');
        quickPanelOpen = true;
        updateQuickPanelStates();
    }
}

function closeQuickPanel() {
    const quickPanel = document.getElementById('quickPanel');
    if (quickPanel) {
        quickPanel.classList.remove('active');
        quickPanelOpen = false;
    }
}

function updateQuickPanelStates() {
    const settings = JSON.parse(localStorage.getItem('cronos_settings') || '{}');
    
    document.getElementById('quickWifi')?.classList.toggle('active', settings.isWifiEnabled !== false);
    document.getElementById('quickBluetooth')?.classList.toggle('active', settings.isBluetoothEnabled !== false);
    document.getElementById('quickFlashlight')?.classList.toggle('active', isFlashlightEnabled);
    document.getElementById('quickDark')?.classList.toggle('active', isDarkModeEnabled);
    document.getElementById('quickAOD')?.classList.toggle('active', settings.aodEnabled || false);
}

function toggleAirplaneMode() {
    const settings = JSON.parse(localStorage.getItem('cronos_settings') || '{}');
    settings.isAirplaneModeEnabled = !settings.isAirplaneModeEnabled;
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
    
    document.getElementById('quickAirplane')?.classList.toggle('active', settings.isAirplaneModeEnabled);
    showToast(settings.isAirplaneModeEnabled ? 'Modalità aereo attivata' : 'Modalità aereo disattivata');
}

function toggleQuickAOD() {
    const settings = JSON.parse(localStorage.getItem('cronos_settings') || '{}');
    settings.aodEnabled = !settings.aodEnabled;
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
    
    document.getElementById('quickAOD')?.classList.toggle('active', settings.aodEnabled);
    showToast(settings.aodEnabled ? 'AOD attivato' : 'AOD disattivato');
}

function toggleSilentMode() {
    const settings = JSON.parse(localStorage.getItem('cronos_settings') || '{}');
    settings.isSilentModeEnabled = !settings.isSilentModeEnabled;
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
    
    document.getElementById('quickSilent')?.classList.toggle('active', settings.isSilentModeEnabled);
    showToast(settings.isSilentModeEnabled ? 'Modalità silenziosa attivata' : 'Modalità silenziosa disattivata');
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
    // Check if we're in an iframe (phone mockup)
    if (window.parent !== window) {
        // We're in the phone mockup iframe
        window.parent.postMessage({ action: 'navigate', url: 'home.html' }, '*');
    } else {
        // Direct navigation
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 300);
    }
}

function openApp(appName) {
    // Check if we're in an iframe (phone mockup)
    if (window.parent !== window) {
        // We're in the phone mockup iframe
        window.parent.postMessage({ action: 'navigate', url: appName }, '*');
    } else {
        // Direct navigation
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = appName;
        }, 300);
    }
}

// Listen for navigation messages from iframe
if (window.parent !== window) {
    window.addEventListener('message', function(event) {
        if (event.data.action === 'navigate') {
        window.location.href = 'home.html';
        }
    });
}

// Phone mockup navigation handler
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    window.addEventListener('message', function(event) {
        if (event.data.action === 'navigate') {
            const osFrame = document.getElementById('osFrame');
            if (osFrame) {
                osFrame.src = event.data.url;
            }
        }
    });
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

function closePanels() {
    const quickPanel = document.getElementById('quickPanel');
    const overlay = document.getElementById('overlay');
    
    if (quickPanel) quickPanel.classList.remove('active');
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

function toggleFlashlight() {
    isFlashlightEnabled = !isFlashlightEnabled;
    const flashlightToggle = document.getElementById('flashlightToggle');
    const flashlightToggleItem = flashlightToggle?.closest('.toggle-item');
    
    if (flashlightToggleItem) {
        flashlightToggleItem.classList.toggle('active', isFlashlightEnabled);
    }
    
    // Visual feedback
    if (isFlashlightEnabled) {
        document.body.style.filter = 'brightness(1.2)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 200);
    }
    
    showToast(isFlashlightEnabled ? 'Torcia accesa' : 'Torcia spenta');
    saveSettings();
    updateQuickPanelStates();
}

// Theme Functions
function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDarkModeEnabled ? 'dark' : 'light');
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
        backdrop-filter: blur(20px);
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: toastSlideIn 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
            transform: translateX(-50%) translateY(30px);
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
            transform: translateX(-50%) translateY(30px);
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
        isFlashlightEnabled,
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
        isFlashlightEnabled = settings.isFlashlightEnabled || false;
        brightnessLevel = settings.brightnessLevel || 50;
        
        applyTheme();
        updateToggleStates();
        updateQuickPanelStates();
    }
}

function updateToggleStates() {
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const darkToggle = document.getElementById('darkToggle');
    const flashlightToggle = document.getElementById('flashlightToggle');
    
    if (wifiToggle) {
        const wifiItem = wifiToggle.closest('.toggle-item');
        if (wifiItem) wifiItem.classList.toggle('active', isWifiEnabled);
    }
    
    if (bluetoothToggle) {
        const bluetoothItem = bluetoothToggle.closest('.toggle-item');
        if (bluetoothItem) bluetoothItem.classList.toggle('active', isBluetoothEnabled);
    }
    
    if (darkToggle) {
        const darkItem = darkToggle.closest('.toggle-item');
        if (darkItem) darkItem.classList.toggle('active', isDarkModeEnabled);
    }
    
    if (flashlightToggle) {
        const flashlightItem = flashlightToggle.closest('.toggle-item');
        if (flashlightItem) flashlightItem.classList.toggle('active', isFlashlightEnabled);
    }
}

// Tab Functions
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

// Brightness Control
function updateBrightness(value) {
    brightnessLevel = value;
    const brightness = Math.max(30, value);
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('CronoOS Error:', e.error);
    showToast('Si è verificato un errore', 3000);
});
/* Settings App Styles - CronoOS 2.5 */

:root {
    --bg-primary-light: #f2f2f7;
    --bg-secondary-light: #ffffff;
    --text-primary-light: #000000;
    --text-secondary-light: #8a8a8e;
    --separator-light: #e5e5ea;
    --ios-blue: #007aff;
    --ios-red: #ff3b30;

    --bg-primary-dark: #000000;
    --bg-secondary-dark: #1c1c1e;
    --text-primary-dark: #ffffff;
    --text-secondary-dark: #8d8d92;
    --separator-dark: #38383a;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
}

.app-container {
    background: var(--bg-primary-light);
    height: 100vh;
    display: flex;
    flex-direction: column;
    transition: background-image 0.5s ease-in-out;
}

[data-theme="dark"] .app-container {
    background: var(--bg-primary-dark);
}

.app-header {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    position: relative;
    height: 44px;
    /* Effetto vetro per coerenza con lo sfondo */
    background: rgba(242, 242, 247, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

[data-theme="dark"] .app-header {
    background: rgba(0, 0, 0, 0.7);
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

.app-header h1 {
    font-size: 17px;
    font-weight: 600;
    text-align: center;
    width: 100%;
    position: absolute;
    left: 0;
    color: var(--text-primary-light);
}
[data-theme="dark"] .app-header h1 {
    color: var(--text-primary-dark);
}

.app-header .back-btn {
    background: none;
    border: none;
    color: var(--ios-blue);
    font-size: 17px;
    cursor: pointer;
    padding: 0;
    z-index: 1;
}

.settings-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.settings-group {
    margin-bottom: 20px;
    background: var(--bg-secondary-light);
    border-radius: 12px;
    overflow: hidden;
}

[data-theme="dark"] .settings-group {
    background: var(--bg-secondary-dark);
}

.setting-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid var(--separator-light);
    min-height: 44px;
}
.setting-item:last-child {
    border-bottom: none;
}
[data-theme="dark"] .setting-item {
    border-bottom-color: var(--separator-dark);
}
.setting-item:hover {
    background: #e5e5ea;
}
[data-theme="dark"] .setting-item:hover {
    background: #38383a;
}

.setting-title {
    font-size: 17px;
    color: var(--text-primary-light);
}
[data-theme="dark"] .setting-title {
    color: var(--text-primary-dark);
}

.setting-description {
    font-size: 13px;
    color: var(--text-secondary-light);
    margin-top: 2px;
}
[data-theme="dark"] .setting-description {
    color: var(--text-secondary-dark);
}

.setting-accessory {
    color: var(--text-secondary-light);
}
[data-theme="dark"] .setting-accessory {
    color: var(--text-secondary-dark);
}

/* Stili per il toast */
.toast-notification {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    z-index: 1001;
    font-size: 14px;
    transition: opacity 0.5s ease;
    opacity: 1;
}
