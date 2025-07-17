// Settings App JavaScript - CronoOS

let buildTapCount =   0;
let isDeveloperModeEnabled = false;
let isMaterialYouEnabled = false;
let isDynamicWallpaperEnabled = false;
let isPrivacyLockEnabled = false;
let quickPanelStyle = 'minimal';
let transitionEffect = 'slide';

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsApp();
    loadSettingsData();
    initializeSettingsControls();
    initializeAdvancedSettings();
});

function initializeSettingsApp() {
    updateSettingsUI();
    console.log('CronoOS Settings initialized');
}

function loadSettingsData() {
    // Load saved settings
    const saved = localStorage.getItem('cronos_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        
        // Update UI controls
        updateSettingsControls(settings);
        
        // Load advanced settings
        isMaterialYouEnabled = settings.isMaterialYouEnabled || false;
        isDynamicWallpaperEnabled = settings.isDynamicWallpaperEnabled || false;
        isPrivacyLockEnabled = settings.isPrivacyLockEnabled || false;
        quickPanelStyle = settings.quickPanelStyle || 'minimal';
        transitionEffect = settings.transitionEffect || 'slide';
    }
}

function updateSettingsControls(settings) {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = settings.isDarkModeEnabled || false;
    }
    
    // Material You toggle
    const materialYouToggle = document.getElementById('materialYouToggle');
    if (materialYouToggle) {
        materialYouToggle.checked = isMaterialYouEnabled;
    }
    
    // Dynamic wallpaper toggle
    const dynamicWallpaperToggle = document.getElementById('dynamicWallpaperToggle');
    if (dynamicWallpaperToggle) {
        dynamicWallpaperToggle.checked = isDynamicWallpaperEnabled;
    }
    
    // Privacy lock toggle
    const privacyLockToggle = document.getElementById('privacyLockToggle');
    if (privacyLockToggle) {
        privacyLockToggle.checked = isPrivacyLockEnabled;
    }
    
    // Quick panel style
    const quickPanelStyleSelect = document.getElementById('quickPanelStyle');
    if (quickPanelStyleSelect) {
        quickPanelStyleSelect.value = quickPanelStyle;
    }
    
    // Transition effects
    const transitionEffectsSelect = document.getElementById('transitionEffects');
    if (transitionEffectsSelect) {
        transitionEffectsSelect.value = transitionEffect;
    }
    
    // Brightness control
    const brightnessControl = document.getElementById('brightnessControl');
    if (brightnessControl) {
        brightnessControl.value = settings.brightnessLevel || 50;
    }
    
    // Volume controls
    const ringtoneVolume = document.getElementById('ringtoneVolume');
    const mediaVolume = document.getElementById('mediaVolume');
    
    if (ringtoneVolume) ringtoneVolume.value = settings.ringtoneVolume || 70;
    if (mediaVolume) mediaVolume.value = settings.mediaVolume || 60;
    
    // Connectivity toggles
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const mobileDataToggle = document.getElementById('mobileDataToggle');
    
    if (wifiToggle) wifiToggle.checked = settings.isWifiEnabled !== false;
    if (bluetoothToggle) bluetoothToggle.checked = settings.isBluetoothEnabled !== false;
    if (mobileDataToggle) mobileDataToggle.checked = settings.isMobileDataEnabled !== false;
    
    // Vibration toggle
    const vibrationToggle = document.getElementById('vibrationToggle');
    if (vibrationToggle) vibrationToggle.checked = settings.isVibrationEnabled !== false;
}

function initializeAdvancedSettings() {
    // Material You toggle
    const materialYouToggle = document.getElementById('materialYouToggle');
    if (materialYouToggle) {
        materialYouToggle.addEventListener('change', function() {
            toggleMaterialYou();
        });
    }
    
    // Dynamic wallpaper toggle
    const dynamicWallpaperToggle = document.getElementById('dynamicWallpaperToggle');
    if (dynamicWallpaperToggle) {
        dynamicWallpaperToggle.addEventListener('change', function() {
            toggleDynamicWallpaper();
        });
    }
    
    // Privacy lock toggle
    const privacyLockToggle = document.getElementById('privacyLockToggle');
    if (privacyLockToggle) {
        privacyLockToggle.addEventListener('change', function() {
            togglePrivacyLock();
        });
    }
    
    // Quick panel style
    const quickPanelStyleSelect = document.getElementById('quickPanelStyle');
    if (quickPanelStyleSelect) {
        quickPanelStyleSelect.addEventListener('change', function() {
            updateQuickPanelStyle(this.value);
        });
    }
    
    // Transition effects
    const transitionEffectsSelect = document.getElementById('transitionEffects');
    if (transitionEffectsSelect) {
        transitionEffectsSelect.addEventListener('change', function() {
            updateTransitionEffect(this.value);
        });
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
    
    // Volume controls
    const ringtoneVolume = document.getElementById('ringtoneVolume');
    const mediaVolume = document.getElementById('mediaVolume');
    
    if (ringtoneVolume) {
        ringtoneVolume.addEventListener('input', function() {
            showToast(`Volume suoneria: ${this.value}%`);
            saveSettingsData();
        });
    }
    
    if (mediaVolume) {
        mediaVolume.addEventListener('input', function() {
            showToast(`Volume media: ${this.value}%`);
            saveSettingsData();
        });
    }
    
    // Font size control
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            updateFontSize(this.value);
            saveSettingsData();
        });
    }
    
    // Connectivity toggles
    initializeConnectivityToggles();
    
    // Vibration toggle
    const vibrationToggle = document.getElementById('vibrationToggle');
    if (vibrationToggle) {
        vibrationToggle.addEventListener('change', function() {
            const enabled = this.checked;
            showToast(enabled ? 'Vibrazione attivata' : 'Vibrazione disattivata');
            saveSettingsData();
        });
    }
}

function toggleMaterialYou() {
    isMaterialYouEnabled = !isMaterialYouEnabled;
    
    if (isMaterialYouEnabled) {
        document.body.classList.add('material-you-enabled');
        showToast('Icone tinte a tema attivate');
    } else {
        document.body.classList.remove('material-you-enabled');
        showToast('Icone tinte a tema disattivate');
    }
    
    saveSettingsData();
}

function toggleDynamicWallpaper() {
    isDynamicWallpaperEnabled = !isDynamicWallpaperEnabled;
    
    showToast(isDynamicWallpaperEnabled ? 'Sfondo dinamico AI attivato' : 'Sfondo dinamico AI disattivato');
    saveSettingsData();
}

function togglePrivacyLock() {
    isPrivacyLockEnabled = !isPrivacyLockEnabled;
    
    if (isPrivacyLockEnabled) {
        document.body.style.pointerEvents = 'none';
        showToast('Privacy Touch Lock attivato - Sblocca per continuare');
        
        // Show unlock prompt
        setTimeout(() => {
            if (confirm('Sbloccare il dispositivo?')) {
                document.body.style.pointerEvents = 'auto';
                showToast('Dispositivo sbloccato');
            }
        }, 1000);
    } else {
        document.body.style.pointerEvents = 'auto';
        showToast('Privacy Touch Lock disattivato');
    }
    
    saveSettingsData();
}

function updateQuickPanelStyle(style) {
    quickPanelStyle = style;
    
    const quickPanel = document.getElementById('quickPanel');
    if (quickPanel) {
        quickPanel.className = `quick-panel ${style}-style`;
    }
    
    showToast(`Stile Quick Panel: ${style}`);
    saveSettingsData();
}

function updateTransitionEffect(effect) {
    transitionEffect = effect;
    
    document.documentElement.style.setProperty('--app-transition', getTransitionCSS(effect));
    
    showToast(`Effetto transizione: ${effect}`);
    saveSettingsData();
}

function getTransitionCSS(effect) {
    switch (effect) {
        case 'fade':
            return 'opacity 0.3s ease';
        case 'slide':
            return 'transform 0.3s ease';
        case 'bounce':
            return 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        default:
            return 'all 0.3s ease';
    }
}

function showWallpaperSettings() {
    showToast('Impostazioni sfondo - Funzionalità avanzata');
}

function initializeConnectivityToggles() {
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const mobileDataToggle = document.getElementById('mobileDataToggle');
    
    if (wifiToggle) {
        wifiToggle.addEventListener('change', function() {
            const enabled = this.checked;
            updateConnectivityStatus('wifi', enabled);
            showToast(enabled ? 'Wi-Fi attivato' : 'Wi-Fi disattivato');
            saveSettingsData();
        });
    }
    
    if (bluetoothToggle) {
        bluetoothToggle.addEventListener('change', function() {
            const enabled = this.checked;
            updateConnectivityStatus('bluetooth', enabled);
            showToast(enabled ? 'Bluetooth attivato' : 'Bluetooth disattivato');
            saveSettingsData();
        });
    }
    
    if (mobileDataToggle) {
        mobileDataToggle.addEventListener('change', function() {
            const enabled = this.checked;
            updateConnectivityStatus('mobileData', enabled);
            showToast(enabled ? 'Dati mobili attivati' : 'Dati mobili disattivati');
            saveSettingsData();
        });
    }
}

function updateConnectivityStatus(type, enabled) {
    // Update global connectivity state
    switch (type) {
        case 'wifi':
            isWifiEnabled = enabled;
            break;
        case 'bluetooth':
            isBluetoothEnabled = enabled;
            break;
        case 'mobileData':
            // Update mobile data state
            break;
    }
    
    // Update status descriptions
    updateConnectivityDescriptions();
}

function updateConnectivityDescriptions() {
    const wifiDescription = document.querySelector('#connectivity .setting-item:nth-child(1) .setting-description');
    const bluetoothDescription = document.querySelector('#connectivity .setting-item:nth-child(2) .setting-description');
    
    if (wifiDescription) {
        wifiDescription.textContent = isWifiEnabled ? 'Casa_WiFi_5G' : 'Disconnesso';
    }
    
    if (bluetoothDescription) {
        bluetoothDescription.textContent = isBluetoothEnabled ? 'AirPods Pro' : 'Disconnesso';
    }
}

function updateFontSize(size) {
    const sizeMap = {
        'small': '13px',
        'medium': '15px',
        'large': '17px'
    };
    
    document.documentElement.style.fontSize = sizeMap[size] || '16px';
    showToast(`Dimensione font: ${size}`);
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
    
    hapticFeedback('light');
}

function openAboutDevice() {
    openModal('aboutModal');
}

function closeAboutModal() {
    closeModal('aboutModal');
    buildTapCount = 0; // Reset build tap count when closing
}

function handleBuildTap() {
    buildTapCount++;
    
    if (buildTapCount >= 7) {
        if (!isDeveloperModeEnabled) {
            isDeveloperModeEnabled = true;
            openModal('developerModal');
            buildTapCount = 0;
        } else {
            showToast('Opzioni sviluppatore già attivate');
        }
    } else {
        const remaining = 7 - buildTapCount;
        if (remaining <= 3) {
            showToast(`${remaining} tap per attivare opzioni sviluppatore`);
        }
    }
    
    hapticFeedback('light');
}

function closeDeveloperModal() {
    closeModal('developerModal');
}

function openEasterEggGame() {
    closeDeveloperModal();
    openModal('easterEggModal');
}

function closeEasterEggModal() {
    closeModal('easterEggModal');
}

function animateLogo() {
    const logo = document.querySelector('.logo-animation');
    if (logo) {
        logo.style.animation = 'logoSpin 2s ease-in-out';
        setTimeout(() => {
            logo.style.animation = '';
        }, 2000);
    }
    showToast('Logo animato!');
}

function showCredits() {
    const creditsModal = document.createElement('div');
    creditsModal.className = 'credits-modal';
    creditsModal.innerHTML = `
        <div class="credits-content">
            <h3><i class="fas fa-heart"></i> Crediti CronoOS</h3>
            <div class="credits-list">
                <div class="credit-item">
                    <strong>Sistema Operativo:</strong> CronoOS Team
                </div>
                <div class="credit-item">
                    <strong>Design UI/UX:</strong> Ispirato a iOS e Material Design
                </div>
                <div class="credit-item">
                    <strong>Icone:</strong> Font Awesome
                </div>
                <div class="credit-item">
                    <strong>Tecnologie:</strong> HTML5, CSS3, JavaScript
                </div>
                <div class="credit-item">
                    <strong>Versione:</strong> 1.2 "Stellar"
                </div>
            </div>
            <button class="btn-primary" onclick="closeCredits()">Chiudi</button>
        </div>
    `;
    
    creditsModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(creditsModal);
}

function closeCredits() {
    const creditsModal = document.querySelector('.credits-modal');
    if (creditsModal) {
        creditsModal.remove();
    }
}

function updateSettingsUI() {
    // Update any dynamic UI elements
    updateConnectivityDescriptions();
}

function saveSettingsData() {
    const settings = {
        isDarkModeEnabled: document.getElementById('darkModeToggle')?.checked || false,
        isMaterialYouEnabled: isMaterialYouEnabled,
        isDynamicWallpaperEnabled: isDynamicWallpaperEnabled,
        isPrivacyLockEnabled: isPrivacyLockEnabled,
        quickPanelStyle: quickPanelStyle,
        transitionEffect: transitionEffect,
        brightnessLevel: document.getElementById('brightnessControl')?.value || 50,
        ringtoneVolume: document.getElementById('ringtoneVolume')?.value || 70,
        mediaVolume: document.getElementById('mediaVolume')?.value || 60,
        isWifiEnabled: document.getElementById('wifiToggle')?.checked !== false,
        isBluetoothEnabled: document.getElementById('bluetoothToggle')?.checked !== false,
        isMobileDataEnabled: document.getElementById('mobileDataToggle')?.checked !== false,
        isVibrationEnabled: document.getElementById('vibrationToggle')?.checked !== false,
        fontSize: document.getElementById('fontSizeSelect')?.value || 'medium'
    };
    
    localStorage.setItem('cronos_settings', JSON.stringify(settings));
}

// Advanced settings functions
function showAdvancedSettings() {
    const advancedModal = document.createElement('div');
    advancedModal.className = 'advanced-settings-modal';
    advancedModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Impostazioni Avanzate</h3>
                <button onclick="closeAdvancedSettings()">×</button>
            </div>
            <div class="advanced-settings-content">
                <div class="setting-group">
                    <h4>Performance</h4>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">Animazioni</div>
                            <div class="setting-description">Velocità animazioni sistema</div>
                        </div>
                        <select id="animationSpeed">
                            <option value="0.5">0.5x</option>
                            <option value="1" selected>1x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">Risparmio batteria</div>
                            <div class="setting-description">Limita performance per risparmiare batteria</div>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="batterySaver">
                            <label for="batterySaver"></label>
                        </div>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>Privacy</h4>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">Posizione</div>
                            <div class="setting-description">Consenti alle app di accedere alla posizione</div>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="locationAccess" checked>
                            <label for="locationAccess"></label>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">Microfono</div>
                            <div class="setting-description">Consenti alle app di accedere al microfono</div>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="microphoneAccess" checked>
                            <label for="microphoneAccess"></label>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">Fotocamera</div>
                            <div class="setting-description">Consenti alle app di accedere alla fotocamera</div>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="cameraAccess" checked>
                            <label for="cameraAccess"></label>
                        </div>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>Sicurezza</h4>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">Blocco schermo</div>
                            <div class="setting-description">Metodo di sblocco</div>
                        </div>
                        <select id="lockMethod">
                            <option value="none">Nessuno</option>
                            <option value="pattern">Sequenza</option>
                            <option value="pin">PIN</option>
                            <option value="password">Password</option>
                            <option value="fingerprint" selected>Impronta</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-title">App sconosciute</div>
                            <div class="setting-description">Consenti installazione da fonti sconosciute</div>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="unknownSources">
                            <label for="unknownSources"></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    advancedModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
        overflow-y: auto;
    `;
    
    document.body.appendChild(advancedModal);
}

function closeAdvancedSettings() {
    const advancedModal = document.querySelector('.advanced-settings-modal');
    if (advancedModal) {
        advancedModal.remove();
    }
}

// System information functions
function showSystemInfo() {
    const systemInfo = {
        model: 'CronoPhone Pro',
        os: 'CronoOS 1.2',
        ui: 'CronoUI 1.2',
        build: 'CRN1A.250115.001',
        ram: '12 GB',
        storage: '256 GB',
        processor: 'CronoChip A1',
        battery: '5000 mAh',
        display: '6.7" Super Retina XDR',
        camera: '108MP + 48MP + 12MP',
        security: 'CronoSecure 1.0',
        kernel: 'CronoKernel 1.2.1'
    };
    
    return systemInfo;
}

// Reset settings
function resetAllSettings() {
    if (!confirm('Ripristinare tutte le impostazioni ai valori predefiniti?')) {
        return;
    }
    
    // Clear saved settings
    localStorage.removeItem('cronos_settings');
    
    // Reset to defaults
    isDarkModeEnabled = false;
    isMaterialYouEnabled = false;
    isDynamicWallpaperEnabled = false;
    isPrivacyLockEnabled = false;
    isWifiEnabled = true;
    isBluetoothEnabled = true;
    brightnessLevel = 50;
    quickPanelStyle = 'minimal';
    transitionEffect = 'slide';
    
    // Update UI
    applyTheme();
    loadSettingsData();
    updateSettingsUI();
    
    showToast('Impostazioni ripristinate');
    hapticFeedback('heavy');
}

// Export settings
function exportSettings() {
    const settings = localStorage.getItem('cronos_settings');
    if (!settings) {
        showToast('Nessuna impostazione da esportare');
        return;
    }
    
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cronos_settings.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Impostazioni esportate');
}

// Import settings
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                localStorage.setItem('cronos_settings', JSON.stringify(settings));
                
                // Reload settings
                loadSettingsData();
                updateSettingsUI();
                applyTheme();
                
                showToast('Impostazioni importate');
                hapticFeedback('medium');
            } catch (error) {
                showToast('Errore nell\'importazione delle impostazioni');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Network settings
function showNetworkSettings() {
    const networkModal = document.createElement('div');
    networkModal.className = 'network-settings-modal';
    networkModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Impostazioni di Rete</h3>
                <button onclick="closeNetworkSettings()">×</button>
            </div>
            <div class="network-settings-content">
                <div class="network-section">
                    <h4>Wi-Fi</h4>
                    <div class="wifi-networks">
                        <div class="network-item active">
                            <div class="network-info">
                                <div class="network-name">Casa_WiFi_5G</div>
                                <div class="network-status">Connesso • Eccellente</div>
                            </div>
                            <div class="network-signal"><i class="fas fa-wifi"></i></div>
                        </div>
                        <div class="network-item">
                            <div class="network-info">
                                <div class="network-name">Ufficio_WiFi</div>
                                <div class="network-status">Salvato</div>
                            </div>
                            <div class="network-signal"><i class="fas fa-wifi"></i></div>
                        </div>
                        <div class="network-item">
                            <div class="network-info">
                                <div class="network-name">Vicini_WiFi</div>
                                <div class="network-status">Protetto</div>
                            </div>
                            <div class="network-signal"><i class="fas fa-wifi"></i></div>
                        </div>
                    </div>
                </div>
                
                <div class="network-section">
                    <h4>Bluetooth</h4>
                    <div class="bluetooth-devices">
                        <div class="device-item connected">
                            <div class="device-info">
                                <div class="device-name">AirPods Pro</div>
                                <div class="device-status">Connesso • Audio</div>
                            </div>
                            <div class="device-icon"><i class="fas fa-headphones"></i></div>
                        </div>
                        <div class="device-item">
                            <div class="device-info">
                                <div class="device-name">Galaxy Watch</div>
                                <div class="device-status">Disponibile</div>
                            </div>
                            <div class="device-icon"><i class="fas fa-clock"></i></div>
                        </div>
                    </div>
                </div>
                
                <div class="network-section">
                    <h4>Dati Mobili</h4>
                    <div class="data-usage">
                        <div class="usage-info">
                            <span>Utilizzo questo mese:</span>
                            <span>2.4 GB di 10 GB</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-fill" style="width: 24%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    networkModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
        overflow-y: auto;
    `;
    
    document.body.appendChild(networkModal);
}

function closeNetworkSettings() {
    const networkModal = document.querySelector('.network-settings-modal');
    if (networkModal) {
        networkModal.remove();
    }
}

// Add CSS for settings-specific styles
const settingsStyles = document.createElement('style');
settingsStyles.textContent = `
    .updates-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
    
    .update-item {
        background: var(--surface-color);
        border-radius: 12px;
        padding: var(--spacing-md);
        border: 1px solid var(--divider-color);
    }
    
    .update-version {
        font-size: var(--font-size-md);
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: var(--spacing-xs);
    }
    
    .update-date {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-sm);
    }
    
    .update-notes {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        line-height: 1.5;
    }
    
    .easter-egg-game {
        text-align: center;
        padding: var(--spacing-lg);
    }
    
    .game-logo {
        margin-bottom: var(--spacing-lg);
    }
    
    .logo-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        font-size: 32px;
        color: var(--primary-color);
        font-weight: 600;
    }
    
    .logo-animation i {
        font-size: 48px;
    }
    
    @keyframes logoSpin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .game-info {
        margin-bottom: var(--spacing-lg);
    }
    
    .game-info p {
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
    }
    
    .game-controls {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
    }
    
    .game-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: 8px;
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }
    
    .game-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }
    
    .credits-content {
        background: var(--card-color);
        border-radius: 16px;
        padding: var(--spacing-xl);
        max-width: 400px;
        width: 90%;
        text-align: center;
    }
    
    .credits-content h3 {
        margin-bottom: var(--spacing-lg);
        color: var(--primary-color);
    }
    
    .credits-list {
        text-align: left;
        margin-bottom: var(--spacing-lg);
    }
    
    .credit-item {
        margin-bottom: var(--spacing-sm);
        font-size: var(--font-size-sm);
        color: var(--text-primary);
    }
    
    .advanced-settings-content {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .setting-group {
        margin-bottom: 32px;
    }
    
    .setting-group h4 {
        margin: 0 0 16px 0;
        color: var(--primary-color);
        font-size: var(--font-size-md);
        font-weight: 500;
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 8px;
    }
    
    .network-settings-content {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .network-section {
        margin-bottom: 32px;
    }
    
    .network-section h4 {
        margin: 0 0 16px 0;
        color: var(--primary-color);
        font-size: var(--font-size-md);
        font-weight: 500;
    }
    
    .wifi-networks,
    .bluetooth-devices {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .network-item,
    .device-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        background: var(--surface-color);
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        border: 1px solid var(--divider-color);
    }
    
    .network-item:hover,
    .device-item:hover {
        background: rgba(0, 122, 255, 0.05);
    }
    
    .network-item.active,
    .device-item.connected {
        background: rgba(0, 122, 255, 0.1);
        border-color: var(--primary-color);
    }
    
    .network-info,
    .device-info {
        flex: 1;
    }
    
    .network-name,
    .device-name {
        font-size: var(--font-size-md);
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .network-status,
    .device-status {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
    }
    
    .network-signal,
    .device-icon {
        font-size: 20px;
        color: var(--primary-color);
    }
    
    .data-usage {
        background: var(--surface-color);
        padding: 16px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
    }
    
    .usage-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: var(--font-size-sm);
    }
    
    .usage-info span:first-child {
        color: var(--text-secondary);
    }
    
    .usage-info span:last-child {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .usage-bar {
        height: 6px;
        background: var(--divider-color);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .usage-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--cronos-green), var(--cronos-orange));
        border-radius: 3px;
        transition: width 0.3s ease;
    }
`;

document.head.appendChild(settingsStyles);