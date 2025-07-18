// Home Screen JavaScript - CronoOS 2.1 - Phoenix Edition v2 (Robust)
// Author: Gemini
// Date: 18 Luglio 2025
// Line Count: 300+

/**
 * This script is a complete rewrite to address stability and functionality issues.
 * It is architected with clear separation of concerns:
 * 1. DataManager: Handles all interactions with localStorage, ensuring data integrity.
 * 2. UIManager: Handles all rendering and DOM manipulation.
 * 3. DragDropService: Manages the complex logic for rearranging icons.
 * 4. Initialization: A clear entry point that orchestrates the setup.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DATA MANAGER ---
    // Manages all app data, acting as the single source of truth.
    const DataManager = {
        _availableApps: {},
        _installedApps: new Set(),
        _appLayout: { grid: [], dock: [] },

        // Default apps that are always present
        CORE_APPS: ['phone', 'messages', 'camera', 'gallery', 'calendar', 'settings'],
        DOCK_APPS: ['phone', 'messages', 'camera', 'playstore'],

        // Initialize and load data from localStorage
        init() {
            console.log("DataManager: Initializing...");
            this._loadAvailableApps();
            this._loadInstalledApps();
            this._loadLayout();
            this._validateData();
            console.log("DataManager: Initialization complete.");
        },

        // Loads the master list of all possible apps
        _loadAvailableApps() {
            const rawData = localStorage.getItem('crono_available_apps');
            if (rawData) {
                this._availableApps = JSON.parse(rawData);
            } else {
                console.warn("Available apps not found in localStorage. The App Store must be run first.");
                // A fallback can be added here if needed
            }
        },

        // Loads the list of installed app IDs
        _loadInstalledApps() {
            const userApps = JSON.parse(localStorage.getItem('cronos_installed_apps')) || [];
            this._installedApps = new Set([...this.CORE_APPS, ...userApps]);
        },

        // Loads the user's custom icon layout
        _loadLayout() {
            const savedLayout = localStorage.getItem('crono_app_layout_v2');
            if (savedLayout) {
                this._appLayout = JSON.parse(savedLayout);
            } else {
                // Create a default layout if none exists
                const allApps = Array.from(this._installedApps);
                this._appLayout.dock = this.DOCK_APPS.filter(id => this._installedApps.has(id));
                this._appLayout.grid = allApps.filter(id => !this.DOCK_APPS.includes(id));
                this.saveLayout();
            }
        },

        // Ensures data consistency
        _validateData() {
            const currentInstalled = Array.from(this._installedApps);
            const layoutApps = new Set([...this._appLayout.grid, ...this._appLayout.dock]);

            // Add newly installed apps not yet in the layout
            currentInstalled.forEach(appId => {
                if (!layoutApps.has(appId)) {
                    console.log(`Found new app: ${appId}. Adding to grid.`);
                    this._appLayout.grid.push(appId);
                }
            });

            // Remove uninstalled apps from the layout
            this._appLayout.grid = this._appLayout.grid.filter(appId => this._installedApps.has(appId));
            this._appLayout.dock = this._appLayout.dock.filter(appId => this._installedApps.has(appId));
            
            this.saveLayout();
        },

        // Public getters
        getLayout: () => this.DataManager._appLayout,
        getAppInfo: (appId) => this.DataManager._availableApps[appId] || { name: 'Unknown', icon: 'fas fa-question-circle', color: '#888' },

        // Update and save the layout
        saveLayout(newLayout) {
            if (newLayout) this._appLayout = newLayout;
            localStorage.setItem('crono_app_layout_v2', JSON.stringify(this._appLayout));
            console.log("DataManager: Layout saved.");
        }
    };

    // --- UI MANAGER ---
    // Responsible for all rendering to the DOM.
    const UIManager = {
        appGrid: document.getElementById('appGrid'),
        dock: document.getElementById('dock'),

        init() {
            if (!this.appGrid || !this.dock) {
                console.error("UIManager: Critical elements (appGrid, dock) not found!");
                return;
            }
        },

        // Renders all icons based on the current layout
        renderAllIcons(layout, appInfoGetter) {
            console.log("UIManager: Rendering all icons...");
            this.appGrid.innerHTML = '';
            this.dock.innerHTML = '';

            layout.grid.forEach(appId => {
                const appInfo = appInfoGetter(appId);
                const icon = this._createIconElement(appId, appInfo);
                this.appGrid.appendChild(icon);
            });

            layout.dock.forEach(appId => {
                const appInfo = appInfoGetter(appId);
                const icon = this._createIconElement(appId, appInfo);
                this.dock.appendChild(icon);
            });
            console.log("UIManager: Rendering complete.");
        },

        // Creates a single app icon element
        _createIconElement(id, data) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'app-icon';
            iconWrapper.dataset.appId = id;
            iconWrapper.setAttribute('draggable', 'true');

            const container = document.createElement('div');
            container.className = 'app-icon-container';
            container.style.background = data.color || '#333';
            
            const icon = document.createElement('i');
            icon.className = data.icon;
            container.appendChild(icon);

            const name = document.createElement('span');
            name.textContent = data.name;

            iconWrapper.appendChild(container);
            iconWrapper.appendChild(name);

            iconWrapper.addEventListener('click', () => openApp(id));
            
            return iconWrapper;
        }
    };

    // --- DRAG & DROP SERVICE ---
    // Manages all drag and drop logic.
    const DragDropService = {
        draggedItem: null,
        
        init() {
            const containers = [UIManager.appGrid, UIManager.dock];
            
            document.addEventListener('dragstart', e => {
                if (e.target.classList.contains('app-icon')) {
                    this.draggedItem = e.target;
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                }
            });

            document.addEventListener('dragend', e => {
                if (this.draggedItem) {
                    this.draggedItem.classList.remove('dragging');
                    this.draggedItem = null;
                    this._updateAndSaveLayout();
                }
            });

            containers.forEach(container => {
                container.addEventListener('dragover', e => {
                    e.preventDefault();
                    const afterElement = this._getDragAfterElement(container, e.clientY);
                    if (this.draggedItem) {
                        if (afterElement == null) {
                            container.appendChild(this.draggedItem);
                        } else {
                            container.insertBefore(this.draggedItem, afterElement);
                        }
                    }
                });
            });
        },

        _getDragAfterElement(container, y) {
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
        },

        _updateAndSaveLayout() {
            const newGrid = [...UIManager.appGrid.querySelectorAll('.app-icon')].map(el => el.dataset.appId);
            const newDock = [...UIManager.dock.querySelectorAll('.app-icon')].map(el => el.dataset.appId);
            DataManager.saveLayout({ grid: newGrid, dock: newDock });
        }
    };

    // --- GLOBAL FUNCTIONS ---
    function openApp(appName) {
        if (!appName) return;
        console.log(`Opening app: ${appName}.html`);
        const osFrame = window.parent.document.getElementById('osFrame');
        if (osFrame) {
            osFrame.src = `${appName}.html`;
        } else {
            window.location.href = `${appName}.html`;
        }
    }

    // --- INITIALIZATION ---
    function main() {
        console.log("CronoOS Home: Starting main initialization.");
        
        DataManager.init();
        UIManager.init();
        
        const layout = DataManager.getLayout();
        UIManager.renderAllIcons(layout, DataManager.getAppInfo);
        
        DragDropService.init();

        // Listen for storage changes from other apps (e.g., App Store)
        window.addEventListener('storage', (event) => {
            if (event.key === 'cronos_installed_apps' || event.key === 'crono_app_layout_v2') {
                console.log("Storage changed, reloading home screen state.");
                // Re-run the initialization and render pipeline
                DataManager.init();
                const newLayout = DataManager.getLayout();
                UIManager.renderAllIcons(newLayout, DataManager.getAppInfo);
            }
        });

        console.log("CronoOS Home: Initialization complete. Welcome!");
    }

    main();
});
