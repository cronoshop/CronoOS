// Settings App JavaScript - CronoOS 2.1

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsApp();
    loadSettingsData();
    initializeSettingsControls();
    loadUserProfile();
    setupFontSelector();
    setupThemeSelector();
});

function initializeSettingsApp() {
    console.log('CronoOS 2.4 Settings initialized');
}

function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
    
    if (profile.name) {
        document.getElementById('profileName').textContent = profile.name;
    }
    if (profile.email) {
        document.getElementById('profileEmail').textContent = profile.email;
    }
    if (profile.avatar) {
        const img = document.getElementById('profileImage');
        const icon = document.getElementById('profileIcon');
        img.src = profile.avatar;
        img.style.display = 'block';
        icon.style.display = 'none';
    }
}

function loadSettingsData() {
    // Load saved settings
    const saved = localStorage.getItem('cronos_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        updateSettingsControls(settings);
        
        // Load AOD setting
        const aodToggle = document.getElementById('aodToggle');
        if (aodToggle) {
            aodToggle.checked = settings.aodEnabled || false;
        }
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
    
    // Update AOD toggle
    const aodToggle = document.getElementById('aodToggle');
    if (aodToggle) {
        aodToggle.checked = settings.aodEnabled || false;
    }
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
    
    // AOD toggle
    const aodToggle = document.getElementById('aodToggle');
    if (aodToggle) {
        aodToggle.addEventListener('change', toggleAOD);
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

function toggleAOD() {
    const aodToggle = document.getElementById('aodToggle');
    const enabled = aodToggle.checked;
    
    // Save AOD setting
    const settings = JSON.parse(localStorage.getItem('cronos_settings') || '{}');
    settings.aodEnabled = enabled;
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
    
    showToast(enabled ? 'Always-On Display attivato' : 'Always-On Display disattivato');
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

// Account Functions
function editProfile() {
    const name = prompt('Inserisci il tuo nome:', document.getElementById('profileName').textContent);
    if (name && name.trim()) {
        const email = prompt('Inserisci la tua email:', document.getElementById('profileEmail').textContent);
        if (email && email.trim()) {
            const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
            profile.name = name.trim();
            profile.email = email.trim();
            localStorage.setItem('cronos_user_profile', JSON.stringify(profile));
            
            document.getElementById('profileName').textContent = profile.name;
            document.getElementById('profileEmail').textContent = profile.email;
            
            showToast('Profilo aggiornato!');
        }
    }
}

function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
                profile.avatar = e.target.result;
                localStorage.setItem('cronos_user_profile', JSON.stringify(profile));
                
                const img = document.getElementById('profileImage');
                const icon = document.getElementById('profileIcon');
                img.src = e.target.result;
                img.style.display = 'block';
                icon.style.display = 'none';
                
                showToast('Avatar aggiornato!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function signOut() {
    if (confirm('Sei sicuro di voler uscire?')) {
        localStorage.removeItem('cronos_user_profile');
        document.getElementById('profileName').textContent = 'Utente CronoOS';
        document.getElementById('profileEmail').textContent = 'utente@cronos.com';
        
        const img = document.getElementById('profileImage');
        const icon = document.getElementById('profileIcon');
        img.style.display = 'none';
        icon.style.display = 'flex';
        
        showToast('Disconnesso con successo');
    }
}

function deleteAccount() {
    if (confirm('ATTENZIONE: Questa azione eliminerà permanentemente il tuo account e tutti i dati. Continuare?')) {
        if (confirm('Sei assolutamente sicuro? Questa azione non può essere annullata.')) {
            localStorage.clear();
            showToast('Account eliminato');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
}

// Lock Font Settings
function openLockFontSettings() {
    const modal = document.getElementById('lockFontModal');
    if (modal) {
        // Load current font selection
        const settings = JSON.parse(localStorage.getItem('cronos_lockscreen_settings') || '{}');
        const currentFont = settings.fontStyle || 'default';
        
        // Update UI
        document.querySelectorAll('.font-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.font === currentFont);
        });
        
        modal.classList.add('active');
    }
}

function closeLockFontModal() {
    const modal = document.getElementById('lockFontModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function setupFontSelector() {
    document.querySelectorAll('.font-option').forEach(option => {
        option.addEventListener('click', () => {
            const fontStyle = option.dataset.font;
            
            // Update selection
            document.querySelectorAll('.font-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Save setting
            const settings = JSON.parse(localStorage.getItem('cronos_lockscreen_settings') || '{}');
            settings.fontStyle = fontStyle;
            localStorage.setItem('cronos_lockscreen_settings', JSON.stringify(settings));
            
            showToast('Font orologio aggiornato!');
        });
    });
}

// Wallpaper Settings
function openWallpaperSettings() {
    const modal = document.getElementById('wallpaperModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeWallpaperModal() {
    const modal = document.getElementById('wallpaperModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleWallpaperUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const wallpaperData = e.target.result;
            localStorage.setItem('cronos_custom_wallpaper', wallpaperData);
            
            // Apply wallpaper immediately
            document.documentElement.style.setProperty('--custom-wallpaper', `url(${wallpaperData})`);
            
            showToast('Sfondo aggiornato!');
            closeWallpaperModal();
        };
        reader.readAsDataURL(file);
    }
}

// Theme Settings
function openThemeSettings() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        // Load current theme
        const settings = JSON.parse(localStorage.getItem('cronos_theme_settings') || '{}');
        const currentTheme = settings.colorTheme || 'blue';
        
        // Update UI
        document.querySelectorAll('.color-theme').forEach(theme => {
            theme.classList.toggle('selected', theme.dataset.theme === currentTheme);
        });
        
        modal.classList.add('active');
    }
}

function closeThemeModal() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function setupThemeSelector() {
    document.querySelectorAll('.color-theme').forEach(theme => {
        theme.addEventListener('click', () => {
            selectTheme(theme.dataset.theme);
        });
    });
}

function selectTheme(themeName) {
    // Update selection
    document.querySelectorAll('.color-theme').forEach(theme => {
        theme.classList.remove('selected');
    });
    document.querySelector(`[data-theme="${themeName}"]`).classList.add('selected');
    
    // Save setting
    const settings = JSON.parse(localStorage.getItem('cronos_theme_settings') || '{}');
    settings.colorTheme = themeName;
    localStorage.setItem('cronos_theme_settings', JSON.stringify(settings));
    
    showToast(`Tema ${themeName} applicato!`);
}

// Category Navigation Functions
function openAccountSettings(event) {
    event.stopPropagation();
    showToast('Apertura impostazioni account...');
    // Here you could navigate to a dedicated account settings page
}

function openDisplaySettings(event) {
    event.stopPropagation();
    showToast('Apertura impostazioni schermo...');
    // Here you could navigate to a dedicated display settings page
}

function openWallpaperSettings(event) {
    event.stopPropagation();
    openWallpaperSettings();
}

function openSoundsSettings(event) {
    event.stopPropagation();
    showToast('Apertura impostazioni audio...');
    // Here you could navigate to a dedicated sounds settings page
}

function openConnectivitySettings(event) {
    event.stopPropagation();
    showToast('Apertura impostazioni connettività...');
    // Here you could navigate to a dedicated connectivity settings page
}

function openPrivacySettings(event) {
    event.stopPropagation();
    showToast('Apertura impostazioni privacy...');
    // Here you could navigate to a dedicated privacy settings page
}

function openSystemSettings(event) {
    event.stopPropagation();
    showToast('Apertura impostazioni sistema...');
    // Here you could navigate to a dedicated system settings page
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
        isLocationEnabled: document.getElementById('locationToggle')?.checked !== false,
        aodEnabled: document.getElementById('aodToggle')?.checked || false
    };
    
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
}

// Search functionality
document.getElementById('searchSettingsBtn')?.addEventListener('click', function() {
    showToast('Ricerca impostazioni non ancora implementata');
});

// Profile edit
document.querySelector('.profile-edit')?.addEventListener('click', function() {
    editProfile();
});