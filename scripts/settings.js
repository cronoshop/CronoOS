// Settings App JavaScript - CronoOS 2.1

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsApp();
    loadSettingsData();
    initializeSettingsControls();
});

function initializeSettingsApp() {
    console.log('CronoOS 2.1 Settings initialized');
}

function loadSettingsData() {
    // Load saved settings
    const saved = localStorage.getItem('cronos_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        updateSettingsControls(settings);
    }
}

function updateSettingsControls(settings) {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = settings.isDarkModeEnabled || false;
    }
    
    // Brightness control
    const brightnessControl = document.getElementById('brightnessControl');
    if (brightnessControl) {
        brightnessControl.value = settings.brightnessLevel || 50;
    }
    
    // Volume control
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl) {
        volumeControl.value = settings.volumeLevel || 70;
    }
    
    // Connectivity toggles
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    
    if (wifiToggle) wifiToggle.checked = settings.isWifiEnabled !== false;
    if (bluetoothToggle) bluetoothToggle.checked = settings.isBluetoothEnabled !== false;
}

function initializeSettingsControls() {
    // Brightness control
    const brightnessControl = document.getElementById('brightnessControl');
    if (brightnessControl) {
        brightnessControl.addEventListener('input', function() {
            updateBrightness(this.value);
            saveSettingsData();
        });
    }
    
    // Volume control
    const volumeControl = document.getElementById('volumeControl');
    if (volumeControl) {
        volumeControl.addEventListener('input', function() {
            showToast(`Volume: ${this.value}%`);
            saveSettingsData();
        });
    }
    
    // Connectivity toggles
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    
    if (wifiToggle) {
        wifiToggle.addEventListener('change', function() {
            const enabled = this.checked;
            showToast(enabled ? 'Wi-Fi attivato' : 'Wi-Fi disattivato');
            saveSettingsData();
        });
    }
    
    if (bluetoothToggle) {
        bluetoothToggle.addEventListener('change', function() {
            const enabled = this.checked;
            showToast(enabled ? 'Bluetooth attivato' : 'Bluetooth disattivato');
            saveSettingsData();
        });
    }
}

function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId)?.closest('.settings-category');
    if (!category) return;
    
    const isExpanded = category.classList.contains('expanded');
    
    // Close all other categories
    document.querySelectorAll('.settings-category.expanded').forEach(cat => {
        if (cat !== category) {
            cat.classList.remove('expanded');
        }
    });
    
    // Toggle current category
    category.classList.toggle('expanded');
}

function openAboutDevice() {
    openModal('aboutModal');
}

function closeAboutModal() {
    closeModal('aboutModal');
}

function saveSettingsData() {
    const settings = {
        isDarkModeEnabled: document.getElementById('darkModeToggle')?.checked || false,
        brightnessLevel: document.getElementById('brightnessControl')?.value || 50,
        volumeLevel: document.getElementById('volumeControl')?.value || 70,
        isWifiEnabled: document.getElementById('wifiToggle')?.checked !== false,
        isBluetoothEnabled: document.getElementById('bluetoothToggle')?.checked !== false
    };
    
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
}