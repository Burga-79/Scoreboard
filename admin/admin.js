//
// LOAD EXISTING IMAGES
//
function loadImages() {
    fetch("../images/sponsors/")
        .then(() => listImages("sponsors", "sponsorList"));

    fetch("../images/backgrounds/")
        .then(() => listImages("backgrounds", "backgroundList"));
}

//
// LIST IMAGES IN A FOLDER
//
function listImages(folder, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";

    window.fs = window.fs || require("fs");
    window.path = window.path || require("path");

    const dir = window.path.join(__dirname, "..", "images", folder);

    const files = window.fs.readdirSync(dir);

    files.forEach(file => {
        const item = document.createElement("div");
        item.className = "item";

        const img = document.createElement("img");
        img.src = `../images/${folder}/${file}`;

        const removeBtn = document.createElement("button");
        removeBtn.className = "removeBtn";
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => {
            window.fs.unlinkSync(window.path.join(dir, file));
            window.scoreboardAPI.reloadDisplay();
            loadImages();
        };

        item.appendChild(img);
        item.appendChild(removeBtn);
        container.appendChild(item);
    });
}

//
// UPLOAD SPONSOR
//
document.getElementById("uploadSponsorBtn").onclick = () => {
    const fileInput = document.getElementById("sponsorUpload");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("http://localhost:3000/upload/sponsor", {
        method: "POST",
        body: formData
    }).then(() => {
        window.scoreboardAPI.reloadDisplay();
        loadImages();
    });
};

//
// UPLOAD BACKGROUND
//
document.getElementById("uploadBackgroundBtn").onclick = () => {
    const fileInput = document.getElementById("backgroundUpload");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("http://localhost:3000/upload/background", {
        method: "POST",
        body: formData
    }).then(() => {
        window.scoreboardAPI.reloadDisplay();
        loadImages();
    });
};

//
// INITIAL LOAD
//
window.onload = () => {
    loadImages();
};
