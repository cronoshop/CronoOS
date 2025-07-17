// Phone App JavaScript - One UI OS

let currentNumber = '';
let callHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    initializePhoneApp();
    loadCallHistory();
});

function initializePhoneApp() {
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.value = currentNumber;
    }
    
    // Initialize keypad sounds
    initializeKeypadSounds();
    
    console.log('Phone app initialized');
}

function initializeKeypadSounds() {
    const keys = document.querySelectorAll('.key');
    
    keys.forEach(key => {
        key.addEventListener('click', function() {
            // Play DTMF tone (simulated with haptic feedback)
            hapticFeedback('light');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

function addNumber(digit) {
    currentNumber += digit;
    updateNumberDisplay();
    
    // Play DTMF tone simulation
    playDTMFTone(digit);
}

function playDTMFTone(digit) {
    // Simulate DTMF tone with different haptic patterns
    const toneMap = {
        '1': 'light', '2': 'light', '3': 'light',
        '4': 'light', '5': 'medium', '6': 'light',
        '7': 'light', '8': 'light', '9': 'light',
        '*': 'heavy', '0': 'medium', '#': 'heavy'
    };
    
    hapticFeedback(toneMap[digit] || 'light');
}

function deleteNumber() {
    if (currentNumber.length > 0) {
        currentNumber = currentNumber.slice(0, -1);
        updateNumberDisplay();
        hapticFeedback('light');
    }
}

function updateNumberDisplay() {
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.value = formatPhoneNumber(currentNumber);
    }
}

function formatPhoneNumber(number) {
    // Format Italian phone numbers
    if (number.length === 0) return '';
    
    let formatted = number;
    
    if (number.startsWith('39') && number.length > 2) {
        formatted = '+39 ' + number.substring(2);
    } else if (number.startsWith('3') && number.length > 3) {
        formatted = number.substring(0, 3) + ' ' + number.substring(3);
    }
    
    return formatted;
}

function makeCall() {
    if (currentNumber.length === 0) {
        showToast('Inserisci un numero di telefono');
        return;
    }
    
    // Add to call history
    addToCallHistory(currentNumber, 'outgoing');
    
    // Show calling interface
    showCallingInterface(currentNumber);
    
    hapticFeedback('medium');
}

function showCallingInterface(number) {
    const callingModal = document.createElement('div');
    callingModal.className = 'calling-modal';
    callingModal.innerHTML = `
        <div class="calling-content">
            <div class="calling-avatar">📞</div>
            <div class="calling-number">${formatPhoneNumber(number)}</div>
            <div class="calling-status">Chiamata in corso...</div>
            <div class="calling-timer" id="callingTimer">00:00</div>
            <div class="calling-controls">
                <button class="call-control-btn mute-btn" onclick="toggleMute()">🔇</button>
                <button class="call-control-btn speaker-btn" onclick="toggleSpeaker()">🔊</button>
                <button class="call-control-btn keypad-btn" onclick="showCallKeypad()">⌨️</button>
                <button class="call-control-btn end-call-btn" onclick="endCall()">📞</button>
            </div>
        </div>
    `;
    
    callingModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(callingModal);
    
    // Start call timer
    startCallTimer();
    
    // Simulate call connection after 3 seconds
    setTimeout(() => {
        const status = callingModal.querySelector('.calling-status');
        if (status) {
            status.textContent = 'Connesso';
        }
    }, 3000);
}

let callTimer;
let callDuration = 0;

function startCallTimer() {
    callDuration = 0;
    callTimer = setInterval(() => {
        callDuration++;
        const minutes = Math.floor(callDuration / 60);
        const seconds = callDuration % 60;
        const timerElement = document.getElementById('callingTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function endCall() {
    clearInterval(callTimer);
    const callingModal = document.querySelector('.calling-modal');
    if (callingModal) {
        callingModal.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => callingModal.remove(), 300);
    }
    
    // Clear current number
    currentNumber = '';
    updateNumberDisplay();
    
    showToast('Chiamata terminata');
    hapticFeedback('medium');
}

function toggleMute() {
    const muteBtn = document.querySelector('.mute-btn');
    if (muteBtn) {
        muteBtn.classList.toggle('active');
        const isMuted = muteBtn.classList.contains('active');
        muteBtn.textContent = isMuted ? '🔇' : '🎤';
        showToast(isMuted ? 'Microfono disattivato' : 'Microfono attivato');
    }
}

function toggleSpeaker() {
    const speakerBtn = document.querySelector('.speaker-btn');
    if (speakerBtn) {
        speakerBtn.classList.toggle('active');
        const isSpeaker = speakerBtn.classList.contains('active');
        speakerBtn.textContent = isSpeaker ? '🔊' : '🔈';
        showToast(isSpeaker ? 'Vivavoce attivato' : 'Vivavoce disattivato');
    }
}

function showCallKeypad() {
    showToast('Tastierino durante chiamata - Funzionalità in arrivo!');
}

function callBack(number) {
    currentNumber = number.replace(/\D/g, ''); // Remove non-digits
    updateNumberDisplay();
    makeCall();
}

function callContact(number) {
    callBack(number);
}

function addToCallHistory(number, type) {
    const historyItem = {
        number: number,
        type: type, // 'incoming', 'outgoing', 'missed'
        timestamp: new Date(),
        duration: type === 'missed' ? 0 : Math.floor(Math.random() * 300) + 30 // Random duration
    };
    
    callHistory.unshift(historyItem);
    
    // Keep only last 50 calls
    if (callHistory.length > 50) {
        callHistory = callHistory.slice(0, 50);
    }
    
    saveCallHistory();
    updateCallHistoryDisplay();
}

function loadCallHistory() {
    const saved = localStorage.getItem('phone_call_history');
    if (saved) {
        callHistory = JSON.parse(saved);
        updateCallHistoryDisplay();
    } else {
        // Add some sample call history
        addSampleCallHistory();
    }
}

function saveCallHistory() {
    localStorage.setItem('phone_call_history', JSON.stringify(callHistory));
}

function addSampleCallHistory() {
    const sampleCalls = [
        { number: '+39 123 456 789', type: 'outgoing', timestamp: new Date(Date.now() - 120000), duration: 180 },
        { number: '+39 987 654 321', type: 'missed', timestamp: new Date(Date.now() - 900000), duration: 0 },
        { number: '+39 555 123 456', type: 'incoming', timestamp: new Date(Date.now() - 3600000), duration: 240 }
    ];
    
    callHistory = sampleCalls;
    saveCallHistory();
    updateCallHistoryDisplay();
}

function updateCallHistoryDisplay() {
    const callList = document.querySelector('.call-list');
    if (!callList) return;
    
    callList.innerHTML = '';
    
    callHistory.forEach(call => {
        const callItem = document.createElement('div');
        callItem.className = 'call-item';
        
        const typeIcon = getCallTypeIcon(call.type);
        const timeAgo = getTimeAgo(call.timestamp);
        const contactName = getContactName(call.number);
        
        callItem.innerHTML = `
            <div class="call-info">
                <div class="caller-name">${contactName}</div>
                <div class="call-details">${typeIcon} ${getCallTypeText(call.type)} • ${timeAgo}</div>
            </div>
            <button class="call-back-btn" onclick="callBack('${call.number}')">📞</button>
        `;
        
        callList.appendChild(callItem);
    });
}

function getCallTypeIcon(type) {
    switch (type) {
        case 'incoming': return '📞';
        case 'outgoing': return '📞';
        case 'missed': return '📞';
        default: return '📞';
    }
}

function getCallTypeText(type) {
    switch (type) {
        case 'incoming': return 'Chiamata in entrata';
        case 'outgoing': return 'Chiamata in uscita';
        case 'missed': return 'Chiamata persa';
        default: return 'Chiamata';
    }
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ora';
    if (minutes < 60) return `${minutes} min fa`;
    if (hours < 24) return `${hours} ora${hours > 1 ? 'e' : ''} fa`;
    return `${days} giorno${days > 1 ? 'i' : ''} fa`;
}

function getContactName(number) {
    // Simple contact mapping
    const contacts = {
        '+39 123 456 789': 'Marco Rossi',
        '+39 987 654 321': 'Anna Bianchi',
        '+39 555 123 456': 'Luca Verdi'
    };
    
    return contacts[number] || number;
}

// Contact search functionality
function initializeContactSearch() {
    const searchInput = document.getElementById('contactSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            const name = item.querySelector('.contact-name').textContent.toLowerCase();
            const number = item.querySelector('.contact-number').textContent.toLowerCase();
            const shouldShow = name.includes(query) || number.includes(query);
            
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }, 300));
}

// Initialize contact search
document.addEventListener('DOMContentLoaded', initializeContactSearch);

// Speed dial functionality
function initializeSpeedDial() {
    const keys = document.querySelectorAll('.key');
    
    keys.forEach(key => {
        key.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const digit = this.textContent.trim().charAt(0);
            
            if (digit >= '2' && digit <= '9') {
                showSpeedDialOptions(digit);
            }
        });
    });
}

function showSpeedDialOptions(digit) {
    showToast(`Composizione rapida ${digit} - Funzionalità in arrivo!`);
}

// Initialize speed dial
document.addEventListener('DOMContentLoaded', initializeSpeedDial);

// Call blocking functionality
function initializeCallBlocking() {
    // This would integrate with a call blocking system
    console.log('Call blocking initialized');
}

// Voicemail functionality
function initializeVoicemail() {
    // Add voicemail indicator
    const voicemailIndicator = document.createElement('div');
    voicemailIndicator.className = 'voicemail-indicator';
    voicemailIndicator.innerHTML = '📧 2 nuovi messaggi vocali';
    voicemailIndicator.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        animation: slideInDown 0.3s ease;
    `;
    
    voicemailIndicator.addEventListener('click', function() {
        showToast('Segreteria telefonica - Funzionalità in arrivo!');
        this.remove();
    });
    
    // Show voicemail indicator occasionally
    if (Math.random() < 0.3) {
        document.body.appendChild(voicemailIndicator);
        
        setTimeout(() => {
            if (voicemailIndicator.parentNode) {
                voicemailIndicator.remove();
            }
        }, 10000);
    }
}

// Initialize voicemail
document.addEventListener('DOMContentLoaded', initializeVoicemail);

// Add CSS for calling interface
const phoneStyles = document.createElement('style');
phoneStyles.textContent = `
    .calling-content {
        text-align: center;
        padding: 40px;
    }
    
    .calling-avatar {
        font-size: 80px;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
    }
    
    .calling-number {
        font-size: 24px;
        font-weight: 300;
        margin-bottom: 10px;
    }
    
    .calling-status {
        font-size: 16px;
        opacity: 0.8;
        margin-bottom: 20px;
    }
    
    .calling-timer {
        font-size: 18px;
        font-family: 'Courier New', monospace;
        margin-bottom: 40px;
    }
    
    .calling-controls {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .call-control-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    .call-control-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
    }
    
    .call-control-btn.active {
        background: rgba(255, 255, 255, 0.4);
    }
    
    .end-call-btn {
        background: #f44336 !important;
    }
    
    .end-call-btn:hover {
        background: #d32f2f !important;
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;

document.head.appendChild(phoneStyles);