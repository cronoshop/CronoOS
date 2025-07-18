// Enhanced Global JavaScript - CronoOS 3.1

class CronoOS {
    constructor() {
        this.version = '3.1';
        this.theme = 'light';
        this.settings = {};
        this.installedApps = new Set();
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateTime();
        this.initializeNavbar();
        this.applyTheme();
        console.log(`CronoOS ${this.version} initialized`);
    }

    loadSettings() {
        try {
            this.settings = JSON.parse(localStorage.getItem('cronos_settings') || '{}');
            this.theme = this.settings.theme || 'light';
            this.installedApps = new Set(JSON.parse(localStorage.getItem('cronos_installed_apps') || '[]'));
        } catch (error) {
            console.warn('Failed to load settings:', error);
            this.settings = {};
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('cronos_settings', JSON.stringify(this.settings));
            localStorage.setItem('cronos_installed_apps', JSON.stringify([...this.installedApps]));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    setupEventListeners() {
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
        
        // Handle theme changes
        document.addEventListener('themeChange', (e) => {
            this.setTheme(e.detail.theme);
        });
        
        // Handle app installations
        document.addEventListener('appInstalled', (e) => {
            this.installedApps.add(e.detail.appId);
            this.saveSettings();
        });
        
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-navigate]')) {
                e.preventDefault();
                this.navigateTo(e.target.dataset.navigate);
            }
        });
        
        // Handle glass effects
        this.setupGlassEffects();
    }

    setupGlassEffects() {
        // Add spring animation to interactive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('.glass-btn, .glass-card, .navbar-btn')) {
                e.target.classList.add('spring-animation');
                setTimeout(() => {
                    e.target.classList.remove('spring-animation');
                }, 600);
            }
        });
        
        // Add shimmer effect on hover
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.glass-panel')) {
                e.target.classList.add('glass-shimmer');
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.glass-panel')) {
                e.target.classList.remove('glass-shimmer');
            }
        }, true);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        const dateString = now.toLocaleDateString('it-IT', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        
        // Update all time elements
        document.querySelectorAll('.time, #statusTime, #lockTime, #widgetTime').forEach(el => {
            el.textContent = timeString;
        });
        
        document.querySelectorAll('.date, #lockDate, #widgetDate').forEach(el => {
            el.textContent = dateString;
        });
    }

    initializeNavbar() {
        // Add navbar to all pages if not present
        if (!document.querySelector('.global-navbar')) {
            this.createNavbar();
        }
        
        // Set active navbar item based on current page
        this.updateNavbarActive();
    }

    createNavbar() {
        const navbar = document.createElement('div');
        navbar.className = 'global-navbar glass-nav';
        navbar.innerHTML = `
            <a href="home.html" class="navbar-btn home" data-page="home">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="playstore.html" class="navbar-btn" data-page="apps">
                <i class="fas fa-th"></i>
                <span>App</span>
            </a>
            <a href="settings.html" class="navbar-btn" data-page="settings">
                <i class="fas fa-gear"></i>
                <span>Impostazioni</span>
            </a>
            <a href="system.html" class="navbar-btn" data-page="info">
                <i class="fas fa-info-circle"></i>
                <span>Info</span>
            </a>
            <a href="playstore.html" class="navbar-btn" data-page="store">
                <i class="fas fa-store"></i>
                <span>Store</span>
            </a>
        `;
        
        document.body.appendChild(navbar);
    }

    updateNavbarActive() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
        
        document.querySelectorAll('.navbar-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === currentPage) {
                btn.classList.add('active');
            }
        });
    }

    navigateTo(url) {
        // Add transition effect
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            if (window.parent !== window) {
                // Inside iframe (mockup)
                window.parent.postMessage({ action: 'navigate', url }, '*');
            } else {
                // Direct navigation
                window.location.href = url;
            }
        }, 300);
    }

    setTheme(theme) {
        this.theme = theme;
        this.settings.theme = theme;
        this.applyTheme();
        this.saveSettings();
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast-notification glass-panel ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            zIndex: '2000',
            fontSize: '14px',
            fontWeight: '500',
            minWidth: '200px',
            textAlign: 'center',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        });

        // Animate out
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    playSound(soundType) {
        // Create audio context for system sounds
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Generate simple system sounds
        const sounds = {
            click: { frequency: 800, duration: 0.1 },
            notification: { frequency: 600, duration: 0.3 },
            error: { frequency: 300, duration: 0.5 },
            success: { frequency: 1000, duration: 0.2 }
        };
        
        const sound = sounds[soundType];
        if (!sound) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    }

    // Camera API
    async requestCameraAccess() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' },
                audio: false 
            });
            return stream;
        } catch (error) {
            console.error('Camera access denied:', error);
            this.showToast('Accesso alla fotocamera negato', 'error');
            return null;
        }
    }

    // Utility functions
    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize CronoOS
const cronos = new CronoOS();

// Global functions for backward compatibility
function openApp(url) {
    cronos.navigateTo(url);
}

function goHome() {
    cronos.navigateTo('home.html');
}

function showToast(message, type = 'info') {
    cronos.showToast(message, type);
}

function updateTime() {
    cronos.updateTime();
}

// Export for modules
window.CronoOS = cronos;