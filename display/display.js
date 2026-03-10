const STORAGE_KEY = "cometBayScoreboardData";

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

let sponsors = [];
let backgrounds = [];
let bgMode = "single";
let bgInterval = 30000;
let bgOverlay = 0.4;
let bgIndex = 0;
let sponsorIndex = 0;

function initFromData() {
  const data = loadData();
  if (!data) return;

  // Logo
  const clubLogoEl = document.getElementById("clubLogo");
  if (clubLogoEl) {
    const path = data.logos.clubLogo
      ? "http://localhost:3000/" + data.logos.clubLogo
      : "http://localhost:3000/images/club-logo.png";
    clubLogoEl.src = path;
  }

  // Sponsors
  sponsors = data.logos.sponsors
    .filter(s => s.enabled)
    .map(s => "http://localhost:3000/" + s.path);

  // Backgrounds
  backgrounds = data.backgrounds.images
    .filter(b => b.enabled)
    .map(b => "http://localhost:3000/" + b.path);

  bgMode = data.backgrounds.mode;
  bgInterval = data.backgrounds.intervalSeconds * 1000;
  bgOverlay = data.backgrounds.overlay;

  const overlay = document.getElementById("backgroundOverlay");
  if (overlay) {
    overlay.style.background = `rgba(0,0,0,${bgOverlay})`;
  }

  // Results
  const resultsEl = document.getElementById("resultsContainer");
  resultsEl.innerHTML = `
    <div class="result-line">${data.results.teamA}: ${data.results.scoreA}</div>
    <div class="result-line">${data.results.teamB}: ${data.results.scoreB}</div>
  `;
}

function rotateSponsors() {
  if (!sponsors.length) return;
  const container = document.getElementById("sponsorsCarousel");
  if (!container) return;
  container.innerHTML = `<img src="${sponsors[sponsorIndex]}" class="active">`;
  sponsorIndex = (sponsorIndex + 1) % sponsors.length;
}

function setBackground(path) {
  const bgEl = document.getElementById("backgroundImage");
  if (!bgEl) return;
  bgEl.style.backgroundImage = `url('${path}')`;
}

function rotateBackgrounds() {
  if (!backgrounds.length) return;

  if (bgMode === "single") {
    setBackground(backgrounds[0]);
    return;
  }

  if (bgMode === "sequential") {
    setBackground(backgrounds[bgIndex]);
    bgIndex = (bgIndex + 1) % backgrounds.length;
  }

  if (bgMode === "random") {
    const next = Math.floor(Math.random() * backgrounds.length);
    setBackground(backgrounds[next]);
  }
}

window.onload = () => {
  initFromData();
  rotateSponsors();
  rotateBackgrounds();
  setInterval(rotateSponsors, 8000);
  setInterval(rotateBackgrounds, bgInterval);
};
