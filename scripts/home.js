// Home Screen JavaScript - CronoOS 2.1

document.addEventListener('DOMContentLoaded', function() {
    initializeHomeScreen();
    updateToggleStates();
});

function initializeHomeScreen() {
    // Add staggered animation to app icons
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
        icon.classList.add('fade-in');
    });
    
    // Initialize weather widget
    updateWeatherWidget();
    
    console.log('CronoOS 2.1 Home screen initialized');
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