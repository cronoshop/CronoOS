// Gmail App JavaScript - CronoOS 2.4.1

const emailData = {
    1: {
        sender: 'Marco Rossi',
        email: 'marco.rossi@email.com',
        subject: 'Riunione di domani',
        time: 'Oggi alle 10:30',
        initial: 'M',
        color: '#ea4335',
        body: `
            <p>Ciao!</p>
            <p>Volevo confermarti la riunione di domani alle 14:00. Abbiamo diversi punti importanti da discutere:</p>
            <ul>
                <li>Revisione del progetto corrente</li>
                <li>Pianificazione delle prossime milestone</li>
                <li>Allocazione delle risorse</li>
                <li>Budget per il prossimo trimestre</li>
            </ul>
            <p>Ti prego di confermare la tua presenza.</p>
            <p>Grazie!</p>
            <p>Marco</p>
        `
    },
    2: {
        sender: 'Anna Bianchi',
        email: 'anna.bianchi@email.com',
        subject: 'Progetto completato',
        time: 'Oggi alle 09:15',
        initial: 'A',
        color: '#34a853',
        body: `
            <p>Ottima notizia!</p>
            <p>Il progetto è stato completato con successo. Tutti i deliverable sono stati consegnati in tempo e il cliente è molto soddisfatto del risultato.</p>
            <p>Dettagli del completamento:</p>
            <ul>
                <li>Tutte le funzionalità implementate</li>
                <li>Test completati con successo</li>
                <li>Documentazione consegnata</li>
                <li>Training del team cliente effettuato</li>
            </ul>
            <p>Complimenti a tutto il team per l'eccellente lavoro!</p>
            <p>Anna</p>
        `
    },
    3: {
        sender: 'Google',
        email: 'noreply@google.com',
        subject: 'Attività del tuo account',
        time: 'Ieri alle 18:00',
        initial: 'G',
        color: '#fbbc04',
        body: `
            <p>Ciao,</p>
            <p>Questo è il riepilogo delle attività recenti del tuo account Google.</p>
            <p><strong>Attività recenti:</strong></p>
            <ul>
                <li>Accesso da nuovo dispositivo: iPhone (Milano, Italia)</li>
                <li>Modifica password: 2 giorni fa</li>
                <li>Backup foto: 150 nuove foto salvate</li>
            </ul>
            <p>Nessuna attività sospetta rilevata. Il tuo account è sicuro.</p>
            <p>Team Google</p>
        `
    },
    4: {
        sender: 'Luca Verdi',
        email: 'luca.verdi@email.com',
        subject: 'Invito evento',
        time: '2 giorni fa',
        initial: 'L',
        color: '#9c27b0',
        body: `
            <p>Ciao!</p>
            <p>Ti invito al mio compleanno sabato prossimo! Sarà una festa fantastica con tutti gli amici.</p>
            <p><strong>Dettagli dell'evento:</strong></p>
            <ul>
                <li>Data: Sabato 25 Gennaio</li>
                <li>Ora: 20:00</li>
                <li>Luogo: Via Roma 123, Milano</li>
                <li>Dress code: Casual elegante</li>
            </ul>
            <p>Fammi sapere se puoi partecipare!</p>
            <p>A presto,</p>
            <p>Luca</p>
        `
    },
    5: {
        sender: 'Newsletter Tech',
        email: 'newsletter@tech.com',
        subject: 'Le ultime novità tecnologiche',
        time: '3 giorni fa',
        initial: 'N',
        color: '#ff5722',
        body: `
            <p>Scopri le innovazioni più interessanti della settimana nel mondo della tecnologia!</p>
            <p><strong>Highlights di questa settimana:</strong></p>
            <ul>
                <li>Nuovi processori AI più efficienti</li>
                <li>Breakthrough nella tecnologia delle batterie</li>
                <li>Aggiornamenti sui veicoli autonomi</li>
                <li>Innovazioni nel cloud computing</li>
            </ul>
            <p>Leggi l'articolo completo sul nostro sito web.</p>
            <p>Team Newsletter Tech</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeGmail();
    setupInteractions();
});

function initializeGmail() {
    console.log('Gmail initialized - CronoOS 2.4.1');
}

function setupInteractions() {
    // Star buttons
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleStar(this);
        });
    });
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                // Remove active from all buttons
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                this.classList.add('active');
                
                const text = this.querySelector('span').textContent;
                showToast(`${text} selezionato`);
            }
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            showToast('Ricerca email - Funzione in sviluppo');
        });
    }
    
    // Profile button
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            showToast('Profilo utente');
        });
    }
}

function openEmail(emailId) {
    const email = emailData[emailId];
    if (!email) return;
    
    const modal = document.getElementById('emailModal');
    
    // Update modal content
    document.getElementById('senderInitial').textContent = email.initial;
    document.getElementById('senderInitial').parentElement.style.background = email.color;
    document.getElementById('senderName').textContent = email.sender;
    document.getElementById('senderEmail').textContent = email.email;
    document.getElementById('emailDate').textContent = email.time;
    document.getElementById('emailSubject').textContent = email.subject;
    document.getElementById('emailBody').innerHTML = email.body;
    
    // Show modal
    modal.classList.add('active');
    
    // Mark as read
    const emailItem = document.querySelector(`[onclick="openEmail(${emailId})"]`);
    if (emailItem) {
        emailItem.classList.remove('unread');
    }
}

function closeEmail() {
    const modal = document.getElementById('emailModal');
    modal.classList.remove('active');
}

function toggleStar(button) {
    const isStarred = button.classList.contains('starred');
    const icon = button.querySelector('i');
    
    if (isStarred) {
        button.classList.remove('starred');
        icon.classList.remove('fas');
        icon.classList.add('far');
        showToast('Rimosso dai speciali');
    } else {
        button.classList.add('starred');
        icon.classList.remove('far');
        icon.classList.add('fas');
        showToast('Aggiunto ai speciali');
    }
}

function composeEmail() {
    showToast('Scrivi email - Funzione in sviluppo');
}

function replyEmail() {
    showToast('Rispondi - Funzione in sviluppo');
}

function replyAllEmail() {
    showToast('Rispondi a tutti - Funzione in sviluppo');
}

function forwardEmail() {
    showToast('Inoltra - Funzione in sviluppo');
}