const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const electronApp = electron.app;

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===== Express Setup =====
const app = express();
const PORT = 5555;
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.join(frontendPath, "index.html");

if (fs.existsSync(indexPath)) {
  console.log("✅ Frontend build found. Serving React app...");
  app.use(express.static(frontendPath));

  // ✅ Explicit catch-all route (MUST BE LAST!)
  app.get(/^\/(?!api\/).*$/, (req, res) => {
    // Exclude /api/*
    res.sendFile(indexPath);
  });
} else {
  console.warn("⚠️ Frontend index.html not found at:", indexPath);
}

// ===== Email Template Filler =====
function fillTemplate(template, row) {
  let result = template;
  Object.keys(row).forEach((key) => {
    const placeholder = new RegExp(`{${key}}`, "g");
    result = result.replace(placeholder, row[key] || "");
  });
  return result;
}

// ===== Email Sender Endpoint =====
app.post("/send-emails", upload.single("resume"), async (req, res) => {
  const { senderEmail, appPassword, recipients, mode } = JSON.parse(req.body.data);
  const resume = req.file;

  console.log(`📩 Sending ${recipients.length} emails (mode: ${mode})`);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: appPassword,
    },
  });

  let success = 0;
  for (const r of recipients) {
    const subjectText = fillTemplate(r.subject, r);
    const bodyText = fillTemplate(r.body, r);

    const mailOptions = {
      from: senderEmail,
      to: r.Email,
      subject: subjectText,
      text: bodyText,
      attachments: resume
          ? [
            {
              filename: resume.originalname,
              content: resume.buffer,
              contentType: resume.mimetype || "application/pdf",
            },
          ]
          : [],
    };

    try {
      await transporter.sendMail(mailOptions);
      success++;
    } catch (err) {
      console.error("❌ Failed to send to", r.Email, err.message);
    }
  }

  res.json({ success });
});

// ===== Start Backend Server =====
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

// ===== Electron Window Setup =====
function createWindow() {
  const win = new BrowserWindow({
    show: false, // Don't show until it's ready to maximize
    webPreferences: {
      nodeIntegration: false,
    },
  });

  //  Corrected port to 5555
  new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running at http://localhost:${PORT}`);
      resolve();
    });
  }).then(() => {
    win.loadURL(`http://localhost:5555`);
    win.maximize(); // Maximize the window (with border + controls)
    win.show();
    win.webContents.openDevTools();
  });
}

electronApp.whenReady().then(() => {
  createWindow();
  electronApp.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

electronApp.on("window-all-closed", () => {
  if (process.platform !== "darwin") electronApp.quit();
});