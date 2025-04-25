import React from 'react';
import { Routes, Route, useLocation} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    const location = useLocation(); // ✅ helps force remount

    return (
        <Routes key={location.pathname} location={location}>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;
