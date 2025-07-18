// YouTube App JavaScript - CronoOS 2.4.1

let isPlaying = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeYouTube();
    setupVideoInteractions();
    setupNavigation();
});

function initializeYouTube() {
    console.log('YouTube initialized - CronoOS 2.4.1');
}

function setupVideoInteractions() {
    // Video items click
    document.querySelectorAll('.video-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.video-title').textContent;
            openVideoPlayer(title);
        });
    });
    
    // Play buttons
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = this.closest('.video-item').querySelector('.video-title').textContent;
            openVideoPlayer(title);
        });
    });
    
    // Video menu buttons
    document.querySelectorAll('.video-menu').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showVideoMenu();
        });
    });
}

function setupNavigation() {
    // Bottom navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                // Remove active from all buttons
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');
                
                const text = this.querySelector('span').textContent;
                showToast(`${text} selezionato`);
            }
        });
    });
    
    // Player controls
    setupPlayerControls();
}

function setupPlayerControls() {
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const progressBar = document.querySelector('.progress-bar');
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', seekVideo);
    }
    
    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showToast(`${action} - Funzione in sviluppo`);
        });
    });
    
    // Control buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-backward')) {
                showToast('Riavvolgi 10 secondi');
            } else if (icon.classList.contains('fa-forward')) {
                showToast('Avanti 10 secondi');
            } else if (icon.classList.contains('fa-volume-high')) {
                showToast('Controlli audio');
            } else if (icon.classList.contains('fa-expand')) {
                showToast('Schermo intero');
            }
        });
    });
}

function openVideoPlayer(title) {
    const modal = document.getElementById('videoPlayerModal');
    const playerTitle = document.getElementById('playerVideoTitle');
    
    if (modal && playerTitle) {
        playerTitle.textContent = title;
        modal.classList.add('active');
        
        // Reset player state
        isPlaying = false;
        updatePlayPauseButton();
    }
}

function closeVideoPlayer() {
    const modal = document.getElementById('videoPlayerModal');
    if (modal) {
        modal.classList.remove('active');
        isPlaying = false;
        updatePlayPauseButton();
    }
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    updatePlayPauseButton();
    
    if (isPlaying) {
        showToast('Riproduzione avviata');
        simulateVideoProgress();
    } else {
        showToast('Riproduzione in pausa');
    }
}

function updatePlayPauseButton() {
    const playPauseBtn = document.querySelector('.play-pause-btn i');
    if (playPauseBtn) {
        if (isPlaying) {
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
        } else {
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
        }
    }
}

function simulateVideoProgress() {
    if (!isPlaying) return;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        let currentWidth = parseInt(progressFill.style.width) || 30;
        
        const interval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(interval);
                return;
            }
            
            currentWidth += 0.5;
            if (currentWidth >= 100) {
                currentWidth = 100;
                isPlaying = false;
                updatePlayPauseButton();
                clearInterval(interval);
                showToast('Video terminato');
            }
            
            progressFill.style.width = currentWidth + '%';
        }, 1000);
    }
}

function seekVideo(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        showToast(`Spostato al ${Math.round(percentage)}%`);
    }
}

function showVideoMenu() {
    const options = [
        'Aggiungi alla coda',
        'Salva nella playlist',
        'Condividi',
        'Non mi interessa',
        'Segnala'
    ];
    
    const randomOption = options[Math.floor(Math.random() * options.length)];
    showToast(`Menu video: ${randomOption}`);
}