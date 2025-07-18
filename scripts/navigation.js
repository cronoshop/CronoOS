// Navigation System - CronoOS 3.0

let isMultitaskingOpen = false;
let navigationHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    setupNavigationListeners();
});

function initializeNavigation() {
    console.log('CronoOS 3.0 Navigation System initialized');
    
    // Add current page to history
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (navigationHistory.length === 0) {
        navigationHistory.push(currentPage);
    }
    
    // Setup gesture listeners
    setupGestureListeners();
}

function setupNavigationListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isMultitaskingOpen) {
                hideMultitasking();
            } else {
                goBack();
            }
        }
        
        if (e.key === 'h' && e.ctrlKey) {
            e.preventDefault();
            goHome();
        }
        
        if (e.key === 'm' && e.ctrlKey) {
            e.preventDefault();
            showMultitasking();
        }
    });
    
    // Close app cards
    document.querySelectorAll('.close-app-card').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAppCard(this.closest('.app-card'));
        });
    });
}

function setupGestureListeners() {
    let startY = 0;
    let startX = 0;
    let isGesturing = false;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isGesturing = true;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!isGesturing) return;
        
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const deltaY = endY - startY;
        const deltaX = endX - startX;
        
        // Swipe up from bottom for multitasking
        if (deltaY < -100 && startY > window.innerHeight - 100 && Math.abs(deltaX) < 50) {
            showMultitasking();
        }
        
        // Swipe from left edge for back
        if (deltaX > 100 && startX < 50 && Math.abs(deltaY) < 100) {
            goBack();
        }
        
        isGesturing = false;
    }, { passive: true });
}

function goBack() {
    if (isMultitaskingOpen) {
        hideMultitasking();
        return;
    }
    
    // Check if we can go back in browser history
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Fallback to home
        goHome();
    }
    
    showToast('Navigazione indietro');
}

function goHome() {
    if (isMultitaskingOpen) {
        hideMultitasking();
    }
    
    // Add smooth transition
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        openApp('home.html');
    }, 300);
}

function showMultitasking() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (!overlay) return;
    
    isMultitaskingOpen = true;
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
    
    isMultitaskingOpen = false;
    overlay.classList.remove('active');
    
    // Remove animations
    document.querySelectorAll('.app-card').forEach(card => {
        card.classList.remove('spring-animation');
    });
}

function closeAppCard(card) {
    if (!card) return;
    
    // Add close animation
    card.style.transform = 'translateY(-20px) scale(0.8)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.remove();
        showToast('App chiusa');
    }, 300);
}

// Enhanced navigation with page tracking
function navigateToPage(page) {
    // Add to navigation history
    if (navigationHistory[navigationHistory.length - 1] !== page) {
        navigationHistory.push(page);
        
        // Keep history manageable
        if (navigationHistory.length > 10) {
            navigationHistory.shift();
        }
    }
    
    openApp(page);
}

// Global navigation functions
window.goBack = goBack;
window.goHome = goHome;
window.showMultitasking = showMultitasking;
window.hideMultitasking = hideMultitasking;
window.navigateToPage = navigateToPage;