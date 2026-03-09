// Handles uploads and passes new paths into script-admin.js

function uploadFile(inputId, url, onDone) {
  const input = document.getElementById(inputId);
  if (!input || !input.files || !input.files.length) {
    alert("Please choose a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", input.files[0]);

  fetch(url, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(body => {
      if (!body || !body.path) {
        alert("Upload failed.");
        return;
      }
      // body.path is like "images/sponsors/filename.png"
      const fullPath = `http://localhost:3000/${body.path}`;
      onDone(fullPath);
      input.value = "";
    })
    .catch(() => {
      alert("Upload failed (network error).");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const sponsorBtn = document.getElementById("uploadSponsorBtn");
  if (sponsorBtn) {
    sponsorBtn.addEventListener("click", () => {
      uploadFile("sponsorUpload", "http://localhost:3000/upload/sponsor", path => {
        if (window.scoreboardAdmin && window.scoreboardAdmin.addSponsorFromUpload) {
          window.scoreboardAdmin.addSponsorFromUpload(path);
          alert("Sponsor uploaded and added to display.");
        }
      });
    });
  }

  const bgBtn = document.getElementById("uploadBackgroundBtn");
  if (bgBtn) {
    bgBtn.addEventListener("click", () => {
      uploadFile("backgroundUpload", "http://localhost:3000/upload/background", path => {
        if (window.scoreboardAdmin && window.scoreboardAdmin.addBackgroundFromUpload) {
          window.scoreboardAdmin.addBackgroundFromUpload(path);
          alert("Background uploaded and added to rotation.");
        }
      });
    });
  }
});
