const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Detect packaged vs development
const isDev = !process.mainModule || !process.mainModule.filename.includes("app.asar");
const basePath = isDev ? __dirname : process.resourcesPath;

app.use(express.json());

// Static
app.use("/admin", express.static(path.join(basePath, "admin")));
app.use("/display", express.static(path.join(basePath, "display")));
app.use("/images", express.static(path.join(basePath, "images")));

// Ensure image folders exist
const sponsorsDir = path.join(basePath, "images", "sponsors");
const backgroundsDir = path.join(basePath, "images", "backgrounds");
if (!fs.existsSync(sponsorsDir)) fs.mkdirSync(sponsorsDir, { recursive: true });
if (!fs.existsSync(backgroundsDir)) fs.mkdirSync(backgroundsDir, { recursive: true });

// Upload storage
const sponsorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, sponsorsDir);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

const backgroundStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, backgroundsDir);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

const uploadSponsor = multer({ storage: sponsorStorage });
const uploadBackground = multer({ storage: backgroundStorage });

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
