// App Store JavaScript - CronoOS 2.4 Final

document.addEventListener('DOMContentLoaded', () => {
    // Load the database first
    loadAppDatabase();
    
    const appsGrid = document.getElementById('appsGrid');
    const searchInput = document.getElementById('appSearch');
    let installedApps = new Set(JSON.parse(localStorage.getItem('cronos_installed_apps_v2')) || []);
    
    if (!appsGrid) {
        console.error('Apps grid not found');
        return;
    }

    function loadAppDatabase() {
        // Ensure the database is loaded
        if (typeof AVAILABLE_APPS === 'undefined') {
            window.AVAILABLE_APPS = {
                'whatsapp': { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', description: 'Messaggistica semplice e sicura.' },
                'instagram': { name: 'Instagram', icon: 'fab fa-instagram', color: 'linear-gradient(45deg, #f09433,#e6683c,#dc2743,#cc2366,#bc1888)', description: 'Condividi momenti con il mondo.' },
                'youtube': { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', description: 'Guarda, carica e condividi video.' },
                'facebook': { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', description: 'Connettiti con i tuoi amici.' },
                'twitter': { name: 'X (Twitter)', icon: 'fab fa-twitter', color: '#14171A', description: 'L\'app per tutto.' },
                'telegram': { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088CC', description: 'Messaggistica veloce e sicura.' },
                'spotify': { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954', description: 'Musica per tutti.' },
                'netflix': { name: 'Netflix', icon: 'fas fa-film', color: '#E50914', description: 'Film e serie TV illimitati.' },
                'gmail': { name: 'Gmail', icon: 'fas fa-envelope', color: '#EA4335', description: 'Email sicura e intelligente by Google.' },
                'maps': { name: 'Google Maps', icon: 'fas fa-map-marked-alt', color: '#4285F4', description: 'Esplora e naviga il tuo mondo.' },
                'chrome': { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4', description: 'Il browser web veloce di Google.' },
                'tiktok': { name: 'TikTok', icon: 'fab fa-tiktok', color: '#010101', description: 'Video, trend e momenti.' },
                'discord': { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2', description: 'Il tuo posto per parlare e ritrovarti.' },
                'zoom': { name: 'Zoom', icon: 'fas fa-video', color: '#2D8CFF', description: 'Videoconferenze felici.' },
                'reddit': { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500', description: 'Tuffati in qualsiasi cosa.' },
                'snapchat': { name: 'Snapchat', icon: 'fab fa-snapchat', color: '#FFFC00', description: 'Il modo più veloce per condividere un momento.' },
                'linkedin': { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', description: 'Il più grande network professionale.' }
            };
        }
    }

    function renderApps(filter = '') {
        appsGrid.innerHTML = '';
        Object.entries(window.AVAILABLE_APPS || {})
            .filter(([id, data]) => !data.isCore && data.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(([id, data]) => {
                appsGrid.appendChild(createAppItem(id, data));
            });
        
        if (appsGrid.children.length === 0) {
            appsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary-light);">
                    <i class="fas fa-store" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>Nessuna app trovata</p>
                </div>
            `;
        }
    }

    function createAppItem(id, data) {
        const appItem = document.createElement('div');
        appItem.className = 'app-item';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'app-icon';
        iconDiv.style.background = data.color;
        iconDiv.innerHTML = `<i class="${data.icon}"></i>`;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'app-info';
        infoDiv.innerHTML = `<div class="app-name">${data.name}</div><div class="app-description">${data.description}</div>`;

        const button = document.createElement('button');
        button.dataset.appId = id;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            handleInstallToggle(id, button);
        });

        updateButtonState(button);
        appItem.append(iconDiv, infoDiv, button);
        return appItem;
    }

    function updateButtonState(button) {
        const appId = button.dataset.appId;
        button.className = 'install-btn';
        if (installedApps.has(appId)) {
            button.textContent = 'OPEN';
        } else {
            button.innerHTML = '<i class="fas fa-download"></i> GET';
        }
    }

    function handleInstallToggle(appId, button) {
        if (installedApps.has(appId)) {
            // If app is installed, open it
            openApp(window.AVAILABLE_APPS[appId].page || `${appId}.html`);
        } else {
            // Install logic
            button.classList.add('installing');
            button.disabled = true;
            button.textContent = '...';
            setTimeout(() => {
                installedApps.add(appId);
                localStorage.setItem('cronos_installed_apps_v2', JSON.stringify([...installedApps]));
                showToast(`${window.AVAILABLE_APPS[appId].name} installata!`);
                button.disabled = false;
                updateButtonState(button);
            }, 1500);
        }
    }
    
    // Initial Render
    renderApps();
    searchInput.addEventListener('input', (e) => renderApps(e.target.value));
});
