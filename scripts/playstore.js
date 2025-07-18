// App Store JavaScript - CronoOS 2.4 Final

document.addEventListener('DOMContentLoaded', () => {
    // Load the database first
    loadAppDatabase();
    
    const gptAppsGrid = document.getElementById('gptAppsGrid');
    const essentialAppsGrid = document.getElementById('essentialAppsGrid');
    const gamesGrid = document.getElementById('gamesGrid');
    const utilityGrid = document.getElementById('utilityGrid');
    const appsGrid = document.getElementById('appsGrid');
    const searchInput = document.getElementById('appSearch');
    let installedApps = new Set(JSON.parse(localStorage.getItem('cronos_installed_apps_v2')) || []);
    

    function loadAppDatabase() {
        // Ensure the database is loaded
        if (typeof AVAILABLE_APPS === 'undefined') {
            window.AVAILABLE_APPS = {
                // GPT Modules
                'gpt-assistant': { name: 'CronoGPT', icon: 'fas fa-brain', color: 'linear-gradient(135deg, #667eea, #764ba2)', description: 'Assistente AI integrato.', category: 'gpt' },
                'cronogames': { name: 'CronoGames', icon: 'fas fa-gamepad', color: '#FF6B6B', description: 'Giochi AI generati.', category: 'gpt' },
                'gpt-studio': { name: 'CronoStudio', icon: 'fas fa-graduation-cap', color: '#6C5CE7', description: 'Aiuto studio con AI.', category: 'gpt' },
                
                // Essential Apps
                'whatsapp': { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', description: 'Messaggistica semplice e sicura.' },
                'instagram': { name: 'Instagram', icon: 'fab fa-instagram', color: 'linear-gradient(45deg, #f09433,#e6683c,#dc2743,#cc2366,#bc1888)', description: 'Condividi momenti con il mondo.' },
                'youtube': { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', description: 'Guarda, carica e condividi video.' },
                'facebook': { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', description: 'Connettiti con i tuoi amici.' },
                'gmail': { name: 'Gmail', icon: 'fas fa-envelope', color: '#EA4335', description: 'Email sicura e intelligente by Google.' },
                'spotify': { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954', description: 'Musica per tutti.' },
                
                // Games
                'tiktok': { name: 'TikTok', icon: 'fab fa-tiktok', color: '#010101', description: 'Video, trend e momenti.' },
                'snapchat': { name: 'Snapchat', icon: 'fab fa-snapchat', color: '#FFFC00', description: 'Il modo più veloce per condividere un momento.' },
                'netflix': { name: 'Netflix', icon: 'fas fa-film', color: '#E50914', description: 'Film e serie TV illimitati.' },
                
                // Utility
                'calculator': { name: 'Calculator', icon: 'fas fa-calculator', color: '#74B9FF', description: 'Per tutti i tuoi calcoli.', category: 'utility' },
                'weather': { name: 'Meteo', icon: 'fas fa-cloud-sun', color: '#74B9FF', description: 'Previsioni meteo accurate.', category: 'utility' },
                'maps': { name: 'Google Maps', icon: 'fas fa-map-marked-alt', color: '#4285F4', description: 'Esplora e naviga il tuo mondo.', category: 'utility' },
                'chrome': { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4', description: 'Il browser web veloce di Google.', category: 'utility' },
                'discord': { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2', description: 'Il tuo posto per parlare e ritrovarti.', category: 'utility' },
                'zoom': { name: 'Zoom', icon: 'fas fa-video', color: '#2D8CFF', description: 'Videoconferenze felici.', category: 'utility' }
            };
        }
    }

    function renderApps(filter = '') {
        // Clear all grids
        if (gptAppsGrid) gptAppsGrid.innerHTML = '';
        if (essentialAppsGrid) essentialAppsGrid.innerHTML = '';
        if (gamesGrid) gamesGrid.innerHTML = '';
        if (utilityGrid) utilityGrid.innerHTML = '';
        if (appsGrid) appsGrid.innerHTML = '';
        
        const apps = Object.entries(window.AVAILABLE_APPS || {})
            .filter(([id, data]) => !data.isCore && data.name.toLowerCase().includes(filter.toLowerCase()));
        
        if (filter) {
            // Show all filtered results in main grid
            apps.forEach(([id, data]) => {
                if (appsGrid) appsGrid.appendChild(createAppItem(id, data));
            });
        } else {
            // Categorize apps
            apps.forEach(([id, data]) => {
                const item = createAppItem(id, data);
                
                if (data.category === 'gpt' && gptAppsGrid) {
                    gptAppsGrid.appendChild(item);
                } else if (data.category === 'utility' && utilityGrid) {
                    utilityGrid.appendChild(item);
                } else if (['netflix', 'tiktok', 'snapchat'].includes(id) && gamesGrid) {
                    gamesGrid.appendChild(item);
                } else if (essentialAppsGrid) {
                    essentialAppsGrid.appendChild(item);
                }
            });
        }
        
        // Show empty state if no results
        const totalApps = apps.length;
        if (totalApps === 0 && appsGrid) {
            appsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary-light);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5; color: white;"></i>
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
