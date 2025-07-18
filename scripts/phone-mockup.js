// Phone Mockup JavaScript - CronoOS 2.1

document.addEventListener('DOMContentLoaded', function() {
    initializePhoneMockup();
    setupResponsiveHandling();
});

function initializePhoneMockup() {
    const phoneFrame = document.querySelector('.phone-frame');
    const osFrame = document.getElementById('osFrame');
    
    if (!phoneFrame || !osFrame) return;
    
    // Handle frame load
    osFrame.addEventListener('load', function() {
        setupFrameCommunication();
    });
    
    // Add phone interaction effects
    setupPhoneInteractions();
}

function setupFrameCommunication() {
    // Listen for messages from the OS
    window.addEventListener('message', function(event) {
        if (event.data.type === 'os-navigation') {
            console.log('OS Navigation:', event.data);
        }
    });
}

function setupPhoneInteractions() {
    const phoneFrame = document.querySelector('.phone-frame');
    if (!phoneFrame) return;
    
    // Add subtle hover effects
    phoneFrame.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    phoneFrame.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Add button interactions
    setupButtonInteractions();
}

function setupButtonInteractions() {
    const buttons = document.querySelectorAll('.phone-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
            this.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.5)';
            
            // Simulate button press
            if (this.classList.contains('power')) {
                simulatePowerButton();
            } else if (this.classList.contains('volume-up')) {
                simulateVolumeUp();
            } else if (this.classList.contains('volume-down')) {
                simulateVolumeDown();
            }
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

function simulatePowerButton() {
    // Navigate to lock screen
    const osFrame = document.getElementById('osFrame');
    if (osFrame) {
        osFrame.src = 'lock.html';
    }
    showVolumeIndicator('🔒');
}

function simulateVolumeUp() {
    showVolumeIndicator('🔊');
}

function simulateVolumeDown() {
    showVolumeIndicator('🔉');
}

function showVolumeIndicator(icon) {
    const indicator = document.createElement('div');
    indicator.className = 'volume-indicator';
    indicator.innerHTML = `
        <div class="volume-icon">${icon}</div>
        <div class="volume-bars">
            <div class="volume-bar active"></div>
            <div class="volume-bar active"></div>
            <div class="volume-bar ${icon === '🔊' ? 'active' : ''}"></div>
        </div>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        color: white;
        padding: 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10001;
        animation: fadeInOut 2s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 2000);
}

function setupResponsiveHandling() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustPhoneSize, 250);
    });
    
    adjustPhoneSize();
}

function adjustPhoneSize() {
    const phoneMockup = document.querySelector('.phone-mockup');
    if (!phoneMockup) return;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate optimal size
    const maxWidth = Math.min(375, viewportWidth * 0.9);
    const maxHeight = Math.min(812, viewportHeight * 0.9);
    
    const scale = Math.min(maxWidth / 375, maxHeight / 812);
    
    if (scale < 1) {
        phoneMockup.style.transform = `scale(${scale})`;
    } else {
        phoneMockup.style.transform = 'scale(1)';
    }
}

// Add CSS for animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .volume-bars {
        display: flex;
        gap: 3px;
        align-items: end;
    }
    
    .volume-bar {
        width: 4px;
        height: 15px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        transition: background-color 0.2s ease;
    }
    
    .volume-bar.active {
        background: white;
    }
    
    .volume-bar:nth-child(2) {
        height: 20px;
    }
    
    .volume-bar:nth-child(3) {
        height: 25px;
    }
`;

document.head.appendChild(additionalStyles);