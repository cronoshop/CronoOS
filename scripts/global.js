// Global JavaScript Functions - CronoOS 2.4.3 (Corrected & Cleaned)

document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    initializeDarkMode();
    updateTime();
    setInterval(updateTime, 1000); // Aggiorna l'ora ogni secondo
});

function initializeSystem() {
    loadSettings();
    loadCustomWallpaper();
    console.log('CronoOS 3.3 Initialized');
}

/**
 * Inizializza il dark mode dal localStorage o dalle preferenze di sistema
 */
function initializeDarkMode() {
    const savedTheme = localStorage.getItem('crono_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Ascolta i cambiamenti delle preferenze di sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('crono_theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }
    });
}

/**
 * Carica lo sfondo personalizzato se presente nel localStorage.
 */
function loadCustomWallpaper() {
    // Load different wallpapers for different screens
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'lock.html') {
        const lockWallpaper = localStorage.getItem('crono_lock_wallpaper');
        if (lockWallpaper) {
            const wallpaperElement = document.querySelector('.wallpaper-lock');
            if (wallpaperElement) {
                wallpaperElement.style.backgroundImage = `url(${lockWallpaper})`;
            }
        }
    } else if (currentPage === 'home.html') {
        const homeWallpaper = localStorage.getItem('crono_home_wallpaper');
        if (homeWallpaper) {
            const wallpaperElement = document.querySelector('.wallpaper');
            if (wallpaperElement) {
                wallpaperElement.style.backgroundImage = `url(${homeWallpaper})`;
            }
        }
    } else {
        // Fallback to general wallpaper
        const customWallpaper = localStorage.getItem('crono_wallpaper');
        if (customWallpaper) {
            const wallpaperElement = document.querySelector('.wallpaper, .wallpaper-lock');
            if (wallpaperElement) {
                wallpaperElement.style.backgroundImage = `url(${customWallpaper})`;
            }
        }
    }
}


/**
 * Naviga a un'app o pagina specifica, gestendo il caso in cui sia dentro il mockup.
 * @param {string} pageUrl L'URL della pagina/app da aprire.
 */
function openApp(pageUrl) {
    // Se la pagina è dentro un iframe (il mockup), invia un messaggio al genitore.
    if (window.parent !== window) {
        window.parent.postMessage({ action: 'navigate', url: pageUrl }, '*');
    } else {
        // Altrimenti, esegue una navigazione diretta.
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = pageUrl;
        }, 300);
    }
}

/**
 * Funzione scorciatoia per tornare alla home.
 */
function goHome() {
    openApp('home.html');
}

/**
 * Aggiorna costantemente l'ora mostrata nella status bar e nella lock screen.
 */
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    // Aggiorna tutti gli elementi con la classe 'time' o l'ID 'statusTime'
    document.querySelectorAll('.time, #statusTime').forEach(el => el.textContent = timeString);
}


/**
 * Mostra una notifica temporanea (toast) in stile iOS.
 * @param {string} message Il messaggio da visualizzare.
 */
function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}


/**
 * Carica e applica le impostazioni salvate come il tema scuro.
 */
function loadSettings() {
    const theme = localStorage.getItem('crono_theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Applica impostazioni accessibilità
    const largeText = localStorage.getItem('crono_large_text') === 'true';
    const boldText = localStorage.getItem('crono_bold_text') === 'true';
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('bold-text', boldText);
    
    // Applica filtro luce blu
    const blueLight = localStorage.getItem('crono_bluelight') === 'on';
    const overlay = document.getElementById('blue-light-filter-overlay');
    if (overlay) overlay.classList.toggle('active', blueLight);
}

/**
 * Gestisce il multitasking
 */
function showMultitasking() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (overlay) {
        overlay.classList.add('active');
        showToast('Multitasking aperto');
    } else {
        showToast('Multitasking - Funzione in sviluppo');
    }
}

function hideMultitasking() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Gestione degli errori generici
window.addEventListener('error', function(e) {
    console.error('CronoOS 3.3 Error:', e.error);
    showToast('Si è verificato un errore di sistema');
});


function navigateTo(page) {
    window.location.href = page;
}

// Gesture bar interaction
document.addEventListener('DOMContentLoaded', function() {
    const gestureBar = document.querySelector('.gesture-bar');
    if (gestureBar) {
        let startY = 0;
        let startTime = 0;
        
        gestureBar.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
            startTime = Date.now();
        });
        
        gestureBar.addEventListener('touchend', function(e) {
            const endY = e.changedTouches[0].clientY;
            const deltaY = startY - endY;
            const deltaTime = Date.now() - startTime;
            
            // Swipe up gesture
            if (deltaY > 30 && deltaTime < 300) {
                showMultitasking();
            }
        });
    }
});
