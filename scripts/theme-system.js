// Dynamic Theme System - CronoOS 1.3.1

class ThemeSystem {
    constructor() {
        this.currentTheme = 'theme-blue';
        this.themes = {
            'theme-blue': { primary: '#007AFF', secondary: '#5AC8FA', accent: '#0051D5' },
            'theme-purple': { primary: '#5856D6', secondary: '#AF52DE', accent: '#7B68EE' },
            'theme-pink': { primary: '#FF2D92', secondary: '#FF69B4', accent: '#C71585' },
            'theme-green': { primary: '#30D158', secondary: '#32D74B', accent: '#228B22' },
            'theme-orange': { primary: '#FF9500', secondary: '#FFCC00', accent: '#FF6B35' },
            'theme-red': { primary: '#FF3B30', secondary: '#FF6B6B', accent: '#DC143C' },
            'theme-teal': { primary: '#5AC8FA', secondary: '#40E0D0', accent: '#008B8B' },
            'theme-indigo': { primary: '#5856D6', secondary: '#6366F1', accent: '#4338CA' }
        };
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.applyTheme(this.currentTheme);
        this.setupThemeChangeListener();
    }

    loadSavedTheme() {
        const saved = localStorage.getItem('cronos_theme_color');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) return;

        const theme = this.themes[themeName];
        const root = document.documentElement;

        // Remove all theme classes
        Object.keys(this.themes).forEach(theme => {
            document.body.classList.remove(theme);
        });

        // Add current theme class
        document.body.classList.add(themeName);

        // Set CSS custom properties
        root.style.setProperty('--dynamic-primary', theme.primary);
        root.style.setProperty('--dynamic-secondary', theme.secondary);
        root.style.setProperty('--dynamic-accent', theme.accent);

        // Calculate derived colors
        this.setDerivedColors(theme);

        this.currentTheme = themeName;
        localStorage.setItem('cronos_theme_color', themeName);

        // Notify other frames
        this.notifyFrames();
    }

    setDerivedColors(theme) {
        const root = document.documentElement;
        
        // Create lighter and darker variants
        const primaryRgb = this.hexToRgb(theme.primary);
        const secondaryRgb = this.hexToRgb(theme.secondary);
        
        if (primaryRgb) {
            root.style.setProperty('--dynamic-primary-light', 
                `rgb(${Math.min(255, primaryRgb.r + 40)}, ${Math.min(255, primaryRgb.g + 40)}, ${Math.min(255, primaryRgb.b + 40)})`);
            root.style.setProperty('--dynamic-primary-dark', 
                `rgb(${Math.max(0, primaryRgb.r - 40)}, ${Math.max(0, primaryRgb.g - 40)}, ${Math.max(0, primaryRgb.b - 40)})`);
            root.style.setProperty('--dynamic-primary-alpha', 
                `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`);
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    setupThemeChangeListener() {
        // Listen for theme changes from settings
        window.addEventListener('message', (event) => {
            if (event.data.type === 'theme-change') {
                this.applyTheme(event.data.theme);
            }
        });
    }

    notifyFrames() {
        // Notify iframe about theme change
        const osFrame = document.getElementById('osFrame');
        if (osFrame && osFrame.contentWindow) {
            osFrame.contentWindow.postMessage({
                type: 'theme-change',
                theme: this.currentTheme,
                colors: this.themes[this.currentTheme]
            }, '*');
        }
    }

    getAvailableThemes() {
        return Object.keys(this.themes);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setCustomColor(color) {
        const customTheme = {
            primary: color,
            secondary: this.adjustBrightness(color, 20),
            accent: this.adjustBrightness(color, -20)
        };

        this.themes['theme-custom'] = customTheme;
        this.applyTheme('theme-custom');
    }

    adjustBrightness(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const adjust = (color) => {
            const adjusted = color + (color * percent / 100);
            return Math.max(0, Math.min(255, Math.round(adjusted)));
        };

        const newR = adjust(rgb.r);
        const newG = adjust(rgb.g);
        const newB = adjust(rgb.b);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}

// Initialize theme system
document.addEventListener('DOMContentLoaded', () => {
    window.themeSystem = new ThemeSystem();
});

// Export for global access
window.ThemeSystem = ThemeSystem;