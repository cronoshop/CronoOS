// Messages App JavaScript - CronoOS 2.1

const SAMPLE_CONVERSATIONS = [
    {
        id: 1,
        name: 'Marco Rossi',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        lastMessage: 'Ciao! Come stai?',
        time: '10:30',
        unread: 2,
        messages: [
            { id: 1, text: 'Ciao Marco!', sent: true, time: '10:25' },
            { id: 2, text: 'Ciao! Come stai?', sent: false, time: '10:30' },
            { id: 3, text: 'Tutto bene, grazie! Tu?', sent: true, time: '10:31' }
        ]
    },
    {
        id: 2,
        name: 'Anna Bianchi',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        lastMessage: 'Ci vediamo stasera?',
        time: '09:15',
        unread: 0,
        messages: [
            { id: 1, text: 'Ciao Anna!', sent: true, time: '09:10' },
            { id: 2, text: 'Ciao! Ci vediamo stasera?', sent: false, time: '09:15' },
            { id: 3, text: 'Perfetto! A che ora?', sent: true, time: '09:16' }
        ]
    },
    {
        id: 3,
        name: 'Luca Verdi',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        lastMessage: 'Hai visto il match ieri?',
        time: 'Ieri',
        unread: 1,
        messages: [
            { id: 1, text: 'Hai visto il match ieri?', sent: false, time: 'Ieri 22:30' },
            { id: 2, text: 'Sì! Che partita incredibile!', sent: true, time: 'Ieri 22:35' }
        ]
    }
];

let currentConversation = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeMessagesApp();
    renderConversations();
    setupEventListeners();
});

function initializeMessagesApp() {
    console.log('Messages app initialized');
}

function renderConversations() {
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList) return;
    
    conversationsList.innerHTML = '';
    
    SAMPLE_CONVERSATIONS.forEach(conversation => {
        const conversationElement = createConversationElement(conversation);
        conversationsList.appendChild(conversationElement);
    });
}

function createConversationElement(conversation) {
    const div = document.createElement('div');
    div.className = 'conversation-item';
    div.dataset.conversationId = conversation.id;
    
    div.innerHTML = `
        <div class="contact-avatar">
            <img src="${conversation.avatar}" alt="${conversation.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="avatar-fallback" style="display: none; width: 100%; height: 100%; background: var(--ios-blue); color: white; align-items: center; justify-content: center; font-weight: 600;">
                ${conversation.name.charAt(0)}
            </div>
        </div>
        <div class="conversation-details">
            <div class="contact-name">${conversation.name}</div>
            <div class="last-message">${conversation.lastMessage}</div>
        </div>
        <div class="conversation-meta">
            <div class="message-time">${conversation.time}</div>
            ${conversation.unread > 0 ? `<div class="unread-badge">${conversation.unread}</div>` : ''}
        </div>
    `;
    
    div.addEventListener('click', () => openConversation(conversation));
    
    return div;
}

function openConversation(conversation) {
    currentConversation = conversation;
    
    // Update chat header
    const chatContactName = document.getElementById('chatContactName');
    const chatAvatar = document.getElementById('chatAvatar');
    
    if (chatContactName) chatContactName.textContent = conversation.name;
    if (chatAvatar) {
        chatAvatar.innerHTML = `
            <img src="${conversation.avatar}" alt="${conversation.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none; width: 100%; height: 100%; background: var(--ios-blue); color: white; align-items: center; justify-content: center; font-weight: 600; border-radius: 50%;">
                ${conversation.name.charAt(0)}
            </div>
        `;
    }
    
    // Render messages
    renderMessages(conversation.messages);
    
    // Show chat view
    const chatView = document.getElementById('chat-view');
    const conversationListView = document.getElementById('conversation-list-view');
    
    if (chatView && conversationListView) {
        chatView.classList.add('active');
        conversationListView.style.display = 'none';
    }
    
    // Clear unread count
    conversation.unread = 0;
    renderConversations();
}

function renderMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        chatMessages.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.sent ? 'sent' : 'received'}`;
    
    div.innerHTML = `
        <div class="message-bubble">
            ${message.text}
        </div>
        <div class="message-time">${message.time}</div>
    `;
    
    return div;
}

function setupEventListeners() {
    // Back to conversations
    const backToConversations = document.getElementById('backToConversations');
    if (backToConversations) {
        backToConversations.addEventListener('click', closeChat);
    }
    
    // Send message
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function closeChat() {
    const chatView = document.getElementById('chat-view');
    const conversationListView = document.getElementById('conversation-list-view');
    
    if (chatView && conversationListView) {
        chatView.classList.remove('active');
        conversationListView.style.display = 'block';
    }
    
    currentConversation = null;
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !currentConversation) return;
    
    const messageText = chatInput.value.trim();
    if (!messageText) return;
    
    // Add message to conversation
    const newMessage = {
        id: Date.now(),
        text: messageText,
        sent: true,
        time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };
    
    currentConversation.messages.push(newMessage);
    currentConversation.lastMessage = messageText;
    currentConversation.time = 'Ora';
    
    // Re-render messages
    renderMessages(currentConversation.messages);
    
    // Clear input
    chatInput.value = '';
    
    // Update conversations list
    renderConversations();
    
    // Simulate response after 2 seconds
    setTimeout(() => {
        simulateResponse();
    }, 2000);
}

function simulateResponse() {
    if (!currentConversation) return;
    
    const responses = [
        'Perfetto!',
        'Va bene 👍',
        'Grazie!',
        'Ci sentiamo dopo',
        'Ok, a presto!',
        'Ottimo! 😊'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const responseMessage = {
        id: Date.now(),
        text: randomResponse,
        sent: false,
        time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };
    
    currentConversation.messages.push(responseMessage);
    currentConversation.lastMessage = randomResponse;
    currentConversation.time = 'Ora';
    
    // Re-render messages
    renderMessages(currentConversation.messages);
    
    // Update conversations list
    renderConversations();
}