// === Danh sách nhạc mặc định ===
const musicList_music = [
  {
    title: "Aura Power",
    author: "Phonk",
    img: "originos_data/Music/aura_power.png",
    src: "originos_data/Music/phonk/Aura Power - phonk.mp3",
  },
  {
    title: "HEADPHONK",
    author: "Phonk",
    img: "originos_data/Music/headphonk.png",
    src: "originos_data/Music/phonk/HEADPHONK - phonk.mp3",
  },
  {
    title: "Dark Heart",
    author: "Ambient",
    img: "originos_data/Music/dark_heart.png",
    src: "originos_data/Music/ambient/Dark Heart - ambient.mp3",
  },
  {
    title: "Atmospheric Guitar",
    author: "Electric",
    img: "originos_data/Music/atmospheric_guitar.png",
    src: "originos_data/Music/eletric/Atmospheric Guitar - electric.mp3",
  },
  {
    title: "Machine",
    author: "Electric",
    img: "originos_data/Music/machine.png",
    src: "originos_data/Music/eletric/Machine -electric.mp3",
  },
  {
    title: "Happy",
    author: "Pop",
    img: "originos_data/Music/happy.png",
    src: "originos_data/Music/pop/Happy - pop.mp3",
  },
];

let customTracks_music = []; // danh sách bài người dùng chọn
let isPlaying_music = false;
updateActionsMap();
let currentIndex_music = 0;

const playlist_music = document.getElementById("playlist_music");
const popup_music = document.getElementById("playerPopup_music");
const popupImage_music = document.getElementById("popupImage_music");
const popupTitle_music = document.getElementById("popupTitle_music");
const popupAuthor_music = document.getElementById("popupAuthor_music");
const popupTitle_music2 = document.getElementById("popupTitle_music2");
const popupAuthor_music2 = document.getElementById("popupAuthor_music2");
const audioPlayer_music = document.getElementById("audioPlayer_music");
const playPauseIcon_music = document.getElementById("playPauseIcon_music");
const playPauseIcon_music2 = document.getElementById("playPauseIcon_music2");
const progressBar_music = document.getElementById("progressBar_music");
const progressBar_music2 = document.getElementById("progressBar_music2");

function updatePlaylist_music() {
  playlist_music.innerHTML = "";
  [...musicList_music, ...customTracks_music].forEach((track, index) => {
    const trackDiv = document.createElement("div");
    trackDiv.className = "track_music";
    trackDiv.onclick = () => playTrack_music(index);
    trackDiv.innerHTML = `
      <img src="${track.img}" alt="Art">
      <div class="track-info_music">
        <div class="track-title_music">${track.title}</div>
        <div class="track-author_music">${track.author}</div>
      </div>`;
    playlist_music.appendChild(trackDiv);
  });

  set_dark_mode(dark_mode);
}

function playTrack_music(index) {
  const allTracks = [...musicList_music, ...customTracks_music];
  const track = allTracks[index];
  currentIndex_music = index;

  popupImage_music.src = track.img;
  popupTitle_music.textContent = track.title;
  popupAuthor_music.textContent = track.author;
  popupTitle_music2.textContent = track.title;
  popupAuthor_music2.textContent = track.author;
  document.querySelector(
    ".image_island_right2"
  ).style.backgroundImage = `url('${track.img}')`;
  document.querySelector(
    ".island_circle_img"
  ).style.backgroundImage = `url('${track.img}')`;

  audioPlayer_music.src = track.src;
  audioPlayer_music.play();
  playPauseIcon_music.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M556.67-200v-560h170v560h-170Zm-323.34 0v-560h170v560h-170Z"/></svg>`;
  playPauseIcon_music2.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M556.67-200v-560h170v560h-170Zm-323.34 0v-560h170v560h-170Z"/></svg>`;
  popup_music.style.display = "flex";
  showPopup_open_close(playerPopup_music);
  playlist_music.style.height = "28vh";
  isPlaying_music = true;
  updateActionsMap();

  audioPlayer_music.onended = () => nextTrack_music();
}

function togglePlay_music() {
  if (audioPlayer_music.paused) {
    audioPlayer_music.play();
    playPauseIcon_music.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>
`;
    playPauseIcon_music2.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M548.22-174v-612h214v612h-214Zm-350.44 0v-612h214v612h-214Z"/></svg>
`;

    isPlaying_music = true;
  } else {
    audioPlayer_music.pause();
    playPauseIcon_music.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
    playPauseIcon_music2.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
    isPlaying_music = false;
  }
  updateActionsMap();
}

function nextTrack_music() {
  const total = musicList_music.length + customTracks_music.length;
  currentIndex_music = (currentIndex_music + 1) % total;
  playTrack_music(currentIndex_music);
}

function prevTrack_music() {
  const total = musicList_music.length + customTracks_music.length;
  currentIndex_music = (currentIndex_music - 1 + total) % total;
  playTrack_music(currentIndex_music);
}

audioPlayer_music.ontimeupdate = () => {
  const percent =
    (audioPlayer_music.currentTime / audioPlayer_music.duration) * 100;
  progressBar_music.value = percent || 0;
  progressBar_music2.value = percent || 0;
};

progressBar_music.oninput = () => {
  audioPlayer_music.currentTime =
    (progressBar_music.value / 100) * audioPlayer_music.duration;
};
progressBar_music2.oninput = () => {
  audioPlayer_music.currentTime =
    (progressBar_music2.value / 100) * audioPlayer_music.duration;
};

function closePlayer_music() {
  audioPlayer_music.pause();
  audioPlayer_music.currentTime = 0;
  hidePopup_open_close(playerPopup_music);
  playlist_music.style.height = "60vh";
  playPauseIcon_music.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="gray"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
  isPlaying_music = false;
  updateActionsMap();
}

function openFilePicker_music() {
  const input = document.getElementById("fileInput_music");
  input.value = "";
  input.click();
}

document
  .getElementById("fileInput_music")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    jsmediatags.read(file, {
      onSuccess: function (tag) {
        const tags = tag.tags;
        const title = tags.title || file.name.replace(/\.[^/.]+$/, "");
        const artist = tags.artist || "Unknown Artist";

        let imgUrl = "https://i.imgur.com/svQHjVl.jpg";
        if (tags.picture) {
          const { data, format } = tags.picture;
          const byteArray = new Uint8Array(data);
          const blob = new Blob([byteArray], { type: format });
          imgUrl = URL.createObjectURL(blob);
        }

        const newTrack = { title, author: artist, img: imgUrl, src: url };

        if (customTracks_music.length >= 3) {
          customTracks_music.shift();
        }
        customTracks_music.push(newTrack);

        updatePlaylist_music();
        playTrack_music(musicList_music.length + customTracks_music.length - 1);
      },
      onError: function () {
        const fallbackTrack = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          author: "Local",
          img: "https://i.imgur.com/svQHjVl.jpg",
          src: url,
        };
        if (customTracks_music.length >= 3) {
          customTracks_music.shift();
        }
        customTracks_music.push(fallbackTrack);

        updatePlaylist_music();
        playTrack_music(musicList_music.length + customTracks_music.length - 1);
      },
    });
  });

// Khởi tạo giao diện ban đầu
updatePlaylist_music();

function playmusic(url, volume = 1.0) {
  if (volume == 0) return; // không phát nếu âm lượng bằng 0

  const container = document.createElement("div");
  container.style.display = "none";

  const audio = document.createElement("audio");
  audio.src = url;
  audio.loop = false;
  audio.autoplay = true;
  audio.volume = Math.min(volume, 1);

  const cleanup = () => {
    audio.removeEventListener("ended", cleanup);
    container.remove();
  };

  audio.addEventListener("ended", cleanup);

  container.appendChild(audio);
  document.body.appendChild(container);
}

window.addEventListener("click", () => {
  playmusic("originos_data/ui/Effect_Tick.ogg", volume_click_volume);
});
