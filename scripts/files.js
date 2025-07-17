// Files App JavaScript - One UI OS

let currentPath = '/';
let files = [];
let folders = [];
let viewMode = 'list'; // 'list' or 'grid'
let selectedItems = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeFilesApp();
    loadFileSystem();
    updateBreadcrumb();
    updateFilesList();
});

function initializeFilesApp() {
    generateSampleFileSystem();
    updateStorageInfo();
    
    console.log('Files app initialized');
}

function generateSampleFileSystem() {
    folders = [
        {
            id: 1,
            name: 'Documenti',
            path: '/Documents',
            type: 'folder',
            size: 0,
            items: 12,
            modified: new Date(Date.now() - 86400000),
            icon: '📁'
        },
        {
            id: 2,
            name: 'Download',
            path: '/Downloads',
            type: 'folder',
            size: 0,
            items: 8,
            modified: new Date(Date.now() - 3600000),
            icon: '📁'
        },
        {
            id: 3,
            name: 'Immagini',
            path: '/Pictures',
            type: 'folder',
            size: 0,
            items: 156,
            modified: new Date(Date.now() - 7200000),
            icon: '📁'
        },
        {
            id: 4,
            name: 'Musica',
            path: '/Music',
            type: 'folder',
            size: 0,
            items: 89,
            modified: new Date(Date.now() - 14400000),
            icon: '📁'
        }
    ];
    
    files = [
        {
            id: 5,
            name: 'Documento.pdf',
            path: '/Documento.pdf',
            type: 'pdf',
            size: 2097152, // 2MB
            modified: new Date(),
            icon: '📄'
        },
        {
            id: 6,
            name: 'Foto_vacanze.jpg',
            path: '/Foto_vacanze.jpg',
            type: 'image',
            size: 5033164, // 4.8MB
            modified: new Date(Date.now() - 86400000),
            icon: '🖼️'
        },
        {
            id: 7,
            name: 'Canzone.mp3',
            path: '/Canzone.mp3',
            type: 'audio',
            size: 5452595, // 5.2MB
            modified: new Date(Date.now() - 172800000),
            icon: '🎵'
        },
        {
            id: 8,
            name: 'Video_compleanno.mp4',
            path: '/Video_compleanno.mp4',
            type: 'video',
            size: 15728640, // 15MB
            modified: new Date(Date.now() - 259200000),
            icon: '🎬'
        },
        {
            id: 9,
            name: 'Presentazione.pptx',
            path: '/Presentazione.pptx',
            type: 'presentation',
            size: 3145728, // 3MB
            modified: new Date(Date.now() - 345600000),
            icon: '📊'
        }
    ];
}

function loadFileSystem() {
    // In a real app, this would load from storage or API
    updateFilesList();
}

function updateBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const pathParts = currentPath.split('/').filter(part => part);
    
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item ${currentPath === '/' ? 'active' : ''}" onclick="navigateToFolder('/')">
            Memoria Interna
        </span>
        ${pathParts.map((part, index) => {
            const partPath = '/' + pathParts.slice(0, index + 1).join('/');
            const isLast = index === pathParts.length - 1;
            return `
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-item ${isLast ? 'active' : ''}" onclick="navigateToFolder('${partPath}')">
                    ${part}
                </span>
            `;
        }).join('')}
    `;
}

function updateFilesList() {
    const filesList = document.getElementById('filesList');
    if (!filesList) return;
    
    filesList.innerHTML = '';
    filesList.className = `files-list ${viewMode === 'grid' ? 'grid-view' : ''}`;
    
    // Get items for current path
    const currentItems = getCurrentPathItems();
    
    if (currentItems.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon">📂</div>
            <div class="empty-text">Cartella vuota</div>
        `;
        emptyState.style.cssText = `
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        `;
        filesList.appendChild(emptyState);
        return;
    }
    
    // Sort items (folders first, then files)
    currentItems.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });
    
    currentItems.forEach(item => {
        const itemElement = createFileItemElement(item);
        filesList.appendChild(itemElement);
    });
}

function getCurrentPathItems() {
    const allItems = [...folders, ...files];
    
    if (currentPath === '/') {
        return allItems.filter(item => {
            const pathParts = item.path.split('/').filter(part => part);
            return pathParts.length === 1;
        });
    }
    
    return allItems.filter(item => {
        const itemDir = item.path.substring(0, item.path.lastIndexOf('/')) || '/';
        return itemDir === currentPath;
    });
}

function createFileItemElement(item) {
    const element = document.createElement('div');
    element.className = `file-item ${item.type === 'folder' ? 'folder' : ''}`;
    element.setAttribute('data-type', item.type);
    
    const isFolder = item.type === 'folder';
    const sizeText = isFolder ? `${item.items} elementi` : formatFileSize(item.size);
    const modifiedText = getTimeAgo(item.modified);
    
    if (viewMode === 'grid') {
        element.innerHTML = `
            <div class="file-icon">${item.icon}</div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
            </div>
            <button class="file-menu" onclick="showFileMenu(event, ${item.id})">⋮</button>
        `;
    } else {
        element.innerHTML = `
            <div class="file-icon">${item.icon}</div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
                <div class="file-details">${modifiedText}</div>
            </div>
            <div class="file-size">${sizeText}</div>
            <button class="file-menu" onclick="showFileMenu(event, ${item.id})">⋮</button>
        `;
    }
    
    // Add click handler
    element.addEventListener('click', function(e) {
        if (!e.target.matches('.file-menu')) {
            if (isFolder) {
                openFolder(item.name);
            } else {
                openFile(item.name);
            }
        }
    });
    
    return element;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ora';
    if (minutes < 60) return `${minutes} min fa`;
    if (hours < 24) return `${hours} ora${hours > 1 ? 'e' : ''} fa`;
    if (days === 1) return 'Ieri';
    if (days < 30) return `${days} giorni fa`;
    
    return date.toLocaleDateString('it-IT');
}

function navigateToFolder(path) {
    currentPath = path;
    updateBreadcrumb();
    updateFilesList();
    hapticFeedback('light');
}

function openFolder(folderName) {
    const folder = folders.find(f => f.name === folderName);
    if (!folder) return;
    
    // Add folder navigation animation
    const filesList = document.getElementById('filesList');
    if (filesList) {
        filesList.style.transform = 'translateX(-20px)';
        filesList.style.opacity = '0.7';
        
        setTimeout(() => {
            navigateToFolder(folder.path);
            filesList.style.transform = 'translateX(0)';
            filesList.style.opacity = '1';
        }, 150);
    }
}

function openFile(fileName) {
    const file = files.find(f => f.name === fileName);
    if (!file) return;
    
    // Show file preview or open with appropriate app
    showFilePreview(file);
    hapticFeedback('light');
}

function showFilePreview(file) {
    const previewModal = document.createElement('div');
    previewModal.className = 'file-preview-modal';
    
    let previewContent = '';
    
    switch (file.type) {
        case 'image':
            previewContent = `
                <div class="preview-image">
                    <div class="image-placeholder">${file.icon}</div>
                    <p>Anteprima immagine</p>
                </div>
            `;
            break;
        case 'pdf':
            previewContent = `
                <div class="preview-document">
                    <div class="document-icon">${file.icon}</div>
                    <p>Documento PDF</p>
                    <button onclick="openWithApp('${file.name}')">Apri con lettore PDF</button>
                </div>
            `;
            break;
        case 'audio':
            previewContent = `
                <div class="preview-audio">
                    <div class="audio-icon">${file.icon}</div>
                    <p>File audio</p>
                    <div class="audio-controls">
                        <button onclick="playAudio('${file.name}')">▶️ Riproduci</button>
                    </div>
                </div>
            `;
            break;
        case 'video':
            previewContent = `
                <div class="preview-video">
                    <div class="video-placeholder">${file.icon}</div>
                    <p>File video</p>
                    <button onclick="playVideo('${file.name}')">▶️ Riproduci</button>
                </div>
            `;
            break;
        default:
            previewContent = `
                <div class="preview-generic">
                    <div class="file-icon-large">${file.icon}</div>
                    <p>Anteprima non disponibile</p>
                    <button onclick="openWithApp('${file.name}')">Apri con app predefinita</button>
                </div>
            `;
    }
    
    previewModal.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <h3>${file.name}</h3>
                <button onclick="closeFilePreview()">×</button>
            </div>
            <div class="preview-body">
                ${previewContent}
            </div>
            <div class="preview-footer">
                <div class="file-info-details">
                    <span>Dimensione: ${formatFileSize(file.size)}</span>
                    <span>Modificato: ${file.modified.toLocaleDateString('it-IT')}</span>
                </div>
                <div class="preview-actions">
                    <button onclick="shareFile('${file.name}')">📤 Condividi</button>
                    <button onclick="deleteFile('${file.name}')">🗑️ Elimina</button>
                </div>
            </div>
        </div>
    `;
    
    previewModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(previewModal);
}

function closeFilePreview() {
    const previewModal = document.querySelector('.file-preview-modal');
    if (previewModal) {
        previewModal.remove();
    }
}

function openWithApp(fileName) {
    showToast(`Apertura ${fileName} con app predefinita`);
    closeFilePreview();
}

function playAudio(fileName) {
    showToast(`Riproduzione ${fileName}`);
    // Could integrate with music app
    closeFilePreview();
}

function playVideo(fileName) {
    showToast(`Riproduzione ${fileName}`);
    // Could open video player
    closeFilePreview();
}

function shareFile(fileName) {
    if (navigator.share) {
        navigator.share({
            title: 'Condividi file',
            text: `Condivido il file: ${fileName}`,
            url: window.location.href
        });
    } else {
        showToast('Condivisione file - Funzionalità in arrivo!');
    }
    closeFilePreview();
}

function deleteFile(fileName) {
    if (!confirm(`Eliminare il file "${fileName}"?`)) {
        return;
    }
    
    files = files.filter(f => f.name !== fileName);
    updateFilesList();
    updateStorageInfo();
    closeFilePreview();
    
    showToast('File eliminato');
    hapticFeedback('medium');
}

function showFileMenu(event, itemId) {
    event.stopPropagation();
    
    const item = [...folders, ...files].find(i => i.id === itemId);
    if (!item) return;
    
    const menu = document.createElement('div');
    menu.className = 'file-menu-popup';
    
    const isFolder = item.type === 'folder';
    
    menu.innerHTML = `
        <div class="menu-item" onclick="renameItem(${itemId})">✏️ Rinomina</div>
        <div class="menu-item" onclick="copyItem(${itemId})">📋 Copia</div>
        <div class="menu-item" onclick="moveItem(${itemId})">✂️ Taglia</div>
        ${!isFolder ? '<div class="menu-item" onclick="shareFile(\'' + item.name + '\')">📤 Condividi</div>' : ''}
        <div class="menu-item" onclick="showItemProperties(${itemId})">ℹ️ Proprietà</div>
        <div class="menu-item delete" onclick="deleteItem(${itemId})">🗑️ Elimina</div>
    `;
    
    menu.style.cssText = `
        position: fixed;
        background: var(--card-color);
        border-radius: 8px;
        box-shadow: 0 4px 20px var(--shadow-color);
        z-index: 1000;
        animation: fadeIn 0.2s ease;
        min-width: 180px;
    `;
    
    // Position menu
    const rect = event.target.getBoundingClientRect();
    menu.style.top = (rect.bottom + 5) + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
    
    document.body.appendChild(menu);
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu() {
            menu.remove();
            document.removeEventListener('click', removeMenu);
        });
    }, 100);
}

function renameItem(itemId) {
    const item = [...folders, ...files].find(i => i.id === itemId);
    if (!item) return;
    
    const newName = prompt('Nuovo nome:', item.name);
    if (newName && newName !== item.name) {
        item.name = newName;
        updateFilesList();
        showToast('Elemento rinominato');
    }
}

function copyItem(itemId) {
    showToast('Elemento copiato negli appunti');
}

function moveItem(itemId) {
    showToast('Elemento tagliato - Seleziona destinazione');
}

function showItemProperties(itemId) {
    const item = [...folders, ...files].find(i => i.id === itemId);
    if (!item) return;
    
    const propertiesModal = document.createElement('div');
    propertiesModal.className = 'properties-modal';
    propertiesModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Proprietà</h3>
                <button onclick="closeProperties()">×</button>
            </div>
            <div class="properties-content">
                <div class="property-item">
                    <span class="property-label">Nome:</span>
                    <span class="property-value">${item.name}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Tipo:</span>
                    <span class="property-value">${item.type === 'folder' ? 'Cartella' : 'File'}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Dimensione:</span>
                    <span class="property-value">${item.type === 'folder' ? `${item.items} elementi` : formatFileSize(item.size)}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Modificato:</span>
                    <span class="property-value">${item.modified.toLocaleString('it-IT')}</span>
                </div>
                <div class="property-item">
                    <span class="property-label">Percorso:</span>
                    <span class="property-value">${item.path}</span>
                </div>
            </div>
        </div>
    `;
    
    propertiesModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(propertiesModal);
}

function closeProperties() {
    const propertiesModal = document.querySelector('.properties-modal');
    if (propertiesModal) {
        propertiesModal.remove();
    }
}

function deleteItem(itemId) {
    const item = [...folders, ...files].find(i => i.id === itemId);
    if (!item) return;
    
    if (!confirm(`Eliminare "${item.name}"?`)) {
        return;
    }
    
    if (item.type === 'folder') {
        folders = folders.filter(f => f.id !== itemId);
    } else {
        files = files.filter(f => f.id !== itemId);
    }
    
    updateFilesList();
    updateStorageInfo();
    showToast('Elemento eliminato');
    hapticFeedback('medium');
}

function toggleViewMode() {
    viewMode = viewMode === 'list' ? 'grid' : 'list';
    updateFilesList();
    
    const viewBtn = document.querySelector('.header-actions .header-btn');
    if (viewBtn) {
        viewBtn.textContent = viewMode === 'list' ? '⊞' : '☰';
    }
    
    showToast(`Vista ${viewMode === 'list' ? 'elenco' : 'griglia'}`);
}

function updateStorageInfo() {
    // Calculate storage usage
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalCapacity = 128 * 1024 * 1024 * 1024; // 128GB
    const usedPercentage = (totalSize / totalCapacity) * 100;
    
    const storageUsed = document.querySelector('.storage-used');
    if (storageUsed) {
        storageUsed.style.width = `${Math.min(usedPercentage, 100)}%`;
    }
    
    const storageHeader = document.querySelector('.storage-header');
    if (storageHeader) {
        const spans = storageHeader.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[1].textContent = `${formatFileSize(totalSize)} di ${formatFileSize(totalCapacity)} utilizzati`;
        }
    }
}

// Search functionality
function initializeFileSearch() {
    const searchInput = document.getElementById('fileSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        const fileItems = document.querySelectorAll('.file-item');
        
        fileItems.forEach(item => {
            const fileName = item.querySelector('.file-name').textContent.toLowerCase();
            const shouldShow = fileName.includes(query);
            
            item.style.display = shouldShow ? 'flex' : 'none';
        });
        
        if (query) {
            showToast(`Ricerca: "${query}"`);
        }
    }, 300));
}

// Create new folder
function createNewFolder() {
    const folderName = prompt('Nome della nuova cartella:');
    if (!folderName) return;
    
    const newFolder = {
        id: Date.now(),
        name: folderName,
        path: currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`,
        type: 'folder',
        size: 0,
        items: 0,
        modified: new Date(),
        icon: '📁'
    };
    
    folders.push(newFolder);
    updateFilesList();
    showToast('Cartella creata');
    hapticFeedback('medium');
}

// Initialize file search
document.addEventListener('DOMContentLoaded', initializeFileSearch);

// Add CSS for files-specific styles
const filesStyles = document.createElement('style');
filesStyles.textContent = `
    .file-menu-popup {
        overflow: hidden;
    }
    
    .menu-item {
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 14px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .menu-item:hover {
        background: var(--surface-color);
    }
    
    .menu-item.delete {
        color: var(--oneui-red);
    }
    
    .menu-item.delete:hover {
        background: rgba(244, 67, 54, 0.1);
    }
    
    .file-preview-modal .preview-content {
        background: var(--card-color);
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .preview-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 18px;
    }
    
    .preview-header button {
        background: none;
        border: none;
        font-size: 24px;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    .preview-header button:hover {
        background: var(--surface-color);
    }
    
    .preview-body {
        flex: 1;
        padding: 20px;
        text-align: center;
        overflow-y: auto;
    }
    
    .preview-image,
    .preview-document,
    .preview-audio,
    .preview-video,
    .preview-generic {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }
    
    .image-placeholder,
    .video-placeholder {
        width: 200px;
        height: 150px;
        background: var(--surface-color);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
    }
    
    .document-icon,
    .audio-icon,
    .file-icon-large {
        font-size: 64px;
        margin-bottom: 16px;
    }
    
    .audio-controls {
        display: flex;
        gap: 12px;
    }
    
    .preview-footer {
        padding: 20px;
        border-top: 1px solid var(--divider-color);
        background: var(--surface-color);
    }
    
    .file-info-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        font-size: 14px;
        color: var(--text-secondary);
    }
    
    .preview-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
    }
    
    .preview-actions button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .preview-actions button:hover {
        background: var(--primary-dark);
    }
    
    .properties-content {
        padding: 20px;
    }
    
    .property-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .property-item:last-child {
        border-bottom: none;
    }
    
    .property-label {
        font-weight: 500;
        color: var(--text-secondary);
    }
    
    .property-value {
        color: var(--text-primary);
        text-align: right;
        max-width: 60%;
        word-break: break-word;
    }
    
    .empty-state .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
    }
    
    .empty-state .empty-text {
        font-size: 16px;
        font-weight: 500;
    }
`;

document.head.appendChild(filesStyles);