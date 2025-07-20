// Navigation System JavaScript - CronoOS UI 3.0 Enhanced

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigationSystem();
    setupNavigationInteractions();
    setupMultitaskingSystem();
    setupPageAnimations();
});

function initializeNavigationSystem() {
    console.log('Enhanced Navigation System initialized - CronoOS 3.0');
    
    // Add entrance animations to navigation items
    setTimeout(() => {
        const navItems = document.querySelectorAll('.navigation ul li');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = `fadeInUp 0.5s ease-out forwards`;
            }, index * 100);
        });
    }, 300);
}

function setupNavigationInteractions() {
    // Cool Navigation Menu Logic
    const navigationItems = document.querySelectorAll('.navigation .list');
    
    navigationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navigationItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the navigation target
            const icon = this.querySelector('.icon i');
            const text = this.querySelector('.text').textContent;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle navigation based on the icon/text
            handleNavigationClick(text, icon);
            
            // Show toast with spring animation
            showToastWithAnimation(`${text} selezionato`);
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

function handleNavigationClick(text, icon) {
    const navigationMap = {
        'Home': 'home.html',
        'Profile': 'account.html',
        'Messages': 'messages.html',
        'Photos': 'gallery.html',
        'Settings': 'settings.html'
    };
    
    const targetPage = navigationMap[text];
    
    if (targetPage) {
        // Add page transition animation
        animatePageTransition(() => {
            openApp(targetPage);
        });
    } else {
        showToastWithAnimation(`${text} - Funzione in sviluppo`);
    }
}

function animatePageTransition(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(41, 253, 83, 0.1), rgba(0, 212, 170, 0.1));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Execute callback and animate out
    setTimeout(() => {
        callback();
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }, 300);
}

function setupMultitaskingSystem() {
    // Enhanced multitasking with better animations
    const multitaskingOverlay = document.getElementById('multitaskingOverlay');
    
    if (multitaskingOverlay) {
        // Close on background click
        multitaskingOverlay.addEventListener('click', function(e) {
            if (e.target === multitaskingOverlay) {
                hideMultitaskingWithAnimation();
            }
        });
        
        // Setup app cards interactions
        setupAppCardsAnimations();
    }
}

function setupAppCardsAnimations() {
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02) rotateX(5deg)';
            this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
        });
        
        // Click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-4px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }, 100);
        });
    });
}

function setupPageAnimations() {
    // Add page load animation
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.opacity = '0';
        appContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            appContainer.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            appContainer.style.opacity = '1';
            appContainer.style.transform = 'translateY(0)';
        }, 100);
    }
}

function showMultitaskingWithAnimation() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (!overlay) return;
    
    overlay.classList.add('active');
    
    // Animate cards with stagger
    setTimeout(() => {
        const cards = document.querySelectorAll('.app-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = `cardSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
            }, index * 100);
        });
    }, 200);
    
    showToastWithAnimation('Multitasking aperto');
}

function hideMultitaskingWithAnimation() {
    const overlay = document.getElementById('multitaskingOverlay');
    if (!overlay) return;
    
    // Animate cards out
    const cards = document.querySelectorAll('.app-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `cardSlideOut 0.3s ease-in forwards`;
        }, index * 50);
    });
    
    // Hide overlay after cards animation
    setTimeout(() => {
        overlay.classList.remove('active');
        
        // Reset cards for next time
        setTimeout(() => {
            cards.forEach(card => {
                card.style.animation = '';
            });
        }, 300);
    }, cards.length * 50 + 300);
}

function showToastWithAnimation(message) {
    // Enhanced toast with spring animation
    const existingToast = document.querySelector('.toast-notification-enhanced');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification-enhanced';
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%) translateY(50px) scale(0.8);
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 15px;
        font-weight: 500;
        font-family: "Poppins", sans-serif;
        z-index: 3000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(toast);

    // Animate in with spring effect
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0) scale(1)';
    }, 10);

    // Animate out
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-30px) scale(0.9)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 3000);
}

// Add keyframe animations to document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes cardSlideOut {
        to {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
        }
    }
    
    @keyframes springBounce {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .spring-animation {
        animation: springBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
`;
document.head.appendChild(styleSheet);

// Enhanced global functions
function showMultitasking() {
    showMultitaskingWithAnimation();
}

function hideMultitasking() {
    hideMultitaskingWithAnimation();
}

function goBack() {
    if (document.getElementById('multitaskingOverlay')?.classList.contains('active')) {
        hideMultitaskingWithAnimation();
        return;
    }
    
    // Add back animation
    animatePageTransition(() => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            openApp('home.html');
        }
    });
}

// Make functions globally available
window.showMultitasking = showMultitasking;
window.hideMultitasking = hideMultitasking;
window.goBack = goBack;
window.showToastWithAnimation = showToastWithAnimation;
window.animatePageTransition = animatePageTransition;