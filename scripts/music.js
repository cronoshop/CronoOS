// Music App JavaScript - One UI OS

let songs = [];
let playlists = [];
let artists = [];
let currentSong = null;
let isPlaying = false;
let currentPlaylist = [];
let currentIndex = 0;
let isShuffled = false;
let repeatMode = 'none'; // 'none', 'one', 'all'

document.addEventListener('DOMContentLoaded', function() {
    initializeMusicApp();
    loadMusicLibrary();
    initializePlayer();
});

function initializeMusicApp() {
    generateSampleMusic();
    updateSongsList();
    updatePlaylistsGrid();
    updateArtistsList();
    
    console.log('Music app initialized');
}

function generateSampleMusic() {
    songs = [
        {
            id: 1,
            title: 'Bohemian Rhapsody',
            artist: 'Queen',
            album: 'A Night at the Opera',
            duration: 355, // seconds
            emoji: '🎵',
            genre: 'Rock'
        },
        {
            id: 2,
            title: 'Imagine',
            artist: 'John Lennon',
            album: 'Imagine',
            duration: 187,
            emoji: '🎼',
            genre: 'Pop'
        },
        {
            id: 3,
            title: 'Hotel California',
            artist: 'Eagles',
            album: 'Hotel California',
            duration: 390,
            emoji: '🦅',
            genre: 'Rock'
        },
        {
            id: 4,
            title: 'Stairway to Heaven',
            artist: 'Led Zeppelin',
            album: 'Led Zeppelin IV',
            duration: 482,
            emoji: '🎸',
            genre: 'Rock'
        },
        {
            id: 5,
            title: 'Billie Jean',
            artist: 'Michael Jackson',
            album: 'Thriller',
            duration: 294,
            emoji: '🕺',
            genre: 'Pop'
        }
    ];
    
    playlists = [
        {
            id: 1,
            name: 'Preferiti',
            emoji: '❤️',
            songs: [1, 2, 5],
            count: 3
        },
        {
            id: 2,
            name: 'Rock Classico',
            emoji: '🎸',
            songs: [1, 3, 4],
            count: 3
        },
        {
            id: 3,
            name: 'Relax',
            emoji: '🧘',
            songs: [2],
            count: 1
        }
    ];
    
    artists = [
        {
            id: 1,
            name: 'Queen',
            songs: songs.filter(s => s.artist === 'Queen').length,
            avatar: 'Q'
        },
        {
            id: 2,
            name: 'John Lennon',
            songs: songs.filter(s => s.artist === 'John Lennon').length,
            avatar: 'J'
        },
        {
            id: 3,
            name: 'Eagles',
            songs: songs.filter(s => s.artist === 'Eagles').length,
            avatar: 'E'
        },
        {
            id: 4,
            name: 'Led Zeppelin',
            songs: songs.filter(s => s.artist === 'Led Zeppelin').length,
            avatar: 'L'
        },
        {
            id: 5,
            name: 'Michael Jackson',
            songs: songs.filter(s => s.artist === 'Michael Jackson').length,
            avatar: 'M'
        }
    ];
}

function updateSongsList() {
    const songsList = document.querySelector('.songs-list');
    if (!songsList) return;
    
    songsList.innerHTML = '';
    
    songs.forEach(song => {
        const songElement = createSongElement(song);
        songsList.appendChild(songElement);
    });
}

function createSongElement(song) {
    const element = document.createElement('div');
    element.className = 'song-item';
    if (currentSong && currentSong.id === song.id) {
        element.classList.add('playing');
    }
    
    element.onclick = () => playSong(song.title, song.artist);
    
    element.innerHTML = `
        <div class="song-cover">${song.emoji}</div>
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
        <div class="song-duration">${formatDuration(song.duration)}</div>
        <button class="song-menu" onclick="showSongMenu(event, ${song.id})">⋮</button>
    `;
    
    return element;
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlaylistsGrid() {
    const playlistsGrid = document.querySelector('.playlists-grid');
    if (!playlistsGrid) return;
    
    playlistsGrid.innerHTML = '';
    
    playlists.forEach(playlist => {
        const playlistElement = createPlaylistElement(playlist);
        playlistsGrid.appendChild(playlistElement);
    });
}

function createPlaylistElement(playlist) {
    const element = document.createElement('div');
    element.className = 'playlist-item';
    element.onclick = () => openPlaylist(playlist.name);
    
    element.innerHTML = `
        <div class="playlist-cover">${playlist.emoji}</div>
        <div class="playlist-info">
            <div class="playlist-name">${playlist.name}</div>
            <div class="playlist-count">${playlist.count} brani</div>
        </div>
    `;
    
    return element;
}

function updateArtistsList() {
    const artistsList = document.querySelector('.artists-list');
    if (!artistsList) return;
    
    artistsList.innerHTML = '';
    
    artists.forEach(artist => {
        const artistElement = createArtistElement(artist);
        artistsList.appendChild(artistElement);
    });
}

function createArtistElement(artist) {
    const element = document.createElement('div');
    element.className = 'artist-item';
    element.onclick = () => openArtist(artist.name);
    
    element.innerHTML = `
        <div class="artist-avatar">${artist.avatar}</div>
        <div class="artist-info">
            <div class="artist-name">${artist.name}</div>
            <div class="artist-songs">${artist.songs} brani</div>
        </div>
    `;
    
    return element;
}

function playSong(title, artist) {
    const song = songs.find(s => s.title === title && s.artist === artist);
    if (!song) return;
    
    currentSong = song;
    isPlaying = true;
    
    // Update UI
    updateNowPlayingBar();
    updateSongsList();
    updatePlayerUI();
    
    // Show now playing bar
    showNowPlayingBar();
    
    // Simulate playback
    simulatePlayback();
    
    hapticFeedback('light');
    showToast(`In riproduzione: ${title}`);
}

function updateNowPlayingBar() {
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');
    const nowPlayingArtist = document.getElementById('nowPlayingArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (currentSong) {
        if (nowPlayingTitle) nowPlayingTitle.textContent = currentSong.title;
        if (nowPlayingArtist) nowPlayingArtist.textContent = currentSong.artist;
        if (playPauseBtn) playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
    }
}

function showNowPlayingBar() {
    const nowPlayingBar = document.getElementById('nowPlayingBar');
    if (nowPlayingBar) {
        nowPlayingBar.style.display = 'flex';
    }
}

function togglePlayPause() {
    if (!currentSong) return;
    
    isPlaying = !isPlaying;
    updateNowPlayingBar();
    updatePlayerUI();
    
    const action = isPlaying ? 'Riproduzione' : 'Pausa';
    showToast(action);
    hapticFeedback('light');
}

function nextSong() {
    if (currentPlaylist.length === 0) {
        // Create playlist from all songs
        currentPlaylist = [...songs];
        currentIndex = currentPlaylist.findIndex(s => s.id === currentSong?.id) || 0;
    }
    
    if (isShuffled) {
        currentIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
        currentIndex = (currentIndex + 1) % currentPlaylist.length;
    }
    
    const nextSong = currentPlaylist[currentIndex];
    playSong(nextSong.title, nextSong.artist);
}

function previousSong() {
    if (currentPlaylist.length === 0) {
        currentPlaylist = [...songs];
        currentIndex = currentPlaylist.findIndex(s => s.id === currentSong?.id) || 0;
    }
    
    if (isShuffled) {
        currentIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
        currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    }
    
    const prevSong = currentPlaylist[currentIndex];
    playSong(prevSong.title, prevSong.artist);
}

function openPlayer() {
    if (!currentSong) return;
    
    const fullPlayer = document.getElementById('fullPlayer');
    if (fullPlayer) {
        fullPlayer.style.display = 'flex';
        updatePlayerUI();
    }
}

function closePlayer() {
    const fullPlayer = document.getElementById('fullPlayer');
    if (fullPlayer) {
        fullPlayer.style.display = 'none';
    }
}

function updatePlayerUI() {
    const playerSongTitle = document.getElementById('playerSongTitle');
    const playerArtistName = document.getElementById('playerArtistName');
    const playPauseLarge = document.querySelector('.play-pause-large');
    
    if (currentSong) {
        if (playerSongTitle) playerSongTitle.textContent = currentSong.title;
        if (playerArtistName) playerArtistName.textContent = currentSong.artist;
        if (playPauseLarge) playPauseLarge.textContent = isPlaying ? '⏸️' : '▶️';
    }
}

function initializePlayer() {
    // Initialize progress bar interaction
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seekToPosition(percent);
        });
    }
    
    // Initialize volume controls (if implemented)
    initializeVolumeControls();
}

function seekToPosition(percent) {
    if (!currentSong) return;
    
    const newTime = currentSong.duration * percent;
    updateProgressBar(percent);
    
    showToast(`Posizione: ${formatDuration(Math.floor(newTime))}`);
}

function updateProgressBar(percent) {
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    
    if (progressFill) {
        progressFill.style.width = `${percent * 100}%`;
    }
    
    if (progressHandle) {
        progressHandle.style.left = `${percent * 100}%`;
    }
}

function simulatePlayback() {
    if (!currentSong || !isPlaying) return;
    
    let currentTime = 0;
    const duration = currentSong.duration;
    
    const playbackInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(playbackInterval);
            return;
        }
        
        currentTime++;
        const progress = currentTime / duration;
        
        updateProgressBar(progress);
        updateTimeDisplay(currentTime, duration);
        
        if (currentTime >= duration) {
            clearInterval(playbackInterval);
            handleSongEnd();
        }
    }, 1000);
}

function updateTimeDisplay(currentTime, duration) {
    const progressTimes = document.querySelectorAll('.progress-time');
    if (progressTimes.length >= 2) {
        progressTimes[0].textContent = formatDuration(currentTime);
        progressTimes[1].textContent = formatDuration(duration);
    }
}

function handleSongEnd() {
    switch (repeatMode) {
        case 'one':
            // Repeat current song
            playSong(currentSong.title, currentSong.artist);
            break;
        case 'all':
            // Play next song
            nextSong();
            break;
        default:
            // Stop playback
            isPlaying = false;
            updateNowPlayingBar();
            updatePlayerUI();
    }
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    const shuffleBtn = document.querySelector('.player-control-btn');
    
    if (shuffleBtn) {
        shuffleBtn.style.opacity = isShuffled ? '1' : '0.5';
    }
    
    showToast(isShuffled ? 'Riproduzione casuale attivata' : 'Riproduzione casuale disattivata');
}

function toggleRepeat() {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentModeIndex + 1) % modes.length];
    
    const repeatTexts = {
        'none': 'Ripetizione disattivata',
        'all': 'Ripeti tutto',
        'one': 'Ripeti brano'
    };
    
    showToast(repeatTexts[repeatMode]);
}

function openPlaylist(playlistName) {
    const playlist = playlists.find(p => p.name === playlistName);
    if (!playlist) return;
    
    // Get songs in playlist
    const playlistSongs = songs.filter(s => playlist.songs.includes(s.id));
    
    // Show playlist view
    showPlaylistView(playlist, playlistSongs);
}

function showPlaylistView(playlist, playlistSongs) {
    const playlistView = document.createElement('div');
    playlistView.className = 'playlist-view';
    playlistView.innerHTML = `
        <div class="playlist-header">
            <button class="back-btn" onclick="closePlaylistView()">←</button>
            <div class="playlist-info">
                <div class="playlist-cover-large">${playlist.emoji}</div>
                <div class="playlist-details">
                    <h2>${playlist.name}</h2>
                    <p>${playlistSongs.length} brani</p>
                </div>
            </div>
            <button class="play-all-btn" onclick="playPlaylist(${playlist.id})">▶️ Riproduci tutto</button>
        </div>
        <div class="playlist-songs" id="playlistSongs">
            <!-- Songs will be inserted here -->
        </div>
    `;
    
    playlistView.style.cssText = `
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
    
    document.body.appendChild(playlistView);
    
    // Populate playlist songs
    const playlistSongsContainer = document.getElementById('playlistSongs');
    if (playlistSongsContainer) {
        playlistSongs.forEach(song => {
            const songElement = createSongElement(song);
            playlistSongsContainer.appendChild(songElement);
        });
    }
}

function closePlaylistView() {
    const playlistView = document.querySelector('.playlist-view');
    if (playlistView) {
        playlistView.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => playlistView.remove(), 300);
    }
}

function playPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    const playlistSongs = songs.filter(s => playlist.songs.includes(s.id));
    if (playlistSongs.length === 0) return;
    
    currentPlaylist = playlistSongs;
    currentIndex = 0;
    
    const firstSong = playlistSongs[0];
    playSong(firstSong.title, firstSong.artist);
    
    closePlaylistView();
}

function openArtist(artistName) {
    const artistSongs = songs.filter(s => s.artist === artistName);
    
    // Show artist view similar to playlist view
    showArtistView(artistName, artistSongs);
}

function showArtistView(artistName, artistSongs) {
    const artistView = document.createElement('div');
    artistView.className = 'artist-view';
    artistView.innerHTML = `
        <div class="artist-header">
            <button class="back-btn" onclick="closeArtistView()">←</button>
            <div class="artist-info">
                <div class="artist-avatar-large">${artistName.charAt(0)}</div>
                <div class="artist-details">
                    <h2>${artistName}</h2>
                    <p>${artistSongs.length} brani</p>
                </div>
            </div>
            <button class="play-all-btn" onclick="playArtistSongs('${artistName}')">▶️ Riproduci tutto</button>
        </div>
        <div class="artist-songs" id="artistSongs">
            <!-- Songs will be inserted here -->
        </div>
    `;
    
    artistView.style.cssText = `
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
    
    document.body.appendChild(artistView);
    
    // Populate artist songs
    const artistSongsContainer = document.getElementById('artistSongs');
    if (artistSongsContainer) {
        artistSongs.forEach(song => {
            const songElement = createSongElement(song);
            artistSongsContainer.appendChild(songElement);
        });
    }
}

function closeArtistView() {
    const artistView = document.querySelector('.artist-view');
    if (artistView) {
        artistView.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => artistView.remove(), 300);
    }
}

function playArtistSongs(artistName) {
    const artistSongs = songs.filter(s => s.artist === artistName);
    if (artistSongs.length === 0) return;
    
    currentPlaylist = artistSongs;
    currentIndex = 0;
    
    const firstSong = artistSongs[0];
    playSong(firstSong.title, firstSong.artist);
    
    closeArtistView();
}

function showSongMenu(event, songId) {
    event.stopPropagation();
    
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    const menu = document.createElement('div');
    menu.className = 'song-menu-popup';
    menu.innerHTML = `
        <div class="menu-item" onclick="addToPlaylist(${songId})">➕ Aggiungi a playlist</div>
        <div class="menu-item" onclick="addToQueue(${songId})">📋 Aggiungi alla coda</div>
        <div class="menu-item" onclick="shareSong(${songId})">📤 Condividi</div>
        <div class="menu-item" onclick="showSongInfo(${songId})">ℹ️ Informazioni</div>
    `;
    
    menu.style.cssText = `
        position: fixed;
        background: var(--card-color);
        border-radius: 8px;
        box-shadow: 0 4px 20px var(--shadow-color);
        z-index: 1000;
        animation: fadeIn 0.2s ease;
        min-width: 200px;
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

function addToPlaylist(songId) {
    showToast('Aggiungi a playlist - Funzionalità in arrivo!');
}

function addToQueue(songId) {
    showToast('Aggiunto alla coda');
}

function shareSong(songId) {
    const song = songs.find(s => s.id === songId);
    if (song && navigator.share) {
        navigator.share({
            title: song.title,
            text: `Ascolta "${song.title}" di ${song.artist}`,
            url: window.location.href
        });
    } else {
        showToast('Condivisione - Funzionalità in arrivo!');
    }
}

function showSongInfo(songId) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    const infoModal = document.createElement('div');
    infoModal.className = 'song-info-modal';
    infoModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Informazioni Brano</h3>
                <button onclick="closeSongInfo()">×</button>
            </div>
            <div class="song-info-details">
                <div class="info-row">
                    <span class="info-label">Titolo:</span>
                    <span class="info-value">${song.title}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Artista:</span>
                    <span class="info-value">${song.artist}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Album:</span>
                    <span class="info-value">${song.album}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Durata:</span>
                    <span class="info-value">${formatDuration(song.duration)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Genere:</span>
                    <span class="info-value">${song.genre}</span>
                </div>
            </div>
        </div>
    `;
    
    infoModal.style.cssText = `
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
    
    document.body.appendChild(infoModal);
}

function closeSongInfo() {
    const infoModal = document.querySelector('.song-info-modal');
    if (infoModal) {
        infoModal.remove();
    }
}

function initializeVolumeControls() {
    // Volume control would be implemented here
    console.log('Volume controls initialized');
}

// Add CSS for music-specific styles
const musicStyles = document.createElement('style');
musicStyles.textContent = `
    .song-menu-popup {
        overflow: hidden;
    }
    
    .menu-item {
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 14px;
        color: var(--text-primary);
    }
    
    .menu-item:hover {
        background: var(--surface-color);
    }
    
    .menu-item:first-child {
        border-radius: 8px 8px 0 0;
    }
    
    .menu-item:last-child {
        border-radius: 0 0 8px 8px;
    }
    
    .playlist-header,
    .artist-header {
        padding: 20px;
        background: linear-gradient(135deg, var(--oneui-purple), var(--oneui-blue));
        color: white;
    }
    
    .playlist-cover-large,
    .artist-avatar-large {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        margin-bottom: 16px;
    }
    
    .playlist-details h2,
    .artist-details h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
    }
    
    .playlist-details p,
    .artist-details p {
        margin: 0;
        opacity: 0.8;
    }
    
    .play-all-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 16px;
        transition: background-color 0.2s ease;
    }
    
    .play-all-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .song-info-details {
        padding: 20px;
    }
    
    .info-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .info-row:last-child {
        border-bottom: none;
    }
    
    .info-label {
        font-weight: 500;
        color: var(--text-secondary);
    }
    
    .info-value {
        color: var(--text-primary);
    }
`;

document.head.appendChild(musicStyles);