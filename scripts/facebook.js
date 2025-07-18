// Facebook App JavaScript - CronoOS 2.4.1

document.addEventListener('DOMContentLoaded', function() {
    initializeFacebook();
    setupInteractions();
});

function initializeFacebook() {
    console.log('Facebook initialized - CronoOS 2.4.1');
}

function setupInteractions() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleLike(this);
        });
    });
    
    // Post actions
    document.querySelectorAll('.post-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showToast(`${action} - Funzione in sviluppo`);
        });
    });
    
    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        if (!btn.classList.contains('like-btn')) {
            btn.addEventListener('click', function() {
                const action = this.querySelector('span').textContent;
                showToast(`${action} - Funzione in sviluppo`);
            });
        }
    });
    
    // Story items
    document.querySelectorAll('.story-item').forEach(story => {
        story.addEventListener('click', function() {
            const storyText = this.querySelector('.story-text').textContent;
            if (storyText === 'Crea storia') {
                showToast('Crea una nuova storia');
            } else {
                showToast(`Visualizzazione storia di ${storyText}`);
            }
        });
    });
    
    // Post menu buttons
    document.querySelectorAll('.post-menu').forEach(btn => {
        btn.addEventListener('click', function() {
            showPostMenu();
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
                if (icon.classList.contains('fa-users')) {
                    showToast('Amici');
                } else if (icon.classList.contains('fa-tv')) {
                    showToast('Video');
                } else if (icon.classList.contains('fa-store')) {
                    showToast('Marketplace');
                } else if (icon.classList.contains('fa-bell')) {
                    showToast('Notifiche');
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
    const reactionCount = post.querySelector('.reaction-count');
    
    if (isLiked) {
        button.classList.remove('liked');
        // Decrease like count
        const currentCount = parseInt(reactionCount.textContent);
        reactionCount.textContent = currentCount - 1;
        showToast('Mi piace rimosso');
    } else {
        button.classList.add('liked');
        // Increase like count
        const currentCount = parseInt(reactionCount.textContent);
        reactionCount.textContent = currentCount + 1;
        showToast('Mi piace aggiunto');
        
        // Add like animation
        createLikeAnimation(button);
    }
}

function createLikeAnimation(button) {
    const like = document.createElement('div');
    like.innerHTML = '👍';
    like.style.cssText = `
        position: absolute;
        font-size: 24px;
        pointer-events: none;
        animation: likeFloat 1s ease-out forwards;
        z-index: 1000;
    `;
    
    const rect = button.getBoundingClientRect();
    like.style.left = rect.left + 'px';
    like.style.top = rect.top + 'px';
    
    document.body.appendChild(like);
    
    setTimeout(() => {
        document.body.removeChild(like);
    }, 1000);
}

function showPostMenu() {
    const options = [
        'Salva post',
        'Nascondi post',
        'Segnala post',
        'Disattiva notifiche',
        'Copia link'
    ];
    
    const randomOption = options[Math.floor(Math.random() * options.length)];
    showToast(`Menu post: ${randomOption}`);
}

// Add like animation CSS
const likeAnimationCSS = document.createElement('style');
likeAnimationCSS.textContent = `
    @keyframes likeFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px) scale(1.3);
        }
    }
`;
document.head.appendChild(likeAnimationCSS);