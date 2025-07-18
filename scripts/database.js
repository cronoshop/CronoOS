// CronoOS App Database - Phoenix Edition
// This file is the single source of truth for all available apps.
// It is loaded by both home.js and playstore.js to ensure data consistency.

const AVAILABLE_APPS = {
    // Core System Apps (cannot be uninstalled)
    'phone': { name: 'Telefono', icon: 'fas fa-phone-flip', color: '#30D158', isCore: true, page: 'phone.html' },
    'messages': { name: 'Messaggi', icon: 'fas fa-comment-dots', color: '#0A84FF', isCore: true, page: 'messages.html' },
    'camera': { name: 'Fotocamera', icon: 'fas fa-camera', color: '#888', isCore: true, page: 'camera.html' },
    'settings': { name: 'Impostazioni', icon: 'fas fa-gear', color: '#555', isCore: true, page: 'settings.html' },
    'gallery': { name: 'Galleria', icon: 'fas fa-images', color: '#AF52DE', isCore: true, page: 'gallery.html' },
    'calendar': { name: 'Calendario', icon: 'fas fa-calendar-days', color: '#FF453A', isCore: true, page: 'calendar.html' },
    'playstore': { name: 'App Store', icon: 'fas fa-store', color: '#0A84FF', isCore: true, page: 'playstore.html' },

    // Installable Apps
    'gpt-assistant': { name: 'CronoGPT', icon: 'fas fa-brain', color: 'linear-gradient(135deg, #667eea, #764ba2)', description: 'Assistente AI integrato.', category: 'gpt' },
    'cronogames': { name: 'CronoGames', icon: 'fas fa-gamepad', color: '#FF6B6B', description: 'Giochi AI generati.', category: 'gpt' },
    'weather': { name: 'Meteo', icon: 'fas fa-cloud-sun', color: '#74B9FF', description: 'Previsioni meteo accurate.', category: 'utility' },
    'clock': { name: 'Orologio', icon: 'fas fa-clock', color: '#FD79A8', description: 'Timer, sveglie e cronometro.', category: 'utility' },
    'whatsapp': { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', description: 'Messaggistica semplice e sicura.' },
    'instagram': { name: 'Instagram', icon: 'fab fa-instagram', color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', description: 'Condividi momenti con il mondo.' },
    'youtube': { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', description: 'Guarda, carica e condividi video.' },
    'facebook': { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', description: 'Connettiti con i tuoi amici.' },
    'twitter': { name: 'X (Twitter)', icon: 'fab fa-twitter', color: '#14171A', description: 'L\'app per tutto.' },
    'telegram': { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088CC', description: 'Messaggistica veloce e sicura.' },
    'spotify': { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954', description: 'Musica per tutti.' },
    'netflix': { name: 'Netflix', icon: 'fas fa-film', color: '#E50914', description: 'Film e serie TV illimitati.' },
    'gmail': { name: 'Gmail', icon: 'fas fa-envelope', color: '#EA4335', description: 'Email sicura e intelligente by Google.' },
    'maps': { name: 'Google Maps', icon: 'fas fa-map-marked-alt', color: '#4285F4', description: 'Esplora e naviga il tuo mondo.' },
    'chrome': { name: 'Chrome', icon: 'fab fa-chrome', color: '#4285F4', description: 'Il browser web veloce di Google.' },
    'tiktok': { name: 'TikTok', icon: 'fab fa-tiktok', color: '#010101', description: 'Video, trend e momenti.' },
    'app-designer': { name: 'App Designer', icon: 'fas fa-paint-brush', color: '#E17055', description: 'Disegna e crea le tue app.', page: 'app-designer.html' },
    'ai-notepad': { name: 'AI Notepad', icon: 'fas fa-robot', color: '#6C5CE7', description: 'Note potenziate dall\'intelligenza artificiale.' },
    'calculator': { name: 'Calculator', icon: 'fas fa-calculator', color: '#74B9FF', description: 'Per tutti i tuoi calcoli.' },
    'discord': { name: 'Discord', icon: 'fab fa-discord', color: '#5865F2', description: 'Il tuo posto per parlare e ritrovarti.' },
    'zoom': { name: 'Zoom', icon: 'fas fa-video', color: '#2D8CFF', description: 'Videoconferenze felici.' },
    'reddit': { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500', description: 'Tuffati in qualsiasi cosa.' },
    'snapchat': { name: 'Snapchat', icon: 'fab fa-snapchat', color: '#FFFC00', description: 'Il modo più veloce per condividere un momento.' },
    'linkedin': { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', description: 'Il più grande network professionale.' },
    'podcast-player': { name: 'Podcast Player', icon: 'fas fa-podcast', color: '#9B59B6', description: 'Ascolta i tuoi podcast preferiti.' },
};
