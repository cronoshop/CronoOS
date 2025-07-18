// App Store JavaScript - Phoenix Edition

document.addEventListener('DOMContentLoaded', function() {
    const appsGrid = document.getElementById('appsGrid');
    const searchInput = document.getElementById('appSearch');

    // --- The Great App Database ---
    const availableApps = {
        'whatsapp': { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', description: 'Simple. Secure. Reliable messaging.' },
        'instagram': { name: 'Instagram', icon: 'fab fa-instagram', color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', description: 'Bring you closer to the people and things you love.' },
        'youtube': { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', description: 'Watch, stream, and discover.' },
        'facebook': { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', description: 'Connect with friends, family and other people you know.' },
        'twitter': { name: 'X (Twitter)', icon: 'fab fa-twitter', color: '#000000', description: 'The everything app.' },
        'telegram': { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088CC', description: 'A new era of messaging.' },
        'spotify': { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954', description: 'Music for everyone.' },
        'netflix': { name: 'Netflix', icon: 'fas fa-film', color: '#E50914', description: 'Watch TV shows and movies online.' },
        'gmail': { name: 'Gmail', icon: 'fas fa-envelope', color: '#EA4335', description: 'Secure, smart, and easy to use email.' },
        'maps': { name: 'Google Maps', icon: 'fas fa-map-marked-alt', color: '#4285F4', description: 'Explore and navigate your world.' },
        'chrome': { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4', description: 'The browser built by Google.' },
        'tiktok': { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000', description: 'Videos, trends, and moments.' },
        'app-designer': { name: 'App Designer', icon: 'fas fa-paint-brush', color: '#E17055', description: 'Design and create your own apps.' },
        'ai-notepad': { name: 'AI Notepad', icon: 'fas fa-robot', color: '#6C5CE7', description: 'Notes powered by artificial intelligence.' },
        'calculator': { name: 'Calculator', icon: 'fas fa-calculator', color: '#74B9FF', description: 'For all your calculation needs.' },
        'news-reader': { name: 'News Reader', icon: 'fas fa-newspaper', color: '#00B894', description: 'Your daily news, personalized.' },
        'discord': { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2', description: 'Your place to talk and hang out.' },
        'zoom': { name: 'Zoom', icon: 'fas fa-video', color: '#2D8CFF', description: 'Happy meetings.' },
        'reddit': { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500', description: 'Dive into anything.' },
        'snapchat': { name: 'Snapchat', icon: 'fab fa-snapchat', color: '#FFFC00', description: 'The fastest way to share a moment!' },
        'teams': { name: 'Microsoft Teams', icon: 'fas fa-users', color: '#6264A7', description: 'Workplace chat and videoconferencing.' },
        'linkedin': { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', description: 'The largest professional network.' },
        'podcast-player': { name: 'Podcast Player', icon: 'fas fa-podcast', color: '#9B59B6', description: 'Listen to your favorite podcasts.' },
    };
    
    // Persist the full app database to localStorage so home.js can read it
    localStorage.setItem('crono_available_apps', JSON.stringify(availableApps));

    let installedApps = JSON.parse(localStorage.getItem('cronos_installed_apps')) || [];

    function saveInstalledApps() {
        localStorage.setItem('cronos_installed_apps', JSON.stringify(installedApps));
        // Force home screen to re-render
        window.parent.postMessage('updateHomeScreen', '*');
    }

    function renderApps(filter = '') {
        appsGrid.innerHTML = '';
        Object.entries(availableApps)
            .filter(([id, data]) => data.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(([id, data]) => {
                const appItem = document.createElement('div');
                appItem.className = 'app-item';

                const iconDiv = document.createElement('div');
                iconDiv.className = 'app-icon';
                iconDiv.style.background = data.color;
                iconDiv.innerHTML = `<i class="${data.icon}"></i>`;

                const infoDiv = document.createElement('div');
                infoDiv.className = 'app-info';
                infoDiv.innerHTML = `
                    <div class="app-name">${data.name}</div>
                    <div class="app-description">${data.description}</div>
                `;

                const button = document.createElement('button');
                button.dataset.appId = id;
                updateButtonState(button);
                
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleInstallToggle(id, button);
                });

                appItem.appendChild(iconDiv);
                appItem.appendChild(infoDiv);
                appItem.appendChild(button);
                appsGrid.appendChild(appItem);
            });
    }

    function updateButtonState(button) {
        const appId = button.dataset.appId;
        button.className = 'install-btn';

        if (installedApps.includes(appId)) {
            button.classList.add('installed');
            button.innerHTML = 'OPEN'; // Or 'UNINSTALL'
            button.onclick = () => openApp(appId);
        } else {
            button.innerHTML = '<i class="fas fa-download"></i> GET';
        }
    }

    function handleInstallToggle(appId, button) {
        if (installedApps.includes(appId)) {
            // Uninstall logic
            // installedApps = installedApps.filter(id => id !== appId);
            // showToast(`${availableApps[appId].name} uninstalled.`);
            openApp(appId); // For now, Open is better than uninstall here
        } else {
            // Install logic
            button.classList.add('installing');
            button.textContent = '...';
            setTimeout(() => {
                installedApps.push(appId);
                showToast(`${availableApps[appId].name} installed!`);
                saveInstalledApps();
                updateButtonState(button);
                // Force a reload of home iframe to show new app
                if (window.parent) {
                    const osFrame = window.parent.document.getElementById('osFrame');
                    if (osFrame) {
                       // A bit of a hack, but effective for this simulation
                       const currentPage = osFrame.src;
                       osFrame.src = 'home.html';
                       // Optional: navigate back to store after a delay
                       // setTimeout(() => osFrame.src = currentPage, 2000);
                    }
                }
            }, 1500);
        }
    }

    searchInput.addEventListener('input', (e) => renderApps(e.target.value));
    
    // Initial Render
    renderApps();
});
