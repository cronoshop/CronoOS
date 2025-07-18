// Phone Mockup JavaScript - CronoOS 2.1 - Dynamic Island Edition

document.addEventListener('DOMContentLoaded', function() {
    // Stato del telefono per gestire volume e Dynamic Island
    const phoneState = {
        volume: 7, // Volume iniziale (su una scala da 0 a 10)
        maxVolume: 10,
        dynamicIslandTimeout: null,
    };

    initializePhoneMockup(phoneState);
    setupResponsiveHandling();
});

function initializePhoneMockup(state) {
    const osFrame = document.getElementById('osFrame');
    if (!osFrame) return;

    setupButtonInteractions(state);
    injectDynamicIslandStyles();
}

/**
 * Imposta le interazioni per i pulsanti fisici del mockup.
 * @param {object} state - L'oggetto che tiene traccia dello stato del telefono.
 */
function setupButtonInteractions(state) {
    const buttons = document.querySelectorAll('.phone-button');

    buttons.forEach(button => {
        // Effetto pressione
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateX(1px)';
        });
        button.addEventListener('mouseup', () => button.style.transform = 'translateX(0)');
        button.addEventListener('mouseleave', () => button.style.transform = 'translateX(0)');

        // Azioni
        button.addEventListener('click', function() {
            if (this.classList.contains('power')) {
                simulatePowerButton(state);
            } else if (this.classList.contains('volume-up')) {
                simulateVolumeChange(state, 'up');
            } else if (this.classList.contains('volume-down')) {
                simulateVolumeChange(state, 'down');
            }
        });
    });
}

/**
 * Simula la pressione del tasto di accensione.
 * Mostra un'icona nella Dynamic Island e poi blocca lo schermo.
 */
function simulatePowerButton(state) {
    const osFrame = document.getElementById('osFrame');
    if (!osFrame) return;

    const lockIconContent = `<i class="fas fa-lock" style="font-size: 16px;"></i>`;
    updateDynamicIsland(state, lockIconContent, { width: '60px', height: '38px' });

    setTimeout(() => {
        if (osFrame) {
            osFrame.src = 'lock.html';
        }
        // Resetta la Dynamic Island dopo aver cambiato pagina
        setTimeout(() => updateDynamicIsland(state, '', null, true), 500);
    }, 400);
}

/**
 * Simula il cambio del volume e lo mostra nella Dynamic Island.
 * @param {object} state - L'oggetto di stato del telefono.
 * @param {'up' | 'down'} direction - La direzione del cambio volume.
 */
function simulateVolumeChange(state, direction) {
    if (direction === 'up') {
        state.volume = Math.min(state.volume + 1, state.maxVolume);
    } else {
        state.volume = Math.max(state.volume - 1, 0);
    }

    const volumePercentage = (state.volume / state.maxVolume) * 100;
    const icon = state.volume > 0 ? 'fa-volume-high' : 'fa-volume-xmark';

    // Contenuto HTML per la barra del volume
    const volumeContent = `
        <div class="island-volume-container">
            <i class="fas ${icon}"></i>
            <div class="island-volume-bar">
                <div class="island-volume-level" style="height: ${volumePercentage}%;"></div>
            </div>
        </div>
    `;

    updateDynamicIsland(state, volumeContent, { width: '180px', height: '40px' });
}

/**
 * Aggiorna l'aspetto e il contenuto della Dynamic Island.
 * @param {object} state - Lo stato del telefono.
 * @param {string} contentHTML - L'HTML da inserire nell'isola.
 * @param {object} expandedSize - Le dimensioni {width, height} dell'isola quando espansa.
 * @param {boolean} forceReset - Se forzare il reset immediato dell'isola.
 */
function updateDynamicIsland(state, contentHTML, expandedSize = null, forceReset = false) {
    const notch = document.querySelector('.notch');
    if (!notch) return;

    clearTimeout(state.dynamicIslandTimeout);

    if (forceReset) {
        notch.style.width = '';
        notch.style.height = '';
        notch.innerHTML = '';
        return;
    }
    
    // Espandi l'isola
    if (expandedSize) {
        notch.style.width = expandedSize.width;
        notch.style.height = expandedSize.height;
    }
    notch.innerHTML = contentHTML;

    // Imposta un timeout per tornare allo stato normale
    state.dynamicIslandTimeout = setTimeout(() => {
        notch.style.width = ''; // Ritorna alla larghezza CSS originale
        notch.style.height = ''; // Ritorna all'altezza CSS originale
        notch.innerHTML = '';
    }, 2500); // L'isola rimane visibile per 2.5 secondi
}

/**
 * Gestisce il ridimensionamento del mockup su schermi più piccoli.
 */
function setupResponsiveHandling() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustPhoneSize, 150);
    });
    adjustPhoneSize();
}

function adjustPhoneSize() {
    const phoneMockup = document.querySelector('.phone-mockup');
    if (!phoneMockup) return;

    const viewportHeight = window.innerHeight;
    const scale = Math.min(1, (viewportHeight * 0.9) / 800); // 800 è l'altezza del mockup
    
    phoneMockup.style.transform = `scale(${scale})`;
}

/**
 * Inietta nel DOM gli stili CSS necessari per le animazioni.
 */
function injectDynamicIslandStyles() {
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .notch {
            /* Transizione fluida per la Dynamic Island */
            transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            overflow: hidden;
            font-size: 14px;
        }

        .island-volume-container {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            height: 100%;
            padding: 0 15px;
            animation: fadeIn 0.3s ease-out forwards;
        }

        .island-volume-bar {
            width: 8px;
            height: 22px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            display: flex;
            align-items: flex-end; /* Allinea il livello del volume in basso */
        }

        .island-volume-level {
            width: 100%;
            background: white;
            border-radius: 4px;
            transition: height 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(additionalStyles);
}
