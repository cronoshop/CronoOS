// File Manager App - CronoOS 3.1

class FileManagerApp {
    constructor() {
        this.currentPath = '/';
        this.files = [];
        this.sortBy = 'name';
        this.viewMode = 'list';
        this.selectedFile = null;
        this.init();
    }

    init() {
        this.generateSampleFiles();
        this.setupEventListeners();
        this.renderFileList();
        console.log('File Manager App initialized - CronoOS 3.1');
    }

    setupEventListeners() {
        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setSortMode(btn.dataset.sort));
        });

        // View toggle
        const viewBtn = document.getElementById('viewBtn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => this.toggleView());
        }

        // Search
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.openSearch());
        }

        // Context menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });

        // File item right click
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.file-item')) {
                e.preventDefault();
                this.showContextMenu(e, e.target.closest('.file-item'));
            }
        });
    }

    generateSampleFiles() {
        this.files = [
            {
                id: '1',
                name: 'Documenti',
                type: 'folder',
                size: null,
                modified: new Date('2025-01-15'),
                icon: 'fas fa-folder'
            },
            {
                id: '2',
                name: 'Immagini',
                type: 'folder',
                size: null,
                modified: new Date('2025-01-14'),
                icon: 'fas fa-folder'
            },
            {
                id: '3',
                name: 'Download',
                type: 'folder',
                size: null,
                modified: new Date('2025-01-13'),
                icon: 'fas fa-folder'
            },
            {
                id: '4',
                name: 'Presentazione.pptx',
                type: 'file',
                size: 2048576,
                modified: new Date('2025-01-12'),
                icon: 'fas fa-file-powerpoint'
            },
            {
                id: '5',
                name: 'Relazione.docx',
                type: 'file',
                size: 1024000,
                modified: new Date('2025-01-11'),
                icon: 'fas fa-file-word'
            },
            {
                id: '6',
                name: 'Budget.xlsx',
                type: 'file',
                size: 512000,
                modified: new Date('2025-01-10'),
                icon: 'fas fa-file-excel'
            },
            {
                id: '7',
                name: 'Foto_Vacanze.jpg',
                type: 'file',
                size: 3145728,
                modified: new Date('2025-01-09'),
                icon: 'fas fa-file-image'
            },
            {
                id: '8',
                name: 'Musica.mp3',
                type: 'file',
                size: 4194304,
                modified: new Date('2025-01-08'),
                icon: 'fas fa-file-audio'
            },
            {
                id: '9',
                name: 'Video_Tutorial.mp4',
                type: 'file',
                size: 52428800,
                modified: new Date('2025-01-07'),
                icon: 'fas fa-file-video'
            },
            {
                id: '10',
                name: 'Archivio.zip',
                type: 'file',
                size: 10485760,
                modified: new Date('2025-01-06'),
                icon: 'fas fa-file-archive'
            }
        ];
    }

    renderFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;
        
        const sortedFiles = this.getSortedFiles();

        fileList.innerHTML = '';

        sortedFiles.forEach(file => {
            const fileElement = this.createFileElement(file);
            fileList.appendChild(fileElement);
        });
    }

    createFileElement(file) {
        const div = document.createElement('div');
        div.className = 'file-item glass-card';
        div.dataset.fileId = file.id;

        const sizeText = file.type === 'folder' ? 
            'Cartella' : 
            this.formatFileSize(file.size);

        const dateText = file.modified.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        div.innerHTML = `
            <div class="file-icon">
                <i class="${file.icon}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-details">
                    <span>${sizeText}</span>
                    <span>${dateText}</span>
                </div>
            </div>
            <button class="file-menu" onclick="event.stopPropagation(); showFileMenu(event, '${file.id}')">
                <i class="fas fa-ellipsis-vertical"></i>
            </button>
        `;

        div.addEventListener('click', () => this.openFile(file));

        return div;
    }

    getSortedFiles() {
        const sorted = [...this.files];

        sorted.sort((a, b) => {
            // Folders first
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;

            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return b.modified - a.modified;
                case 'size':
                    if (a.type === 'folder' && b.type === 'folder') {
                        return a.name.localeCompare(b.name);
                    }
                    return (b.size || 0) - (a.size || 0);
                default:
                    return 0;
            }
        });

        return sorted;
    }

    setSortMode(sortBy) {
        this.sortBy = sortBy;

        // Update active sort button
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === sortBy);
        });

        this.renderFileList();
        
        if (window.cronos) {
            cronos.showToast(`Ordinamento per ${this.getSortLabel(sortBy)}`, 'info');
            cronos.playSound('click');
        } else {
            showToast(`Ordinamento per ${this.getSortLabel(sortBy)}`);
        }
    }

    getSortLabel(sortBy) {
        const labels = {
            name: 'nome',
            date: 'data',
            size: 'dimensione'
        };
        return labels[sortBy] || sortBy;
    }

    toggleView() {
        this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
        
        const viewBtn = document.getElementById('viewBtn');
        if (viewBtn) {
            const icon = viewBtn.querySelector('i');
            
            if (this.viewMode === 'grid') {
                icon.className = 'fas fa-list';
                document.getElementById('fileList').classList.add('grid-view');
            } else {
                icon.className = 'fas fa-th';
                document.getElementById('fileList').classList.remove('grid-view');
            }
        }

        if (window.cronos) {
            cronos.showToast(`Vista ${this.viewMode === 'list' ? 'lista' : 'griglia'}`, 'info');
            cronos.playSound('click');
        } else {
            showToast(`Vista ${this.viewMode === 'list' ? 'lista' : 'griglia'}`);
        }
    }

    openFile(file) {
        if (file.type === 'folder') {
            this.openFolder(file.name.toLowerCase());
        } else {
            if (window.cronos) {
                cronos.showToast(`Apertura ${file.name}...`, 'info');
                cronos.playSound('click');
            } else {
                showToast(`Apertura ${file.name}...`);
            }
            
            // Simulate file opening
            setTimeout(() => {
                if (window.cronos) {
                    cronos.showToast('File aperto!', 'success');
                } else {
                    showToast('File aperto!');
                }
            }, 1000);
        }
    }

    openFolder(folderName) {
        if (window.cronos) {
            cronos.showToast(`Apertura cartella ${folderName}...`, 'info');
            cronos.playSound('click');
        } else {
            showToast(`Apertura cartella ${folderName}...`);
        }
        
        // Simulate folder navigation
        setTimeout(() => {
            if (window.cronos) {
                cronos.showToast('Cartella aperta!', 'success');
            } else {
                showToast('Cartella aperta!');
            }
        }, 500);
    }

    showContextMenu(event, fileElement) {
        const contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) return;
        
        const fileId = fileElement.dataset.fileId;
        this.selectedFile = this.files.find(f => f.id === fileId);

        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';
        contextMenu.classList.add('active');
    }

    hideContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.classList.remove('active');
        }
        this.selectedFile = null;
    }

    openSearch() {
        if (window.cronos) {
            cronos.showToast('Ricerca file - Funzione in sviluppo', 'info');
            cronos.playSound('click');
        } else {
            showToast('Ricerca file - Funzione in sviluppo');
        }
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Global functions for context menu
function openFile() {
    if (window.fileManager && window.fileManager.selectedFile) {
        window.fileManager.openFile(window.fileManager.selectedFile);
        window.fileManager.hideContextMenu();
    }
}

function shareFile() {
    if (window.fileManager && window.fileManager.selectedFile) {
        if (window.cronos) {
            cronos.showToast(`Condivisione ${window.fileManager.selectedFile.name}...`, 'info');
        } else {
            showToast(`Condivisione ${window.fileManager.selectedFile.name}...`);
        }
        window.fileManager.hideContextMenu();
    }
}

function renameFile() {
    if (window.fileManager && window.fileManager.selectedFile) {
        const newName = prompt('Nuovo nome:', window.fileManager.selectedFile.name);
        if (newName && newName.trim()) {
            window.fileManager.selectedFile.name = newName.trim();
            window.fileManager.renderFileList();
            if (window.cronos) {
                cronos.showToast('File rinominato!', 'success');
            } else {
                showToast('File rinominato!');
            }
        }
        window.fileManager.hideContextMenu();
    }
}

function deleteFile() {
    if (window.fileManager && window.fileManager.selectedFile) {
        if (confirm(`Eliminare ${window.fileManager.selectedFile.name}?`)) {
            const index = window.fileManager.files.findIndex(f => f.id === window.fileManager.selectedFile.id);
            if (index > -1) {
                window.fileManager.files.splice(index, 1);
                window.fileManager.renderFileList();
                if (window.cronos) {
                    cronos.showToast('File eliminato!', 'success');
                } else {
                    showToast('File eliminato!');
                }
            }
        }
        window.fileManager.hideContextMenu();
    }
}

function showFileMenu(event, fileId) {
    const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileElement && window.fileManager) {
        window.fileManager.showContextMenu(event, fileElement);
    }
}

function openFolder(folderName) {
    if (window.fileManager) {
        window.fileManager.openFolder(folderName);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.fileManager = new FileManagerApp();
});