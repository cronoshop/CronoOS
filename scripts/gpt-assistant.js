// CronoGPT Assistant - CronoOS 3.0

document.addEventListener('DOMContentLoaded', function() {
    initializeGPTAssistant();
    setupModuleInteractions();
});

function initializeGPTAssistant() {
    console.log('CronoGPT Assistant initialized - CronoOS 3.0');
    
    // Add entrance animations
    setTimeout(() => {
        document.querySelectorAll('.gpt-module').forEach((module, index) => {
            setTimeout(() => {
                module.classList.add('spring-animation');
            }, index * 100);
        });
    }, 300);
}

function setupModuleInteractions() {
    // Add hover effects
    document.querySelectorAll('.gpt-module').forEach(module => {
        module.addEventListener('mouseenter', function() {
            this.querySelector('.module-icon').style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        module.addEventListener('mouseleave', function() {
            this.querySelector('.module-icon').style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Quick action interactions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('spring-animation');
            setTimeout(() => {
                this.classList.remove('spring-animation');
            }, 600);
        });
    });
}

function openGPTModule(module) {
    const modules = {
        'studio': {
            name: 'CronoStudio',
            description: 'Aiuto per studiare e riassumere testi',
            page: 'gpt-studio.html'
        },
        'assist': {
            name: 'CronoAssist',
            description: 'Assistente personale intelligente',
            page: 'gpt-assist.html'
        },
        'translate': {
            name: 'GPT-Translator',
            description: 'Traduttore istantaneo multilingua',
            page: 'gpt-translate.html'
        },
        'design': {
            name: 'CronoDesign',
            description: 'Personalizza con AI prompt-based',
            page: 'gpt-design.html'
        },
        'games': {
            name: 'CronoGames AI',
            description: 'Quiz e minigiochi generati da AI',
            page: 'cronogames.html'
        }
    };
    
    const moduleInfo = modules[module];
    if (moduleInfo) {
        showToast(`Apertura ${moduleInfo.name}...`);
        
        // Add loading animation
        const moduleElement = document.querySelector(`[onclick*="${module}"]`);
        if (moduleElement) {
            moduleElement.style.transform = 'scale(0.95)';
            moduleElement.style.opacity = '0.7';
            
            setTimeout(() => {
                openApp(moduleInfo.page);
            }, 500);
        }
    }
}

function quickAction(action) {
    const actions = {
        'summarize': 'Riassunto testo - Funzione AI in sviluppo',
        'translate': 'Traduzione istantanea - Funzione AI in sviluppo',
        'explain': 'Spiegazione concetti - Funzione AI in sviluppo',
        'create': 'Creazione contenuti - Funzione AI in sviluppo'
    };
    
    const actionText = actions[action] || 'Azione AI in sviluppo';
    showToast(actionText);
    
    // Simulate AI processing
    setTimeout(() => {
        showToast('AI pronta per l\'uso!');
    }, 2000);
}

// Make functions globally available
window.openGPTModule = openGPTModule;
window.quickAction = quickAction;