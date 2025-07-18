// CronoGames - CronoOS 3.0

let currentGame = null;
let gameState = 'stopped';

document.addEventListener('DOMContentLoaded', function() {
    initializeCronoGames();
    setupGameInteractions();
});

function initializeCronoGames() {
    console.log('CronoGames initialized - CronoOS 3.0');
    
    // Add entrance animations
    setTimeout(() => {
        document.querySelectorAll('.game-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('spring-animation');
            }, index * 150);
        });
    }, 300);
}

function setupGameInteractions() {
    // Add hover effects to game cards
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.game-icon').style.transform = 'scale(1.1) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.game-icon').style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Close modal on background click
    document.getElementById('gameModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeGame();
        }
    });
}

function openGame(gameId) {
    const games = {
        'snake': {
            name: 'Snake Neo',
            description: 'Classico Snake con grafica moderna'
        },
        'tap-master': {
            name: 'Tap Master',
            description: 'Gioco musicale a ritmo'
        },
        'pixel-miner': {
            name: 'Pixel Miner',
            description: 'Gestione miniera in pixel art'
        },
        'crono-trivia': {
            name: 'CronoTrivia',
            description: 'Quiz intelligente dinamico'
        }
    };
    
    const game = games[gameId];
    if (!game) return;
    
    currentGame = gameId;
    
    // Update modal content
    document.getElementById('gameTitle').textContent = game.name;
    
    // Show modal
    const modal = document.getElementById('gameModal');
    modal.classList.add('active');
    
    // Initialize game area
    initializeGameArea(gameId);
    
    showToast(`Caricamento ${game.name}...`);
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    
    // Stop current game
    if (gameState === 'playing') {
        pauseGame();
    }
    
    currentGame = null;
    gameState = 'stopped';
}

function initializeGameArea(gameId) {
    const gameArea = document.getElementById('gameArea');
    
    switch (gameId) {
        case 'snake':
            gameArea.innerHTML = `
                <div class="snake-game">
                    <div class="game-placeholder">
                        <i class="fas fa-snake" style="font-size: 48px; margin-bottom: 16px;"></i>
                        <p>Snake Neo</p>
                        <p style="font-size: 14px; opacity: 0.7;">Premi Gioca per iniziare</p>
                    </div>
                </div>
            `;
            break;
            
        case 'tap-master':
            gameArea.innerHTML = `
                <div class="tap-master-game">
                    <div class="game-placeholder">
                        <i class="fas fa-music" style="font-size: 48px; margin-bottom: 16px;"></i>
                        <p>Tap Master</p>
                        <p style="font-size: 14px; opacity: 0.7;">Segui il ritmo!</p>
                    </div>
                </div>
            `;
            break;
            
        case 'pixel-miner':
            gameArea.innerHTML = `
                <div class="pixel-miner-game">
                    <div class="game-placeholder">
                        <i class="fas fa-pickaxe" style="font-size: 48px; margin-bottom: 16px;"></i>
                        <p>Pixel Miner</p>
                        <p style="font-size: 14px; opacity: 0.7;">Scava e costruisci!</p>
                    </div>
                </div>
            `;
            break;
            
        case 'crono-trivia':
            gameArea.innerHTML = `
                <div class="trivia-game">
                    <div class="game-placeholder">
                        <i class="fas fa-brain" style="font-size: 48px; margin-bottom: 16px;"></i>
                        <p>CronoTrivia</p>
                        <p style="font-size: 14px; opacity: 0.7;">Quiz intelligente</p>
                    </div>
                </div>
            `;
            break;
            
        default:
            gameArea.innerHTML = `
                <div class="game-placeholder">
                    <i class="fas fa-gamepad" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>Gioco in caricamento...</p>
                </div>
            `;
    }
}

function startGame() {
    if (!currentGame) return;
    
    gameState = 'playing';
    const gameArea = document.getElementById('gameArea');
    
    // Simulate game start
    gameArea.innerHTML = `
        <div class="game-active">
            <div class="game-score">
                <span>Punteggio: <strong id="gameScore">0</strong></span>
            </div>
            <div class="game-field">
                <div class="game-running">
                    <i class="fas fa-play" style="font-size: 32px; color: #4CAF50;"></i>
                    <p>Gioco in corso...</p>
                    <p style="font-size: 12px; opacity: 0.7;">Simulazione di gioco</p>
                </div>
            </div>
        </div>
    `;
    
    showToast(`${currentGame} avviato!`);
    
    // Simulate score increase
    let score = 0;
    const scoreInterval = setInterval(() => {
        if (gameState !== 'playing') {
            clearInterval(scoreInterval);
            return;
        }
        
        score += Math.floor(Math.random() * 10) + 1;
        const scoreElement = document.getElementById('gameScore');
        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }, 1000);
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        showToast('Gioco in pausa');
        
        const gameArea = document.getElementById('gameArea');
        const pauseOverlay = document.createElement('div');
        pauseOverlay.className = 'pause-overlay';
        pauseOverlay.innerHTML = `
            <i class="fas fa-pause" style="font-size: 32px; margin-bottom: 8px;"></i>
            <p>Gioco in pausa</p>
        `;
        pauseOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        `;
        
        gameArea.style.position = 'relative';
        gameArea.appendChild(pauseOverlay);
    } else if (gameState === 'paused') {
        gameState = 'playing';
        showToast('Gioco ripreso');
        
        const pauseOverlay = document.querySelector('.pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    }
}

function resetGame() {
    gameState = 'stopped';
    
    if (currentGame) {
        initializeGameArea(currentGame);
        showToast('Gioco resettato');
    }
}

function generateAIGame() {
    showToast('Generazione gioco AI in corso...');
    
    // Simulate AI generation
    const generationSteps = [
        'Analisi preferenze utente...',
        'Generazione meccaniche di gioco...',
        'Creazione grafica procedurale...',
        'Ottimizzazione difficoltà...',
        'Gioco AI pronto!'
    ];
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
        if (stepIndex < generationSteps.length) {
            showToast(generationSteps[stepIndex]);
            stepIndex++;
        } else {
            clearInterval(stepInterval);
            
            // Show generated game
            setTimeout(() => {
                showToast('Nuovo gioco AI aggiunto alla libreria!');
            }, 1000);
        }
    }, 1500);
}

// Make functions globally available
window.openGame = openGame;
window.closeGame = closeGame;
window.startGame = startGame;
window.pauseGame = pauseGame;
window.resetGame = resetGame;
window.generateAIGame = generateAIGame;