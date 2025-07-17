// Messages App JavaScript - One UI OS

let conversations = [];
let currentConversation = null;
let messageHistory = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeMessagesApp();
    loadConversations();
    initializeMessageSearch();
});

function initializeMessagesApp() {
    // Load sample conversations if none exist
    if (conversations.length === 0) {
        loadSampleConversations();
    }
    
    updateConversationsList();
    console.log('Messages app initialized');
}

function loadSampleConversations() {
    conversations = [
        {
            id: 1,
            name: 'Marco Rossi',
            avatar: 'M',
            lastMessage: 'Ciao! Come stai?',
            timestamp: new Date(Date.now() - 1800000), // 30 min ago
            unreadCount: 2,
            isGroup: false
        },
        {
            id: 2,
            name: 'Anna Bianchi',
            avatar: 'A',
            lastMessage: 'Perfetto, ci sentiamo domani',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            unreadCount: 0,
            isGroup: false
        },
        {
            id: 3,
            name: 'Gruppo Famiglia',
            avatar: '👨‍👩‍👧‍👦',
            lastMessage: 'Mamma: Cena domenica alle 13:00',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            unreadCount: 5,
            isGroup: true
        }
    ];
    
    // Load sample message history
    messageHistory = {
        1: [
            { id: 1, text: 'Ciao! Come stai?', sender: 'other', timestamp: new Date(Date.now() - 300000) },
            { id: 2, text: 'Tutto bene, grazie! Tu?', sender: 'me', timestamp: new Date(Date.now() - 180000) },
            { id: 3, text: 'Benissimo! Ci vediamo stasera?', sender: 'other', timestamp: new Date(Date.now() - 60000) }
        ],
        2: [
            { id: 1, text: 'Ciao Anna, come va il progetto?', sender: 'me', timestamp: new Date(Date.now() - 172800000) },
            { id: 2, text: 'Tutto procede bene, dovremmo finire entro venerdì', sender: 'other', timestamp: new Date(Date.now() - 172700000) },
            { id: 3, text: 'Perfetto, ci sentiamo domani', sender: 'other', timestamp: new Date(Date.now() - 86400000) }
        ],
        3: [
            { id: 1, text: 'Papà: Chi viene a cena domenica?', sender: 'other', timestamp: new Date(Date.now() - 90000000) },
            { id: 2, text: 'Io ci sarò!', sender: 'me', timestamp: new Date(Date.now() - 89900000) },
            { id: 3, text: 'Mamma: Perfetto, cucino per tutti', sender: 'other', timestamp: new Date(Date.now() - 89800000) },
            { id: 4, text: 'Mamma: Cena domenica alle 13:00', sender: 'other', timestamp: new Date(Date.now() - 86400000) }
        ]
    };
}

function updateConversationsList() {
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList) return;
    
    conversationsList.innerHTML = '';
    
    // Sort conversations by timestamp (most recent first)
    const sortedConversations = [...conversations].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedConversations.forEach(conversation => {
        const conversationElement = createConversationElement(conversation);
        conversationsList.appendChild(conversationElement);
    });
}

function createConversationElement(conversation) {
    const element = document.createElement('div');
    element.className = 'conversation-item';
    element.onclick = () => openConversation(conversation.name);
    
    const timeString = formatMessageTime(conversation.timestamp);
    
    element.innerHTML = `
        <div class="conversation-avatar">${conversation.avatar}</div>
        <div class="conversation-info">
            <div class="conversation-header">
                <div class="conversation-name">${conversation.name}</div>
                <div class="conversation-time">${timeString}</div>
            </div>
            <div class="conversation-preview">${conversation.lastMessage}</div>
        </div>
        ${conversation.unreadCount > 0 ? `<div class="unread-badge">${conversation.unreadCount}</div>` : ''}
    `;
    
    return element;
}

function formatMessageTime(timestamp) {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays}g`;
    
    return messageDate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
}

function openConversation(contactName) {
    const conversation = conversations.find(c => c.name === contactName);
    if (!conversation) return;
    
    currentConversation = conversation;
    
    // Mark as read
    conversation.unreadCount = 0;
    updateConversationsList();
    
    // Show chat view
    const chatView = document.getElementById('chatView');
    const conversationsList = document.getElementById('conversationsList');
    
    if (chatView && conversationsList) {
        conversationsList.style.display = 'none';
        chatView.style.display = 'flex';
        
        // Update chat header
        updateChatHeader(conversation);
        
        // Load messages
        loadChatMessages(conversation.id);
        
        // Add slide animation
        chatView.style.animation = 'slideInRight 0.3s ease';
    }
}

function updateChatHeader(conversation) {
    const chatAvatar = document.getElementById('chatAvatar');
    const chatContactName = document.getElementById('chatContactName');
    
    if (chatAvatar) chatAvatar.textContent = conversation.avatar;
    if (chatContactName) chatContactName.textContent = conversation.name;
}

function loadChatMessages(conversationId) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    
    const messages = messageHistory[conversationId] || [];
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        chatMessages.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(message) {
    const element = document.createElement('div');
    element.className = `message ${message.sender === 'me' ? 'sent' : 'received'}`;
    
    const timeString = new Date(message.timestamp).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    element.innerHTML = `
        <div class="message-bubble">${message.text}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    return element;
}

function closeChatView() {
    const chatView = document.getElementById('chatView');
    const conversationsList = document.getElementById('conversationsList');
    
    if (chatView && conversationsList) {
        chatView.style.animation = 'slideOutRight 0.3s ease';
        
        setTimeout(() => {
            chatView.style.display = 'none';
            conversationsList.style.display = 'block';
            currentConversation = null;
        }, 300);
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput || !currentConversation) return;
    
    const messageText = messageInput.value.trim();
    if (messageText === '') return;
    
    // Create new message
    const newMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'me',
        timestamp: new Date()
    };
    
    // Add to message history
    if (!messageHistory[currentConversation.id]) {
        messageHistory[currentConversation.id] = [];
    }
    messageHistory[currentConversation.id].push(newMessage);
    
    // Update conversation last message
    currentConversation.lastMessage = messageText;
    currentConversation.timestamp = new Date();
    
    // Clear input
    messageInput.value = '';
    
    // Add message to chat
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        const messageElement = createMessageElement(newMessage);
        messageElement.classList.add('new');
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Update conversations list
    updateConversationsList();
    
    // Simulate response after a delay
    setTimeout(() => {
        simulateResponse();
    }, 1000 + Math.random() * 2000);
    
    hapticFeedback('light');
}

function simulateResponse() {
    if (!currentConversation) return;
    
    const responses = [
        'Perfetto!',
        'Va bene 👍',
        'Ci sentiamo dopo',
        'Grazie!',
        'Ok, a presto',
        'Interessante...',
        'Sono d\'accordo',
        'Fammi sapere'
    ];
    
    const responseText = responses[Math.floor(Math.random() * responses.length)];
    
    const responseMessage = {
        id: Date.now(),
        text: responseText,
        sender: 'other',
        timestamp: new Date()
    };
    
    // Add to message history
    messageHistory[currentConversation.id].push(responseMessage);
    
    // Update conversation
    currentConversation.lastMessage = responseText;
    currentConversation.timestamp = new Date();
    
    // Add message to chat if chat is open
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && document.getElementById('chatView').style.display !== 'none') {
        // Show typing indicator first
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            
            const messageElement = createMessageElement(responseMessage);
            messageElement.classList.add('new');
            chatMessages.appendChild(messageElement);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    } else {
        // Update unread count if chat is not open
        currentConversation.unreadCount = (currentConversation.unreadCount || 0) + 1;
    }
    
    // Update conversations list
    updateConversationsList();
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.id = 'typingIndicator';
    typingIndicator.innerHTML = `
        <span>Sta scrivendo</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function initializeMessageSearch() {
    const searchInput = document.getElementById('messageSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        const conversationItems = document.querySelectorAll('.conversation-item');
        
        conversationItems.forEach(item => {
            const name = item.querySelector('.conversation-name').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
            const shouldShow = name.includes(query) || preview.includes(query);
            
            item.style.display = shouldShow ? 'flex' : 'none';
            
            if (shouldShow && query) {
                item.style.animation = 'pulse 0.5s ease';
            }
        });
    }, 300));
}

// Handle Enter key in message input
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
});

// Message actions (long press)
function initializeMessageActions() {
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.message-bubble')) {
            e.preventDefault();
            showMessageActions(e.target.closest('.message'));
        }
    });
}

function showMessageActions(messageElement) {
    const actionsMenu = document.createElement('div');
    actionsMenu.className = 'message-actions-menu';
    actionsMenu.innerHTML = `
        <div class="action-item" onclick="copyMessage()">📋 Copia</div>
        <div class="action-item" onclick="replyToMessage()">↩️ Rispondi</div>
        <div class="action-item" onclick="deleteMessage()">🗑️ Elimina</div>
        <div class="action-item" onclick="forwardMessage()">➡️ Inoltra</div>
    `;
    
    actionsMenu.style.cssText = `
        position: fixed;
        background: var(--card-color);
        border-radius: 8px;
        box-shadow: 0 4px 20px var(--shadow-color);
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    `;
    
    // Position menu
    const rect = messageElement.getBoundingClientRect();
    actionsMenu.style.top = (rect.top - 10) + 'px';
    actionsMenu.style.left = (rect.left + 10) + 'px';
    
    document.body.appendChild(actionsMenu);
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu() {
            actionsMenu.remove();
            document.removeEventListener('click', removeMenu);
        });
    }, 100);
}

function copyMessage() {
    showToast('Messaggio copiato');
}

function replyToMessage() {
    showToast('Risposta - Funzionalità in arrivo!');
}

function deleteMessage() {
    showToast('Messaggio eliminato');
}

function forwardMessage() {
    showToast('Inoltra messaggio - Funzionalità in arrivo!');
}

// Initialize message actions
document.addEventListener('DOMContentLoaded', initializeMessageActions);

// Voice message functionality
function initializeVoiceMessages() {
    const attachmentBtn = document.querySelector('.attachment-btn');
    if (!attachmentBtn) return;
    
    let isRecording = false;
    let recordingTimer;
    let recordingDuration = 0;
    
    attachmentBtn.addEventListener('click', function() {
        if (!isRecording) {
            startVoiceRecording();
        } else {
            stopVoiceRecording();
        }
    });
    
    function startVoiceRecording() {
        isRecording = true;
        recordingDuration = 0;
        attachmentBtn.textContent = '🔴';
        attachmentBtn.style.background = 'var(--oneui-red)';
        
        // Show recording UI
        showRecordingUI();
        
        recordingTimer = setInterval(() => {
            recordingDuration++;
            updateRecordingUI(recordingDuration);
        }, 1000);
        
        hapticFeedback('medium');
    }
    
    function stopVoiceRecording() {
        isRecording = false;
        clearInterval(recordingTimer);
        attachmentBtn.textContent = '📎';
        attachmentBtn.style.background = '';
        
        hideRecordingUI();
        
        if (recordingDuration > 1) {
            sendVoiceMessage(recordingDuration);
        }
        
        hapticFeedback('light');
    }
    
    function showRecordingUI() {
        const recordingUI = document.createElement('div');
        recordingUI.id = 'recordingUI';
        recordingUI.innerHTML = `
            <div class="recording-indicator">
                <span class="recording-dot"></span>
                <span>Registrazione in corso...</span>
                <span class="recording-time">00:00</span>
            </div>
        `;
        
        recordingUI.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-color);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px var(--shadow-color);
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(recordingUI);
    }
    
    function updateRecordingUI(duration) {
        const recordingTime = document.querySelector('.recording-time');
        if (recordingTime) {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            recordingTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    function hideRecordingUI() {
        const recordingUI = document.getElementById('recordingUI');
        if (recordingUI) {
            recordingUI.remove();
        }
    }
    
    function sendVoiceMessage(duration) {
        const voiceMessage = {
            id: Date.now(),
            type: 'voice',
            duration: duration,
            sender: 'me',
            timestamp: new Date()
        };
        
        // Add to message history
        if (currentConversation && messageHistory[currentConversation.id]) {
            messageHistory[currentConversation.id].push(voiceMessage);
            
            // Create voice message element
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                <div class="message-bubble voice-message">
                    🎤 Messaggio vocale (${duration}s)
                    <button class="play-voice-btn" onclick="playVoiceMessage()">▶️</button>
                </div>
                <div class="message-time">${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    }
}

function playVoiceMessage() {
    showToast('Riproduzione messaggio vocale - Funzionalità in arrivo!');
}

// Initialize voice messages
document.addEventListener('DOMContentLoaded', initializeVoiceMessages);

// Add CSS for animations
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .message-actions-menu {
        min-width: 150px;
    }
    
    .action-item {
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 14px;
    }
    
    .action-item:hover {
        background: var(--surface-color);
    }
    
    .action-item:first-child {
        border-radius: 8px 8px 0 0;
    }
    
    .action-item:last-child {
        border-radius: 0 0 8px 8px;
    }
    
    .recording-indicator {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
    }
    
    .recording-dot {
        width: 8px;
        height: 8px;
        background: var(--oneui-red);
        border-radius: 50%;
        animation: pulse 1s infinite;
    }
    
    .recording-time {
        font-family: 'Courier New', monospace;
        font-weight: bold;
    }
    
    .voice-message {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .play-voice-btn {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .play-voice-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

document.head.appendChild(messageStyles);