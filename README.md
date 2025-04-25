# 💼 Mail Master

**Mail Master** is a powerful desktop application for sending personalized job inquiry or referral emails in bulk using Excel sheets. Built with **React**, **Node.js**, and **Electron**, it supports resume attachments, email templates, and sender authentication.

---

## 🚀 Features

- 📤 Send bulk **job inquiries** or **referral requests**
- 📝 Upload Excel files with columns like `Name`, `Email`, `Company Name`, and more
- 📎 Attach resumes as PDFs
- 💬 Use customizable templates with placeholders (e.g. `{Name}`, `{Company Name}`)
- 🧠 Smart mode-switching between Inquiry & Referral
- 💾 Saves your sender info and templates locally
- 🖥️ Works as a standalone Windows `.exe` application

---

## 🧰 Requirements

- [Node.js](https://nodejs.org/) v22+ (recommended)
- npm or yarn
- Git
- Gmail account with App Password (2FA required), setting up App password is required
- Make sure the files are in the following format
  For job inquiry requests you should have the following columns: 
![image](https://github.com/user-attachments/assets/94ec8b35-ed58-47c1-9225-2d688e3d02d1)

  For referral requests you should have the following columns:
![image](https://github.com/user-attachments/assets/901889b8-f596-49b6-8a04-56e5cc27eb0d)

---

## ⚙️ Setup

## Run the following commands:

## 1. Clone the repo 
git clone https://github.com/mayankrb/mail-master.git

## 2. Install the dependencies
cd mail-master

npm install

cd frontend

npm install


## 3. Build the frontend

npm run build

cd ..


## 4. Run in dev mode(optional)

node main.js


## 5. Create an exe

npm run package

dist-electron/mail-master-win32-x64/mail-master.exe


## 6. Go inside the exe dist-electron package and run the exe.

# Screenshots
![image](https://github.com/user-attachments/assets/32c015f2-72e4-4b1b-89b9-dd5abc4f7163)
![image](https://github.com/user-attachments/assets/862dc94a-fd6c-4ab5-9e1f-6a5e9fb24f7b)
![image](https://github.com/user-attachments/assets/3da7e069-8c35-4b20-9041-b33a0c88c4d0)
You can modify the individual emails if you want.


