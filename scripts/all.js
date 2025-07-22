// CronoOS 4.0.0 All Scripts - Phoenix Edition (FIXED & ENHANCED)
// Fix completo per il caricamento dinamico e nuove animazioni iOS-style

document.addEventListener('DOMContentLoaded', () => {
    console.log('CronoOS 4.0.0 - Home Screen Loading...');
    
    // Fix: Assicuriamo che tutti gli elementi DOM siano pronti
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHomeScreen);
    } else {
        initializeHomeScreen();
    }
    
    function initializeHomeScreen() {
        // Verifica che gli elementi essenziali esistano
        const homeContainer = document.getElementById('home-container');
        const dockContainer = document.getElementById('dock-container');
        
        if (!homeContainer || !dockContainer) {
            console.warn('Essential DOM elements not found, retrying...');
            setTimeout(initializeHomeScreen, 100);
            return;
        }
        
        loadHomeScreen();
    }
    
    function loadHomeScreen() {
        try {
            // Carica le app installate dal localStorage
            const installedApps = JSON.parse(localStorage.getItem('cronos_installed_apps_v2') || '{}');
            
            // App di sistema predefinite
            const systemApps = {
                'settings': { name: 'Impostazioni', icon: 'fas fa-cog', color: '#636E72', page: 'settings.html' },
                'calculator': { name: 'Calcolatrice', icon: 'fas fa-calculator', color: '#00B894', page: 'calculator.html' },
                'notes': { name: 'Note', icon: 'fas fa-sticky-note', color: '#FDCB6E', page: 'notes.html' },
                'photos': { name: 'Foto', icon: 'fas fa-images', color: '#E17055', page: 'photos.html' },
                'music': { name: 'Musica', icon: 'fas fa-music', color: '#A29BFE', page: 'music.html' },
                'files': { name: 'File', icon: 'fas fa-folder', color: '#00CEC9', page: 'files.html' },
                'contacts': { name: 'Contatti', icon: 'fas fa-address-book', color: '#55A3FF', page: 'contacts.html' },
                'messages': { name: 'Messaggi', icon: 'fas fa-comments', color: '#00B894', page: 'messages.html' },
                'phone': { name: 'Telefono', icon: 'fas fa-phone', color: '#00B894', page: 'phone.html' },
                'camera': { name: 'Fotocamera', icon: 'fas fa-camera', color: '#636E72', page: 'camera.html' },
                'maps': { name: 'Mappe', icon: 'fas fa-map-marked-alt', color: '#00B894', page: 'maps.html' },
                'calendar': { name: 'Calendario', icon: 'fas fa-calendar-alt', color: '#E17055', page: 'calendar.html' },
                'weather': { name: 'Meteo', icon: 'fas fa-cloud-sun', color: '#74B9FF', page: 'weather.html' },
                'clock': { name: 'Orologio', icon: 'fas fa-clock', color: '#FD79A8', page: 'clock.html' },
                'chrome': { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4', page: 'chrome.html' },
                'gmail': { name: 'Gmail', icon: 'fas fa-envelope', color: '#EA4335', page: 'https://mail.google.com' },
                'facebook': { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', page: 'facebook.html' }
            };
            
            // Combina app di sistema e installate
            const allApps = { ...systemApps, ...installedApps };
            
            // App per il dock (prime 4)
            const dockApps = ['phone', 'messages', 'chrome', 'settings'];
            
            // Altre app per la home screen
            const homeApps = Object.keys(allApps).filter(id => !dockApps.includes(id));
            
            // Pulisci i container
            const homeContainer = document.getElementById('home-container');
            const dockContainer = document.getElementById('dock-container');
            
            if (homeContainer) homeContainer.innerHTML = '';
            if (dockContainer) dockContainer.innerHTML = '';
            
            // Crea le icone per la home screen
            homeApps.forEach((appId, index) => {
                const app = allApps[appId];
                if (app) {
                    const appIcon = createAppIcon(appId, app);
                    if (homeContainer) {
                        homeContainer.appendChild(appIcon);
                        
                        // Animazione di entrata scaglionata
                        setTimeout(() => {
                            appIcon.style.opacity = '1';
                            appIcon.style.transform = 'scale(1) translateY(0)';
                        }, index * 50);
                    }
                }
            });
            
            // Crea le icone per il dock
            dockApps.forEach((appId, index) => {
                const app = allApps[appId];
                if (app) {
                    const appIcon = createAppIcon(appId, app, true);
                    if (dockContainer) {
                        dockContainer.appendChild(appIcon);
                        
                        // Animazione dock
                        setTimeout(() => {
                            appIcon.style.opacity = '1';
                            appIcon.style.transform = 'scale(1) translateY(0)';
                        }, index * 100 + 300);
                    }
                }
            });
            
            console.log('Home screen loaded successfully');
        } catch (error) {
            console.error('CronoOS 4.0.0 Error loading home screen:', error);
            // Fallback: carica layout minimo
            loadFallbackLayout();
        }
    }
    
    function createAppIcon(appId, app, isDock = false) {
        const appIcon = document.createElement('div');
        appIcon.className = `app-icon ${isDock ? 'dock-icon' : ''}`;
        appIcon.style.opacity = '0';
        appIcon.style.transform = 'scale(0.8) translateY(20px)';
        appIcon.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        appIcon.innerHTML = `
            <div class="app-icon-bg" style="background: linear-gradient(135deg, ${app.color}, ${adjustColor(app.color, -20)});">
                <i class="${app.icon}"></i>
            </div>
            <span class="app-name">${app.name}</span>
        `;
        
        // Gestione click con feedback tattile
        appIcon.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Animazione di feedback
            appIcon.style.transform = 'scale(0.95)';
            setTimeout(() => {
                appIcon.style.transform = isDock ? 'scale(1) translateY(0)' : 'scale(1) translateY(0)';
            }, 100);
            
            // Vibrazione se supportata
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // Apri l'app
            setTimeout(() => {
                openApp(appId, app);
            }, 150);
        });
        
        // Effetto hover per desktop
        appIcon.addEventListener('mouseenter', () => {
            if (!isDock) {
                appIcon.style.transform = 'scale(1.05) translateY(-2px)';
            }
        });
        
        appIcon.addEventListener('mouseleave', () => {
            if (!isDock) {
                appIcon.style.transform = 'scale(1) translateY(0)';
            }
        });
        
        return appIcon;
    }
    
    function openApp(appId, app) {
        console.log(`Opening app: ${app.name}`);
        
        // Salva l'app corrente
        localStorage.setItem('current_app', appId);
        
        // Animazione di apertura
        document.body.style.transition = 'transform 0.3s ease-out';
        document.body.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            if (app.page.startsWith('http')) {
                // Link esterno
                window.open(app.page, '_blank');
                document.body.style.transform = 'scale(1)';
            } else {
                // Pagina interna
                window.location.href = app.page;
            }
        }, 200);
    }
    
    function adjustColor(color, amount) {
        const usePound = color[0] === '#';
        const col = usePound ? color.slice(1) : color;
        const num = parseInt(col, 16);
        let r = (num >> 16) + amount;
        let g = (num >> 8 & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    }
    
    function loadFallbackLayout() {
        console.log('Loading fallback layout...');
        const homeContainer = document.getElementById('home-container');
        if (homeContainer) {
            homeContainer.innerHTML = `
                <div class="app-icon">
                    <div class="app-icon-bg" style="background: #636E72;">
                        <i class="fas fa-cog"></i>
                    </div>
                    <span class="app-name">Impostazioni</span>
                </div>
            `;
        }
    }
    
    // Funzione per riavviare con retry
    function startWithRetry(retries = 3) {
        if (retries <= 0) {
            console.error('Failed to initialize after multiple attempts');
            loadFallbackLayout();
            return;
        }
        
        // Retry con backoff esponenziale
        setTimeout(() => {
            if (!document.getElementById('home-container')) {
                console.log(`Retrying initialization... (${retries} attempts left)`);
                startWithRetry(retries - 1);
            } else {
                loadHomeScreen();
            }
        }, (4 - retries) * 250);
        
        // Listener per il caricamento delle app
        window.addEventListener('app-installed', () => {
            setTimeout(() => {
                loadHomeScreen();
            }, 500);
        }, 500);
    }
    
    startWithRetry();
    
    // Ascolta per aggiornamenti dall'App Store
    window.addEventListener('storage', (event) => {
        if (event.key === 'cronos_installed_apps_v2') {
            console.log("CronoOS 4.0.0 App installation detected, reloading home screen");
            setTimeout(() => {
                loadHomeScreen();
            }, 500);
        }
    });
    
    // Gestione orientamento schermo
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            loadHomeScreen();
        }, 300);
    });
    
    // Prevenzione zoom accidentale
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', (e) => {
        e.preventDefault();
    });
});

// Utility per la gestione delle app
window.CronosAppManager = {
    installApp: function(appId, appData) {
        const installedApps = JSON.parse(localStorage.getItem('cronos_installed_apps_v2') || '{}');
        installedApps[appId] = appData;
        localStorage.setItem('cronos_installed_apps_v2', JSON.stringify(installedApps));
        
        // Trigger evento per aggiornare la home
        window.dispatchEvent(new CustomEvent('app-installed', { detail: { appId, appData } }));
    },
    
    uninstallApp: function(appId) {
        const installedApps = JSON.parse(localStorage.getItem('cronos_installed_apps_v2') || '{}');
        delete installedApps[appId];
        localStorage.setItem('cronos_installed_apps_v2', JSON.stringify(installedApps));
        
        // Trigger evento per aggiornare la home
        window.dispatchEvent(new CustomEvent('app-uninstalled', { detail: { appId } }));
    },
    
    getInstalledApps: function() {
        return JSON.parse(localStorage.getItem('cronos_installed_apps_v2') || '{}');
    }
};