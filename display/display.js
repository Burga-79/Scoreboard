let sponsors = [];
let backgrounds = [];

//
// LOAD IMAGES FROM SERVER
//
function loadImages() {
    // Load sponsors
    fetch("http://localhost:3000/list/sponsors")
        .then(res => res.json())
        .then(files => {
            sponsors = files.map(f => `http://localhost:3000/images/sponsors/${f}`);
        });

    // Load backgrounds
    fetch("http://localhost:3000/list/backgrounds")
        .then(res => res.json())
        .then(files => {
            backgrounds = files.map(f => `http://localhost:3000/images/backgrounds/${f}`);
        });
}

//
// ROTATE SPONSORS
//
let sponsorIndex = 0;

function rotateSponsors() {
    if (sponsors.length === 0) return;

    const img = document.getElementById("sponsorImage");
    img.src = sponsors[sponsorIndex];

    sponsorIndex = (sponsorIndex + 1) % sponsors.length;
}

//
// ROTATE BACKGROUNDS
//
let bgIndex = 0;

function rotateBackgrounds() {
    if (backgrounds.length === 0) return;

    const bg = document.getElementById("background");
    bg.style.opacity = 0;

    setTimeout(() => {
        bg.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
        bg.style.opacity = 1;
    }, 500);

    bgIndex = (bgIndex + 1) % backgrounds.length;
}

//
// INITIALISE
//
window.onload = () => {
    loadImages();

    setTimeout(() => {
        rotateSponsors();
        rotateBackgrounds();

        setInterval(rotateSponsors, 8000);
        setInterval(rotateBackgrounds, 15000);
    }, 500);
};
