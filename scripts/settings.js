// Settings App JavaScript - One UI OS

let buildTapCount =   0;
let isDeveloperModeEnabled = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsApp();
    loadSettingsData();
    initializeSettingsControls();
});

function initializeSettingsApp() {
    updateSettingsUI();
    console.log('Settings app initialized');
}

function loadSettingsData() {
    // Load saved settings
    const saved = localStorage.getItem('oneui_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        
        // Update UI controls
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
        'small': '14px',
        'medium': '16px',
        'large': '18px'
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

function updateSettingsUI() {
    // Update any dynamic UI elements
    updateConnectivityDescriptions();
}

function saveSettingsData() {
    const settings = {
        isDarkModeEnabled: document.getElementById('darkModeToggle')?.checked || false,
        brightnessLevel: document.getElementById('brightnessControl')?.value || 50,
        ringtoneVolume: document.getElementById('ringtoneVolume')?.value || 70,
        mediaVolume: document.getElementById('mediaVolume')?.value || 60,
        isWifiEnabled: document.getElementById('wifiToggle')?.checked !== false,
        isBluetoothEnabled: document.getElementById('bluetoothToggle')?.checked !== false,
        isMobileDataEnabled: document.getElementById('mobileDataToggle')?.checked !== false,
        isVibrationEnabled: document.getElementById('vibrationToggle')?.checked !== false,
        fontSize: document.getElementById('fontSizeSelect')?.value || 'medium'
    };
    
    localStorage.setItem('oneui_settings', JSON.stringify(settings));
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
        model: 'Galaxy S24 Ultra',
        android: '14',
        oneui: '6.1',
        build: 'UP1A.231005.007',
        ram: '12 GB',
        storage: '256 GB',
        processor: 'Snapdragon 8 Gen 3',
        battery: '5000 mAh',
        display: '6.8" Dynamic AMOLED 2X',
        camera: '200MP + 50MP + 12MP + 10MP',
        security: 'Knox 3.9',
        kernel: 'Linux 5.15.78',
        baseband: 'S928BXXU1AXK1',
        bootloader: 'S928BXXU1AXK1'
    };
    
    return systemInfo;
}

// Reset settings
function resetAllSettings() {
    if (!confirm('Ripristinare tutte le impostazioni ai valori predefiniti?')) {
        return;
    }
    
    // Clear saved settings
    localStorage.removeItem('oneui_settings');
    
    // Reset to defaults
    isDarkModeEnabled = false;
    isWifiEnabled = true;
    isBluetoothEnabled = true;
    brightnessLevel = 50;
    
    // Update UI
    applyTheme();
    loadSettingsData();
    updateSettingsUI();
    
    showToast('Impostazioni ripristinate');
    hapticFeedback('heavy');
}

// Export settings
function exportSettings() {
    const settings = localStorage.getItem('oneui_settings');
    if (!settings) {
        showToast('Nessuna impostazione da esportare');
        return;
    }
    
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oneui_settings.json';
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
                localStorage.setItem('oneui_settings', JSON.stringify(settings));
                
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
                            <div class="network-signal">📶</div>
                        </div>
                        <div class="network-item">
                            <div class="network-info">
                                <div class="network-name">Ufficio_WiFi</div>
                                <div class="network-status">Salvato</div>
                            </div>
                            <div class="network-signal">📶</div>
                        </div>
                        <div class="network-item">
                            <div class="network-info">
                                <div class="network-name">Vicini_WiFi</div>
                                <div class="network-status">Protetto</div>
                            </div>
                            <div class="network-signal">📶</div>
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
                            <div class="device-icon">🎧</div>
                        </div>
                        <div class="device-item">
                            <div class="device-info">
                                <div class="device-name">Galaxy Watch</div>
                                <div class="device-status">Disponibile</div>
                            </div>
                            <div class="device-icon">⌚</div>
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
        font-size: 16px;
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
        font-size: 16px;
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
    }
    
    .network-item:hover,
    .device-item:hover {
        background: var(--divider-color);
    }
    
    .network-item.active,
    .device-item.connected {
        background: rgba(25, 118, 210, 0.1);
        border-left: 3px solid var(--primary-color);
    }
    
    .network-info,
    .device-info {
        flex: 1;
    }
    
    .network-name,
    .device-name {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .network-status,
    .device-status {
        font-size: 14px;
        color: var(--text-secondary);
    }
    
    .network-signal,
    .device-icon {
        font-size: 20px;
    }
    
    .data-usage {
        background: var(--surface-color);
        padding: 16px;
        border-radius: 8px;
    }
    
    .usage-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 14px;
    }
    
    .usage-info span:first-child {
        color: var(--text-secondary);
    }
    
    .usage-info span:last-child {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .usage-bar {
        height: 8px;
        background: var(--divider-color);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .usage-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--oneui-green), var(--oneui-orange));
        border-radius: 4px;
        transition: width 0.3s ease;
    }
`;

document.head.appendChild(settingsStyles);