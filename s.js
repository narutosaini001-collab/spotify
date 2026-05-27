
let mobileAccountBtn = document.querySelector(".mobile-account-btn");
let mobileAccountMenu = document.querySelector(".mobile-account-menu");


let selectedPlaylist = "";
let songs = [];

let defaultPlaylists = [
    {
        name: "Desi",

        image:
            "svgs/skele.jpg",

        songs: [
            {
                name: "Asla",
                url: "songs/Desi/Asla.mp3",
                artist: "RUDRA"
            },
            {
                name: "Bairi",
                url: "songs/Desi/Bairi.mp3",
                artist: "RUDRA"
            },
            {
                name: "Falani",
                url: "songs/Desi/Falani.mp3",
                artist: "RUDRA"
            },
            {
                name: "Financer",
                url: "songs/Desi/Financer.mp3",
                artist: "RUDRA"
            },
            {
                name: "GAADI150",
                url: "songs/Desi/GAADI150.mp3",
                artist: "RUDRA"
            },
            {
                name: "Hopeless",
                url: "songs/Desi/Hopeless.mp3",
                artist: "RUDRA"
            }
        ]
    }
];

let userPlaylists =
    JSON.parse(localStorage.getItem("playlists")) || [];

let playlists =
    [...defaultPlaylists, ...userPlaylists];

let contextMenu = document.querySelector(".context-menu");
let deletePlaylistOption = document.querySelector(".delete-playlist-option");
let removeSongOption = document.querySelector(".remove-song-option");
let selectedPlaylistIndex = null;
let selectedSongIndex = null;


const cards = document.querySelector(".cards");
const leftBtn = document.querySelector(".scroll-left");
const rightBtn = document.querySelector(".scroll-right");

let overlay = document.querySelector(".overlay");
let hamburger = document.querySelector(".hamburger");
let leftSidebar = document.querySelector(".left");
hamburger.addEventListener("click", () => {
    leftSidebar.classList.toggle("show");
    overlay.classList.toggle("show");
});
overlay.addEventListener("click", () => {
    leftSidebar.classList.remove("show");
    overlay.classList.remove("show");
});

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

function playMusic(index) {
    currentIndex = index;
    currentSong.src = songs[index].url;
    currentSong.play();
}



function attachSongListeners() {
    let allSongs = document.querySelectorAll(".library ul li")
    let player = document.querySelector(".player");

    allSongs.forEach((li, index) => {
        let button = li.querySelector(".logo button");
        button.addEventListener("click", () => {
            playMusic(index);
            player.classList.add("show");
            let play = document.querySelector("#play img");
            play.src = "svgs/pause.svg";

        });

        li.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            selectedSongIndex = index;
            selectedPlaylistIndex = null;
            contextMenu.style.display = "flex";
            contextMenu.style.left = event.clientX + "px";
            contextMenu.style.top = event.clientY + "px";
            deletePlaylistOption.style.display = "none";
            removeSongOption.style.display = "block";
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

                if (window.innerWidth <= 900) {
                    leftSidebar.classList.add("show");
                    overlay.classList.add("show");
                }
            };
            card.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                selectedPlaylistIndex =
                    [...document.querySelectorAll(".song-card")]
                        .indexOf(card);
                selectedSongIndex = null;
                contextMenu.style.display = "flex";
                contextMenu.style.left = event.clientX + "px";
                contextMenu.style.top = event.clientY + "px";
                deletePlaylistOption.style.display = "block";
                removeSongOption.style.display = "none";
            });
        });
}


async function getfolder() {
    let plist = document.querySelector(".cards");
    plist.innerHTML = "";

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
        document.querySelector(".time").innerText = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
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
        localStorage.setItem(
            "playlists",
            JSON.stringify(userPlaylists)
        );
        attachSongListeners()
    });

}
getfolder()


let modal = document.querySelector(".playlist-modal");
let openBtn = document.querySelector(".playlist-add-btn");
openBtn.addEventListener("click", () => {
    modal.classList.add("show");
});
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});

document.getElementById("createPlaylistBtn")
    .addEventListener("click", () => {
        let name = document.getElementById("playlistName").value;
        if (!name.trim()) {alert("Enter playlist name");return;};

        let artist = document.getElementById("playlistArtist").value;
        let imageInput = document.getElementById("playlistImage");
        let image = imageInput.files[0];
        let imageURL = image ? URL.createObjectURL(image) : "svgs/skele.jpg";

        let playlist = {
            name: name,
            artist: artist,
            image: imageURL,
            songs: []
        };

        playlists.push(playlist);

        userPlaylists.push(playlist);

        localStorage.setItem(
            "playlists",
            JSON.stringify(userPlaylists)
        );

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


let searchBtn = document.querySelector(".mobile-search-btn");
let searchOverlay = document.querySelector(".search-overlay");
let closeSearch = document.querySelector(".close-search");

searchBtn.addEventListener("click", () => {
    searchOverlay.classList.add("show");
});

closeSearch.addEventListener("click", () => {
    searchOverlay.classList.remove("show");
});


document.addEventListener("click", () => {
    contextMenu.style.display = "none";
});

deletePlaylistOption.addEventListener("click", () => {
    if (
        selectedPlaylistIndex < defaultPlaylists.length
    ) {
        alert("Default playlist can't be deleted");
        return;
    }
    playlists.splice(selectedPlaylistIndex, 1);
    userPlaylists.splice(
        selectedPlaylistIndex -
        defaultPlaylists.length,
        1
    );
    localStorage.setItem(
        "playlists",
        JSON.stringify(userPlaylists)
    );
    getfolder();
    contextMenu.style.display = "none";
});

removeSongOption.addEventListener("click", () => {
    if (selectedSongIndex === null) return;
    let currentPlaylist =
        playlists.find(
            p => p.name === selectedPlaylist
        );
    currentPlaylist.songs.splice(
        selectedSongIndex,
        1
    );
    let songul = document.querySelector(".library ul");
    songul.innerHTML = "";
    for (const song of currentPlaylist.songs) {
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
    songs = currentPlaylist.songs;
    attachSongListeners();
    contextMenu.style.display = "none";
});


mobileAccountBtn.addEventListener("click", () => {
    mobileAccountMenu.classList.toggle("show");
});
document.addEventListener("click", (e) => {
    if (
        !mobileAccountMenu.contains(e.target)
        &&
        !mobileAccountBtn.contains(e.target)
    ) {
        mobileAccountMenu.classList.remove("show");
    }
});