const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Allow JSON and static file access
app.use(express.json());
app.use(express.static(__dirname));

//
// SPONSOR UPLOAD STORAGE
//
const sponsorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images/sponsors"));
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

//
// BACKGROUND UPLOAD STORAGE
//
const backgroundStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images/backgrounds"));
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

const uploadSponsor = multer({ storage: sponsorStorage });
const uploadBackground = multer({ storage: backgroundStorage });

//
// SPONSOR UPLOAD ENDPOINT
//
app.post("/upload/sponsor", uploadSponsor.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    path: "images/sponsors/" + req.file.filename
  });
});

//
// BACKGROUND UPLOAD ENDPOINT
//
app.post("/upload/background", uploadBackground.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    path: "images/backgrounds/" + req.file.filename
  });
});

//
// START SERVER
//
app.listen(PORT, () => {
  console.log("Local scoreboard server running on port", PORT);
});
