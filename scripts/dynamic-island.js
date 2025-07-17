// Dynamic Island JavaScript

let islandState = 'compact'; // 'compact', 'expanded'
let islandTimeout;

document.addEventListener('DOMContentLoaded', function() {
    initializeDynamicIsland();
    setupIslandInteractions();
    simulateIslandActivities();
});

function initializeDynamicIsland() {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;
    
    // Set initial state
    updateIslandContent('idle');
    
    console.log('Dynamic Island initialized');
}

function setupIslandInteractions() {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;
    
    island.addEventListener('click', function() {
        toggleIslandState();
    });
    
    island.addEventListener('mouseenter', function() {
        if (islandState === 'compact') {
            this.style.width = '200px';
            this.style.height = '35px';
        }
    });
    
    island.addEventListener('mouseleave', function() {
        if (islandState === 'compact') {
            this.style.width = '120px';
            this.style.height = '30px';
        }
    });
    
    // Handle action buttons
    setupIslandActions();
}

function setupIslandActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.island-btn.decline')) {
            handleDeclineCall();
        } else if (e.target.closest('.island-btn.accept')) {
            handleAcceptCall();
        }
    });
}

function toggleIslandState() {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;
    
    if (islandState === 'compact') {
        expandIsland();
    } else {
        compactIsland();
    }
}

function expandIsland() {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;
    
    islandState = 'expanded';
    island.classList.add('expanded');
    
    // Auto-compact after 5 seconds
    clearTimeout(islandTimeout);
    islandTimeout = setTimeout(() => {
        compactIsland();
    }, 5000);
}

function compactIsland() {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;
    
    islandState = 'compact';
    island.classList.remove('expanded');
    
    clearTimeout(islandTimeout);
}

function updateIslandContent(type, data = {}) {
    const island = document.getElementById('dynamicIsland');
    if (!island) return;
    
    const titleElement = island.querySelector('.island-title');
    const subtitleElement = island.querySelector('.island-subtitle');
    const avatarElement = island.querySelector('.island-avatar');
    const actionsElement = island.querySelector('.island-actions');
    
    switch (type) {
        case 'call':
            if (titleElement) titleElement.textContent = data.name || 'Marco Rossi';
            if (subtitleElement) subtitleElement.textContent = 'Chiamata in arrivo';
            if (avatarElement) avatarElement.innerHTML = '<i class="fas fa-user"></i>';
            if (actionsElement) actionsElement.style.display = 'flex';
            break;
            
        case 'music':
            if (titleElement) titleElement.textContent = data.title || 'Bohemian Rhapsody';
            if (subtitleElement) subtitleElement.textContent = data.artist || 'Queen';
            if (avatarElement) avatarElement.innerHTML = '<i class="fas fa-music"></i>';
            if (actionsElement) actionsElement.style.display = 'none';
            break;
            
        case 'notification':
            if (titleElement) titleElement.textContent = data.app || 'Messaggi';
            if (subtitleElement) subtitleElement.textContent = data.message || 'Nuovo messaggio';
            if (avatarElement) avatarElement.innerHTML = '<i class="fas fa-bell"></i>';
            if (actionsElement) actionsElement.style.display = 'none';
            break;
            
        case 'timer':
            if (titleElement) titleElement.textContent = 'Timer';
            if (subtitleElement) subtitleElement.textContent = data.time || '05:00';
            if (avatarElement) avatarElement.innerHTML = '<i class="fas fa-clock"></i>';
            if (actionsElement) actionsElement.style.display = 'none';
            break;
            
        default:
            if (titleElement) titleElement.textContent = '';
            if (subtitleElement) subtitleElement.textContent = '';
            if (avatarElement) avatarElement.innerHTML = '<i class="fas fa-circle"></i>';
            if (actionsElement) actionsElement.style.display = 'none';
    }
}

function handleAcceptCall() {
    updateIslandContent('call', { name: 'Marco Rossi' });
    
    // Simulate call accepted
    setTimeout(() => {
        updateIslandContent('music', { 
            title: 'In chiamata', 
            artist: '02:34' 
        });
    }, 1000);
    
    // Auto-compact after call simulation
    setTimeout(() => {
        compactIsland();
        updateIslandContent('idle');
    }, 5000);
}

function handleDeclineCall() {
    compactIsland();
    updateIslandContent('idle');
    
    // Show brief notification
    setTimeout(() => {
        updateIslandContent('notification', {
            app: 'Telefono',
            message: 'Chiamata rifiutata'
        });
        
        setTimeout(() => {
            updateIslandContent('idle');
        }, 3000);
    }, 500);
}

function simulateIslandActivities() {
    // Simulate various island activities
    const activities = [
        () => updateIslandContent('call', { name: 'Anna Bianchi' }),
        () => updateIslandContent('music', { title: 'Imagine', artist: 'John Lennon' }),
        () => updateIslandContent('notification', { app: 'WhatsApp', message: '3 nuovi messaggi' }),
        () => updateIslandContent('timer', { time: '03:45' }),
        () => updateIslandContent('notification', { app: 'Email', message: 'Nuova email' })
    ];
    
    let activityIndex = 0;
    
    // Show different activities every 10 seconds
    setInterval(() => {
        if (islandState === 'compact') {
            activities[activityIndex]();
            activityIndex = (activityIndex + 1) % activities.length;
            
            // Return to idle after 4 seconds
            setTimeout(() => {
                if (islandState === 'compact') {
                    updateIslandContent('idle');
                }
            }, 4000);
        }
    }, 10000);
}

// Listen for OS events to update island
window.addEventListener('message', function(event) {
    if (event.data.type === 'island-update') {
        updateIslandContent(event.data.contentType, event.data.data);
        
        if (event.data.expand) {
            expandIsland();
        }
    }
});

// Export functions for OS integration
window.dynamicIsland = {
    update: updateIslandContent,
    expand: expandIsland,
    compact: compactIsland
};