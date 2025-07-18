// CronoOS Home Screen Logic v2.1 (Robust & Stable)

document.addEventListener('DOMContentLoaded', () => {
    const appGrid = document.getElementById('appGrid');
    const dock = document.getElementById('dock');
    let draggedItem = null;

    // --- 1. DATA INITIALIZATION ---
    function initializeData() {
        // Get installed apps from localStorage or create a default set
        const coreApps = Object.keys(AVAILABLE_APPS).filter(id => AVAILABLE_APPS[id].isCore);
        let installedApps = new Set(JSON.parse(localStorage.getItem('cronos_installed_apps')) || coreApps);
        coreApps.forEach(appId => installedApps.add(appId)); // Ensure core apps are always there
        localStorage.setItem('cronos_installed_apps', JSON.stringify([...installedApps]));
        
        // Get layout from localStorage or create a default layout
        let layout = JSON.parse(localStorage.getItem('crono_app_layout_v3'));
        const dockDefault = ['phone', 'messages', 'camera', 'playstore'];

        // If no layout exists, or if it's invalid, create a new one
        if (!layout || !layout.grid || !layout.dock) {
            console.log("No valid layout found. Creating a default layout.");
            const dockApps = dockDefault.filter(id => installedApps.has(id));
            const gridApps = [...installedApps].filter(id => !dockDefault.includes(id));
            layout = { dock: dockApps, grid: gridApps };
            saveLayout(layout);
        }
        return { installedApps, layout };
    }

    // --- 2. UI RENDERING ---
    function renderIcons({ installedApps, layout }) {
        appGrid.innerHTML = '';
        dock.innerHTML = '';

        // Render Grid
        layout.grid
            .filter(appId => installedApps.has(appId))
            .forEach(appId => {
                const appInfo = AVAILABLE_APPS[appId];
                if (appInfo) appGrid.appendChild(createIconElement(appId, appInfo));
            });

        // Render Dock
        layout.dock
            .filter(appId => installedApps.has(appId))
            .forEach(appId => {
                const appInfo = AVAILABLE_APPS[appId];
                if (appInfo) dock.appendChild(createIconElement(appId, appInfo));
            });
    }

    function createIconElement(id, data) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'app-icon';
        iconWrapper.dataset.appId = id;
        iconWrapper.draggable = true;

        const container = document.createElement('div');
        container.className = 'app-icon-container';
        container.style.background = data.color || '#333';
        container.innerHTML = `<i class="${data.icon}"></i>`;

        const name = document.createElement('span');
        name.textContent = data.name;

        iconWrapper.append(container, name);
        iconWrapper.addEventListener('click', () => openApp(data.page || `${id}.html`));
        return iconWrapper;
    }

    // --- 3. DRAG & DROP LOGIC ---
    function setupDragAndDrop() {
        document.addEventListener('dragstart', e => {
            if (e.target.classList.contains('app-icon')) {
                draggedItem = e.target;
                setTimeout(() => e.target.classList.add('dragging'), 0);
            }
        });

        document.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
                saveCurrentLayout();
            }
        });

        const containers = [appGrid, dock];
        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                container.classList.add('drag-over');
                const afterElement = getDragAfterElement(container, e.clientX);
                if (draggedItem) {
                    if (afterElement == null) {
                        container.appendChild(draggedItem);
                    } else {
                        container.insertBefore(draggedItem, afterElement);
                    }
                }
            });
            container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
            container.addEventListener('drop', () => container.classList.remove('drag-over'));
        });
    }

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.app-icon:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- 4. DATA PERSISTENCE ---
    function saveLayout(layout) {
        localStorage.setItem('crono_app_layout_v3', JSON.stringify(layout));
    }

    function saveCurrentLayout() {
        const grid = [...appGrid.querySelectorAll('.app-icon')].map(el => el.dataset.appId);
        const dockApps = [...dock.querySelectorAll('.app-icon')].map(el => el.dataset.appId);
        saveLayout({ grid, dock: dockApps });
        console.log("Layout Saved.");
    }
    
    // --- 5. INITIALIZATION & EVENT LISTENERS ---
    function boot() {
        const data = initializeData();
        renderIcons(data);
        setupDragAndDrop();

        // Listen for installs/uninstalls from other pages
        window.addEventListener('storage', (event) => {
            if (event.key === 'cronos_installed_apps') {
                console.log("Detected app installation change. Re-rendering home screen.");
                const freshData = initializeData();
                renderIcons(freshData);
            }
        });
    }

    boot();
});
