// Gallery App JavaScript - One UI OS

let photos = [];
let albums = [];
let currentPhotoIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryApp();
    loadPhotos();
    loadAlbums();
});

function initializeGalleryApp() {
    // Initialize with sample data
    generateSamplePhotos();
    generateSampleAlbums();
    
    updatePhotosGrid();
    updateAlbumsGrid();
    
    console.log('Gallery app initialized');
}

function generateSamplePhotos() {
    const photoEmojis = ['🌅', '🏔️', '🌸', '🌊', '🌙', '🌺', '🌻', '🌈', '🌲', '🏖️', '🌄', '🌇'];
    
    photos = photoEmojis.map((emoji, index) => ({
        id: index + 1,
        emoji: emoji,
        name: `IMG_${(index + 1).toString().padStart(3, '0')}.jpg`,
        date: new Date(Date.now() - (index * 86400000)), // Each photo is 1 day older
        size: Math.floor(Math.random() * 3000000) + 1000000, // 1-4MB
        album: index < 4 ? 'recenti' : ['preferiti', 'vacanze', 'famiglia'][Math.floor(Math.random() * 3)]
    }));
}

function generateSampleAlbums() {
    albums = [
        {
            id: 'recenti',
            name: 'Recenti',
            emoji: '📱',
            count: photos.filter(p => p.album === 'recenti').length,
            photos: photos.filter(p => p.album === 'recenti')
        },
        {
            id: 'preferiti',
            name: 'Preferiti',
            emoji: '⭐',
            count: photos.filter(p => p.album === 'preferiti').length,
            photos: photos.filter(p => p.album === 'preferiti')
        },
        {
            id: 'vacanze',
            name: 'Vacanze',
            emoji: '🏖️',
            count: photos.filter(p => p.album === 'vacanze').length,
            photos: photos.filter(p => p.album === 'vacanze')
        },
        {
            id: 'famiglia',
            name: 'Famiglia',
            emoji: '👨‍👩‍👧‍👦',
            count: photos.filter(p => p.album === 'famiglia').length,
            photos: photos.filter(p => p.album === 'famiglia')
        }
    ];
}

function loadPhotos() {
    // In a real app, this would load from storage
    updatePhotosGrid();
}

function loadAlbums() {
    // In a real app, this would load from storage
    updateAlbumsGrid();
}

function updatePhotosGrid() {
    const photosGrid = document.querySelector('.photos-grid');
    if (!photosGrid) return;
    
    photosGrid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, index);
        photosGrid.appendChild(photoElement);
    });
}

function createPhotoElement(photo, index) {
    const element = document.createElement('div');
    element.className = 'photo-item';
    element.onclick = () => openPhoto(index);
    
    const timeAgo = getTimeAgo(photo.date);
    
    element.innerHTML = `
        <div class="photo-placeholder">${photo.emoji}</div>
        <div class="photo-overlay">
            <div class="photo-date">${timeAgo}</div>
        </div>
    `;
    
    // Add staggered animation
    element.style.animationDelay = `${index * 0.05}s`;
    element.classList.add('fade-in');
    
    return element;
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) return 'Oggi';
    if (days === 1) return 'Ieri';
    if (days < 7) return `${days} giorni fa`;
    if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
    return `${Math.floor(days / 30)} mesi fa`;
}

function updateAlbumsGrid() {
    const albumsGrid = document.querySelector('.albums-grid');
    if (!albumsGrid) return;
    
    albumsGrid.innerHTML = '';
    
    albums.forEach((album, index) => {
        const albumElement = createAlbumElement(album, index);
        albumsGrid.appendChild(albumElement);
    });
}

function createAlbumElement(album, index) {
    const element = document.createElement('div');
    element.className = 'album-item';
    element.onclick = () => openAlbum(album.id);
    
    element.innerHTML = `
        <div class="album-cover">${album.emoji}</div>
        <div class="album-info">
            <div class="album-name">${album.name}</div>
            <div class="album-count">${album.count} foto</div>
        </div>
    `;
    
    // Add staggered animation
    element.style.animationDelay = `${index * 0.1}s`;
    element.classList.add('fade-in');
    
    return element;
}

function openPhoto(index) {
    currentPhotoIndex = index;
    const photo = photos[index];
    
    const photoViewer = document.getElementById('photoViewer');
    const photoDisplay = document.getElementById('photoDisplay');
    
    if (photoViewer && photoDisplay) {
        // Update photo display
        photoDisplay.innerHTML = `<div class="photo-placeholder large">${photo.emoji}</div>`;
        
        // Update photo info
        updatePhotoInfo(photo);
        
        // Show viewer
        photoViewer.style.display = 'flex';
        photoViewer.classList.add('active');
        
        // Add swipe gestures
        initializePhotoSwipe();
    }
    
    hapticFeedback('light');
}

function updatePhotoInfo(photo) {
    const photoTitle = document.querySelector('.photo-title');
    const photoMetadata = document.querySelector('.photo-metadata');
    
    if (photoTitle) {
        photoTitle.textContent = photo.name;
    }
    
    if (photoMetadata) {
        const dateString = photo.date.toLocaleDateString('it-IT');
        const timeString = photo.date.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const sizeString = formatFileSize(photo.size);
        
        photoMetadata.textContent = `${dateString} alle ${timeString} • ${sizeString}`;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function closePhotoViewer() {
    const photoViewer = document.getElementById('photoViewer');
    
    if (photoViewer) {
        photoViewer.classList.remove('active');
        setTimeout(() => {
            photoViewer.style.display = 'none';
        }, 300);
    }
}

function initializePhotoSwipe() {
    const photoViewer = document.getElementById('photoViewer');
    if (!photoViewer) return;
    
    let startX = 0;
    let startY = 0;
    
    photoViewer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    photoViewer.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Horizontal swipe (next/previous photo)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextPhoto();
            } else {
                previousPhoto();
            }
        }
        
        // Vertical swipe down (close viewer)
        if (diffY < -100 && Math.abs(diffX) < 50) {
            closePhotoViewer();
        }
    });
    
    // Mouse wheel for desktop
    photoViewer.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            nextPhoto();
        } else {
            previousPhoto();
        }
    });
}

function nextPhoto() {
    if (currentPhotoIndex < photos.length - 1) {
        currentPhotoIndex++;
        updatePhotoViewer();
        hapticFeedback('light');
    }
}

function previousPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updatePhotoViewer();
        hapticFeedback('light');
    }
}

function updatePhotoViewer() {
    const photo = photos[currentPhotoIndex];
    const photoDisplay = document.getElementById('photoDisplay');
    
    if (photoDisplay) {
        // Add slide animation
        photoDisplay.style.opacity = '0';
        photoDisplay.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            photoDisplay.innerHTML = `<div class="photo-placeholder large">${photo.emoji}</div>`;
            updatePhotoInfo(photo);
            
            photoDisplay.style.opacity = '1';
            photoDisplay.style.transform = 'scale(1)';
        }, 150);
    }
}

function openAlbum(albumId) {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    
    // Filter photos for this album
    const albumPhotos = photos.filter(p => p.album === albumId);
    
    // Create album view
    showAlbumView(album, albumPhotos);
    
    hapticFeedback('light');
}

function showAlbumView(album, albumPhotos) {
    const albumView = document.createElement('div');
    albumView.className = 'album-view';
    albumView.innerHTML = `
        <div class="album-header">
            <button class="back-btn" onclick="closeAlbumView()">←</button>
            <div class="album-title">
                <h2>${album.name}</h2>
                <p>${albumPhotos.length} foto</p>
            </div>
            <button class="album-menu-btn">⋮</button>
        </div>
        <div class="album-photos-grid" id="albumPhotosGrid">
            <!-- Photos will be inserted here -->
        </div>
    `;
    
    albumView.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background-color);
        z-index: 1500;
        animation: slideInRight 0.3s ease;
        overflow-y: auto;
    `;
    
    document.body.appendChild(albumView);
    
    // Populate album photos
    const albumPhotosGrid = document.getElementById('albumPhotosGrid');
    if (albumPhotosGrid) {
        albumPhotosGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 2px;
            padding: 16px;
        `;
        
        albumPhotos.forEach((photo, index) => {
            const photoElement = createPhotoElement(photo, photos.indexOf(photo));
            albumPhotosGrid.appendChild(photoElement);
        });
    }
}

function closeAlbumView() {
    const albumView = document.querySelector('.album-view');
    if (albumView) {
        albumView.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => albumView.remove(), 300);
    }
}

// Photo actions
function initializePhotoActions() {
    // Add to favorites
    window.addToFavorites = function() {
        const photo = photos[currentPhotoIndex];
        if (photo.album !== 'preferiti') {
            photo.album = 'preferiti';
            showToast('Aggiunto ai preferiti');
            updateAlbumsGrid();
        } else {
            showToast('Già nei preferiti');
        }
    };
    
    // Share photo
    window.sharePhoto = function() {
        if (navigator.share) {
            navigator.share({
                title: 'Condividi foto',
                text: 'Guarda questa foto!',
                url: window.location.href
            });
        } else {
            showToast('Condivisione - Funzionalità in arrivo!');
        }
    };
    
    // Delete photo
    window.deletePhoto = function() {
        if (confirm('Eliminare questa foto?')) {
            photos.splice(currentPhotoIndex, 1);
            
            if (currentPhotoIndex >= photos.length) {
                currentPhotoIndex = photos.length - 1;
            }
            
            if (photos.length === 0) {
                closePhotoViewer();
            } else {
                updatePhotoViewer();
            }
            
            updatePhotosGrid();
            updateAlbumsGrid();
            showToast('Foto eliminata');
        }
    };
    
    // Edit photo
    window.editPhoto = function() {
        showPhotoEditor();
    };
}

function showPhotoEditor() {
    const photo = photos[currentPhotoIndex];
    
    const editorModal = document.createElement('div');
    editorModal.className = 'photo-editor-modal';
    editorModal.innerHTML = `
        <div class="editor-content">
            <div class="editor-header">
                <button onclick="closePhotoEditor()">Annulla</button>
                <h3>Modifica</h3>
                <button onclick="savePhotoEdit()">Salva</button>
            </div>
            <div class="editor-preview">
                <div class="photo-placeholder large" id="editorPreview">${photo.emoji}</div>
            </div>
            <div class="editor-controls">
                <div class="editor-tool">
                    <label>Luminosità</label>
                    <input type="range" min="-50" max="50" value="0" oninput="applyFilter('brightness', this.value)">
                </div>
                <div class="editor-tool">
                    <label>Contrasto</label>
                    <input type="range" min="-50" max="50" value="0" oninput="applyFilter('contrast', this.value)">
                </div>
                <div class="editor-tool">
                    <label>Saturazione</label>
                    <input type="range" min="-50" max="50" value="0" oninput="applyFilter('saturate', this.value)">
                </div>
            </div>
        </div>
    `;
    
    editorModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background-color);
        z-index: 2000;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(editorModal);
}

function closePhotoEditor() {
    const editorModal = document.querySelector('.photo-editor-modal');
    if (editorModal) {
        editorModal.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => editorModal.remove(), 300);
    }
}

function applyFilter(type, value) {
    const preview = document.getElementById('editorPreview');
    if (!preview) return;
    
    let filter = '';
    const normalizedValue = parseFloat(value);
    
    switch (type) {
        case 'brightness':
            filter = `brightness(${1 + normalizedValue / 100})`;
            break;
        case 'contrast':
            filter = `contrast(${1 + normalizedValue / 100})`;
            break;
        case 'saturate':
            filter = `saturate(${1 + normalizedValue / 100})`;
            break;
    }
    
    preview.style.filter = filter;
}

function savePhotoEdit() {
    showToast('Modifiche salvate');
    closePhotoEditor();
}

// Initialize photo actions
document.addEventListener('DOMContentLoaded', initializePhotoActions);

// Search functionality
function initializePhotoSearch() {
    // This would implement photo search by date, location, etc.
    console.log('Photo search initialized');
}

// Slideshow functionality
function startSlideshow() {
    if (photos.length === 0) return;
    
    const slideshowInterval = setInterval(() => {
        nextPhoto();
        
        // Stop at the end
        if (currentPhotoIndex >= photos.length - 1) {
            clearInterval(slideshowInterval);
            showToast('Slideshow terminato');
        }
    }, 3000);
    
    showToast('Slideshow avviato');
    
    // Add stop button
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Ferma Slideshow';
    stopButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 24px;
        z-index: 2001;
    `;
    
    stopButton.onclick = () => {
        clearInterval(slideshowInterval);
        stopButton.remove();
        showToast('Slideshow fermato');
    };
    
    document.body.appendChild(stopButton);
}

// Add CSS for gallery animations
const galleryStyles = document.createElement('style');
galleryStyles.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease forwards;
        opacity: 0;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .album-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: var(--card-color);
        border-bottom: 1px solid var(--divider-color);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .album-title h2 {
        margin: 0;
        font-size: 20px;
        color: var(--text-primary);
    }
    
    .album-title p {
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary);
    }
    
    .album-menu-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .album-menu-btn:hover {
        background: var(--surface-color);
    }
    
    .editor-content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: var(--card-color);
        border-bottom: 1px solid var(--divider-color);
    }
    
    .editor-header button {
        background: none;
        border: none;
        color: var(--primary-color);
        font-size: 16px;
        cursor: pointer;
        padding: 8px;
    }
    
    .editor-header h3 {
        margin: 0;
        font-size: 18px;
        color: var(--text-primary);
    }
    
    .editor-preview {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface-color);
    }
    
    .editor-controls {
        padding: 20px;
        background: var(--card-color);
        border-top: 1px solid var(--divider-color);
    }
    
    .editor-tool {
        margin-bottom: 20px;
    }
    
    .editor-tool label {
        display: block;
        font-size: 14px;
        color: var(--text-primary);
        margin-bottom: 8px;
    }
    
    .editor-tool input[type="range"] {
        width: 100%;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
    }
    
    .editor-tool input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
    }
`;

document.head.appendChild(galleryStyles);