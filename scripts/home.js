// Home Screen JavaScript - Phoenix Edition

document.addEventListener('DOMContentLoaded', function() {
    const appGrid = document.getElementById('appGrid');
    const dock = document.getElementById('dock');
    
    // Default dock apps
    const DOCK_APPS = ['phone', 'messages', 'camera', 'playstore'];

    // --- Data Initialization ---
    function getAvailableApps() {
        const appsData = localStorage.getItem('crono_available_apps');
        return appsData ? JSON.parse(appsData) : {};
    }

    function getInstalledApps() {
        const installedData = localStorage.getItem('cronos_installed_apps');
        // Core apps are always installed
        const coreApps = ['phone', 'messages', 'camera', 'gallery', 'calendar', 'settings'];
        if (!installedData) {
            return coreApps;
        }
        const userApps = JSON.parse(installedData);
        return [...new Set([...coreApps, ...userApps])];
    }

    // --- UI Rendering ---
    function renderIcons() {
        const availableApps = getAvailableApps();
        const installedApps = getInstalledApps();
        const appLayout = JSON.parse(localStorage.getItem('crono_app_layout')) || installedApps;

        appGrid.innerHTML = '';
        dock.innerHTML = '';

        const appsToRender = appLayout.filter(id => installedApps.includes(id));

        appsToRender.forEach(appId => {
            const appData = availableApps[appId];
            if (!appData) return;

            const icon = createAppIcon(appId, appData);
            if (DOCK_APPS.includes(appId)) {
                dock.appendChild(icon);
            } else {
                appGrid.appendChild(icon);
            }
        });
        
        setupDragAndDrop();
    }

    function createAppIcon(id, data) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'app-icon';
        iconWrapper.dataset.appId = id;
        iconWrapper.setAttribute('draggable', 'true');

        const container = document.createElement('div');
        container.className = 'app-icon-container';
        if(data.color) {
            container.style.background = data.color;
        }
        
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
    
    // --- Drag and Drop ---
    function setupDragAndDrop() {
        const icons = document.querySelectorAll('.app-icon[draggable="true"]');
        let draggedItem = null;

        icons.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                setTimeout(() => item.classList.add('dragging'), 0);
            });

            item.addEventListener('dragend', () => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                saveLayout();
            });
        });

        appGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(appGrid, e.clientY);
            if (afterElement == null) {
                appGrid.appendChild(draggedItem);
            } else {
                appGrid.insertBefore(draggedItem, afterElement);
            }
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

    // --- Data Persistence ---
    function saveLayout() {
        const allIcons = [...appGrid.querySelectorAll('.app-icon'), ...dock.querySelectorAll('.app-icon')];
        const layout = allIcons.map(icon => icon.dataset.appId);
        localStorage.setItem('crono_app_layout', JSON.stringify(layout));
    }
    
    // --- Initial Load ---
    renderIcons();
    
    // Listen for storage changes to auto-update UI
    window.addEventListener('storage', (e) => {
        if (e.key === 'cronos_installed_apps' || e.key === 'crono_available_apps') {
            location.reload(); // Simple way to reflect changes
        }
    });
});
