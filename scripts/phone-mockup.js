// Phone Mockup JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePhoneMockup();
    setupResponsiveHandling();
});

function initializePhoneMockup() {
    const phoneFrame = document.querySelector('.phone-frame');
    const osFrame = document.getElementById('osFrame');
    
    if (!phoneFrame || !osFrame) return;
    
    // Add loading animation
    showLoadingAnimation();
    
    // Handle frame load
    osFrame.addEventListener('load', function() {
        hideLoadingAnimation();
        setupFrameCommunication();
    });
    
    // Add phone interaction effects
    setupPhoneInteractions();
}

function showLoadingAnimation() {
    const phoneScreen = document.querySelector('.phone-screen');
    if (!phoneScreen) return;
    
    const loader = document.createElement('div');
    loader.className = 'phone-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">CronoOS</div>
            <div class="loader-spinner"></div>
        </div>
    `;
    
    loader.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        border-radius: 37px;
    `;
    
    phoneScreen.appendChild(loader);
}

function hideLoadingAnimation() {
    const loader = document.querySelector('.phone-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
}

function setupFrameCommunication() {
    const osFrame = document.getElementById('osFrame');
    if (!osFrame) return;
    
    // Listen for messages from the OS
    window.addEventListener('message', function(event) {
        if (event.data.type === 'os-navigation') {
            handleOSNavigation(event.data);
        }
    });
}

function handleOSNavigation(data) {
    // Handle navigation events from the OS
    console.log('OS Navigation:', data);
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
    
    // Send volume up to OS
    const osFrame = document.getElementById('osFrame');
    if (osFrame && osFrame.contentWindow) {
        osFrame.contentWindow.postMessage({
            type: 'volume-change',
            direction: 'up'
        }, '*');
    }
}

function simulateVolumeDown() {
    showVolumeIndicator('🔉');
    
    // Send volume down to OS
    const osFrame = document.getElementById('osFrame');
    if (osFrame && osFrame.contentWindow) {
        osFrame.contentWindow.postMessage({
            type: 'volume-change',
            direction: 'down'
        }, '*');
    }
}

function showVolumeIndicator(direction) {
    const indicator = document.createElement('div');
    indicator.className = 'volume-indicator';
    indicator.innerHTML = `
        <div class="volume-icon">${direction}</div>
        <div class="volume-bars">
            <div class="volume-bar active"></div>
            <div class="volume-bar active"></div>
            <div class="volume-bar ${direction === '🔊' ? 'active' : ''}"></div>
        </div>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        color: white;
        padding: 24px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10001;
        animation: fadeInOut 2s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
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
    
    phoneMockup.style.transform = `scale(${scale})`;
    phoneMockup.style.transformOrigin = 'center center';
}

// Add CSS for additional animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .loader-content {
        text-align: center;
        color: white;
    }
    
    .loader-logo {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .loader-spinner {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
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