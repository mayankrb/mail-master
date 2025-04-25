const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5555;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads (resume)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve frontend build
app.use(express.static(path.join(__dirname, "frontend", "dist")));


// Helper to fill templates with Excel data
function fillTemplate(template, row) {
  let result = template;
  Object.keys(row).forEach((key) => {
    const placeholder = new RegExp(`{${key}}`, "g");
    result = result.replace(placeholder, row[key] || "");
  });
  return result;
}

// Email sending endpoint
app.post("/send-emails", upload.single("resume"), async (req, res) => {
  const { senderEmail, appPassword, recipients, mode } = JSON.parse(req.body.data);
  const resume = req.file;

  console.log(`📩 Sending ${recipients.length} emails in mode: ${mode}`);

  // Optional validation for referrals
  if (mode === "referral") {
    recipients.forEach((r, i) => {
      if (!r["Job Title"] || !r["Job Link"]) {
        console.warn(`⚠️ Missing Job Title or Job Link in row ${i + 1}`);
      }
    });
  }

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
// ✅ Fixed: Named wildcard parameter
app.get(/^\/(?!api\/).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
