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
    
    // Other toggles
    const hapticToggle = document.getElementById('hapticToggle');
    const keyboardSoundsToggle = document.getElementById('keyboardSoundsToggle');
    const autoLockToggle = document.getElementById('autoLockToggle');
    const airplaneModeToggle = document.getElementById('airplaneModeToggle');
    const locationToggle = document.getElementById('locationToggle');
    
    if (hapticToggle) {
        hapticToggle.addEventListener('change', function() {
            showToast(this.checked ? 'Vibrazione attivata' : 'Vibrazione disattivata');
            saveSettingsData();
        });
    }
    
    if (keyboardSoundsToggle) {
        keyboardSoundsToggle.addEventListener('change', function() {
            showToast(this.checked ? 'Suoni tastiera attivati' : 'Suoni tastiera disattivati');
            saveSettingsData();
        });
    }
    
    if (autoLockToggle) {
        autoLockToggle.addEventListener('change', function() {
            showToast(this.checked ? 'Auto-lock attivato' : 'Auto-lock disattivato');
            saveSettingsData();
        });
    }
    
    if (airplaneModeToggle) {
        airplaneModeToggle.addEventListener('change', function() {
            const enabled = this.checked;
            showToast(enabled ? 'Modalità aereo attivata' : 'Modalità aereo disattivata');
            
            // Disable other connectivity options when airplane mode is on
            if (wifiToggle) wifiToggle.disabled = enabled;
            if (bluetoothToggle) bluetoothToggle.disabled = enabled;
            
            saveSettingsData();
        });
    }
    
    if (locationToggle) {
        locationToggle.addEventListener('change', function() {
            showToast(this.checked ? 'Localizzazione attivata' : 'Localizzazione disattivata');
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
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveSettingsData() {
    const settings = {
        isDarkModeEnabled: document.getElementById('darkModeToggle')?.checked || false,
        brightnessLevel: document.getElementById('brightnessControl')?.value || 50,
        volumeLevel: document.getElementById('volumeControl')?.value || 70,
        isWifiEnabled: document.getElementById('wifiToggle')?.checked !== false,
        isBluetoothEnabled: document.getElementById('bluetoothToggle')?.checked !== false,
        isHapticEnabled: document.getElementById('hapticToggle')?.checked !== false,
        isKeyboardSoundsEnabled: document.getElementById('keyboardSoundsToggle')?.checked || false,
        isAutoLockEnabled: document.getElementById('autoLockToggle')?.checked !== false,
        isAirplaneModeEnabled: document.getElementById('airplaneModeToggle')?.checked || false,
        isLocationEnabled: document.getElementById('locationToggle')?.checked !== false
    };
    
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
}

// Search functionality
document.getElementById('searchSettingsBtn')?.addEventListener('click', function() {
    showToast('Ricerca impostazioni non ancora implementata');
});

// Profile edit
document.querySelector('.profile-edit')?.addEventListener('click', function() {
    showToast('Modifica profilo non ancora implementata');
}