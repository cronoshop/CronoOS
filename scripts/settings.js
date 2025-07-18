// Settings App JavaScript - CronoOS 2.4 Redesigned

document.addEventListener('DOMContentLoaded', function() {
    // Esistenti funzioni di inizializzazione
    loadUserProfile();
    // Aggiungi qui le altre funzioni di setup se necessario
});

function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
    
    if (profile.name) {
        document.getElementById('profileName').textContent = profile.name;
    }
    // L'email ora è parte dei dettagli, puoi aggiornarla se vuoi o lasciarla statica
    // if (profile.email) {
    //     document.getElementById('profileEmail').textContent = profile.email;
    // }
    if (profile.avatar) {
        const img = document.getElementById('profileImage');
        const icon = document.getElementById('profileIcon');
        img.src = profile.avatar;
        img.style.display = 'block';
        icon.style.display = 'none';
    }
}

// LA FUNZIONE toggleCategory(categoryId) È STATA RIMOSSA PERCHÉ NON PIÙ NECESSARIA

// --- Funzioni di Navigazione (Semplificate) ---
// Queste funzioni sono ora chiamate direttamente dai nuovi div .setting-item

function openAccountSettings() {
    showToast('Apertura impostazioni Account e Profilo...');
    // Qui puoi navigare a una pagina dedicata o aprire un modale per il profilo
    // Esempio: editProfile();
}

function openDisplaySettings() {
    showToast('Apertura impostazioni Schermo...');
    // Logica per navigare alla pagina delle impostazioni schermo
}

function openWallpaperSettings() {
    showToast('Apertura impostazioni Sfondo...');
    // La tua logica attuale per aprire il modale dello sfondo va bene
    const modal = document.getElementById('wallpaperModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function openSoundsSettings() {
    showToast('Apertura impostazioni Suoni e Vibrazione...');
    // Logica per navigare alla pagina delle impostazioni audio
}

function openConnectivitySettings() {
    showToast('Apertura impostazioni Connettività...');
    // Logica per navigare alla pagina delle impostazioni connettività
}

function openPrivacySettings() {
    showToast('Apertura impostazioni Privacy...');
    // Logica per navigare alla pagina delle impostazioni privacy
}

function openSystemSettings() {
    showToast('Apertura impostazioni Sistema...');
    // Logica per navigare alla pagina delle impostazioni di sistema
}

function openAccountManagement() {
    showToast('Apertura gestione Account...');
    // Qui puoi aprire un modale o una pagina per le azioni account
    // come Modifica Profilo, Esci, etc.
}


// --- Funzioni esistenti che puoi mantenere ---
// (Tutte le funzioni per i modali, salvataggio dati, etc.)

function showToast(message) {
    // Assicurati che questa funzione esista nel tuo global.js
    console.log(`Toast: ${message}`);
}

// ... (Incolla qui il resto del tuo file settings.js, ad esempio:)
// - openAboutDevice() e closeAboutModal()
// - Funzioni di gestione Account: editProfile, changeAvatar, signOut, deleteAccount
// - Funzioni per i modali: openLockFontSettings, openThemeSettings, etc.
// - handleWallpaperUpload, selectTheme, ecc.
// Assicurati di mantenere tutte le funzioni che sono ancora collegate a pulsanti o eventi nei tuoi modali.
