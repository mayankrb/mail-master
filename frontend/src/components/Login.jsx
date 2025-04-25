import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("inquiry");
    const [subject, setSubject] = useState("");
    const [template, setTemplate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");
        const savedSubject = localStorage.getItem("subject");
        const savedTemplate = localStorage.getItem("template");
        const savedMode = localStorage.getItem("mode");

        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        if (savedSubject) setSubject(savedSubject);
        if (savedTemplate) setTemplate(savedTemplate);
        if (savedMode) setMode(savedMode);
    }, []);

    const defaultTemplates = {
        inquiry: {
            subject: "Inquiry About Opportunities at {Company Name}",
            body: `Hi {Name},

I hope you're doing well. I'm reaching out to explore any job opportunities at {Company Name}. I would love to connect and learn more about any openings.

Best regards,  
Mayank Bhandari`,
        },
        referral: {
            subject: "Referral Request for {Job Title} at {Company Name}",
            body: `Hi {Name},

I hope you're doing well. I came across a {Job Title} role at {Company Name} and was wondering if you'd be open to referring me.

Here's the job link for reference: {Job Link}

I’d greatly appreciate your support!

Best regards,  
Mayank Bhandari`,
        },
    };

    // Load template on mode change
    useEffect(() => {
        const savedSubject = localStorage.getItem(`subject_${mode}`);
        const savedTemplate = localStorage.getItem(`template_${mode}`);
        setSubject(savedSubject || defaultTemplates[mode].subject);
        setTemplate(savedTemplate || defaultTemplates[mode].body);
    }, [mode]);

    // Persist mode-variant templates separately as they change
    useEffect(() => {
        localStorage.setItem(`subject_${mode}`, subject);
    }, [subject, mode]);

    useEffect(() => {
        localStorage.setItem(`template_${mode}`, template);
    }, [template, mode]);

    const handleLogin = () => {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        localStorage.setItem("subject", subject);
        localStorage.setItem("template", template);
        localStorage.setItem("mode", mode);
        navigate("/dashboard");
    };

    return (
        <div className="p-6 max-w-full mx-auto">
            <h2 className="text-2xl max-w-xl font-bold mb-2">🔐 Enter Sender Email Details</h2>
            <div className="flex items-center gap-6 mb-6 flex-wrap">
                {/* Email Field */}
                <div className="flex items-center">
                    <label className="text-lg font-medium mr-2 min-w-[60px]">Email:</label>
                    <input
                        type="email"
                        placeholder="Gmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-[300px] p-2 border border-gray-300 rounded
                                    bg-gray-100 text-black
                                    dark:bg-gray-800 dark:text-white
                                    dark:border-gray-600
                                    placeholder-gray-500 dark:placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password Field */}
                <div className="flex items-center">
                    <label className="text-lg font-medium mr-2 min-w-[80px]">Password:</label>
                    <input
                        type="password"
                        placeholder="App Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-[300px] p-2 border border-gray-300 rounded
                                    bg-gray-100 text-black
                                    dark:bg-gray-800 dark:text-white
                                    dark:border-gray-600
                                    placeholder-gray-500 dark:placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="text-2xl">
                <h2 className="md:font-bold mb-2">⚙️ Select mode:</h2>
            </div>
            {/* Mode Buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setMode("inquiry")}
                    className={`px-4 py-2 rounded ${
                        mode === "inquiry" ? "bg-blue-600 text-white" : "bg-gray-400"
                    }`}
                >
                    🔍 Job Inquiry
                </button>
                <button
                    onClick={() => setMode("referral")}
                    className={`px-4 py-2 rounded ${
                        mode === "referral" ? "bg-purple-600 text-white" : "bg-gray-400"
                    }`}
                >
                    🙋‍♂️ Ask for Referral
                </button>
            </div>

            {/* Current Mode Display */}
            <p className="mb-4 text-md italic text-gray-200">
                Current mode:{" "}
                <span
                    className={`font-semibold text-white px-2 py-1 rounded ${
                        mode === "inquiry" ? "bg-blue-700" : "bg-purple-700"
                    }`}
                >
                {mode === "inquiry" ? "Job Inquiry" : "Referral Request"}
                </span>
            </p>

            {/* Editable Subject */}
            <label className="block text-xl italic font-medium mb-1">Subject</label>
            <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
            />

            {/* Editable Template */}
            <label className="block text-xl italic font-medium mb-1">Email Template</label>
            <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full mb-4 p-2 border rounded h-80"
            />

            <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleLogin}
            >
                Continue
            </button>
        </div>
    );
};

export default Login;
