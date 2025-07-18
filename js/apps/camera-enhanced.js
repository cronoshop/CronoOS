// Enhanced Camera App - CronoOS 3.1

class CameraApp {
    constructor() {
        this.stream = null;
        this.currentMode = 'photo';
        this.isRecording = false;
        this.flashMode = 'off';
        this.timerMode = 'off';
        this.gridEnabled = false;
        this.frontCamera = false;
        this.photos = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPhotos();
        console.log('Enhanced Camera App initialized - CronoOS 3.1');
    }

    setupEventListeners() {
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        // Control buttons
        document.getElementById('flashBtn').addEventListener('click', () => this.toggleFlash());
        document.getElementById('timerBtn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('gridBtn').addEventListener('click', () => this.toggleGrid());
        document.getElementById('flipBtn').addEventListener('click', () => this.flipCamera());
        document.getElementById('switchCameraBtn').addEventListener('click', () => this.switchCamera());
        
        // Capture button
        document.getElementById('captureBtn').addEventListener('click', () => this.handleCapture());
        
        // Preview modal
        document.getElementById('previewCloseBtn').addEventListener('click', () => this.closePreview());
        document.getElementById('savePhotoBtn').addEventListener('click', () => this.savePhoto());
        document.getElementById('shareBtn').addEventListener('click', () => this.sharePhoto());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deletePhoto());
        
        // Viewfinder interaction
        this.setupViewfinderInteraction();
    }

    setupViewfinderInteraction() {
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
            
            // Play focus sound
            cronos.playSound('click');
            cronos.showToast('Messa a fuoco', 'info');
        });
    }

    async requestCameraPermission() {
        const accessMessage = document.getElementById('cameraAccessMessage');
        
        try {
            this.stream = await cronos.requestCameraAccess();
            
            if (this.stream) {
                const video = document.getElementById('cameraFeed');
                video.srcObject = this.stream;
                
                // Hide access message
                accessMessage.style.display = 'none';
                
                cronos.showToast('Fotocamera attivata', 'success');
                cronos.playSound('success');
            }
        } catch (error) {
            console.error('Camera permission error:', error);
            cronos.showToast('Errore accesso fotocamera', 'error');
            cronos.playSound('error');
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        
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
        
        cronos.showToast(`Modalità ${mode.toUpperCase()} attivata`, 'info');
        cronos.playSound('click');
    }

    toggleFlash() {
        const flashStates = ['off', 'on', 'auto'];
        const currentIndex = flashStates.indexOf(this.flashMode);
        this.flashMode = flashStates[(currentIndex + 1) % flashStates.length];
        
        const flashBtn = document.getElementById('flashBtn');
        const icon = flashBtn.querySelector('i');
        
        flashBtn.classList.toggle('active', this.flashMode !== 'off');
        
        switch (this.flashMode) {
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
        
        cronos.showToast(`Flash: ${this.flashMode.toUpperCase()}`, 'info');
        cronos.playSound('click');
    }

    toggleTimer() {
        const timerStates = ['off', '3s', '10s'];
        const currentIndex = timerStates.indexOf(this.timerMode);
        this.timerMode = timerStates[(currentIndex + 1) % timerStates.length];
        
        const timerBtn = document.getElementById('timerBtn');
        timerBtn.classList.toggle('active', this.timerMode !== 'off');
        
        cronos.showToast(this.timerMode === 'off' ? 'Timer disattivato' : `Timer: ${this.timerMode}`, 'info');
        cronos.playSound('click');
    }

    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
        
        const gridBtn = document.getElementById('gridBtn');
        const gridLines = document.getElementById('gridLines');
        
        gridBtn.classList.toggle('active', this.gridEnabled);
        gridLines.classList.toggle('active', this.gridEnabled);
        
        cronos.showToast(this.gridEnabled ? 'Griglia attivata' : 'Griglia disattivata', 'info');
        cronos.playSound('click');
    }

    flipCamera() {
        // Simulate camera flip animation
        const viewfinder = document.getElementById('viewfinder');
        viewfinder.style.transform = 'scaleX(-1)';
        
        setTimeout(() => {
            viewfinder.style.transform = 'scaleX(1)';
        }, 300);
        
        cronos.showToast('Fotocamera ruotata', 'info');
        cronos.playSound('click');
    }

    async switchCamera() {
        this.frontCamera = !this.frontCamera;
        
        if (this.stream) {
            // Stop current stream
            this.stream.getTracks().forEach(track => track.stop());
            
            try {
                // Request new stream with different camera
                this.stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: this.frontCamera ? 'user' : 'environment' },
                    audio: false 
                });
                
                const video = document.getElementById('cameraFeed');
                video.srcObject = this.stream;
                
                cronos.showToast(this.frontCamera ? 'Fotocamera frontale' : 'Fotocamera posteriore', 'info');
                cronos.playSound('click');
            } catch (error) {
                console.error('Camera switch error:', error);
                cronos.showToast('Errore cambio fotocamera', 'error');
            }
        }
    }

    handleCapture() {
        if (this.currentMode === 'video') {
            this.toggleVideoRecording();
        } else {
            this.capturePhoto();
        }
    }

    capturePhoto() {
        if (!this.stream) {
            cronos.showToast('Fotocamera non disponibile', 'error');
            return;
        }

        const captureBtn = document.getElementById('captureBtn');
        
        // Disable button temporarily
        captureBtn.style.pointerEvents = 'none';
        
        if (this.timerMode !== 'off') {
            this.startTimer(() => {
                this.performPhotoCapture();
                captureBtn.style.pointerEvents = 'auto';
            });
        } else {
            this.performPhotoCapture();
            captureBtn.style.pointerEvents = 'auto';
        }
    }

    startTimer(callback) {
        const timerDisplay = document.getElementById('timerDisplay');
        const seconds = this.timerMode === '3s' ? 3 : 10;
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

    performPhotoCapture() {
        // Flash effect
        if (this.flashMode === 'on' || (this.flashMode === 'auto' && Math.random() > 0.5)) {
            this.showFlashEffect();
        }
        
        // Capture from video stream
        const video = document.getElementById('cameraFeed');
        const canvas = document.getElementById('captureCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Show preview
        this.showPhotoPreview(photoDataUrl);
        
        // Save to photos array
        this.savePhotoToGallery(photoDataUrl);
        
        cronos.showToast('Foto catturata!', 'success');
        cronos.playSound('success');
    }

    showFlashEffect() {
        const flashEffect = document.createElement('div');
        flashEffect.className = 'flash-effect active';
        document.body.appendChild(flashEffect);
        
        setTimeout(() => {
            document.body.removeChild(flashEffect);
        }, 300);
    }

    showPhotoPreview(photoDataUrl) {
        const modal = document.getElementById('photoPreviewModal');
        const previewImage = document.getElementById('previewImage');
        
        previewImage.src = photoDataUrl;
        modal.classList.add('active');
    }

    closePreview() {
        const modal = document.getElementById('photoPreviewModal');
        modal.classList.remove('active');
    }

    savePhoto() {
        cronos.showToast('Foto salvata in Galleria', 'success');
        cronos.playSound('success');
        this.closePreview();
    }

    sharePhoto() {
        cronos.showToast('Condivisione foto...', 'info');
        setTimeout(() => {
            cronos.showToast('Foto condivisa!', 'success');
        }, 1500);
    }

    deletePhoto() {
        if (confirm('Eliminare questa foto?')) {
            cronos.showToast('Foto eliminata', 'info');
            this.closePreview();
        }
    }

    savePhotoToGallery(photoDataUrl) {
        const newPhoto = {
            id: cronos.generateId(),
            dataUrl: photoDataUrl,
            timestamp: new Date().toISOString(),
            type: 'photo'
        };
        
        this.photos.unshift(newPhoto);
        
        // Keep only last 50 photos to avoid storage issues
        if (this.photos.length > 50) {
            this.photos = this.photos.slice(0, 50);
        }
        
        // Save to localStorage
        localStorage.setItem('cronos_gallery_photos', JSON.stringify(this.photos));
    }

    loadPhotos() {
        try {
            this.photos = JSON.parse(localStorage.getItem('cronos_gallery_photos') || '[]');
        } catch (error) {
            console.error('Failed to load photos:', error);
            this.photos = [];
        }
    }

    toggleVideoRecording() {
        this.isRecording = !this.isRecording;
        const captureBtn = document.getElementById('captureBtn');
        
        captureBtn.classList.toggle('recording', this.isRecording);
        
        if (this.isRecording) {
            cronos.showToast('Registrazione avviata', 'info');
            cronos.playSound('notification');
        } else {
            cronos.showToast('Registrazione terminata', 'info');
            cronos.playSound('click');
        }
    }
}

// Global function for camera permission
function requestCameraPermission() {
    if (window.cameraApp) {
        window.cameraApp.requestCameraPermission();
    }
}

// Initialize camera app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cameraApp = new CameraApp();
});