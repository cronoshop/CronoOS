// Gallery App JavaScript - CronoOS 2.3

let photos = [];
let albums = [];
let selectedPhotos = new Set();
let isSelectionMode = false;
let currentPhotoIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryApp();
    loadPhotos();
    loadAlbums();
    setupEventListeners();
    setupTabSwitching();
});

function initializeGalleryApp() {
    console.log('Gallery app initialized');
}

function loadPhotos() {
    // Load photos from localStorage (saved by camera app)
    const savedPhotos = JSON.parse(localStorage.getItem('cronos_gallery_photos') || '[]');
    
    // Add some sample photos if none exist
    if (savedPhotos.length === 0) {
        photos = generateSamplePhotos();
    } else {
        photos = savedPhotos;
    }
    
    renderPhotos();
    updatePhotosCount();
}

function generateSamplePhotos() {
    const samplePhotos = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    for (let i = 0; i < 12; i++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 300, 300);
        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(1, colors[(i + 1) % colors.length]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 300);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px -apple-system';
        ctx.textAlign = 'center';
        ctx.fillText(`Foto ${i + 1}`, 150, 150);
        
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        samplePhotos.push({
            id: Date.now() + i,
            dataUrl: canvas.toDataURL('image/jpeg', 0.8),
            timestamp: date.toISOString(),
            type: 'photo',
            name: `IMG_${String(i + 1).padStart(4, '0')}.jpg`
        });
    }
    
    return samplePhotos;
}

function loadAlbums() {
    albums = [
        {
            id: 1,
            name: 'Recenti',
            count: photos.length,
            cover: photos[0]?.dataUrl || null,
            photos: photos
        },
        {
            id: 2,
            name: 'Preferiti',
            count: 0,
            cover: null,
            photos: []
        },
        {
            id: 3,
            name: 'Screenshot',
            count: 0,
            cover: null,
            photos: []
        },
        {
            id: 4,
            name: 'Selfie',
            count: 0,
            cover: null,
            photos: []
        }
    ];
    
    renderAlbums();
}

function renderPhotos() {
    const photosGrid = document.getElementById('photosGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    
    if (photos.length === 0) {
        photosGrid.style.display = 'none';
        emptyGallery.style.display = 'flex';
        return;
    }
    
    photosGrid.style.display = 'grid';
    emptyGallery.style.display = 'none';
    photosGrid.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, index);
        photosGrid.appendChild(photoElement);
    });
}

function createPhotoElement(photo, index) {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.dataset.photoId = photo.id;
    div.dataset.photoIndex = index;
    
    const date = new Date(photo.timestamp);
    const formattedDate = date.toLocaleDateString('it-IT');
    
    div.innerHTML = `
        <img src="${photo.dataUrl}" alt="${photo.name || 'Foto'}" loading="lazy">
        <div class="photo-overlay">
            <div class="photo-date">${formattedDate}</div>
        </div>
        <div class="photo-info">
            <div class="photo-name">${photo.name || `Foto ${index + 1}`}</div>
            <div class="photo-date">${formattedDate}</div>
        </div>
    `;
    
    div.addEventListener('click', (e) => {
        if (isSelectionMode) {
            togglePhotoSelection(photo.id, div);
        } else {
            openPhotoViewer(index);
        }
    });
    
    return div;
}

function renderAlbums() {
    const albumsGrid = document.getElementById('albumsGrid');
    albumsGrid.innerHTML = '';
    
    albums.forEach(album => {
        const albumElement = createAlbumElement(album);
        albumsGrid.appendChild(albumElement);
    });
}

function createAlbumElement(album) {
    const div = document.createElement('div');
    div.className = 'album-item';
    div.dataset.albumId = album.id;
    
    div.innerHTML = `
        <div class="album-cover">
            ${album.cover ? `<img src="${album.cover}" alt="${album.name}">` : '<i class="fas fa-images"></i>'}
        </div>
        <div class="album-info">
            <div class="album-name">${album.name}</div>
            <div class="album-count">${album.count} ${album.count === 1 ? 'elemento' : 'elementi'}</div>
        </div>
    `;
    
    div.addEventListener('click', () => openAlbum(album));
    
    return div;
}

function setupEventListeners() {
    // Select button
    document.getElementById('selectBtn').addEventListener('click', toggleSelectionMode);
    
    // View options
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Selection actions
    document.getElementById('shareSelectedBtn').addEventListener('click', shareSelected);
    document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelected);
    
    // Photo viewer
    document.getElementById('viewerCloseBtn').addEventListener('click', closePhotoViewer);
    document.getElementById('prevPhotoBtn').addEventListener('click', showPreviousPhoto);
    document.getElementById('nextPhotoBtn').addEventListener('click', showNextPhoto);
    document.getElementById('viewerShareBtn').addEventListener('click', shareCurrentPhoto);
    document.getElementById('viewerDeleteBtn').addEventListener('click', deleteCurrentPhoto);
}

function setupTabSwitching() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabName);
    });
    
    // Exit selection mode when switching tabs
    if (isSelectionMode) {
        toggleSelectionMode();
    }
}

function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    const selectBtn = document.getElementById('selectBtn');
    const selectionFooter = document.getElementById('selectionFooter');
    
    selectBtn.textContent = isSelectionMode ? 'Annulla' : 'Seleziona';
    selectionFooter.classList.toggle('active', isSelectionMode);
    
    if (!isSelectionMode) {
        // Clear selections
        selectedPhotos.clear();
        document.querySelectorAll('.photo-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        updateSelectionCount();
    }
}

function togglePhotoSelection(photoId, element) {
    if (selectedPhotos.has(photoId)) {
        selectedPhotos.delete(photoId);
        element.classList.remove('selected');
    } else {
        selectedPhotos.add(photoId);
        element.classList.add('selected');
    }
    
    updateSelectionCount();
}

function updateSelectionCount() {
    const selectedCount = document.getElementById('selectedCount');
    const count = selectedPhotos.size;
    selectedCount.textContent = `${count} ${count === 1 ? 'selezionato' : 'selezionati'}`;
}

function switchView(viewType) {
    const photosGrid = document.getElementById('photosGrid');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewType);
    });
    
    photosGrid.classList.toggle('list-view', viewType === 'list');
}

function updatePhotosCount() {
    const photosCount = document.getElementById('photosCount');
    const count = photos.length;
    photosCount.textContent = `${count} ${count === 1 ? 'elemento' : 'elementi'}`;
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    if (!query) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>Cerca nelle tue foto</p>
            </div>
        `;
        return;
    }
    
    const filteredPhotos = photos.filter(photo => {
        const name = photo.name || '';
        const date = new Date(photo.timestamp).toLocaleDateString('it-IT');
        return name.toLowerCase().includes(query) || date.includes(query);
    });
    
    if (filteredPhotos.length === 0) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>Nessun risultato per "${query}"</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = '<div class="photos-grid"></div>';
    const resultsGrid = searchResults.querySelector('.photos-grid');
    
    filteredPhotos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, photos.indexOf(photo));
        resultsGrid.appendChild(photoElement);
    });
}

function openPhotoViewer(index) {
    currentPhotoIndex = index;
    const modal = document.getElementById('photoViewerModal');
    const viewerImage = document.getElementById('viewerImage');
    const photoIndex = document.getElementById('photoIndex');
    const photoDetails = document.getElementById('photoDetails');
    
    const photo = photos[index];
    viewerImage.src = photo.dataUrl;
    photoIndex.textContent = `${index + 1} di ${photos.length}`;
    
    const date = new Date(photo.timestamp);
    photoDetails.querySelector('.photo-date').textContent = date.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    modal.classList.add('active');
    
    // Update navigation buttons
    document.getElementById('prevPhotoBtn').style.display = index > 0 ? 'block' : 'none';
    document.getElementById('nextPhotoBtn').style.display = index < photos.length - 1 ? 'block' : 'none';
}

function closePhotoViewer() {
    const modal = document.getElementById('photoViewerModal');
    modal.classList.remove('active');
}

function showPreviousPhoto() {
    if (currentPhotoIndex > 0) {
        openPhotoViewer(currentPhotoIndex - 1);
    }
}

function showNextPhoto() {
    if (currentPhotoIndex < photos.length - 1) {
        openPhotoViewer(currentPhotoIndex + 1);
    }
}

function shareSelected() {
    const count = selectedPhotos.size;
    showToast(`Condivisione di ${count} ${count === 1 ? 'foto' : 'foto'}...`);
    
    setTimeout(() => {
        showToast('Foto condivise!');
        toggleSelectionMode();
    }, 1500);
}

function deleteSelected() {
    const count = selectedPhotos.size;
    
    if (confirm(`Eliminare ${count} ${count === 1 ? 'foto' : 'foto'}?`)) {
        // Remove selected photos
        photos = photos.filter(photo => !selectedPhotos.has(photo.id));
        
        // Update localStorage
        localStorage.setItem('cronos_gallery_photos', JSON.stringify(photos));
        
        // Re-render
        renderPhotos();
        updatePhotosCount();
        loadAlbums(); // Update album counts
        
        showToast(`${count} ${count === 1 ? 'foto eliminata' : 'foto eliminate'}`);
        toggleSelectionMode();
    }
}

function shareCurrentPhoto() {
    showToast('Condivisione foto...');
    setTimeout(() => {
        showToast('Foto condivisa!');
    }, 1500);
}

function deleteCurrentPhoto() {
    if (confirm('Eliminare questa foto?')) {
        const photoToDelete = photos[currentPhotoIndex];
        photos = photos.filter(photo => photo.id !== photoToDelete.id);
        
        // Update localStorage
        localStorage.setItem('cronos_gallery_photos', JSON.stringify(photos));
        
        // Close viewer and re-render
        closePhotoViewer();
        renderPhotos();
        updatePhotosCount();
        loadAlbums();
        
        showToast('Foto eliminata');
    }
}

function openAlbum(album) {
    showToast(`Apertura album: ${album.name}`);
    // Here you could implement album-specific view
}