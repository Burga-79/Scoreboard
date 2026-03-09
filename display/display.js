//
// LOAD SPONSORS + BACKGROUNDS
//
const fs = require("fs");
const path = require("path");

const sponsorDir = path.join(__dirname, "..", "images", "sponsors");
const backgroundDir = path.join(__dirname, "..", "images", "backgrounds");

let sponsors = [];
let backgrounds = [];

function loadImages() {
    sponsors = fs.readdirSync(sponsorDir).map(f => `../images/sponsors/${f}`);
    backgrounds = fs.readdirSync(backgroundDir).map(f => `../images/backgrounds/${f}`);
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

    rotateSponsors();
    rotateBackgrounds();

    setInterval(rotateSponsors, 8000);      // Sponsor every 8 seconds
    setInterval(rotateBackgrounds, 15000);  // Background every 15 seconds
};
