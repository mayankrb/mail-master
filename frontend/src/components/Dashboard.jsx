import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [editableRows, setEditableRows] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');
  const mode = localStorage.getItem('mode');
  const navigate = useNavigate();
  const [excelFileName, setExcelFileName] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setExcelFileName(file.name); // NEW
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 0 });
      setRows(data);
      const enriched = data.map((row) => ({
        ...row,
        subject: applySubject(row),
        body: applyTemplate(row),
      }));
      setEditableRows(enriched);
    };
    reader.readAsBinaryString(file);
  };

  const applySubject = (row) => {
    const subjectTemplate = localStorage.getItem('subject');
    return subjectTemplate
        .replace(/{Name}/g, row.Name || "")
        .replace(/{Company Name}/g, row["Company Name"] || "")
        .replace(/{Job Title}/g, row["Job Title"] || "")
        .replace(/{Job Link}/g, row["Job Link"] || "");
  };

  const applyTemplate = (row) => {
    const bodyTemplate = localStorage.getItem('template');
    return bodyTemplate
        .replace(/{Name}/g, row.Name || "")
        .replace(/{Company Name}/g, row["Company Name"] || "")
        .replace(/{Job Title}/g, row["Job Title"] || "")
        .replace(/{Job Link}/g, row["Job Link"] || "");
  };

  const handleEdit = (index, field, value) => {
    const updated = [...editableRows];
    updated[index][field] = value;
    setEditableRows(updated);
  };

  const sendEmails = async () => {
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("data", JSON.stringify({
        senderEmail: email,
        appPassword: password,
        mode,
        recipients: editableRows,
      }));

      const res = await axios.post("http://localhost:5555/send-emails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`✅ Emails sent: ${res.data.success} / ${editableRows.length}`);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to send emails');
    }
  };

  const resetCredentials = () => {
    window.location.href = '/';
  };

  return (
      <div className="p-6 max-w-full mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Left: Mode Label */}
          <p className="text-lg italic text-gray-400 mb-2 sm:mb-0">
            Current Mode:
            <span className={`ml-2 font-semibold text-white px-2 py-1 rounded ${
                mode === "inquiry" ? "bg-blue-700" : "bg-purple-700"
            }`}>
      {mode === "inquiry" ? "🔍 Job Inquiry" : "🙋‍♂️ Referral Request"}
    </span>
          </p>

          {/* Right: Action Buttons */}
          <div className="flex gap-3">
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={sendEmails}
            >
              Send Emails
            </button>
            <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={resetCredentials}
            >
              Change Sender or Template
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          {mode === "inquiry" ? "📄 Upload Inquiry Files" : "📄 Upload Referral Files"}
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Excel Upload */}
          <label className="cursor-pointer inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            📁 {mode === "inquiry" ? "Upload Inquiry Excel" : "Upload Referral Excel"}
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden"/>
          </label>

          {/* Resume Upload */}
          <label className="cursor-pointer inline-block bg-cyan-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            📎 {mode === "inquiry" ? "Upload Inquiry Resume" : "Upload Referral Resume"}
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])}
                   className="hidden"/>
          </label>

          <div className="flex flex-col gap-1 mt-2 text-sm">
            {excelFileName && (
                <p className="text-green-700">
                  ✅ Excel uploaded: <strong>{excelFileName}</strong>
                </p>
            )}
            {resumeFile && (
                <p className="text-cyan-700">
                  ✅ Resume uploaded: <strong>{resumeFile.name}</strong>
                </p>
            )}
          </div>
        </div>

        {/* Preview Section — only shows after resume is uploaded */}
        {resumeFile && (
            <>
              <h3 className="mt-6 font-semibold">📬 Preview & Edit:</h3>
              <div className="max-h-[800px] overflow-y-auto pr-2">
                <ul className="space-y-4">
                  {editableRows.map((row, idx) => (
                      <li key={idx} className="border rounded p-4 bg-gray-100 dark:bg-gray-800 dark:text-white">
                        <p className="text-sm mb-2"><strong>To:</strong> {row.Email}</p>

                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                            type="text"
                            value={row.subject}
                            onChange={(e) => handleEdit(idx, 'subject', e.target.value)}
                            className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                        />

                        <label className="block text-sm font-medium mb-1">Email Body</label>
                        <textarea
                            value={row.body}
                            onChange={(e) => handleEdit(idx, 'body', e.target.value)}
                            className="w-full mb-2 p-2 border rounded h-50 bg-white dark:bg-gray-700 dark:text-white"
                        />

                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          Attached Resume: {resumeFile?.name || "None selected"}
                        </p>
                      </li>
                  ))}
                </ul>
              </div>
            </>
        )}
      </div>
  );
};

export default Dashboard;
