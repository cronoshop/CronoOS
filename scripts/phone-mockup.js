// Phone Mockup JavaScript - CronoOS 2.1 - Phoenix Edition

document.addEventListener('DOMContentLoaded', function() {
    const powerButton = document.querySelector('.phone-button.power');
    const osFrame = document.getElementById('osFrame');

    if (powerButton && osFrame) {
        powerButton.addEventListener('click', () => {
            // Controlla la pagina corrente e alterna tra lock e home
            const currentSrc = osFrame.contentWindow.location.href;
            if (currentSrc.includes('lock.html')) {
                osFrame.src = 'home.html';
            } else {
                osFrame.src = 'lock.html';
            }
        });
    }

    // *** NUOVA PARTE AGGIUNTA - GESTORE DELLA NAVIGAZIONE ***
    // Ascolta i messaggi dall'iframe (es. quando si clicca un'app)
    window.addEventListener('message', function(event) {
        if (event.data && event.data.action === 'navigate') {
            if (osFrame) {
                osFrame.src = event.data.url;
            }
        }
    });
    // *** FINE PARTE AGGIUNTA ***


    // Adatta le dimensioni per la responsività
    function adjustPhoneSize() {
        const phoneMockup = document.querySelector('.phone-mockup');
        if (!phoneMockup || window.innerWidth <= 480) return;

        const viewportHeight = window.innerHeight;
        const scale = Math.min(1, (viewportHeight * 0.95) / 820);
        phoneMockup.style.transform = `scale(${scale})`;
    }

    window.addEventListener('resize', adjustPhoneSize);
    adjustPhoneSize();
});
