// WhatsApp App JavaScript - CronoOS 2.4.1

let currentChat = null;
let messages = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeWhatsApp();
    setupTabSwitching();
    setupChatFunctionality();
    loadSampleMessages();
});

function initializeWhatsApp() {
    console.log('WhatsApp initialized - CronoOS 2.4.1');
}

function setupTabSwitching() {
    document.querySelectorAll('.whatsapp-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.whatsapp-tabs .tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabName);
    });
}

function setupChatFunctionality() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (chatInput && sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function loadSampleMessages() {
    messages = {
        'Marco Rossi': [
            { text: 'Ciao! Come stai?', sent: false, time: '10:25' },
            { text: 'Tutto bene, grazie! Tu?', sent: true, time: '10:26' },
            { text: 'Benissimo! Ci vediamo stasera?', sent: false, time: '10:30' }
        ],
        'Anna Bianchi': [
            { text: 'Ciao Anna!', sent: true, time: '09:10' },
            { text: 'Ciao! Ci vediamo stasera?', sent: false, time: '09:12' },
            { text: 'Perfetto! A che ora?', sent: true, time: '09:13' },
            { text: 'Alle 20:00 va bene?', sent: false, time: '09:15' }
        ],
        'Famiglia': [
            { text: 'Ciao a tutti!', sent: true, time: 'Ieri 18:00' },
            { text: 'Mamma: Ciao caro!', sent: false, time: 'Ieri 18:05' },
            { text: 'Papà: Come va il lavoro?', sent: false, time: 'Ieri 18:10' },
            { text: 'Mamma: Pranzo domenica da noi?', sent: false, time: 'Ieri 19:30' }
        ]
    };
}

function openChat(contactName) {
    currentChat = contactName;
    const modal = document.getElementById('chatModal');
    const contactNameEl = document.getElementById('chatContactName');
    const contactAvatarEl = document.getElementById('chatContactAvatar');
    
    if (modal && contactNameEl) {
        contactNameEl.textContent = contactName;
        
        // Set avatar based on contact
        if (contactName === 'Marco Rossi') {
            contactAvatarEl.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';
        } else if (contactName === 'Anna Bianchi') {
            contactAvatarEl.src = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop';
        } else {
            contactAvatarEl.src = '';
        }
        
        loadChatMessages(contactName);
        modal.classList.add('active');
    }
}

function closeChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentChat = null;
}

function loadChatMessages(contactName) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    
    const contactMessages = messages[contactName] || [];
    
    contactMessages.forEach(message => {
        const messageEl = createMessageElement(message);
        chatMessages.appendChild(messageEl);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <div class="message-text">${message.text}</div>
            <div class="message-time">${message.time}</div>
        </div>
    `;
    
    return messageDiv;
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !currentChat) return;
    
    const messageText = chatInput.value.trim();
    if (!messageText) return;
    
    // Add message to current chat
    if (!messages[currentChat]) {
        messages[currentChat] = [];
    }
    
    const newMessage = {
        text: messageText,
        sent: true,
        time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };
    
    messages[currentChat].push(newMessage);
    
    // Update UI
    const messageEl = createMessageElement(newMessage);
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Clear input
    chatInput.value = '';
    
    // Simulate response after 2 seconds
    setTimeout(() => {
        simulateResponse();
    }, 2000);
}

function simulateResponse() {
    if (!currentChat) return;
    
    const responses = [
        'Perfetto! 👍',
        'Va bene 😊',
        'Grazie!',
        'Ci sentiamo dopo',
        'Ok, a presto!',
        'Ottimo! 😄'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const responseMessage = {
        text: randomResponse,
        sent: false,
        time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };
    
    messages[currentChat].push(responseMessage);
    
    // Update UI
    const messageEl = createMessageElement(responseMessage);
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function newChat() {
    showToast('Nuova chat - Funzione in sviluppo');
}