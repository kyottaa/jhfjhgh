const songs = [
    {
        path: 'assets/1.mp3',
        displayName: 'Мой калашников',
        cover: 'assets/1.png',
        artist: 'FACE',
    },
    {
        path: 'assets/2.mp3',
        displayName: 'Юморист',
        cover: 'assets/2.png',
        artist: 'FACE',
    },
    {
        path: 'assets/3.mp3',
        displayName: 'Антидепрессант',
        cover: 'assets/3.png',
        artist: 'FACE',
    },
    {
        path: 'assets/8.mp3',
        displayName: 'Девочка с КАРЕ',
        cover: 'assets/8.jpg',
        artist: 'МУККА',
    },
    {
        path: 'assets/14.mp3',
        displayName: 'WHITE',
        cover: 'assets/14.jpeg',
        artist: 'ELVEN DIOR, Tutnstn66',
    },
    {
        path: 'assets/15.mp3',
        displayName: 'Night',
        cover: 'assets/15.jpg',
        artist: 'Autmn Love',
    }
];

const music = new Audio();
let musicIndex = 0;
let isPlaying = false;
let isMuted = false; // Новая переменная для отслеживания состояния звука

const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('music-title');
const artist = document.getElementById('music-artist');
const image = document.getElementById('cover');
const background = document.getElementById('bg-img');
const playerProgress = document.getElementById('player-progress');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const songListContainer = document.getElementById('song-list-container');

const volumeBtn = document.getElementById('volume-btn');

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function showPlayer() {
    const playerContainer = document.getElementById('player-container');
    playerContainer.classList.remove('player-hidden');
    playerContainer.classList.add('player-visible');
    songListContainer.style.display = 'none'; // Скрыть список песен
}

function hidePlayer() {
    const playerContainer = document.getElementById('player-container');
    playerContainer.classList.remove('player-visible');
    playerContainer.classList.add('player-hidden');
    songListContainer.style.display = 'block'; // Показать список песен
}

function updateProgressBar(e) {
    if (isPlaying) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Calculate display for duration
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }

        if (durationSeconds) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }

        // Calculate display for currentTime
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }

        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = music;
    music.currentTime = (clickX / width) * duration;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

document.getElementById('song-list').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'A') {
        const index = e.target.getAttribute('data-index');
        musicIndex = parseInt(index);
        loadMusic(songs[musicIndex]);
        playMusic();
        showPlayer(); // Показать плеер
    }
});

document.getElementById('close').addEventListener('click', () => {
    hidePlayer(); // Скрыть плеер
});

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// Функция переключения звука
function toggleVolume() {
    isMuted = !isMuted; // Переключаем состояние

    if (isMuted) {
        volumeBtn.classList.remove('fa-volume-up');
        volumeBtn.classList.add('fa-volume-mute');
        music.volume = 0; // Установить громкость на 0
    } else {
        volumeBtn.classList.remove('fa-volume-mute');
        volumeBtn.classList.add('fa-volume-up');
        music.volume = 1; // Установить громкость на 100%
    }
}

// Обработчики событий для переключения звука
volumeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Остановить всплытие события
    toggleVolume(); // Вызов функции переключения звука
});

// Добавляем обработчик касания для мобильных устройств
volumeBtn.addEventListener('touchstart', (e) => {
    e.stopPropagation(); // Остановить всплытие события
    toggleVolume(); // Вызов функции переключения звука
});

// Загружаем первую песню
loadMusic(songs[musicIndex]);
