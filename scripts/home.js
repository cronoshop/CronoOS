// Home Screen JavaScript - CronoOS

let installedApps = [];
let isDragging = false;
let draggedElement = null;
let isAirplaneModeEnabled = false;
let isFlashlightEnabled = false;
let isDoNotDisturbEnabled = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeHomeScreen();
    initializeQuickPanel();
    initializeNotifications();
    loadInstalledApps();
    setupAppDragAndDrop();
    listenForAppInstalls();
    initializeThemeListener();
});

function initializeThemeListener() {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'theme-change') {
            // Apply theme to current page
            document.body.className = '';
            document.body.classList.add(event.data.theme);
            
            // Update CSS custom properties
            const root = document.documentElement;
            const colors = event.data.colors;
            root.style.setProperty('--dynamic-primary', colors.primary);
            root.style.setProperty('--dynamic-secondary', colors.secondary);
            root.style.setProperty('--dynamic-accent', colors.accent);
        }
    });
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
        icon.style.animationDelay = `${index * 0.05}s`;
        icon.classList.add('animate-fade-in');
    });
    
    // Add parallax effect to wallpaper
    initializeParallax();
    
    // Initialize weather widget
    updateWeatherWidget();
    
    console.log('CronoOS Home screen initialized');
}

function initializeParallax() {
    const wallpaper = document.querySelector('.wallpaper');
    if (!wallpaper) return;
    
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        wallpaper.style.backgroundPosition = `${50 + (x - 50) * 0.1}% ${50 + (y - 50) * 0.1}%`;
    });
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
        <div class="icon ${app.iconClass}"><i class="${app.icon}"></i></div>
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
            <i class="fas fa-trash"></i>
            <span>Disinstalla</span>
        </div>
        <div class="context-menu-item" onclick="showAppInfo(${appId})">
            <i class="fas fa-info-circle"></i>
            <span>Informazioni</span>
        </div>
    `;
    
    contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: var(--card-color);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: fadeIn 0.2s ease;
        backdrop-filter: blur(20px);
        border: 1px solid var(--divider-color);
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
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function() {
            updateBrightness(this.value);
        });
    }
    
    // Update toggle states
    updateToggleStates();
}

function updateToggleStates() {
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const darkToggle = document.getElementById('darkToggle');
    const airplaneToggle = document.getElementById('airplaneToggle');
    const flashlightToggle = document.getElementById('flashlightToggle');
    const dndToggle = document.getElementById('dndToggle');
    
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
}

function initializeNotifications() {
    // Add more dynamic notifications
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Simulate new notifications
    setTimeout(() => {
        addNotification('fas fa-mobile-alt', 'Sistema', 'Aggiornamento disponibile', '1 min fa');
    }, 5000);
    
    setTimeout(() => {
        addNotification('fas fa-envelope', 'Gmail', 'Nuova email da lavoro', '3 min fa');
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

// App icon interactions
document.addEventListener('DOMContentLoaded', function() {
    const appIcons = document.querySelectorAll('.app-icon');
    
    appIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        icon.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        icon.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
        });
    });
});

// Dock interactions
document.addEventListener('DOMContentLoaded', function() {
    const dockItems = document.querySelectorAll('.dock-item');
    
    dockItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

// Dynamic wallpaper effects
function initializeDynamicWallpaper() {
    const wallpaper = document.querySelector('.wallpaper');
    if (!wallpaper) return;
    
    const hour = new Date().getHours();
    let gradient;
    
    if (hour >= 6 && hour < 12) {
        // Morning
        gradient = 'linear-gradient(135deg, #FF9500 0%, #FFCC00 50%, #5AC8FA 100%)';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon
        gradient = 'linear-gradient(135deg, #007AFF 0%, #5856D6 50%, #FF2D92 100%)';
    } else if (hour >= 18 && hour < 22) {
        // Evening
        gradient = 'linear-gradient(135deg, #FF3B30 0%, #FF2D92 50%, #5856D6 100%)';
    } else {
        // Night
        gradient = 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #5856D6 100%)';
    }
    
    wallpaper.style.background = gradient;
    wallpaper.style.backgroundSize = '400% 400%';
}

// Initialize dynamic wallpaper
document.addEventListener('DOMContentLoaded', function() {
    initializeDynamicWallpaper();
    
    // Update wallpaper every hour
    setInterval(initializeDynamicWallpaper, 3600000);
});

// Search functionality (for future implementation)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        const appIcons = document.querySelectorAll('.app-icon');
        
        appIcons.forEach(icon => {
            const appName = icon.querySelector('span').textContent.toLowerCase();
            const shouldShow = appName.includes(query);
            
            icon.style.display = shouldShow ? 'flex' : 'none';
            
            if (shouldShow && query) {
                icon.style.animation = 'pulse 0.5s ease';
            }
        });
    }, 300));
}

// Widget interactions
function initializeWidgets() {
    const weatherWidget = document.querySelector('.weather-widget');
    if (!weatherWidget) return;
    
    weatherWidget.addEventListener('click', function() {
        // Could open weather app or show more details
        showToast('Widget meteo');
    });
    
    // Add swipe gestures for widgets
    let startX = 0;
    
    weatherWidget.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    weatherWidget.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            // Swipe detected - could switch between widgets
            updateWeatherWidget();
        }
    });
}

// Initialize widgets
document.addEventListener('DOMContentLoaded', function() {
    initializeWidgets();
});

// App organization (drag and drop for future implementation)
function initializeAppOrganization() {
    const appIcons = document.querySelectorAll('.app-icon');
    
    appIcons.forEach(icon => {
        icon.draggable = true;
        
        icon.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', '');
            this.style.opacity = '0.5';
        });
        
        icon.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
        
        icon.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        icon.addEventListener('drop', function(e) {
            e.preventDefault();
            // Could implement app reordering here
            showToast('App riorganizzata');
        });
    });
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`CronoOS Home screen loaded in ${loadTime}ms`);
        });
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', monitorPerformance);

// Accessibility improvements
function initializeAccessibility() {
    const appIcons = document.querySelectorAll('.app-icon');
    
    appIcons.forEach(icon => {
        // Add keyboard navigation
        icon.setAttribute('tabindex', '0');
        
        icon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add ARIA labels
        const appName = icon.querySelector('span').textContent;
        icon.setAttribute('aria-label', `Apri ${appName}`);
        icon.setAttribute('role', 'button');
    });
}

// Initialize accessibility
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Add CSS for context menu and drag effects
const homeStyles = document.createElement('style');
homeStyles.textContent = `
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
        font-size: var(--font-size-sm);
        color: var(--text-primary);
    }
    
    .context-menu-item:hover {
        background: var(--surface-color);
    }
    
    .context-menu-item:first-child {
        border-radius: 8px 8px 0 0;
    }
    
    .context-menu-item:last-child {
        border-radius: 0 0 8px 8px;
    }
    
    .context-menu-item i {
        width: 16px;
        text-align: center;
    }
    
    .app-icon.dragging {
        opacity: 0.5;
        transform: rotate(5deg);
    }
    
    .installed-app {
        position: relative;
    }
    
    .installed-app::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background: var(--cronos-green);
        border-radius: 50%;
        border: 2px solid var(--card-color);
    }
`;

document.head.appendChild(homeStyles);