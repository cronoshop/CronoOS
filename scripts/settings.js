// Settings App JavaScript - CronoOS 2.4 Redesigned (con FIX)

document.addEventListener('DOMContentLoaded', function() {
    console.log('CronoOS 2.4 Settings Initialized');
    loadUserProfile();
    // Aggiungi qui altre funzioni di inizializzazione se necessario
});

/**
 * Mostra una notifica temporanea (toast) sullo schermo.
 * @param {string} message Il messaggio da visualizzare.
 */
function showToast(message) {
    // Rimuovi eventuali toast esistenti per evitare sovrapposizioni
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Crea l'elemento del toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    // Stile del toast (puoi personalizzarlo nel tuo CSS globale se vuoi)
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '20px';
    toast.style.zIndex = '1000';
    toast.style.fontSize = '14px';
    toast.style.transition = 'opacity 0.5s ease';

    // Aggiungi il toast al body
    document.body.appendChild(toast);

    // Fai scomparire il toast dopo 3 secondi
    setTimeout(() => {
        toast.style.opacity = '0';
        // Rimuovi l'elemento dal DOM dopo la transizione
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}


function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
    
    if (profile.name) {
        document.getElementById('profileName').textContent = profile.name;
    }
    if (profile.avatar) {
        const img = document.getElementById('profileImage');
        const icon = document.getElementById('profileIcon');
        img.src = profile.avatar;
        img.style.display = 'block';
        icon.style.display = 'none';
    }
}

// --- Funzioni di Navigazione ---

function openAccountSettings() {
    showToast('Apertura impostazioni Account e Profilo...');
    // In futuro, qui potrai navigare a una pagina dedicata o aprire un modale.
}

function openDisplaySettings() {
    showToast('Apertura impostazioni Schermo...');
    // In futuro, qui potrai navigare alla pagina delle impostazioni schermo.
}

function openWallpaperSettings() {
    showToast('Apertura impostazioni Sfondo...');
    const modal = document.getElementById('wallpaperModal');
    if (modal) {
        // Assicurati che il tuo CSS per i modali includa una classe 'active' o 'visible' per mostrarli
        modal.classList.add('active'); 
    }
}

function openSoundsSettings() {
    showToast('Apertura impostazioni Suoni e Vibrazione...');
    // In futuro, qui potrai navigare alla pagina delle impostazioni audio.
}

function openConnectivitySettings() {
    // Rimuovi la riga showToast e aggiungi questa per la navigazione
    window.location.href = 'connectivity.html'; 
}

function openPrivacySettings() {
    showToast('Apertura impostazioni Privacy...');
    // In futuro, qui potrai navigare alla pagina delle impostazioni privacy.
}

function openSystemSettings() {
    showToast('Apertura impostazioni Sistema...');
    // In futuro, qui potrai navigare alla pagina delle impostazioni di sistema.
}

function openAccountManagement() {
    showToast('Apertura gestione Account...');
    // In futuro, qui potrai aprire un modale o una pagina per le azioni account.
}


// --- Mantieni qui tutte le tue altre funzioni per i modali ---
// Esempio: closeWallpaperModal(), handleWallpaperUpload(), etc.
// Assicurati che esistano e siano corrette.

function closeWallpaperModal() {
    const modal = document.getElementById('wallpaperModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleWallpaperUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const wallpaperData = e.target.result;
            localStorage.setItem('cronos_custom_wallpaper', wallpaperData);
            document.documentElement.style.setProperty('--custom-wallpaper', `url(${wallpaperData})`);
            showToast('Sfondo aggiornato!');
            closeWallpaperModal();
        };
        reader.readAsDataURL(file);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
});

function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
    if (profile.name) {
        document.getElementById('profileName').textContent = profile.name;
    }
    if (profile.avatar) {
        const img = document.getElementById('profileImage');
        const icon = document.getElementById('profileIcon');
        img.src = profile.avatar;
        img.style.display = 'block';
        icon.style.display = 'none';
    }
}

function navigateTo(page) {
    window.location.href = page;
}
// Settings App JavaScript - CronoOS Phoenix Pro

function navigateTo(page) {
    window.location.href = page;
}

/**
 * Carica i dati del profilo negli input della pagina account.html.
 */
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
    const nameInput = document.getElementById('profileNameInput');
    const emailInput = document.getElementById('profileEmailInput');
    const profileImage = document.getElementById('profileImage');
    const profileIcon = document.getElementById('profileIcon');
    const avatarInput = document.getElementById('avatarInput');

    if (nameInput) nameInput.value = profile.name || '';
    if (emailInput) emailInput.value = profile.email || '';

    if (profile.avatar) {
        profileImage.src = profile.avatar;
        profileImage.style.display = 'block';
        profileIcon.style.display = 'none';
    } else {
        profileImage.style.display = 'none';
        profileIcon.style.display = 'block';
    }
    
    // Gestione cambio avatar
    if(avatarInput) {
        avatarInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    profileImage.style.display = 'block';
                    profileIcon.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/**
 * Salva i dati del profilo dal form nel localStorage.
 */
function saveProfile() {
    const name = document.getElementById('profileNameInput').value;
    const email = document.getElementById('profileEmailInput').value;
    const avatarSrc = document.getElementById('profileImage').src;
    
    const profile = {
        name: name,
        email: email,
        // Salva l'avatar solo se non è quello di default (un'icona)
        avatar: avatarSrc.startsWith('data:image') ? avatarSrc : '' 
    };

    localStorage.setItem('cronos_user_profile', JSON.stringify(profile));
    showToast('Profilo salvato!');
    
    // Aggiorna l'header della pagina Impostazioni
    updateSettingsHeaderProfile();
}


/**
 * Aggiorna la sezione profilo in settings.html
 */
function updateSettingsHeaderProfile() {
     const profile = JSON.parse(localStorage.getItem('cronos_user_profile') || '{}');
     const profileNameEl = document.querySelector('.user-profile .profile-name');
     const profileAvatarIcon = document.querySelector('.user-profile .profile-avatar i');
     // Qui potresti aggiungere un <img> per l'avatar se vuoi mostrarlo anche qui

     if(profileNameEl && profile.name) {
        profileNameEl.textContent = profile.name;
     }
}

// Quando la pagina delle impostazioni si carica, aggiorna il profilo
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('.user-profile')) {
        updateSettingsHeaderProfile();
    }
});

// E così via per tutte le altre funzioni dei modali...
