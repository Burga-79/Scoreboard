const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Correct packaged paths
const resourcesPath = process.resourcesPath; // outside ASAR
const imagesPath = path.join(resourcesPath, "images");

// Path to app.asar contents
const appAsarPath = path.join(process.resourcesPath, "app.asar");

// Ensure folders exist
const sponsorsDir = path.join(imagesPath, "sponsors");
const backgroundsDir = path.join(imagesPath, "backgrounds");

fs.mkdirSync(sponsorsDir, { recursive: true });
fs.mkdirSync(backgroundsDir, { recursive: true });

// Serve static images
app.use("/images", express.static(imagesPath));

/* ⭐ Serve admin folder from inside ASAR */
app.use("/admin", express.static(path.join(appAsarPath, "admin")));

/* ⭐ Serve display folder from inside ASAR */
app.use("/display", express.static(path.join(appAsarPath, "display")));

// Multer storage
const sponsorStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, sponsorsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safe);
  }
});

const backgroundStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, backgroundsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safe);
  }
});

const uploadSponsor = multer({ storage: sponsorStorage });
const uploadBackground = multer({ storage: backgroundStorage });

// Upload endpoints
app.post("/upload/sponsor", uploadSponsor.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ path: "images/sponsors/" + req.file.filename });
});

app.post("/upload/background", uploadBackground.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ path: "images/backgrounds/" + req.file.filename });
});

app.listen(PORT, () => {
  console.log("Local scoreboard server running on port", PORT);
});
