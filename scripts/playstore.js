// App Store JavaScript - Phoenix Edition v2 (Stable)

document.addEventListener('DOMContentLoaded', () => {
    const appsGrid = document.getElementById('appsGrid');
    const searchInput = document.getElementById('appSearch');
    let installedApps = new Set(JSON.parse(localStorage.getItem('cronos_installed_apps')) || []);

    function renderApps(filter = '') {
        appsGrid.innerHTML = '';
        Object.entries(AVAILABLE_APPS)
            .filter(([id, data]) => !data.isCore && data.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(([id, data]) => {
                appsGrid.appendChild(createAppItem(id, data));
            });
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
            openApp(AVAILABLE_APPS[appId].page || `${appId}.html`);
        } else {
            // Install logic
            button.classList.add('installing');
            button.disabled = true;
            button.textContent = '...';
            setTimeout(() => {
                installedApps.add(appId);
                localStorage.setItem('cronos_installed_apps', JSON.stringify([...installedApps]));
                showToast(`${AVAILABLE_APPS[appId].name} installata!`);
                button.disabled = false;
                updateButtonState(button);
            }, 1500);
        }
    }
    
    // Initial Render
    renderApps();
    searchInput.addEventListener('input', (e) => renderApps(e.target.value));
});
