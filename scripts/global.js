// Global JavaScript Functions - CronoOS Phoenix Pro

document.addEventListener('DOMContentLoaded', function() {
    loadAndApplySettings();
    updateTime();
    setInterval(updateTime, 1000);
});

function loadAndApplySettings() {
    // Applica tema (dark/light)
    const theme = localStorage.getItem('crono_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Applica filtro luce blu
    const blueLight = localStorage.getItem('crono_bluelight') === 'on';
    const overlay = document.getElementById('blue-light-filter-overlay');
    if(overlay) overlay.classList.toggle('active', blueLight);

    // Applica sfondo
    const wallpaper = localStorage.getItem('crono_wallpaper');
    if (wallpaper) {
        document.documentElement.style.setProperty('--custom-wallpaper', `url(${wallpaper})`);
    }

    // Applica impostazioni accessibilità
    const largeText = localStorage.getItem('crono_large_text') === 'true';
    const boldText = localStorage.getItem('crono_bold_text') === 'true';
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('bold-text', boldText);
}

function navigateTo(page) {
    window.location.href = page;
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false });
    document.querySelectorAll('.time, #statusTime').forEach(el => el.textContent = timeString);
}

function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}
