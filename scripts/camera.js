// Camera App JavaScript - CronoOS 2.3

let currentMode = 'photo';
let isRecording = false;
let flashMode = 'off';
let timerMode = 'off';
let gridEnabled = false;
let frontCamera = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeCameraApp();
    setupEventListeners();
    setupViewfinderInteraction();
});

function initializeCameraApp() {
    console.log('Camera app initialized');
    updateControlStates();
}

function setupEventListeners() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });
    
    // Control buttons
    document.getElementById('flashBtn').addEventListener('click', toggleFlash);
    document.getElementById('timerBtn').addEventListener('click', toggleTimer);
    document.getElementById('gridBtn').addEventListener('click', toggleGrid);
    document.getElementById('flipBtn').addEventListener('click', flipCamera);
    document.getElementById('switchCameraBtn').addEventListener('click', switchCamera);
    
    // Capture button
    document.getElementById('captureBtn').addEventListener('click', handleCapture);
    
    // Preview modal
    document.getElementById('previewCloseBtn').addEventListener('click', closePreview);
    document.getElementById('savePhotoBtn').addEventListener('click', savePhoto);
    document.getElementById('shareBtn').addEventListener('click', sharePhoto);
    document.getElementById('deleteBtn').addEventListener('click', deletePhoto);
}

function setupViewfinderInteraction() {
    const viewfinder = document.getElementById('viewfinder');
    const focusRing = document.getElementById('focusRing');
    
    viewfinder.addEventListener('click', (e) => {
        const rect = viewfinder.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Position focus ring
        focusRing.style.left = (x - 40) + 'px';
        focusRing.style.top = (y - 40) + 'px';
        
        // Show focus animation
        focusRing.classList.remove('active');
        setTimeout(() => {
            focusRing.classList.add('active');
        }, 10);
        
        // Hide after animation
        setTimeout(() => {
            focusRing.classList.remove('active');
        }, 1000);
        
        // Simulate focus feedback
        showToast('Messa a fuoco');
    });
}

function switchMode(mode) {
    currentMode = mode;
    
    // Update active mode button
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update capture button appearance
    const captureBtn = document.getElementById('captureBtn');
    const captureInner = captureBtn.querySelector('.capture-inner');
    
    if (mode === 'video') {
        captureInner.style.background = '#FF453A';
    } else {
        captureInner.style.background = 'white';
    }
    
    showToast(`Modalità ${mode.toUpperCase()} attivata`);
}

function toggleFlash() {
    const flashStates = ['off', 'on', 'auto'];
    const currentIndex = flashStates.indexOf(flashMode);
    flashMode = flashStates[(currentIndex + 1) % flashStates.length];
    
    const flashBtn = document.getElementById('flashBtn');
    const icon = flashBtn.querySelector('i');
    
    flashBtn.classList.toggle('active', flashMode !== 'off');
    
    switch (flashMode) {
        case 'off':
            icon.className = 'fas fa-bolt-slash';
            break;
        case 'on':
            icon.className = 'fas fa-bolt';
            break;
        case 'auto':
            icon.className = 'fas fa-magic';
            break;
    }
    
    showToast(`Flash: ${flashMode.toUpperCase()}`);
}

function toggleTimer() {
    const timerStates = ['off', '3s', '10s'];
    const currentIndex = timerStates.indexOf(timerMode);
    timerMode = timerStates[(currentIndex + 1) % timerStates.length];
    
    const timerBtn = document.getElementById('timerBtn');
    timerBtn.classList.toggle('active', timerMode !== 'off');
    
    showToast(timerMode === 'off' ? 'Timer disattivato' : `Timer: ${timerMode}`);
}

function toggleGrid() {
    gridEnabled = !gridEnabled;
    
    const gridBtn = document.getElementById('gridBtn');
    const gridLines = document.getElementById('gridLines');
    
    gridBtn.classList.toggle('active', gridEnabled);
    gridLines.classList.toggle('active', gridEnabled);
    
    showToast(gridEnabled ? 'Griglia attivata' : 'Griglia disattivata');
}

function flipCamera() {
    // Simulate camera flip animation
    const viewfinder = document.getElementById('viewfinder');
    viewfinder.style.transform = 'scaleX(-1)';
    
    setTimeout(() => {
        viewfinder.style.transform = 'scaleX(1)';
    }, 300);
    
    showToast('Fotocamera ruotata');
}

function switchCamera() {
    frontCamera = !frontCamera;
    
    // Simulate camera switch animation
    const viewfinder = document.getElementById('viewfinder');
    viewfinder.style.opacity = '0';
    
    setTimeout(() => {
        viewfinder.style.opacity = '1';
        showToast(frontCamera ? 'Fotocamera frontale' : 'Fotocamera posteriore');
    }, 300);
}

function handleCapture() {
    if (currentMode === 'video') {
        toggleVideoRecording();
    } else {
        capturePhoto();
    }
}

function capturePhoto() {
    const captureBtn = document.getElementById('captureBtn');
    
    // Disable button temporarily
    captureBtn.style.pointerEvents = 'none';
    
    if (timerMode !== 'off') {
        startTimer(() => {
            performPhotoCapture();
            captureBtn.style.pointerEvents = 'auto';
        });
    } else {
        performPhotoCapture();
        captureBtn.style.pointerEvents = 'auto';
    }
}

function startTimer(callback) {
    const timerDisplay = document.getElementById('timerDisplay');
    const seconds = timerMode === '3s' ? 3 : 10;
    let countdown = seconds;
    
    const timer = setInterval(() => {
        timerDisplay.textContent = countdown;
        timerDisplay.style.opacity = '1';
        
        // Animate timer
        setTimeout(() => {
            timerDisplay.style.opacity = '0';
        }, 800);
        
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            callback();
        }
    }, 1000);
}

function performPhotoCapture() {
    // Flash effect
    if (flashMode === 'on' || (flashMode === 'auto' && Math.random() > 0.5)) {
        showFlashEffect();
    }
    
    // Simulate photo capture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;
    
    // Create a gradient background as placeholder
    const gradient = ctx.createLinearGradient(0, 0, 400, 600);
    gradient.addColorStop(0, '#4343a3');
    gradient.addColorStop(1, '#a343a3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);
    
    // Add some text
    ctx.fillStyle = 'white';
    ctx.font = '24px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText('Foto CronoOS', 200, 300);
    ctx.font = '16px -apple-system';
    ctx.fillText(new Date().toLocaleString('it-IT'), 200, 330);
    
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Show preview
    showPhotoPreview(photoDataUrl);
    
    // Save to local storage (simulate gallery)
    savePhotoToGallery(photoDataUrl);
    
    showToast('Foto catturata!');
}

function toggleVideoRecording() {
    isRecording = !isRecording;
    const captureBtn = document.getElementById('captureBtn');
    
    captureBtn.classList.toggle('recording', isRecording);
    
    if (isRecording) {
        showToast('Registrazione avviata');
        // Simulate recording timer
        startRecordingTimer();
    } else {
        showToast('Registrazione terminata');
        stopRecordingTimer();
    }
}

let recordingTimer;
let recordingTime = 0;

function startRecordingTimer() {
    recordingTime = 0;
    recordingTimer = setInterval(() => {
        recordingTime++;
        const minutes = Math.floor(recordingTime / 60);
        const seconds = recordingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update UI with recording time (you could add a recording indicator)
        console.log('Recording time:', timeString);
    }, 1000);
}

function stopRecordingTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

function showFlashEffect() {
    const flashEffect = document.createElement('div');
    flashEffect.className = 'flash-effect active';
    document.body.appendChild(flashEffect);
    
    setTimeout(() => {
        document.body.removeChild(flashEffect);
    }, 300);
}

function showPhotoPreview(photoDataUrl) {
    const modal = document.getElementById('photoPreviewModal');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = photoDataUrl;
    modal.classList.add('active');
}

function closePreview() {
    const modal = document.getElementById('photoPreviewModal');
    modal.classList.remove('active');
}

function savePhoto() {
    showToast('Foto salvata in Galleria');
    closePreview();
}

function sharePhoto() {
    showToast('Condivisione foto...');
    // Simulate sharing
    setTimeout(() => {
        showToast('Foto condivisa!');
    }, 1500);
}

function deletePhoto() {
    if (confirm('Eliminare questa foto?')) {
        showToast('Foto eliminata');
        closePreview();
    }
}

function savePhotoToGallery(photoDataUrl) {
    // Get existing photos from localStorage
    let photos = JSON.parse(localStorage.getItem('cronos_gallery_photos') || '[]');
    
    // Add new photo
    const newPhoto = {
        id: Date.now(),
        dataUrl: photoDataUrl,
        timestamp: new Date().toISOString(),
        type: 'photo'
    };
    
    photos.unshift(newPhoto);
    
    // Keep only last 20 photos to avoid storage issues
    if (photos.length > 20) {
        photos = photos.slice(0, 20);
    }
    
    // Save back to localStorage
    localStorage.setItem('cronos_gallery_photos', JSON.stringify(photos));
}

function updateControlStates() {
    // Update all control button states
    const flashBtn = document.getElementById('flashBtn');
    const timerBtn = document.getElementById('timerBtn');
    const gridBtn = document.getElementById('gridBtn');
    const gridLines = document.getElementById('gridLines');
    
    flashBtn.classList.toggle('active', flashMode !== 'off');
    timerBtn.classList.toggle('active', timerMode !== 'off');
    gridBtn.classList.toggle('active', gridEnabled);
    gridLines.classList.toggle('active', gridEnabled);
}