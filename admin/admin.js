//
// LOAD EXISTING IMAGES
//
function loadImages() {
    listImages("sponsors", "sponsorList");
    listImages("backgrounds", "backgroundList");
}

//
// LIST IMAGES IN A FOLDER
//
function listImages(folder, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";

    fetch(`http://localhost:3000/list/${folder}`)
        .then(res => res.json())
        .then(files => {
            files.forEach(file => {
                const item = document.createElement("div");
                item.className = "item";

                const img = document.createElement("img");
                img.src = `http://localhost:3000/images/${folder}/${file}`;

                const removeBtn = document.createElement("button");
                removeBtn.className = "removeBtn";
                removeBtn.textContent = "Remove";
                removeBtn.onclick = () => {
                    fetch(`http://localhost:3000/delete/${folder}/${file}`, {
                        method: "DELETE"
                    }).then(() => {
                        window.scoreboardAPI.reloadDisplay();
                        loadImages();
                    });
                };

                item.appendChild(img);
                item.appendChild(removeBtn);
                container.appendChild(item);
            });
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
