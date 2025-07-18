// Phone Mockup JavaScript - CronoOS 2.1 - Phoenix Edition

document.addEventListener('DOMContentLoaded', function() {
    const powerButton = document.querySelector('.phone-button.power');
    const osFrame = document.getElementById('osFrame');

    if (powerButton && osFrame) {
        powerButton.addEventListener('click', () => {
            // Check current page and toggle between lock and home
            const currentSrc = osFrame.contentWindow.location.href;
            if (currentSrc.includes('lock.html')) {
                osFrame.src = 'home.html';
            } else {
                osFrame.src = 'lock.html';
            }
        });
    }

    // Adjust size for responsiveness
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
