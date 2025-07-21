// Always-On Display JavaScript - CronoOS 3.3.1 AetherFix

let selectedFont = 'default';
let customFonts = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeAOD();
    loadAODSettings();
    setupEventListeners();
    updatePreview();
    
    // Update preview every minute
    setInterval(updatePreview, 60000);
});

function initializeAOD() {
    console.log('AOD Settings initialized - CronoOS 3.3.1 AetherFix');
    
    // Load custom fonts from localStorage
    const savedFonts = localStorage.getItem('cronos_custom_fonts');
    if (savedFonts) {
        try {
            customFonts = JSON.parse(savedFonts);
            loadCustomFonts();
        } catch (e) {
            console.error('Error loading custom fonts:', e);
        }
    }
}

function loadAODSettings() {
    const settings = JSON.parse(localStorage.getItem('cronos_aod_settings') || '{}');
    
    // Load toggle states
    document.getElementById('aodToggle').checked = settings.enabled || false;
    document.getElementById('showTimeToggle').checked = settings.showTime !== false;
    document.getElementById('showDateToggle').checked = settings.showDate !== false;
    document.getElementById('showWeatherToggle').checked = settings.showWeather !== false;
    document.getElementById('showNotificationsToggle').checked = settings.showNotifications !== false;
    document.getElementById('pureBlackToggle').checked = settings.pureBlack || false;
    document.getElementById('dimBackgroundToggle').checked = settings.dimBackground !== false;
    
    // Load font setting
    selectedFont = settings.font || 'default';
    updateCurrentFontDisplay();
}

function setupEventListeners() {
    // Toggle event listeners
    document.getElementById('aodToggle').addEventListener('change', saveAndUpdatePreview);
    document.getElementById('showTimeToggle').addEventListener('change', saveAndUpdatePreview);
    document.getElementById('showDateToggle').addEventListener('change', saveAndUpdatePreview);
    document.getElementById('showWeatherToggle').addEventListener('change', saveAndUpdatePreview);
    document.getElementById('showNotificationsToggle').addEventListener('change', saveAndUpdatePreview);
    document.getElementById('pureBlackToggle').addEventListener('change', saveAndUpdatePreview);
    document.getElementById('dimBackgroundToggle').addEventListener('change', saveAndUpdatePreview);
    
    // Font file input
    document.getElementById('fontFileInput').addEventListener('change', handleFontUpload);
    
    // Font option selection
    document.querySelectorAll('.font-option').forEach(option => {
        option.addEventListener('click', () => selectFont(option.dataset.font));
    });
}

function saveAndUpdatePreview() {
    saveAODSettings();
    updatePreview();
    
    const aodEnabled = document.getElementById('aodToggle').checked;
    showToast(aodEnabled ? 'Always-On Display attivato' : 'Always-On Display disattivato');
}

function saveAODSettings() {
    const settings = {
        enabled: document.getElementById('aodToggle').checked,
        showTime: document.getElementById('showTimeToggle').checked,
        showDate: document.getElementById('showDateToggle').checked,
        showWeather: document.getElementById('showWeatherToggle').checked,
        showNotifications: document.getElementById('showNotificationsToggle').checked,
        pureBlack: document.getElementById('pureBlackToggle').checked,
        dimBackground: document.getElementById('dimBackgroundToggle').checked,
        font: selectedFont
    };
    
    localStorage.setItem('cronos_aod_settings', JSON.stringify(settings));
}

function updatePreview() {
    const preview = document.getElementById('aodPreview');
    const timeElement = document.getElementById('aodTimePreview');
    const dateElement = document.getElementById('aodDatePreview');
    
    // Add update animation
    preview.classList.add('aod-updating');
    setTimeout(() => preview.classList.remove('aod-updating'), 300);
    
    // Update time and date
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    dateElement.textContent = now.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'long'
    });
    
    // Apply settings to preview
    const settings = JSON.parse(localStorage.getItem('cronos_aod_settings') || '{}');
    
    // Toggle visibility
    preview.classList.toggle('hide-time', !settings.showTime);
    preview.classList.toggle('hide-date', !settings.showDate);
    preview.classList.toggle('hide-weather', !settings.showWeather);
    preview.classList.toggle('hide-notifications', !settings.showNotifications);
    
    // Background settings
    if (settings.pureBlack) {
        preview.style.background = '#000000';
    } else if (settings.dimBackground) {
        preview.classList.add('dim-background');
    } else {
        preview.classList.remove('dim-background');
        preview.style.background = '';
    }
    
    // Apply font
    applyFontToPreview();
}

function applyFontToPreview() {
    const timeElement = document.getElementById('aodTimePreview');
    timeElement.className = `aod-time font-${selectedFont}`;
}

function openFontSelector() {
    const modal = document.getElementById('fontSelectorModal');
    modal.classList.add('active');
    
    // Update active font option
    document.querySelectorAll('.font-option').forEach(option => {
        option.classList.toggle('active', option.dataset.font === selectedFont);
    });
}

function closeFontSelector() {
    const modal = document.getElementById('fontSelectorModal');
    modal.classList.remove('active');
}

function selectFont(fontName) {
    selectedFont = fontName;
    
    // Update active state
    document.querySelectorAll('.font-option').forEach(option => {
        option.classList.toggle('active', option.dataset.font === fontName);
    });
    
    // Update preview immediately
    applyFontToPreview();
}

function applySelectedFont() {
    saveAODSettings();
    updateCurrentFontDisplay();
    closeFontSelector();
    showToast(`Font "${selectedFont}" applicato`);
}

function updateCurrentFontDisplay() {
    const fontNameElement = document.getElementById('currentFontName');
    const displayName = selectedFont.charAt(0).toUpperCase() + selectedFont.slice(1);
    fontNameElement.textContent = displayName;
}

function handleFontUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name;
    const fontName = fileName.replace(/\.(ttf|otf)$/i, '').toLowerCase().replace(/\s+/g, '-');
    
    if (!fileName.match(/\.(ttf|otf)$/i)) {
        showToast('Formato file non supportato. Usa .ttf o .otf');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const fontData = e.target.result;
        
        // Create font face
        const fontFace = new FontFace(fontName, `url(${fontData})`);
        
        fontFace.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            
            // Save to custom fonts
            customFonts[fontName] = {
                name: fileName.replace(/\.(ttf|otf)$/i, ''),
                data: fontData
            };
            
            localStorage.setItem('cronos_custom_fonts', JSON.stringify(customFonts));
            
            // Add to font options
            addCustomFontOption(fontName, customFonts[fontName].name);
            
            showToast(`Font "${customFonts[fontName].name}" caricato con successo`);
        }).catch(function(error) {
            console.error('Error loading font:', error);
            showToast('Errore nel caricamento del font');
        });
    };
    
    reader.readAsDataURL(file);
}

function loadCustomFonts() {
    Object.keys(customFonts).forEach(fontKey => {
        const fontData = customFonts[fontKey];
        const fontFace = new FontFace(fontKey, `url(${fontData.data})`);
        
        fontFace.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            addCustomFontOption(fontKey, fontData.name);
        }).catch(function(error) {
            console.error('Error loading custom font:', error);
        });
    });
}

function addCustomFontOption(fontKey, fontName) {
    const fontOptions = document.getElementById('fontOptions');
    
    // Check if option already exists
    if (fontOptions.querySelector(`[data-font="${fontKey}"]`)) {
        return;
    }
    
    const option = document.createElement('div');
    option.className = 'font-option';
    option.dataset.font = fontKey;
    
    option.innerHTML = `
        <div class="font-preview" style="font-family: '${fontKey}';">00:52</div>
        <div class="font-name">${fontName}</div>
    `;
    
    option.addEventListener('click', () => selectFont(fontKey));
    fontOptions.appendChild(option);
    
    // Add CSS class for the font
    const style = document.createElement('style');
    style.textContent = `.font-${fontKey} { font-family: '${fontKey}', var(--font-family-display); }`;
    document.head.appendChild(style);
}

// Global functions
window.openFontSelector = openFontSelector;
window.closeFontSelector = closeFontSelector;
window.applySelectedFont = applySelectedFont;