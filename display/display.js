const STORAGE_KEY = "cometBayScoreboardData";

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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

  // Club logo
  const clubLogoEl = document.getElementById("clubLogo");
  if (clubLogoEl) {
    const path = data.logos && data.logos.clubLogo
      ? data.logos.clubLogo
      : "http://localhost:3000/images/club-logo.png";

    clubLogoEl.src = path.startsWith("http")
      ? path
      : "http://localhost:3000/" + path;
  }

  // Sponsors
  sponsors = (data.logos && Array.isArray(data.logos.sponsors)
    ? data.logos.sponsors.filter(s => s.enabled).map(s =>
        s.path.startsWith("http")
          ? s.path
          : "http://localhost:3000/" + s.path
      )
    : []);

  // Backgrounds
  backgrounds = (data.backgrounds && Array.isArray(data.backgrounds.images)
    ? data.backgrounds.images.filter(b => b.enabled).map(b =>
        b.path.startsWith("http")
          ? b.path
          : "http://localhost:3000/" + b.path
      )
    : []);

  bgMode = data.backgrounds?.mode || "single";
  bgInterval = (data.backgrounds?.intervalSeconds || 30) * 1000;
  bgOverlay = typeof data.backgrounds?.overlay === "number"
    ? data.backgrounds.overlay
    : 0.4;

  const overlayEl = document.getElementById("backgroundOverlay");
  if (overlayEl) {
    overlayEl.style.background = `rgba(0,0,0,${bgOverlay})`;
  }
}

/* SPONSOR ROTATION */

function rotateSponsors() {
  if (!sponsors.length) return;
  const container = document.getElementById("sponsorsCarousel");
  if (!container) return;

  container.innerHTML = "";
  sponsors.forEach((src, idx) => {
    const img = document.createElement("img");
    img.src = src;
    if (idx === sponsorIndex) {
      img.classList.add("active");
    }
    container.appendChild(img);
  });

  sponsorIndex = (sponsorIndex + 1) % sponsors.length;
}

/* BACKGROUND ROTATION */

function setBackground(path) {
  const bgEl = document.getElementById("backgroundImage");
  if (!bgEl) return;
  bgEl.style.backgroundImage = `url('${path}')`;
}

function rotateBackgrounds() {
  if (!backgrounds.length) return;

  if (bgMode === "single") {
    if (bgIndex === 0) {
      setBackground(backgrounds[0]);
    }
    return;
  }

  if (bgMode === "sequential") {
    setBackground(backgrounds[bgIndex]);
    bgIndex = (bgIndex + 1) % backgrounds.length;
  } else if (bgMode === "random") {
    const next = Math.floor(Math.random() * backgrounds.length);
    setBackground(backgrounds[next]);
  }
}

/* INIT */

window.onload = () => {
  initFromData();

  rotateSponsors();
  rotateBackgrounds();

  setInterval(rotateSponsors, 8000);
  setInterval(rotateBackgrounds, bgInterval);
};
