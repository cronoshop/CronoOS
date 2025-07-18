// Global JavaScript Functions - CronoOS 2.4.3 (Corrected & Cleaned)

document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    updateTime();
    setInterval(updateTime, 1000); // Aggiorna l'ora ogni secondo
});

function initializeSystem() {
    loadSettings();
    loadCustomWallpaper();
    console.log('CronoOS 2.4 Initialized');
}

/**
 * Carica lo sfondo personalizzato se presente nel localStorage.
 */
function loadCustomWallpaper() {
    const customWallpaper = localStorage.getItem('crono_wallpaper');
    if (customWallpaper) {
        // Applica lo sfondo a elementi specifici per evitare problemi
        const wallpaperElement = document.querySelector('.wallpaper, .wallpaper-lock');
        if (wallpaperElement) {
            wallpaperElement.style.backgroundImage = `url(${customWallpaper})`;
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
}

// Gestione degli errori generici
window.addEventListener('error', function(e) {
    console.error('CronoOS Error:', e.error);
    showToast('Si è verificato un errore di sistema');
});
