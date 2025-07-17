// Home Screen JavaScript - One UI OS

document.addEventListener('DOMContentLoaded', function() {
    initializeHomeScreen();
    initializeQuickPanel();
    initializeNotifications();
});

function initializeHomeScreen() {
    // Add staggered animation to app icons
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add parallax effect to wallpaper
    initializeParallax();
    
    // Initialize weather widget
    updateWeatherWidget();
    
    console.log('Home screen initialized');
}

function initializeParallax() {
    const wallpaper = document.querySelector('.wallpaper');
    if (!wallpaper) return;
    
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        wallpaper.style.backgroundPosition = `${x}% ${y}%`;
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
}

function initializeNotifications() {
    // Add more dynamic notifications
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Simulate new notifications
    setTimeout(() => {
        addNotification('📱', 'Sistema', 'Aggiornamento disponibile', '1 min fa');
    }, 5000);
    
    setTimeout(() => {
        addNotification('📧', 'Gmail', 'Nuova email da lavoro', '3 min fa');
    }, 10000);
}

function addNotification(icon, title, text, time) {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification-item';
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
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
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        icon.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        icon.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.1)';
        });
    });
});

// Dock interactions
document.addEventListener('DOMContentLoaded', function() {
    const dockItems = document.querySelectorAll('.dock-item');
    
    dockItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) translateY(-5px)';
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
        gradient = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon
        gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (hour >= 18 && hour < 22) {
        // Evening
        gradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
        // Night
        gradient = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
    }
    
    wallpaper.style.background = gradient;
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
        showToast('Widget meteo - Funzionalità in arrivo!');
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
            showToast('Riorganizzazione app - Funzionalità in arrivo!');
        });
    });
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Home screen loaded in ${loadTime}ms`);
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