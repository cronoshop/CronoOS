// Camera App JavaScript - One UI OS

let currentMode = 'photo';
let isFlashEnabled = false;
let isTimerEnabled = false;
let currentZoom = 1;
let isGridEnabled = false;
let captureCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeCameraApp();
    initializeCameraControls();
    initializeViewfinder();
});

function initializeCameraApp() {
    // Set initial mode
    switchMode('photo');
    
    // Initialize camera preview simulation
    initializeCameraPreview();
    
    console.log('Camera app initialized');
}

function initializeCameraPreview() {
    const preview = document.querySelector('.camera-preview');
    if (!preview) return;
    
    // Simulate camera feed with animated background
    const gradients = [
        'linear-gradient(45deg, #667eea, #764ba2)',
        'linear-gradient(45deg, #f093fb, #f5576c)',
        'linear-gradient(45deg, #4facfe, #00f2fe)',
        'linear-gradient(45deg, #43e97b, #38f9d7)'
    ];
    
    let currentGradient = 0;
    
    setInterval(() => {
        const placeholder = preview.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.background = gradients[currentGradient];
            currentGradient = (currentGradient + 1) % gradients.length;
        }
    }, 3000);
}

function switchMode(mode) {
    currentMode = mode;
    
    // Update mode buttons
    const modes = document.querySelectorAll('.mode');
    modes.forEach(m => m.classList.remove('active'));
    
    const activeMode = Array.from(modes).find(m => m.textContent.toLowerCase().includes(mode));
    if (activeMode) {
        activeMode.classList.add('active');
    }
    
    // Update capture button appearance
    updateCaptureButton();
    
    // Update UI based on mode
    updateModeUI(mode);
}

function updateCaptureButton() {
    const captureBtn = document.getElementById('captureBtn');
    const captureInner = captureBtn?.querySelector('.capture-inner');
    
    if (!captureBtn || !captureInner) return;
    
    if (currentMode === 'video') {
        captureBtn.classList.add('recording');
        captureInner.style.borderRadius = '4px';
    } else {
        captureBtn.classList.remove('recording');
        captureInner.style.borderRadius = '50%';
    }
}

function updateModeUI(mode) {
    const zoomControl = document.querySelector('.zoom-control');
    
    switch (mode) {
        case 'photo':
            if (zoomControl) zoomControl.style.display = 'flex';
            break;
        case 'video':
            if (zoomControl) zoomControl.style.display = 'flex';
            break;
        case 'portrait':
            if (zoomControl) zoomControl.style.display = 'none';
            break;
    }
}

function initializeCameraControls() {
    // Initialize viewfinder interactions
    const viewfinder = document.querySelector('.camera-viewfinder');
    if (viewfinder) {
        viewfinder.addEventListener('click', handleViewfinderTap);
    }
    
    // Initialize gesture controls
    initializeGestureControls();
}

function handleViewfinderTap(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Show focus indicator
    showFocusIndicator(x, y);
    
    // Simulate auto-focus
    simulateAutoFocus();
    
    hapticFeedback('light');
}

function showFocusIndicator(x, y) {
    const focusIndicator = document.getElementById('focusIndicator');
    if (!focusIndicator) return;
    
    focusIndicator.style.left = (x - 40) + 'px';
    focusIndicator.style.top = (y - 40) + 'px';
    focusIndicator.classList.add('active');
    
    setTimeout(() => {
        focusIndicator.classList.remove('active');
    }, 1000);
}

function simulateAutoFocus() {
    const preview = document.querySelector('.camera-preview');
    if (!preview) return;
    
    // Simulate focus animation
    preview.style.filter = 'blur(2px)';
    
    setTimeout(() => {
        preview.style.filter = 'blur(0px)';
    }, 300);
}

function initializeGestureControls() {
    const viewfinder = document.querySelector('.camera-viewfinder');
    if (!viewfinder) return;
    
    let startDistance = 0;
    let startZoom = currentZoom;
    
    // Pinch to zoom
    viewfinder.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            startDistance = getDistance(e.touches[0], e.touches[1]);
            startZoom = currentZoom;
        }
    });
    
    viewfinder.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scale = currentDistance / startDistance;
            const newZoom = Math.max(1, Math.min(10, startZoom * scale));
            
            if (Math.abs(newZoom - currentZoom) > 0.1) {
                setZoom(newZoom);
            }
        }
    });
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function initializeViewfinder() {
    // Initialize grid lines
    updateGridLines();
    
    // Initialize zoom display
    updateZoomDisplay();
}

function toggleFlash() {
    isFlashEnabled = !isFlashEnabled;
    const flashBtn = document.querySelector('.setting-btn');
    
    if (flashBtn) {
        flashBtn.classList.toggle('active', isFlashEnabled);
    }
    
    showToast(isFlashEnabled ? 'Flash attivato' : 'Flash disattivato');
    hapticFeedback('light');
}

function toggleTimer() {
    isTimerEnabled = !isTimerEnabled;
    showToast(isTimerEnabled ? 'Timer attivato (3s)' : 'Timer disattivato');
    hapticFeedback('light');
}

function toggleGrid() {
    isGridEnabled = !isGridEnabled;
    updateGridLines();
    showToast(isGridEnabled ? 'Griglia attivata' : 'Griglia disattivata');
}

function updateGridLines() {
    const gridLines = document.getElementById('gridLines');
    if (gridLines) {
        gridLines.classList.toggle('active', isGridEnabled);
    }
}

function setZoom(zoom) {
    currentZoom = Math.max(1, Math.min(10, zoom));
    updateZoomDisplay();
    updateZoomButtons();
    
    // Simulate zoom effect
    const preview = document.querySelector('.camera-preview');
    if (preview) {
        preview.style.transform = `scale(${1 + (currentZoom - 1) * 0.1})`;
    }
}

function updateZoomDisplay() {
    // Update zoom indicator if exists
    const zoomIndicator = document.querySelector('.zoom-indicator');
    if (zoomIndicator) {
        zoomIndicator.textContent = `${currentZoom.toFixed(1)}x`;
    }
}

function updateZoomButtons() {
    const zoomButtons = document.querySelectorAll('.zoom-btn');
    zoomButtons.forEach(btn => {
        btn.classList.remove('active');
        const zoomValue = parseFloat(btn.textContent);
        if (Math.abs(zoomValue - currentZoom) < 0.1) {
            btn.classList.add('active');
        }
    });
}

function switchCamera() {
    // Simulate camera switch animation
    const preview = document.querySelector('.camera-preview');
    if (!preview) return;
    
    preview.style.transform = 'scaleX(-1)';
    preview.style.filter = 'blur(5px)';
    
    setTimeout(() => {
        preview.style.transform = 'scaleX(1)';
        preview.style.filter = 'blur(0px)';
    }, 500);
    
    showToast('Fotocamera commutata');
    hapticFeedback('medium');
}

function capturePhoto() {
    if (currentMode === 'video') {
        toggleVideoRecording();
        return;
    }
    
    if (isTimerEnabled) {
        startCaptureTimer();
    } else {
        performCapture();
    }
}

function startCaptureTimer() {
    let countdown = 3;
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'capture-timer';
    timerDisplay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 72px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        z-index: 1000;
        animation: pulse 1s ease-in-out;
    `;
    
    document.body.appendChild(timerDisplay);
    
    const timerInterval = setInterval(() => {
        timerDisplay.textContent = countdown;
        hapticFeedback('medium');
        
        if (countdown === 0) {
            clearInterval(timerInterval);
            timerDisplay.remove();
            performCapture();
        }
        countdown--;
    }, 1000);
}

function performCapture() {
    captureCount++;
    
    // Flash effect
    if (isFlashEnabled || currentMode === 'photo') {
        showFlashEffect();
    }
    
    // Capture animation
    const captureBtn = document.getElementById('captureBtn');
    if (captureBtn) {
        captureBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            captureBtn.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Show capture success
    showCaptureSuccess();
    
    // Simulate saving
    setTimeout(() => {
        showToast(`Foto salvata (${captureCount})`);
    }, 500);
    
    hapticFeedback('heavy');
}

function showFlashEffect() {
    const flashOverlay = document.getElementById('flashOverlay');
    if (flashOverlay) {
        flashOverlay.classList.add('active');
        setTimeout(() => {
            flashOverlay.classList.remove('active');
        }, 100);
    }
}

function showCaptureSuccess() {
    const captureSuccess = document.getElementById('captureSuccess');
    if (captureSuccess) {
        captureSuccess.classList.add('active');
        setTimeout(() => {
            captureSuccess.classList.remove('active');
        }, 2000);
    }
}

let isRecording = false;
let recordingTimer;
let recordingDuration = 0;

function toggleVideoRecording() {
    if (!isRecording) {
        startVideoRecording();
    } else {
        stopVideoRecording();
    }
}

function startVideoRecording() {
    isRecording = true;
    recordingDuration = 0;
    
    const captureBtn = document.getElementById('captureBtn');
    if (captureBtn) {
        captureBtn.classList.add('recording');
    }
    
    // Show recording indicator
    showRecordingIndicator();
    
    // Start recording timer
    recordingTimer = setInterval(() => {
        recordingDuration++;
        updateRecordingIndicator(recordingDuration);
    }, 1000);
    
    showToast('Registrazione avviata');
    hapticFeedback('heavy');
}

function stopVideoRecording() {
    isRecording = false;
    clearInterval(recordingTimer);
    
    const captureBtn = document.getElementById('captureBtn');
    if (captureBtn) {
        captureBtn.classList.remove('recording');
    }
    
    hideRecordingIndicator();
    
    showToast(`Video salvato (${formatDuration(recordingDuration)})`);
    hapticFeedback('heavy');
}

function showRecordingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'recordingIndicator';
    indicator.innerHTML = `
        <div class="recording-dot"></div>
        <span class="recording-text">REC</span>
        <span class="recording-duration">00:00</span>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 100px;
        left: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(244, 67, 54, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        animation: slideInLeft 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
}

function updateRecordingIndicator(duration) {
    const durationElement = document.querySelector('.recording-duration');
    if (durationElement) {
        durationElement.textContent = formatDuration(duration);
    }
}

function hideRecordingIndicator() {
    const indicator = document.getElementById('recordingIndicator');
    if (indicator) {
        indicator.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => indicator.remove(), 300);
    }
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Camera settings menu
function showCameraSettings() {
    const settingsMenu = document.createElement('div');
    settingsMenu.className = 'camera-settings-menu';
    settingsMenu.innerHTML = `
        <div class="settings-header">
            <h3>Impostazioni Fotocamera</h3>
            <button onclick="closeCameraSettings()">×</button>
        </div>
        <div class="settings-options">
            <div class="setting-option" onclick="toggleGrid()">
                <span>Griglia</span>
                <div class="toggle-switch">
                    <input type="checkbox" ${isGridEnabled ? 'checked' : ''}>
                </div>
            </div>
            <div class="setting-option">
                <span>Qualità</span>
                <select>
                    <option>Alta (12MP)</option>
                    <option>Media (8MP)</option>
                    <option>Bassa (5MP)</option>
                </select>
            </div>
            <div class="setting-option">
                <span>Formato</span>
                <select>
                    <option>JPEG</option>
                    <option>RAW</option>
                    <option>HEIF</option>
                </select>
            </div>
        </div>
    `;
    
    settingsMenu.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--card-color);
        border-radius: 20px 20px 0 0;
        z-index: 2000;
        animation: slideInUp 0.3s ease;
        max-height: 50vh;
        overflow-y: auto;
    `;
    
    document.body.appendChild(settingsMenu);
}

function closeCameraSettings() {
    const settingsMenu = document.querySelector('.camera-settings-menu');
    if (settingsMenu) {
        settingsMenu.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => settingsMenu.remove(), 300);
    }
}

// Photo effects and filters
function initializePhotoEffects() {
    const effects = ['Normal', 'Vivid', 'Dramatic', 'Mono', 'Silhouette'];
    let currentEffect = 0;
    
    // Add swipe gesture for effects
    const viewfinder = document.querySelector('.camera-viewfinder');
    if (!viewfinder) return;
    
    let startX = 0;
    
    viewfinder.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
        }
    });
    
    viewfinder.addEventListener('touchend', function(e) {
        if (e.changedTouches.length === 1) {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 100) {
                if (diff > 0) {
                    // Swipe left - next effect
                    currentEffect = (currentEffect + 1) % effects.length;
                } else {
                    // Swipe right - previous effect
                    currentEffect = (currentEffect - 1 + effects.length) % effects.length;
                }
                
                applyPhotoEffect(effects[currentEffect]);
            }
        }
    });
}

function applyPhotoEffect(effect) {
    const preview = document.querySelector('.camera-preview');
    if (!preview) return;
    
    let filter = '';
    
    switch (effect) {
        case 'Vivid':
            filter = 'saturate(1.5) contrast(1.2)';
            break;
        case 'Dramatic':
            filter = 'contrast(1.5) brightness(0.9)';
            break;
        case 'Mono':
            filter = 'grayscale(1)';
            break;
        case 'Silhouette':
            filter = 'brightness(0.3) contrast(2)';
            break;
        default:
            filter = 'none';
    }
    
    preview.style.filter = filter;
    showToast(`Effetto: ${effect}`);
}

// Initialize photo effects
document.addEventListener('DOMContentLoaded', initializePhotoEffects);

// Add CSS for camera-specific animations
const cameraStyles = document.createElement('style');
cameraStyles.textContent = `
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
    
    @keyframes slideOutDown {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
    }
    
    .camera-settings-menu {
        padding: 20px;
    }
    
    .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .settings-header h3 {
        margin: 0;
        font-size: 18px;
    }
    
    .settings-header button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
    }
    
    .setting-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .setting-option:last-child {
        border-bottom: none;
    }
    
    .setting-option span {
        font-size: 16px;
        color: var(--text-primary);
    }
    
    .setting-option select {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--surface-color);
        color: var(--text-primary);
    }
`;

document.head.appendChild(cameraStyles);