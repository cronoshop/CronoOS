// Instagram App JavaScript - CronoOS 2.4.1

document.addEventListener('DOMContentLoaded', function() {
    initializeInstagram();
    setupInteractions();
});

function initializeInstagram() {
    console.log('Instagram initialized - CronoOS 2.4.1');
}

function setupInteractions() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleLike(this);
        });
    });
    
    // Save buttons
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleSave(this);
        });
    });
    
    // Story items
    document.querySelectorAll('.story-item').forEach(story => {
        story.addEventListener('click', function() {
            const username = this.querySelector('.story-username').textContent;
            if (username === 'La tua storia') {
                showToast('Aggiungi alla tua storia');
            } else {
                showToast(`Visualizzazione storia di ${username}`);
            }
        });
    });
    
    // Comments links
    document.querySelectorAll('.comments-link').forEach(link => {
        link.addEventListener('click', function() {
            showToast('Apertura commenti...');
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
                
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-search')) {
                    showToast('Ricerca');
                } else if (icon.classList.contains('fa-plus-square')) {
                    showToast('Crea nuovo post');
                } else if (icon.classList.contains('fa-heart')) {
                    showToast('Attività');
                } else if (icon.classList.contains('fa-home')) {
                    showToast('Home');
                }
            }
        });
    });
}

function toggleLike(button) {
    const isLiked = button.classList.contains('liked');
    const post = button.closest('.post');
    const likesElement = post.querySelector('.likes strong');
    
    if (isLiked) {
        button.classList.remove('liked');
        // Decrease like count
        const currentLikes = parseInt(likesElement.textContent);
        likesElement.textContent = (currentLikes - 1) + ' Mi piace';
    } else {
        button.classList.add('liked');
        // Increase like count
        const currentLikes = parseInt(likesElement.textContent);
        likesElement.textContent = (currentLikes + 1) + ' Mi piace';
        
        // Add heart animation
        createHeartAnimation(button);
    }
}

function toggleSave(button) {
    const isSaved = button.classList.contains('saved');
    
    if (isSaved) {
        button.classList.remove('saved');
        button.querySelector('i').classList.remove('fas');
        button.querySelector('i').classList.add('far');
        showToast('Rimosso dai salvati');
    } else {
        button.classList.add('saved');
        button.querySelector('i').classList.remove('far');
        button.querySelector('i').classList.add('fas');
        showToast('Salvato');
    }
}

function createHeartAnimation(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        font-size: 30px;
        pointer-events: none;
        animation: heartFloat 1s ease-out forwards;
        z-index: 1000;
    `;
    
    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 1000);
}

// Add heart animation CSS
const heartAnimationCSS = document.createElement('style');
heartAnimationCSS.textContent = `
    @keyframes heartFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
        }
    }
`;
document.head.appendChild(heartAnimationCSS);