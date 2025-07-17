// Play Store App JavaScript - One UI OS

let apps = [];
let installedApps = [];
let downloadQueue = [];

document.addEventListener('DOMContentLoaded', function() {
    initializePlayStoreApp();
    loadApps();
    loadInstalledApps();
});

function initializePlayStoreApp() {
    generateSampleApps();
    updateAppsDisplay();
    updateGamesDisplay();
    updateUpdatesDisplay();
    
    console.log('Play Store app initialized');
}

function generateSampleApps() {
    apps = [
        {
            id: 1,
            name: 'WhatsApp Messenger',
            developer: 'WhatsApp LLC',
            category: 'Comunicazione',
            rating: 4.1,
            price: 'Gratis',
            size: '45.2 MB',
            icon: '💬',
            description: 'Messaggistica istantanea semplice, sicura e affidabile',
            screenshots: ['📱', '💬', '📞'],
            version: '2.24.1.78',
            downloads: '5B+',
            type: 'app'
        },
        {
            id: 2,
            name: 'Instagram',
            developer: 'Instagram',
            category: 'Social',
            rating: 4.3,
            price: 'Gratis',
            size: '67.8 MB',
            icon: '📷',
            description: 'Condividi foto e video con i tuoi amici',
            screenshots: ['📸', '📹', '💝'],
            version: '312.0.0.44.113',
            downloads: '1B+',
            type: 'app'
        },
        {
            id: 3,
            name: 'Spotify',
            developer: 'Spotify AB',
            category: 'Musica',
            rating: 4.4,
            price: 'Gratis',
            size: '89.3 MB',
            icon: '🎵',
            description: 'Musica e podcast per ogni momento',
            screenshots: ['🎶', '🎧', '📻'],
            version: '8.8.96.488',
            downloads: '1B+',
            type: 'app'
        },
        {
            id: 4,
            name: 'Netflix',
            developer: 'Netflix, Inc.',
            category: 'Intrattenimento',
            rating: 4.2,
            price: 'Gratis',
            size: '124.5 MB',
            icon: '🎬',
            description: 'Film, serie TV e molto altro',
            screenshots: ['🎭', '🍿', '📺'],
            version: '8.108.0',
            downloads: '1B+',
            type: 'app'
        },
        {
            id: 5,
            name: 'YouTube',
            developer: 'Google LLC',
            category: 'Video',
            rating: 4.0,
            price: 'Gratis',
            size: '156.7 MB',
            icon: '📺',
            description: 'Guarda i tuoi video preferiti',
            screenshots: ['▶️', '🎥', '📹'],
            version: '19.01.35',
            downloads: '10B+',
            type: 'app'
        },
        // Games
        {
            id: 6,
            name: 'Candy Crush Saga',
            developer: 'King',
            category: 'Puzzle',
            rating: 4.5,
            price: 'Gratis',
            size: '78.9 MB',
            icon: '🍭',
            description: 'Il gioco di puzzle più dolce del mondo',
            screenshots: ['🍬', '🎮', '🏆'],
            version: '1.268.1.0',
            downloads: '1B+',
            type: 'game'
        },
        {
            id: 7,
            name: 'PUBG Mobile',
            developer: 'PUBG Corporation',
            category: 'Azione',
            rating: 4.3,
            price: 'Gratis',
            size: '2.1 GB',
            icon: '🎮',
            description: 'Battle royale ufficiale di PUBG',
            screenshots: ['🔫', '🏃', '🏆'],
            version: '3.0.0',
            downloads: '1B+',
            type: 'game'
        },
        {
            id: 8,
            name: 'Among Us',
            developer: 'InnerSloth LLC',
            category: 'Sociale',
            rating: 4.1,
            price: '€4.99',
            size: '250.3 MB',
            icon: '👾',
            description: 'Gioca online o via WiFi locale',
            screenshots: ['🚀', '🔍', '👥'],
            version: '2023.11.28',
            downloads: '500M+',
            type: 'game'
        }
    ];
    
    installedApps = [1, 2, 3]; // WhatsApp, Instagram, Spotify are "installed"
}

function updateAppsDisplay() {
    const appsList = document.querySelector('.apps-list');
    if (!appsList) return;
    
    const appsOnly = apps.filter(app => app.type === 'app');
    
    // Clear existing content except the title
    const title = appsList.querySelector('h3');
    appsList.innerHTML = '';
    if (title) appsList.appendChild(title);
    
    appsOnly.forEach(app => {
        const appElement = createAppElement(app);
        appsList.appendChild(appElement);
    });
}

function updateGamesDisplay() {
    const gamesList = document.querySelector('.games-list');
    if (!gamesList) return;
    
    const gamesOnly = apps.filter(app => app.type === 'game');
    
    // Clear existing content except the title
    const title = gamesList.querySelector('h3');
    gamesList.innerHTML = '';
    if (title) gamesList.appendChild(title);
    
    gamesOnly.forEach(game => {
        const gameElement = createAppElement(game);
        gamesList.appendChild(gameElement);
    });
}

function createAppElement(app) {
    const element = document.createElement('div');
    element.className = 'app-item';
    element.onclick = () => viewApp(app.name);
    
    const isInstalled = installedApps.includes(app.id);
    const buttonText = isInstalled ? 'Apri' : (app.price === 'Gratis' ? 'Installa' : app.price);
    const buttonClass = app.price === 'Gratis' ? 'install-btn' : 'install-btn purchase';
    
    element.innerHTML = `
        <div class="app-icon">${app.icon}</div>
        <div class="app-info">
            <div class="app-name">${app.name}</div>
            <div class="app-developer">${app.developer}</div>
            <div class="app-rating">⭐ ${app.rating} • ${app.price}</div>
        </div>
        <button class="${buttonClass}" onclick="installApp('${app.name}', event)" 
                ${isInstalled ? 'disabled' : ''}>${buttonText}</button>
    `;
    
    return element;
}

function updateUpdatesDisplay() {
    const updatesList = document.querySelector('.updates-list');
    if (!updatesList) return;
    
    // Get apps that have updates available (installed apps)
    const updatableApps = apps.filter(app => installedApps.includes(app.id));
    
    // Clear existing content except the title
    const title = updatesList.querySelector('h3');
    updatesList.innerHTML = '';
    if (title) updatesList.appendChild(title);
    
    updatableApps.forEach(app => {
        const updateElement = createUpdateElement(app);
        updatesList.appendChild(updateElement);
    });
    
    // Add update all button
    if (updatableApps.length > 0) {
        const updateAllBtn = document.createElement('button');
        updateAllBtn.className = 'update-all-btn';
        updateAllBtn.textContent = 'Aggiorna tutto';
        updateAllBtn.onclick = updateAllApps;
        updatesList.appendChild(updateAllBtn);
    }
}

function createUpdateElement(app) {
    const element = document.createElement('div');
    element.className = 'app-item';
    
    element.innerHTML = `
        <div class="app-icon">${app.icon}</div>
        <div class="app-info">
            <div class="app-name">${app.name}</div>
            <div class="app-developer">Versione ${app.version}</div>
            <div class="app-rating">Dimensione: ${app.size}</div>
        </div>
        <button class="update-btn" onclick="updateApp('${app.name}')">Aggiorna</button>
    `;
    
    return element;
}

function viewApp(appName) {
    const app = apps.find(a => a.name === appName);
    if (!app) return;
    
    showAppDetails(app);
}

function showAppDetails(app) {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'app-details-modal';
    
    const isInstalled = installedApps.includes(app.id);
    const buttonText = isInstalled ? 'Apri' : (app.price === 'Gratis' ? 'Installa' : app.price);
    
    detailsModal.innerHTML = `
        <div class="details-content">
            <div class="details-header">
                <button class="back-btn" onclick="closeAppDetails()">←</button>
                <h3>Dettagli App</h3>
                <button class="share-btn">📤</button>
            </div>
            
            <div class="app-hero">
                <div class="app-icon-large">${app.icon}</div>
                <div class="app-main-info">
                    <h2>${app.name}</h2>
                    <p class="app-developer">${app.developer}</p>
                    <div class="app-stats">
                        <span>⭐ ${app.rating}</span>
                        <span>${app.downloads} download</span>
                        <span>${app.category}</span>
                    </div>
                </div>
                <button class="install-btn-large" onclick="installApp('${app.name}', event)">
                    ${buttonText}
                </button>
            </div>
            
            <div class="app-screenshots">
                ${app.screenshots.map(screenshot => `
                    <div class="screenshot">${screenshot}</div>
                `).join('')}
            </div>
            
            <div class="app-description">
                <h4>Descrizione</h4>
                <p>${app.description}</p>
            </div>
            
            <div class="app-details-info">
                <div class="detail-row">
                    <span>Versione</span>
                    <span>${app.version}</span>
                </div>
                <div class="detail-row">
                    <span>Dimensione</span>
                    <span>${app.size}</span>
                </div>
                <div class="detail-row">
                    <span>Download</span>
                    <span>${app.downloads}</span>
                </div>
                <div class="detail-row">
                    <span>Categoria</span>
                    <span>${app.category}</span>
                </div>
            </div>
        </div>
    `;
    
    detailsModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background-color);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        overflow-y: auto;
    `;
    
    document.body.appendChild(detailsModal);
}

function closeAppDetails() {
    const detailsModal = document.querySelector('.app-details-modal');
    if (detailsModal) {
        detailsModal.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => detailsModal.remove(), 300);
    }
}

function installApp(appName, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const app = apps.find(a => a.name === appName);
    if (!app) return;
    
    // Check if already installed
    if (installedApps.includes(app.id)) {
        showToast(`${appName} è già installato`);
        return;
    }
    
    // Start installation process
    startInstallation(app);
}

function startInstallation(app) {
    // Show installation progress
    showInstallProgress(app);
    
    // Simulate download progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            completeInstallation(app);
        }
        
        updateInstallProgress(progress);
    }, 200);
    
    hapticFeedback('medium');
}

function showInstallProgress(app) {
    const progressContainer = document.getElementById('installProgress');
    if (!progressContainer) return;
    
    // Update progress info
    const appIcon = progressContainer.querySelector('.progress-app-icon');
    const appName = progressContainer.querySelector('.progress-app-name');
    const status = progressContainer.querySelector('.progress-status');
    
    if (appIcon) appIcon.textContent = app.icon;
    if (appName) appName.textContent = app.name;
    if (status) status.textContent = 'Download in corso...';
    
    // Show progress container
    progressContainer.style.display = 'block';
    
    // Reset progress
    updateInstallProgress(0);
}

function updateInstallProgress(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }
    
    // Update status text based on progress
    const status = document.querySelector('.progress-status');
    if (status) {
        if (progress < 50) {
            status.textContent = 'Download in corso...';
        } else if (progress < 90) {
            status.textContent = 'Installazione...';
        } else {
            status.textContent = 'Completamento...';
        }
    }
}

function completeInstallation(app) {
    // Add to installed apps
    installedApps.push(app.id);
    
    // Update displays
    updateAppsDisplay();
    updateGamesDisplay();
    updateUpdatesDisplay();
    
    // Hide progress
    setTimeout(() => {
        const progressContainer = document.getElementById('installProgress');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }, 1000);
    
    // Show completion message
    showToast(`${app.name} installato con successo`);
    hapticFeedback('heavy');
    
    // Close app details if open
    const detailsModal = document.querySelector('.app-details-modal');
    if (detailsModal) {
        // Update install button
        const installBtn = detailsModal.querySelector('.install-btn-large');
        if (installBtn) {
            installBtn.textContent = 'Apri';
            installBtn.onclick = () => openApp(app.name);
        }
    }
}

function updateApp(appName) {
    const app = apps.find(a => a.name === appName);
    if (!app) return;
    
    // Simulate update process
    showToast(`Aggiornamento ${appName} in corso...`);
    
    setTimeout(() => {
        showToast(`${appName} aggiornato con successo`);
        hapticFeedback('medium');
    }, 2000);
}

function updateAllApps() {
    const updatableApps = apps.filter(app => installedApps.includes(app.id));
    
    showToast(`Aggiornamento di ${updatableApps.length} app in corso...`);
    
    let completed = 0;
    updatableApps.forEach((app, index) => {
        setTimeout(() => {
            completed++;
            if (completed === updatableApps.length) {
                showToast('Tutti gli aggiornamenti completati');
                hapticFeedback('heavy');
            }
        }, (index + 1) * 1000);
    });
}

function openApp(appName) {
    // This would normally open the actual app
    showToast(`Apertura ${appName}...`);
    
    // Close any open modals
    closeAppDetails();
    
    // Could navigate to the actual app here
    setTimeout(() => {
        // For demo purposes, just show a message
        showToast(`${appName} aperto`);
    }, 500);
}

// Search functionality
function initializeStoreSearch() {
    const searchInput = document.getElementById('storeSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        
        if (query === '') {
            // Show all apps
            updateAppsDisplay();
            updateGamesDisplay();
            return;
        }
        
        // Filter apps based on search query
        const filteredApps = apps.filter(app => 
            app.name.toLowerCase().includes(query) ||
            app.developer.toLowerCase().includes(query) ||
            app.category.toLowerCase().includes(query)
        );
        
        // Update displays with filtered results
        updateSearchResults(filteredApps);
        
        showToast(`${filteredApps.length} risultati per "${query}"`);
    }, 300));
}

function updateSearchResults(filteredApps) {
    const appsList = document.querySelector('.apps-list');
    const gamesList = document.querySelector('.games-list');
    
    if (appsList) {
        const title = appsList.querySelector('h3');
        appsList.innerHTML = '';
        if (title) {
            title.textContent = 'Risultati ricerca';
            appsList.appendChild(title);
        }
        
        filteredApps.forEach(app => {
            const appElement = createAppElement(app);
            appsList.appendChild(appElement);
        });
    }
    
    // Hide games tab during search
    if (gamesList) {
        gamesList.style.display = 'none';
    }
}

// Initialize search
document.addEventListener('DOMContentLoaded', initializeStoreSearch);

// App categories
function showCategory(category) {
    const categoryApps = apps.filter(app => app.category === category);
    
    const categoryModal = document.createElement('div');
    categoryModal.className = 'category-modal';
    categoryModal.innerHTML = `
        <div class="category-content">
            <div class="category-header">
                <button class="back-btn" onclick="closeCategoryModal()">←</button>
                <h3>${category}</h3>
            </div>
            <div class="category-apps">
                ${categoryApps.map(app => createAppElement(app).outerHTML).join('')}
            </div>
        </div>
    `;
    
    categoryModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background-color);
        z-index: 2000;
        animation: slideInUp 0.3s ease;
        overflow-y: auto;
    `;
    
    document.body.appendChild(categoryModal);
}

function closeCategoryModal() {
    const categoryModal = document.querySelector('.category-modal');
    if (categoryModal) {
        categoryModal.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => categoryModal.remove(), 300);
    }
}

// Load and save data
function loadApps() {
    // In a real app, this would load from API or storage
    console.log('Apps loaded');
}

function loadInstalledApps() {
    const saved = localStorage.getItem('playstore_installed_apps');
    if (saved) {
        installedApps = JSON.parse(saved);
        updateAppsDisplay();
        updateGamesDisplay();
        updateUpdatesDisplay();
    }
}

function saveInstalledApps() {
    localStorage.setItem('playstore_installed_apps', JSON.stringify(installedApps));
}

// Save installed apps whenever they change
setInterval(saveInstalledApps, 5000);

// Add CSS for Play Store specific styles
const playstoreStyles = document.createElement('style');
playstoreStyles.textContent = `
    .app-details-modal .details-content {
        padding: 0;
    }
    
    .details-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: var(--card-color);
        border-bottom: 1px solid var(--divider-color);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .details-header h3 {
        margin: 0;
        font-size: 18px;
        color: var(--text-primary);
    }
    
    .share-btn {
        background: none;
        border: none;
        font-size: 18px;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .share-btn:hover {
        background: var(--surface-color);
    }
    
    .app-hero {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: var(--card-color);
    }
    
    .app-icon-large {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--oneui-green), var(--oneui-blue));
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: white;
        flex-shrink: 0;
        box-shadow: 0 4px 12px var(--shadow-color);
    }
    
    .app-main-info {
        flex: 1;
        min-width: 0;
    }
    
    .app-main-info h2 {
        margin: 0 0 4px 0;
        font-size: 20px;
        color: var(--text-primary);
    }
    
    .app-main-info .app-developer {
        margin: 0 0 8px 0;
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .app-stats {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: var(--text-secondary);
    }
    
    .install-btn-large {
        background: var(--oneui-green);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 100px;
    }
    
    .install-btn-large:hover {
        background: #45a049;
        transform: translateY(-1px);
    }
    
    .app-screenshots {
        display: flex;
        gap: 12px;
        padding: 20px;
        overflow-x: auto;
        background: var(--surface-color);
    }
    
    .screenshot {
        width: 150px;
        height: 250px;
        background: var(--card-color);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        flex-shrink: 0;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    
    .app-description {
        padding: 20px;
        background: var(--card-color);
        margin-top: 8px;
    }
    
    .app-description h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: var(--text-primary);
    }
    
    .app-description p {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    .app-details-info {
        padding: 20px;
        background: var(--card-color);
        margin-top: 8px;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .detail-row span:first-child {
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .detail-row span:last-child {
        color: var(--text-primary);
    }
    
    .category-content {
        padding: 0;
    }
    
    .category-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--card-color);
        border-bottom: 1px solid var(--divider-color);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .category-header h3 {
        margin: 0;
        font-size: 18px;
        color: var(--text-primary);
    }
    
    .category-apps {
        padding: 16px;
    }
    
    .install-btn.purchase {
        background: var(--oneui-orange);
    }
    
    .install-btn.purchase:hover {
        background: #f57c00;
    }
    
    .install-btn:disabled {
        background: var(--text-secondary);
        cursor: not-allowed;
        transform: none;
    }
    
    .install-btn:disabled:hover {
        background: var(--text-secondary);
        transform: none;
    }
`;

document.head.appendChild(playstoreStyles);