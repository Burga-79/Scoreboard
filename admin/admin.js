const STORAGE_KEY = "cometBayScoreboardData";

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {
    logos: { clubLogo: "", sponsors: [] },
    backgrounds: { images: [], mode: "single", intervalSeconds: 30, overlay: 0.4 },
    results: { teamA: "", teamB: "", scoreA: 0, scoreB: 0 }
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const data = loadData();

/* NAV */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-section");
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(`section-${target}`).classList.add("active");
  });
});

/* CLUB LOGO */
document.getElementById("uploadClubLogo").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("http://localhost:3000/upload/sponsor", { method: "POST", body: form });
  const json = await res.json();
  data.logos.clubLogo = json.path;
  saveData(data);
  render();
});

/* SPONSORS */
document.getElementById("uploadSponsor").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("http://localhost:3000/upload/sponsor", { method: "POST", body: form });
  const json = await res.json();
  data.logos.sponsors.push({ path: json.path, enabled: true });
  saveData(data);
  render();
});

/* BACKGROUNDS */
document.getElementById("uploadBackground").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("http://localhost:3000/upload/background", { method: "POST", body: form });
  const json = await res.json();
  data.backgrounds.images.push({ path: json.path, enabled: true });
  saveData(data);
  render();
});

/* RESULTS */
document.getElementById("saveResults").addEventListener("click", () => {
  data.results.teamA = document.getElementById("teamA").value;
  data.results.teamB = document.getElementById("teamB").value;
  data.results.scoreA = Number(document.getElementById("scoreA").value || 0);
  data.results.scoreB = Number(document.getElementById("scoreB").value || 0);
  saveData(data);
});

/* SAVE & REFRESH */
document.getElementById("saveAll").addEventListener("click", () => {
  data.backgrounds.mode = document.getElementById("bgMode").value;
  data.backgrounds.intervalSeconds = Number(document.getElementById("bgInterval").value || 30);
  data.backgrounds.overlay = Number(document.getElementById("bgOverlay").value || 0.4);
  saveData(data);
  if (window.electronAPI && window.electronAPI.reloadDisplay) {
    window.electronAPI.reloadDisplay();
  }
});

/* RENDER */
function render() {
  // Logo
  const logoPrev = document.getElementById("clubLogoPreview");
  logoPrev.innerHTML = data.logos.clubLogo
    ? `<img src="http://localhost:3000/${data.logos.clubLogo}" class="thumb">`
    : `<div class="placeholder">No logo set</div>`;

  // Sponsors
  const sponsorList = document.getElementById("sponsorList");
  sponsorList.innerHTML = "";
  data.logos.sponsors.forEach(s => {
    const img = document.createElement("img");
    img.src = "http://localhost:3000/" + s.path;
    img.className = "thumb";
    sponsorList.appendChild(img);
  });

  // Backgrounds
  const bgList = document.getElementById("backgroundList");
  bgList.innerHTML = "";
  data.backgrounds.images.forEach(b => {
    const img = document.createElement("img");
    img.src = "http://localhost:3000/" + b.path;
    img.className = "thumb";
    bgList.appendChild(img);
  });

  // Results
  document.getElementById("teamA").value = data.results.teamA;
  document.getElementById("teamB").value = data.results.teamB;
  document.getElementById("scoreA").value = data.results.scoreA;
  document.getElementById("scoreB").value = data.results.scoreB;

  // Background settings
  document.getElementById("bgMode").value = data.backgrounds.mode;
  document.getElementById("bgInterval").value = data.backgrounds.intervalSeconds;
  document.getElementById("bgOverlay").value = data.backgrounds.overlay;
}

render();
