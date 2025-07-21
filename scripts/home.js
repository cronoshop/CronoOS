// CronoOS Home Screen - Phoenix Edition v3.3.1 AetherFix (FIXED & ENHANCED)
// Fix completo per il caricamento dinamico e nuove animazioni iOS-style

document.addEventListener('DOMContentLoaded', () => {
    console.log('CronoOS 3.3.1 AetherFix - Home Screen Loading...');
    
    // Fix: Assicuriamo che tutti gli elementi DOM siano pronti
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHomeScreen);
    } else {
        initializeHomeScreen();
    }
});

function initializeHomeScreen() {
    console.log('Initializing Home Screen...');
    
    // Fix: Controllo esistenza elementi DOM prima di procedere
    const appGrid = document.getElementById('appGrid');
    if (!appGrid) {
        console.error('appGrid element not found, retrying...');
        setTimeout(initializeHomeScreen, 100);
        return;
    }
    
    // Initialize widgets first
    initializeWidgets();
    
    // Initialize multitasking
    initializeMultitasking();
    
    // Database Interno di Default (FIXED)
    const DEFAULT_APPS_DATABASE = {
        'phone': { name: 'Telefono', icon: 'fas fa-phone-flip', color: '#30D158', page: 'phone.html' },
        'messages': { name: 'Messaggi', icon: 'fas fa-comment-dots', color: '#0A84FF', page: 'messages.html' },
        'camera': { name: 'Fotocamera', icon: 'fas fa-camera', color: '#888', page: 'camera.html' },
        'playstore': { name: 'App Store', icon: 'fas fa-store', color: '#0A84FF', page: 'playstore.html' },
        'settings': { name: 'Impostazioni', icon: 'fas fa-gear', color: '#555', page: 'settings.html' },
        'gallery': { name: 'Galleria', icon: 'fas fa-images', color: '#AF52DE', page: 'gallery.html' },
        'calendar': { name: 'Calendario', icon: 'fas fa-calendar-days', color: '#FF453A', page: 'calendar.html' },
        'whatsapp': { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', page: 'whatsapp.html' },
        'instagram': { name: 'Instagram', icon: 'fab fa-instagram', color: 'linear-gradient(45deg, #f09433,#e6683c,#dc2743,#cc2366,#bc1888)', page: 'instagram.html'},
        'youtube': { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', page: 'youtube.html' },
        'spotify': { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954' },
        'gpt-assistant': { name: 'CronoGPT', icon: 'fas fa-brain', color: 'linear-gradient(135deg, #667eea, #764ba2)', page: 'gpt-assistant.html' },
        'cronogames': { name: 'CronoGames', icon: 'fas fa-gamepad', color: '#FF6B6B', page: 'cronogames.html' },
        'weather': { name: 'Meteo', icon: 'fas fa-cloud-sun', color: '#74B9FF', page: 'weather.html' },
        'clock': { name: 'Orologio', icon: 'fas fa-clock', color: '#FD79A8', page: 'clock.html' },
        'chrome': { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4', page: 'chrome.html' },
        'gmail': { name: 'Gmail', icon: 'fas fa-envelope', color: '#EA4335', page: 'gmail.html' },
        'facebook': { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', page: 'facebook.html' }
    };

    // App di default nel dock
    const DEFAULT_DOCK_APPS = ['phone', 'messages', 'camera', 'gpt-assistant'];

    // Fix: Gestione sicura degli elementi DOM
    function safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    }

    const dock = safeGetElement('dock');

    // Funzione Principale di Avvio (FIXED)
    function loadHomeScreen() {
        try {
            console.log('Loading home screen data...');
            
            // 1. Carica le app installate o crea la lista di default
            const installedApps = getInstalledApps();
            console.log('Installed apps:', installedApps);
            
            // 2. Carica il layout o ne crea uno di default
            const layout = getOrCreateLayout(installedApps);
            console.log('Layout:', layout);

            // 3. Disegna le icone sullo schermo (FIXED)
            renderUI(installedApps, layout);

            // 4. Attiva il Drag and Drop
            setupDragAndDrop();
            
            console.log('Home screen loaded successfully');
        } catch (error) {
            console.error('Error loading home screen:', error);
            // Fallback: carica layout minimo
            loadFallbackLayout();
        }
    }

    // Gestione Dati (FIXED)
    function getInstalledApps() {
        const coreApps = ['phone', 'messages', 'camera', 'settings', 'gallery', 'calendar', 'playstore'];
        let installed = new Set(coreApps);
        
        try {
            const savedApps = localStorage.getItem('cronos_installed_apps_v2');
            if (savedApps) {
                const parsedApps = JSON.parse(savedApps);
                if (Array.isArray(parsedApps)) {
                    parsedApps.forEach(appId => installed.add(appId));
                }
            }
        } catch (e) {
            console.warn("Error loading installed apps:", e);
        }
        return installed;
    }

    function getOrCreateLayout(installedApps) {
        try {
            const savedLayout = localStorage.getItem('crono_app_layout_v4');
            if (savedLayout) {
                const layout = JSON.parse(savedLayout);
                if (layout && layout.grid && layout.dock) {
                    // Pulisce il layout da app non più installate
                    layout.grid = layout.grid.filter(id => installedApps.has(id));
                    layout.dock = layout.dock.filter(id => installedApps.has(id));
                    // Aggiunge al layout le app nuove che non erano presenti
                    installedApps.forEach(id => {
                        if (!layout.grid.includes(id) && !layout.dock.includes(id)) {
                            layout.grid.push(id);
                        }
                    });
                    return layout;
                }
            }
        } catch (e) {
            console.warn("Error loading layout:", e);
        }

        // Se non c'è un layout valido, ne crea uno nuovo
        const gridApps = [...installedApps].filter(id => !DEFAULT_DOCK_APPS.includes(id));
        const dockApps = DEFAULT_DOCK_APPS.filter(id => installedApps.has(id));
        
        const newLayout = { grid: gridApps, dock: dockApps };
        saveLayout(newLayout);
        return newLayout;
    }

    // Rendering UI (FIXED)
    function renderUI(installedApps, layout) {
        console.log('Rendering UI...');
        
        // Fix: Controllo esistenza elementi prima di manipolarli
        if (!appGrid) {
            console.error('appGrid not found during render');
            return;
        }
        
        // Clear existing content safely
        try {
            appGrid.innerHTML = '';
            if (dock) dock.innerHTML = '';
        } catch (e) {
            console.error('Error clearing UI:', e);
            return;
        }
        
        // Renderizza la griglia principale con animazioni
        layout.grid.forEach((appId, index) => {
            if (installedApps.has(appId)) {
                const appInfo = DEFAULT_APPS_DATABASE[appId];
                if (appInfo) {
                    const iconElement = createIconElement(appId, appInfo, index);
                    appGrid.appendChild(iconElement);
                }
            }
        });
        
        // Renderizza il dock con animazioni
        if (dock) {
            layout.dock.forEach((appId, index) => {
                if (installedApps.has(appId)) {
                    const appInfo = DEFAULT_APPS_DATABASE[appId];
                    if (appInfo) {
                        const iconElement = createIconElement(appId, appInfo, index, true);
                        dock.appendChild(iconElement);
                    }
                }
            });
        }
        
        // Applica animazioni di entrata
        setTimeout(() => {
            document.querySelectorAll('.app-icon').forEach((icon, index) => {
                setTimeout(() => {
                    icon.classList.add('animate-fade-in-up');
                }, index * 50);
            });
        }, 100);
    }

    function createIconElement(id, data, index = 0, isDock = false) {
        const page = data.page || `${id}.html`;
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'app-icon';
        iconWrapper.dataset.appId = id;
        iconWrapper.draggable = true;
        iconWrapper.style.setProperty('--app-index', index);
        
        // Enhanced icon with better animations
        iconWrapper.innerHTML = `
            <div class="app-icon-container" style="background: ${data.color || '#333'}">
                <i class="${data.icon}"></i>
            </div>
            <span>${data.name}</span>
        `;
        
        // Enhanced click handler with iOS-style animation
        iconWrapper.addEventListener('click', (e) => {
            e.preventDefault();
            
            // iOS-style press animation
            iconWrapper.style.transform = 'scale(0.9)';
            iconWrapper.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                iconWrapper.style.transform = 'scale(1)';
                
                // Add unlock-style transition
                document.body.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
                document.body.style.opacity = '0.8';
                document.body.style.filter = 'blur(10px)';
                
                setTimeout(() => {
                    openApp(page);
                }, 200);
            }, 100);
        });
        
        return iconWrapper;
    }

    // Drag & Drop e Salvataggio (FIXED)
    function setupDragAndDrop() {
        let draggedItem = null;
        const containers = [appGrid];
        if (dock) containers.push(dock);

        document.addEventListener('dragstart', e => {
            if (e.target.closest('.app-icon')) {
                draggedItem = e.target.closest('.app-icon');
                setTimeout(() => {
                    if (draggedItem) draggedItem.classList.add('dragging');
                }, 0);
            }
        });
        
        document.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                saveCurrentLayout();
            }
        });

        containers.forEach(container => {
            if (!container) return;
            
            container.addEventListener('dragover', e => {
                e.preventDefault();
                if (!draggedItem) return;
                
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                    container.appendChild(draggedItem);
                } else {
                    container.insertBefore(draggedItem, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.app-icon:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveLayout(layout) {
        try {
            localStorage.setItem('crono_app_layout_v4', JSON.stringify(layout));
        } catch (e) {
            console.error('Error saving layout:', e);
        }
    }
    
    function saveCurrentLayout() {
        try {
            const grid = [...appGrid.children].map(el => el.dataset.appId).filter(Boolean);
            const dockApps = dock ? [...dock.children].map(el => el.dataset.appId).filter(Boolean) : [];
            saveLayout({ grid, dock: dockApps });
            console.log("Layout saved successfully");
        } catch (e) {
            console.error('Error saving current layout:', e);
        }
    }

    // Fallback layout in case of errors
    function loadFallbackLayout() {
        console.log('Loading fallback layout...');
        if (!appGrid) return;
        
        appGrid.innerHTML = `
            <div class="app-icon" onclick="openApp('phone.html')">
                <div class="app-icon-container" style="background: #30D158">
                    <i class="fas fa-phone-flip"></i>
                </div>
                <span>Telefono</span>
            </div>
            <div class="app-icon" onclick="openApp('messages.html')">
                <div class="app-icon-container" style="background: #0A84FF">
                    <i class="fas fa-comment-dots"></i>
                </div>
                <span>Messaggi</span>
            </div>
            <div class="app-icon" onclick="openApp('settings.html')">
                <div class="app-icon-container" style="background: #555">
                    <i class="fas fa-gear"></i>
                </div>
                <span>Impostazioni</span>
            </div>
        `;
    }

    // Avvio con retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    
    function startWithRetry() {
        try {
            loadHomeScreen();
        } catch (error) {
            console.error(`Home screen load attempt ${retryCount + 1} failed:`, error);
            retryCount++;
            
            if (retryCount < maxRetries) {
                setTimeout(startWithRetry, 500);
            } else {
                console.error('Max retries reached, loading fallback');
                loadFallbackLayout();
            }
        }
    }
    
    startWithRetry();
    
    // Ascolta per aggiornamenti dall'App Store
    window.addEventListener('storage', (event) => {
        if (event.key === 'cronos_installed_apps_v2') {
            console.log("App installation detected, reloading home screen");
            setTimeout(() => {
                loadHomeScreen();
            }, 500);
        }
    });
    
    // Update widgets every minute
    setInterval(updateWidgets, 60000);
}

// Widget Functions (ENHANCED)
function initializeWidgets() {
    updateWidgets();
    setupWidgetInteractions();
}

function updateWidgets() {
    const now = new Date();
    
    // Update time widget with smooth animation
    const widgetTime = document.getElementById('widgetTime');
    const widgetDate = document.getElementById('widgetDate');
    if (widgetTime) {
        const newTime = now.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        if (widgetTime.textContent !== newTime) {
            widgetTime.style.opacity = '0.5';
            setTimeout(() => {
                widgetTime.textContent = newTime;
                widgetTime.style.opacity = '1';
            }, 150);
        }
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
    // Enhanced hover effects for widgets
    document.querySelectorAll('.widget').forEach((widget, index) => {
        widget.style.setProperty('--widget-index', index);
        
        widget.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        widget.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // iOS-style press animation
        widget.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
        });
        
        widget.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
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
    
    // Enhanced transition effect
    document.body.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.style.transform = 'scale(0.95)';
    document.body.style.filter = 'blur(5px)';
    
    setTimeout(() => {
        openApp(`gpt-${module}.html`);
    }, 300);
}

// Multitasking Functions (ENHANCED)
function initializeMultitasking() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (overlay) {
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