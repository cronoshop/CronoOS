// CronoOS Home Screen - Phoenix Edition v3 (FINAL & STABLE) CronoOS 3.3.1
// Questo script è stato riscritto per essere 100% autonomo e stabile.
// Ora contiene direttamente i dati di default per evitare qualsiasi errore di caricamento.

document.addEventListener('DOMContentLoaded', () => {
    // Initialize widgets
    initializeWidgets();
    
    // Initialize multitasking
    initializeMultitasking();
    
    // --- Database Interno di Default ---
    // Questa è la lista di app che la home CONOSCE. Non dipende da altri file.
    const DEFAULT_APPS_DATABASE = {
        'phone': { name: 'Telefono', icon: 'fas fa-phone-flip', color: '#30D158', page: 'phone.html' },
        'messages': { name: 'Messaggi', icon: 'fas fa-comment-dots', color: '#0A84FF', page: 'messages.html' },
        'camera': { name: 'Fotocamera', icon: 'fas fa-camera', color: '#888', page: 'camera.html' },
        'playstore': { name: 'App Store', icon: 'fas fa-store', color: '#0A84FF', page: 'playstore.html' },
        'settings': { name: 'Impostazioni', icon: 'fas fa-gear', color: '#555', page: 'settings.html' },
        'gallery': { name: 'Galleria', icon: 'fas fa-images', color: '#AF52DE', page: 'gallery.html' },
        'calendar': { name: 'Calendario', icon: 'fas fa-calendar-days', color: '#FF453A', page: 'calendar.html' },
        'whatsapp': { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
        'instagram': { name: 'Instagram', icon: 'fab fa-instagram', color: 'linear-gradient(45deg, #f09433,#e6683c,#dc2743,#cc2366,#bc1888)'},
        'youtube': { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
        'spotify': { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954' },
        'gpt-assistant': { name: 'CronoGPT', icon: 'fas fa-brain', color: 'linear-gradient(135deg, #667eea, #764ba2)', page: 'gpt-assistant.html' },
        'cronogames': { name: 'CronoGames', icon: 'fas fa-gamepad', color: '#FF6B6B', page: 'cronogames.html' },
        'weather': { name: 'Meteo', icon: 'fas fa-cloud-sun', color: '#74B9FF', page: 'weather.html' },
        'clock': { name: 'Orologio', icon: 'fas fa-clock', color: '#FD79A8', page: 'clock.html' },
    };

    // App di default nel dock
    const DEFAULT_DOCK_APPS = ['phone', 'messages', 'camera', 'gpt-assistant'];

    const appGrid = document.getElementById('appGrid');
    const dock = document.getElementById('dock');
    


    // --- Funzione Principale di Avvio ---
    function initializeHomeScreen() {
        // 1. Carica le app installate o crea la lista di default
        const installedApps = getInstalledApps();
        
        // 2. Carica il layout o ne crea uno di default
        const layout = getOrCrearteLayout(installedApps);

        // 3. Disegna le icone sullo schermo
        renderUI(installedApps, layout);

        // 4. Attiva il Drag and Drop
        setupDragAndDrop();
    }

    // --- Gestione Dati ---
    function getInstalledApps() {
        const coreApps = ['phone', 'messages', 'camera', 'settings', 'gallery', 'calendar', 'playstore'];
        let installed = new Set(coreApps); // Le app di sistema sono sempre installate
        
        try {
            const savedApps = JSON.parse(localStorage.getItem('cronos_installed_apps_v2'));
            if (Array.isArray(savedApps)) {
                savedApps.forEach(appId => installed.add(appId));
            }
        } catch (e) {
            console.warn("Nessuna app installata trovata in memoria. Si useranno quelle di default.");
        }
        return installed;
    }

    function getOrCrearteLayout(installedApps) {
        try {
            const savedLayout = JSON.parse(localStorage.getItem('crono_app_layout_v4'));
            if (savedLayout && savedLayout.grid && savedLayout.dock) {
                // Pulisce il layout da app non più installate
                savedLayout.grid = savedLayout.grid.filter(id => installedApps.has(id));
                savedLayout.dock = savedLayout.dock.filter(id => installedApps.has(id));
                // Aggiunge al layout le app nuove che non erano presenti
                installedApps.forEach(id => {
                    if (!savedLayout.grid.includes(id) && !savedLayout.dock.includes(id)) {
                        savedLayout.grid.push(id);
                    }
                });
                return savedLayout;
            }
        } catch (e) {
            console.warn("Layout non valido in memoria. Verrà creato un layout di default.");
        }

        // Se non c'è un layout valido, ne crea uno nuovo
        const gridApps = [...installedApps].filter(id => !DEFAULT_DOCK_APPS.includes(id));
        const dockApps = DEFAULT_DOCK_APPS.filter(id => installedApps.has(id));
        
        const newLayout = { grid: gridApps, dock: dockApps };
        saveLayout(newLayout);
        return newLayout;
    }

    // --- Rendering UI ---
    function renderUI(installedApps, layout) {
        appGrid.innerHTML = '';
        dock.innerHTML = '';
        
        // Renderizza la griglia principale
        layout.grid.forEach(appId => {
            if (installedApps.has(appId)) {
                const appInfo = DEFAULT_APPS_DATABASE[appId];
                if(appInfo) appGrid.appendChild(createIconElement(appId, appInfo));
            }
        });
        
        // Renderizza il dock
        layout.dock.forEach(appId => {
            if (installedApps.has(appId)) {
                const appInfo = DEFAULT_APPS_DATABASE[appId];
                if(appInfo) dock.appendChild(createIconElement(appId, appInfo));
            }
        });
    }

    function createIconElement(id, data) {
        const page = data.page || `${id}.html`;
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'app-icon';
        iconWrapper.dataset.appId = id;
        iconWrapper.draggable = true;
        
        iconWrapper.innerHTML = `
            <div class="app-icon-container" style="background: ${data.color || '#333'}">
                <i class="${data.icon}"></i>
            </div>
            <span>${data.name}</span>
        `;
        
        iconWrapper.addEventListener('click', () => openApp(page));
        return iconWrapper;
    }

    // --- Drag & Drop e Salvataggio ---
    function setupDragAndDrop() {
        let draggedItem = null;
        const containers = [appGrid, dock];

        document.addEventListener('dragstart', e => {
            if (e.target.closest('.app-icon')) {
                draggedItem = e.target.closest('.app-icon');
                setTimeout(() => draggedItem.classList.add('dragging'), 0);
            }
        });
        
        document.addEventListener('dragend', () => {
            if(draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                saveCurrentLayout();
            }
        });

        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                // Semplice logica di inserimento per stabilità
                const x = e.clientX;
                const afterElement = [...container.children].find(child => x < child.getBoundingClientRect().left);
                if (draggedItem) {
                    if (afterElement) {
                        container.insertBefore(draggedItem, afterElement);
                    } else {
                        container.appendChild(draggedItem);
                    }
                }
            });
        });
    }

    function saveLayout(layout) {
        localStorage.setItem('crono_app_layout_v4', JSON.stringify(layout));
    }
    
    function saveCurrentLayout() {
        const grid = [...appGrid.children].map(el => el.dataset.appId);
        const dockApps = [...dock.children].map(el => el.dataset.appId);
        saveLayout({ grid, dock: dockApps });
        console.log("Layout salvato.");
    }

    // --- Avvio ---
    initializeHomeScreen();
    
    // Ascolta per aggiornamenti dall'App Store
    window.addEventListener('storage', (event) => {
        if (event.key === 'cronos_installed_apps_v2') {
            console.log("Rilevato cambiamento nelle app installate. Ricarico la Home.");
            initializeHomeScreen();
        }
    });
    
    // Update widgets every minute
    setInterval(updateWidgets, 60000);
});

// Widget Functions
function initializeWidgets() {
    updateWidgets();
    setupWidgetInteractions();
}

function updateWidgets() {
    const now = new Date();
    
    // Update time widget
    const widgetTime = document.getElementById('widgetTime');
    const widgetDate = document.getElementById('widgetDate');
    if (widgetTime) {
        widgetTime.textContent = now.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }
    if (widgetDate) {
        widgetDate.textContent = now.toLocaleDateString('it-IT', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    }
    
    // Update calendar widget
    const widgetDay = document.getElementById('widgetDay');
    const widgetMonth = document.getElementById('widgetMonth');
    if (widgetDay) {
        widgetDay.textContent = now.getDate();
    }
    if (widgetMonth) {
        widgetMonth.textContent = now.toLocaleDateString('it-IT', { month: 'long' });
    }
}

function setupWidgetInteractions() {
    // Add hover effects to widgets
    document.querySelectorAll('.widget').forEach(widget => {
        widget.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        widget.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function openGPTModule(module) {
    const modules = {
        'studio': 'CronoStudio - Aiuto per studiare',
        'assist': 'CronoAssist - Assistente personale',
        'translate': 'GPT-Translator - Traduttore istantaneo',
        'design': 'CronoDesign - Design con AI'
    };
    
    showToast(`Apertura ${modules[module]}...`);
    setTimeout(() => {
        openApp(`gpt-${module}.html`);
    }, 1000);
}

// Multitasking Functions
function initializeMultitasking() {
    // Setup multitasking overlay
    const overlay = document.getElementById('multitaskingOverlay');
    if (overlay) {
        // Close on background click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideMultitasking();
            }
        });
    }
}

function showMultitasking() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    
    // Add spring animation to cards
    setTimeout(() => {
        document.querySelectorAll('.app-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('spring-animation');
            }, index * 100);
        });
    }, 200);
    
    showToast('Multitasking aperto');
}

function hideMultitasking() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (!overlay) return;
    
    overlay.classList.remove('active');
    
    // Remove animations
    document.querySelectorAll('.app-card').forEach(card => {
        card.classList.remove('spring-animation');
    });
}

function goBack() {
    if (document.getElementById('multitaskingOverlay')?.classList.contains('active')) {
        hideMultitasking();
        return;
    }
    
    // Since we're on home, just show a toast
    showToast('Già nella Home');
}

// Make functions globally available
window.showMultitasking = showMultitasking;
window.hideMultitasking = hideMultitasking;
window.goBack = goBack;
window.openGPTModule = openGPTModule;
