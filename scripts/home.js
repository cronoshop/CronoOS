// Home Screen JavaScript - CronoOS 2.0

let installedApps = [];
let isDragging = false;
let draggedElement = null;
let isAirplaneModeEnabled = false;
let isFlashlightEnabled = false;
let isDoNotDisturbEnabled = false;
let isHotspotEnabled = false;
let isScreenRecordEnabled = false;
let isPowerSavingEnabled = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeHomeScreen();
    initializeQuickPanel();
    initializeNotifications();
    loadInstalledApps();
    setupAppDragAndDrop();
    listenForAppInstalls();
    initializeThemeListener();
    initializeDynamicWallpaper();
    initializeNavigationBar();
});

function initializeNavigationBar() {
    const navBar = document.getElementById('navigationBar');
    if (!navBar) return;
    
    // Check navigation style preference
    const navStyle = localStorage.getItem('cronos_navigation_style') || 'gestures';
    
    if (navStyle === 'buttons') {
        showNavigationButtons();
    } else {
        showGestureBar();
    }
    
    // Add click handler for home gesture
    navBar.addEventListener('click', function() {
        // Already on home, could implement app switcher
        hapticFeedback('light');
    });
}

function showNavigationButtons() {
    const navBar = document.getElementById('navigationBar');
    if (!navBar) return;
    
    navBar.innerHTML = `
        <div class="nav-buttons">
            <button class="nav-btn back-btn" onclick="goBack()">
                <i class="ph ph-arrow-left"></i>
            </button>
            <button class="nav-btn home-btn" onclick="goHome()">
                <i class="ph ph-house"></i>
            </button>
            <button class="nav-btn recent-btn" onclick="showRecentApps()">
                <i class="ph ph-squares-four"></i>
            </button>
        </div>
    `;
    
    navBar.style.width = '100%';
    navBar.style.height = '60px';
    navBar.style.background = 'rgba(0, 0, 0, 0.8)';
    navBar.style.borderRadius = '0';
}

function showGestureBar() {
    const navBar = document.getElementById('navigationBar');
    if (!navBar) return;
    
    navBar.innerHTML = '<div class="nav-indicator"></div>';
    navBar.style.width = '134px';
    navBar.style.height = '5px';
    navBar.style.background = 'rgba(255, 255, 255, 0.8)';
    navBar.style.borderRadius = '3px';
}

function initializeDynamicWallpaper() {
    const wallpaper = document.getElementById('dynamicWallpaper');
    if (!wallpaper) return;
    
    // Apply current theme colors
    const savedTheme = localStorage.getItem('cronos_theme_color') || 'theme-blue';
    applyWallpaperTheme(savedTheme);
}

function applyWallpaperTheme(themeName) {
    const wallpaper = document.getElementById('dynamicWallpaper');
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
    
    // Update app icon colors to match theme
    updateAppIconColors(colors[0]);
}

function updateAppIconColors(primaryColor) {
    const appIcons = document.querySelectorAll('.app-icon-container');
    appIcons.forEach((icon, index) => {
        // Create variations of the primary color for different apps
        const hue = (index * 30) % 360;
        const saturation = 70 + (index * 10) % 30;
        const lightness = 45 + (index * 5) % 20;
        
        icon.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
}

function initializeThemeListener() {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'theme-change') {
            applyWallpaperTheme(event.data.theme);
            
            // Update CSS custom properties
            const root = document.documentElement;
            const colors = event.data.colors;
            root.style.setProperty('--dynamic-primary', colors.primary);
            root.style.setProperty('--dynamic-secondary', colors.secondary);
            root.style.setProperty('--dynamic-accent', colors.accent);
        }
    });
}

function toggleHotspot() {
    isHotspotEnabled = !isHotspotEnabled;
    const hotspotToggle = document.getElementById('hotspotToggle');
    const hotspotToggleItem = hotspotToggle?.closest('.toggle-item');
    
    if (hotspotToggleItem) {
        hotspotToggleItem.classList.toggle('active', isHotspotEnabled);
    }
    
    showToast(isHotspotEnabled ? 'Hotspot attivato' : 'Hotspot disattivato');
    saveSettings();
}

function toggleScreenRecord() {
    isScreenRecordEnabled = !isScreenRecordEnabled;
    const recordToggle = document.getElementById('recordToggle');
    const recordToggleItem = recordToggle?.closest('.toggle-item');
    
    if (recordToggleItem) {
        recordToggleItem.classList.toggle('active', isScreenRecordEnabled);
    }
    
    if (isScreenRecordEnabled) {
        startScreenRecording();
    } else {
        stopScreenRecording();
    }
    
    showToast(isScreenRecordEnabled ? 'Registrazione schermo avviata' : 'Registrazione schermo fermata');
    saveSettings();
}

function togglePowerSaving() {
    isPowerSavingEnabled = !isPowerSavingEnabled;
    const powerToggle = document.getElementById('powerToggle');
    const powerToggleItem = powerToggle?.closest('.toggle-item');
    
    if (powerToggleItem) {
        powerToggleItem.classList.toggle('active', isPowerSavingEnabled);
    }
    
    if (isPowerSavingEnabled) {
        // Reduce animations and brightness
        document.body.style.filter = 'brightness(0.8)';
        document.documentElement.style.setProperty('--transition-fast', '0.1s');
    } else {
        document.body.style.filter = '';
        document.documentElement.style.setProperty('--transition-fast', '0.2s');
    }
    
    showToast(isPowerSavingEnabled ? 'Risparmio energetico attivato' : 'Risparmio energetico disattivato');
    saveSettings();
}

function startScreenRecording() {
    // Show recording indicator
    const indicator = document.createElement('div');
    indicator.id = 'recordingIndicator';
    indicator.innerHTML = `
        <div class="recording-dot"></div>
        <span>REC</span>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 50px;
        left: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(244, 67, 54, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        z-index: 1000;
        animation: slideInLeft 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
}

function stopScreenRecording() {
    const indicator = document.getElementById('recordingIndicator');
    if (indicator) {
        indicator.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => indicator.remove(), 300);
    }
}

function toggleAirplaneMode() {
    isAirplaneModeEnabled = !isAirplaneModeEnabled;
    const airplaneToggle = document.getElementById('airplaneToggle');
    const airplaneToggleItem = airplaneToggle?.closest('.toggle-item');
    
    if (airplaneToggleItem) {
        airplaneToggleItem.classList.toggle('active', isAirplaneModeEnabled);
    }
    
    if (isAirplaneModeEnabled) {
        // Disable other connectivity
        isWifiEnabled = false;
        isBluetoothEnabled = false;
        updateToggleStates();
    }
    
    showToast(isAirplaneModeEnabled ? 'Modalità aereo attivata' : 'Modalità aereo disattivata');
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
}

function toggleDoNotDisturb() {
    isDoNotDisturbEnabled = !isDoNotDisturbEnabled;
    const dndToggle = document.getElementById('dndToggle');
    const dndToggleItem = dndToggle?.closest('.toggle-item');
    
    if (dndToggleItem) {
        dndToggleItem.classList.toggle('active', isDoNotDisturbEnabled);
    }
    
    showToast(isDoNotDisturbEnabled ? 'Non disturbare attivato' : 'Non disturbare disattivato');
    saveSettings();
}

function initializeHomeScreen() {
    // Add staggered animation to app icons
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
        icon.classList.add('animate-fade-in');
    });
    
    // Initialize weather widget
    updateWeatherWidget();
    
    console.log('CronoOS 2.0 Home screen initialized');
}

function updateWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    if (!weatherWidget) return;
    
    // Simulate weather data
    const weatherData = {
        temperature: Math.floor(Math.random() * 15) + 15, //15-30°C
        condition: ['Soleggiato', 'Nuvoloso', 'Piovoso', 'Sereno'][Math.floor(Math.random() * 4)],
        location: 'Milano'
    };
    
    const tempElement = weatherWidget.querySelector('.weather-temp');
    const descElement = weatherWidget.querySelector('.weather-desc');
    const locationElement = weatherWidget.querySelector('.weather-location');
    
    if (tempElement) tempElement.textContent = `${weatherData.temperature}°`;
    if (descElement) descElement.textContent = weatherData.condition;
    if (locationElement) locationElement.textContent = weatherData.location;
}

function loadInstalledApps() {
    const saved = localStorage.getItem('cronos_home_apps');
    if (saved) {
        installedApps = JSON.parse(saved);
        addInstalledAppsToGrid();
    }
}

function addInstalledAppsToGrid() {
    const appGrid = document.getElementById('appGrid');
    if (!appGrid) return;
    
    installedApps.forEach(app => {
        if (!document.querySelector(`[data-app-id="${app.id}"]`)) {
            addAppToGrid(app);
        }
    });
}

function addAppToGrid(app) {
    const appGrid = document.getElementById('appGrid');
    if (!appGrid) return;
    
    const appIcon = document.createElement('div');
    appIcon.className = 'app-icon installed-app';
    appIcon.setAttribute('data-app-id', app.id);
    appIcon.onclick = () => openInstalledApp(app.name);
    
    appIcon.innerHTML = `
        <div class="app-icon-container">
            <i class="${app.icon}"></i>
        </div>
        <span>${app.name}</span>
    `;
    
    // Add with animation
    appIcon.style.opacity = '0';
    appIcon.style.transform = 'scale(0.5)';
    appGrid.appendChild(appIcon);
    
    // Animate in
    setTimeout(() => {
        appIcon.style.transition = 'all 0.3s ease';
        appIcon.style.opacity = '1';
        appIcon.style.transform = 'scale(1)';
    }, 100);
}

function removeAppFromGrid(appId) {
    const appIcon = document.querySelector(`[data-app-id="${appId}"]`);
    if (appIcon) {
        appIcon.style.transition = 'all 0.3s ease';
        appIcon.style.opacity = '0';
        appIcon.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            appIcon.remove();
        }, 300);
    }
}

function openInstalledApp(appName) {
    showToast(`Apertura ${appName}...`);
    // Could implement actual app opening logic here
}

function setupAppDragAndDrop() {
    const appGrid = document.getElementById('appGrid');
    if (!appGrid) return;
    
    // Enable drag and drop for app icons
    appGrid.addEventListener('dragstart', handleDragStart);
    appGrid.addEventListener('dragover', handleDragOver);
    appGrid.addEventListener('drop', handleDrop);
    appGrid.addEventListener('dragend', handleDragEnd);
    
    // Make app icons draggable
    const appIcons = appGrid.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
        icon.draggable = true;
        icon.addEventListener('contextmenu', handleAppContextMenu);
    });
}

function handleDragStart(e) {
    if (!e.target.closest('.app-icon')) return;
    
    isDragging = true;
    draggedElement = e.target.closest('.app-icon');
    draggedElement.style.opacity = '0.5';
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', draggedElement.outerHTML);
}

function handleDragOver(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
    if (afterElement == null) {
        e.currentTarget.appendChild(draggedElement);
    } else {
        e.currentTarget.insertBefore(draggedElement, afterElement);
    }
}

function handleDrop(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    isDragging = false;
    
    if (draggedElement) {
        draggedElement.style.opacity = '1';
        saveAppOrder();
    }
}

function handleDragEnd(e) {
    isDragging = false;
    if (draggedElement) {
        draggedElement.style.opacity = '1';
        draggedElement = null;
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.app-icon:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleAppContextMenu(e) {
    e.preventDefault();
    
    const appIcon = e.target.closest('.app-icon');
    const appId = appIcon.getAttribute('data-app-id');
    
    if (appId && appIcon.classList.contains('installed-app')) {
        showAppContextMenu(e, appId);
    }
}

function showAppContextMenu(e, appId) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'app-context-menu';
    contextMenu.innerHTML = `
        <div class="context-menu-item" onclick="uninstallApp(${appId})">
            <i class="ph ph-trash"></i>
            <span>Disinstalla</span>
        </div>
        <div class="context-menu-item" onclick="showAppInfo(${appId})">
            <i class="ph ph-info"></i>
            <span>Informazioni</span>
        </div>
    `;
    
    contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: var(--card-color);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: fadeIn 0.2s ease;
        backdrop-filter: blur(20px);
        border: 1px solid var(--divider-color);
        overflow: hidden;
    `;
    
    document.body.appendChild(contextMenu);
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu() {
            contextMenu.remove();
            document.removeEventListener('click', removeMenu);
        });
    }, 100);
}

function uninstallApp(appId) {
    const app = installedApps.find(a => a.id == appId);
    if (!app) return;
    
    if (confirm(`Disinstallare ${app.name}?`)) {
        // Remove from installed apps
        installedApps = installedApps.filter(a => a.id != appId);
        localStorage.setItem('cronos_home_apps', JSON.stringify(installedApps));
        
        // Remove from grid
        removeAppFromGrid(appId);
        
        // Update app store
        const installedAppIds = JSON.parse(localStorage.getItem('cronos_installed_apps') || '[]');
        const updatedIds = installedAppIds.filter(id => id != appId);
        localStorage.setItem('cronos_installed_apps', JSON.stringify(updatedIds));
        
        showToast(`${app.name} disinstallato`);
    }
}

function showAppInfo(appId) {
    const app = installedApps.find(a => a.id == appId);
    if (!app) return;
    
    showToast(`Informazioni su ${app.name}`);
}

function saveAppOrder() {
    const appGrid = document.getElementById('appGrid');
    if (!appGrid) return;
    
    const appOrder = [];
    const appIcons = appGrid.querySelectorAll('.app-icon');
    
    appIcons.forEach((icon, index) => {
        const appId = icon.getAttribute('data-app-id');
        if (appId) {
            appOrder.push({ id: appId, order: index });
        }
    });
    
    localStorage.setItem('cronos_app_order', JSON.stringify(appOrder));
}

function listenForAppInstalls() {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'app-installed') {
            const app = event.data.app;
            installedApps.push(app);
            localStorage.setItem('cronos_home_apps', JSON.stringify(installedApps));
            addAppToGrid(app);
        } else if (event.data.type === 'app-uninstalled') {
            const appId = event.data.appId;
            installedApps = installedApps.filter(a => a.id !== appId);
            localStorage.setItem('cronos_home_apps', JSON.stringify(installedApps));
            removeAppFromGrid(appId);
        }
    });
}

function initializeQuickPanel() {
    const brightnessSlider = document.getElementById('brightnessSlider');
    const volumeSlider = document.getElementById('volumeSlider');
    
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function() {
            updateBrightness(this.value);
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            updateVolume(this.value);
        });
    }
    
    // Update toggle states
    updateToggleStates();
}

function updateVolume(value) {
    // Apply volume changes
    showToast(`Volume: ${value}%`);
    saveSettings();
}

function updateToggleStates() {
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const darkToggle = document.getElementById('darkToggle');
    const airplaneToggle = document.getElementById('airplaneToggle');
    const flashlightToggle = document.getElementById('flashlightToggle');
    const dndToggle = document.getElementById('dndToggle');
    const hotspotToggle = document.getElementById('hotspotToggle');
    const recordToggle = document.getElementById('recordToggle');
    const powerToggle = document.getElementById('powerToggle');
    
    if (wifiToggle) {
        const wifiItem = wifiToggle.closest('.toggle-item');
        wifiItem.classList.toggle('active', isWifiEnabled);
    }
    
    if (bluetoothToggle) {
        const bluetoothItem = bluetoothToggle.closest('.toggle-item');
        bluetoothItem.classList.toggle('active', isBluetoothEnabled);
    }
    
    if (darkToggle) {
        const darkItem = darkToggle.closest('.toggle-item');
        darkItem.classList.toggle('active', isDarkModeEnabled);
    }
    
    if (airplaneToggle) {
        const airplaneItem = airplaneToggle.closest('.toggle-item');
        airplaneItem.classList.toggle('active', isAirplaneModeEnabled);
    }
    
    if (flashlightToggle) {
        const flashlightItem = flashlightToggle.closest('.toggle-item');
        flashlightItem.classList.toggle('active', isFlashlightEnabled);
    }
    
    if (dndToggle) {
        const dndItem = dndToggle.closest('.toggle-item');
        dndItem.classList.toggle('active', isDoNotDisturbEnabled);
    }
    
    if (hotspotToggle) {
        const hotspotItem = hotspotToggle.closest('.toggle-item');
        hotspotItem.classList.toggle('active', isHotspotEnabled);
    }
    
    if (recordToggle) {
        const recordItem = recordToggle.closest('.toggle-item');
        recordItem.classList.toggle('active', isScreenRecordEnabled);
    }
    
    if (powerToggle) {
        const powerItem = powerToggle.closest('.toggle-item');
        powerItem.classList.toggle('active', isPowerSavingEnabled);
    }
}

function initializeNotifications() {
    // Add more dynamic notifications
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Simulate new notifications
    setTimeout(() => {
        addNotification('ph ph-device-mobile', 'Sistema', 'Aggiornamento disponibile', '1 min fa');
    }, 5000);
    
    setTimeout(() => {
        addNotification('ph ph-envelope', 'Gmail', 'Nuova email da lavoro', '3 min fa');
    }, 10000);
}

function addNotification(icon, title, text, time) {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification-item';
    notification.innerHTML = `
        <div class="notification-icon"><i class="${icon}"></i></div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-text">${text}</div>
            <div class="notification-time">${time}</div>
        </div>
    `;
    
    notification.style.animation = 'slideInLeft 0.3s ease';
    notificationsList.insertBefore(notification, notificationsList.firstChild);
    
    // Remove old notifications if too many
    const notifications = notificationsList.querySelectorAll('.notification-item');
    if (notifications.length > 5) {
        notifications[notifications.length - 1].remove();
    }
}

// Navigation functions
function goBack() {
    window.history.back();
}

function showRecentApps() {
    showToast('App recenti - Funzionalità in arrivo!');
}

// Add CSS for new features
const homeStyles = document.createElement('style');
homeStyles.textContent = `
    .nav-buttons {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 20px;
    }
    
    .nav-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        padding: 12px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .nav-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .nav-btn:active {
        transform: scale(0.95);
    }
    
    .recording-dot {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: pulse 1s infinite;
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutLeft {
        from { transform: translateX(0); }
        to { transform: translateX(-100%); }
    }
    
    .app-context-menu {
        min-width: 160px;
        overflow: hidden;
    }
    
    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 14px;
        color: var(--text-primary);
    }
    
    .context-menu-item:hover {
        background: var(--surface-color);
    }
    
    .context-menu-item i {
        width: 16px;
        text-align: center;
    }
`;

document.head.appendChild(homeStyles);