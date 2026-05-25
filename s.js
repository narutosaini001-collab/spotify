
let selectedPlaylist = "";
let currfolder;
let playlists = [];
let songs = [];


const cards = document.querySelector(".cards");
const leftBtn = document.querySelector(".scroll-left");
const rightBtn = document.querySelector(".scroll-right");


function updateButtons() {
    const hasScroll =
        cards.scrollWidth > cards.clientWidth;

    if (!hasScroll) {
        leftBtn.classList.remove("show");
        rightBtn.classList.remove("show");
        return;
    }


    if (cards.scrollLeft > 0) { leftBtn.classList.add("show"); }
    else { leftBtn.classList.remove("show"); }

    if (cards.scrollLeft + cards.clientWidth < cards.scrollWidth - 1) { rightBtn.classList.add("show"); }
    else { rightBtn.classList.remove("show"); }
}


window.addEventListener("load", updateButtons);
cards.addEventListener("scroll", updateButtons);
window.addEventListener("resize", updateButtons);

rightBtn.addEventListener("click", () => {
    cards.scrollLeft += 400;
});

leftBtn.addEventListener("click", () => {
    cards.scrollLeft -= 400;
});


let currentIndex = 0;
let currentSong = new Audio();


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://10.191.54.203:3002/spotify/songs/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i]; if (element.href.endsWith(".mp3")) {
            let song = element.href.replace("%5Cspotify%5Csongs%5C", "songs/");
            let songName = decodeURIComponent(song);
            songName = songName.split(/[/\\]/).pop();
            songName = songName.replace(".mp3", "");
            songs.push({
                name: songName,
                url: song,
                artist: "RUDRA"
            });
        }
    }
    return songs
}



function playMusic(index) {
    currentIndex = index;
    currentSong.src = songs[index].url;
    currentSong.play();
}



function attachSongListeners() {
    let allSongs = document.querySelectorAll(".library .logo button");
    let player = document.querySelector(".player");

    allSongs.forEach((e, index) => {
        e.addEventListener("click", () => {
            playMusic(index);
            player.classList.add("show");
            let play = document.querySelector("#play img");
            play.src = "svgs/pause.svg";
        });
    });
}


function attachPlaylistListeners() {
    document.querySelectorAll(".song-card")
        .forEach(card => {
            card.onclick = async () => {
                let folder = card.querySelector("h3").innerText;
                selectedPlaylist = folder;
                let currentPlaylist = playlists.find(p => p.name === folder);
                if (currentPlaylist.songs.length === 0) {
                    currentPlaylist.songs = await getSongs(folder);
                }
                songs = currentPlaylist.songs;

                let songul = document.querySelector(".library ul");
                songul.innerHTML = "";
                for (const song of songs) {
                    songul.innerHTML += `
                <li>
                    <div class="name">
                        <div class="song">
                            ${song.name}
                        </div>
                        <div class="artist">
                            ${song.artist}
                        </div>
                    </div>
                    <div class="logo">
                        <button>
                            <img src="svgs/music.svg">
                        </button>
                    </div>
                </li>`;
                }
                attachSongListeners();
            };
        });
}



async function getfolder() {
    let f = await fetch("http://10.191.54.203:3002/spotify/songs/")
    let result = await f.text();


    let pl = document.createElement("div")
    pl.innerHTML = result;

    let fs = pl.getElementsByTagName("a");

    for (let i = 0; i < fs.length; i++) {
        const elem = fs[i]; if (!elem.text.startsWith("..")) {
            let playlist = elem.text.replace("/", "");
            playlists.push({
                name: playlist,
                image:
                    "https://i.scdn.co/image/ab67616d00001e026b328f3c847bee898e384488",
                songs: []
            });
        }
    }


    let plist = document.querySelector(".cards")
    for (const playlist of playlists) {
        plist.innerHTML = plist.innerHTML + `<div class="song-card">
                        <div class="image-container">
                            <img src="${playlist.image}">
                            <button class="play-btn">
                                <svg viewBox="0 0 24 24" class="play-icon">
                                    <path d="M8 5.14v14l11-7z"></path>
                                </svg>
                            </button>
                        </div>
                        <h3>${playlist.name}</h3>
                        <p>RUDRA</p>
                    </div>` ;
    }
    attachPlaylistListeners()


    document.getElementById("play")
        .addEventListener("click", () => {

            let play = document.querySelector("#play img");

            if (currentSong.paused) {
                currentSong.play();
                play.src = "svgs/pause.svg";
            }
            else {
                currentSong.pause();
                play.src = "svgs/play.svg";
            }
        });

    document.getElementById("prev")
        .addEventListener("click", () => {
            if (currentIndex > 0) { playMusic(currentIndex - 1); }
            else { playMusic(currentIndex) }
            let play = document.querySelector("#play img");
            play.src = "svgs/pause.svg";
        });

    document.getElementById("next")
        .addEventListener("click", () => {
            if (currentIndex < songs.length - 1) { playMusic(currentIndex + 1); }
            else { playMusic(currentIndex) }
            let play = document.querySelector("#play img");
            play.src = "svgs/pause.svg";
        });

    currentSong.addEventListener("ended", () => {
        if (currentIndex < songs.length - 1) { playMusic(currentIndex + 1); }
        else { playMusic(0); }
    });


    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        let mins = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        secs = secs < 10 ? "0" + secs : secs;
        return `${mins}:${secs}`;
    }

    let seekbar = document.querySelector(".seekbar");
    let circle = document.querySelector(".circle");

    currentSong.addEventListener("timeupdate", () => {
        let percent = currentSong.currentTime / currentSong.duration * 100;
        circle.style.left = percent + "%";
        document.querySelector(".time").innerText = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    });

    let seek = document.querySelector(".seekbar");
    seek.addEventListener("click", (e) => {
        currentSong.currentTime = e.offsetX / seek.offsetWidth * currentSong.duration;
    });


    let playerps = document.querySelector(".player")
    document.getElementById("close")
        .addEventListener("click", () => {
            currentSong.pause();
            currentSong.currentTime = 0;
            playerps.classList.remove("show");
        });


    let addSongBtn = document.querySelector(".plus-btn");
    let songInput = document.getElementById("songInput");
    addSongBtn.addEventListener("click", () => {
        if (!selectedPlaylist) {
            alert("Select playlist first");
            return;
        }
        songInput.click();
    });

    songInput.addEventListener("change", (e) => {
        let files = [...e.target.files];
        let songul = document.querySelector(".library ul");

        for (const file of files) {
            let songURL = URL.createObjectURL(file);
            let currentPlaylist = playlists.find(p => p.name === selectedPlaylist);
            currentPlaylist.songs.push({
                name: file.name.replace(/\.[^/.]+$/, ""),
                url: songURL,
                artist: "Local File"
            });
            songul.innerHTML += `
                <li>
                    <div class="name">
                        <div class="song">
                            ${file.name.replace(/\.[^/.]+$/, "")}
                        </div>
                        <div class="artist">
                            Local File
                        </div>
                    </div>
                    <div class="logo">
                        <button>
                            <img src="svgs/music.svg">
                        </button>
                    </div>
                </li>`;
        }
        attachSongListeners()
    });

}
getfolder()


let modal = document.querySelector(".playlist-modal");
let openBtn = document.querySelector(".playlist-add-btn");
openBtn.addEventListener("click", () => {
    modal.classList.add("show");
});

document.getElementById("createPlaylistBtn")
    .addEventListener("click", () => {
        let name = document.getElementById("playlistName").value;
        let artist = document.getElementById("playlistArtist").value;
        let imageInput = document.getElementById("playlistImage");
        let image = imageInput.files[0];
        let imageURL = image ? URL.createObjectURL(image) : "https://i.scdn.co/image/ab67616d00001e026b328f3c847bee898e384488";

        let playlist = {
            name: name,
            artist: artist,
            image: imageURL,
            songs: []
        };
        playlists.push(playlist);

        let plist = document.querySelector(".cards");
        plist.innerHTML += `
            <div class="song-card">
                <div class="image-container">
                    <img src="${imageURL}">
                    <button class="play-btn">
                        <svg viewBox="0 0 24 24" class="play-icon">
                            <path d="M8 5.14v14l11-7z"></path>
                        </svg>
                    </button>
                </div>
                <h3>${name}</h3>
                <p>${artist || "Custom Playlist"}</p>
            </div>
            `;
        updateButtons();
        attachPlaylistListeners();
        modal.classList.remove("show");
    });



