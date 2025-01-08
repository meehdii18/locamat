import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Hardware from './pages/Hardware/Hardware.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Admin_navigation from "./pages/Admin/Navigation/Admin_navigation.jsx";
import CreateUser from "./pages/Admin/CreateUser/CreateUser.jsx";
import HardwareList from "./pages/Hardware/HardWareList.jsx";
import Spinner from './components/Spinner/Spinner.jsx';

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [location]);

    return (
        <div className="App">
            <Header />
            {loading ? (
                <Spinner />
            ) : (
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/hardware/:id" element={<Hardware />} />
                    <Route path="/hardware-list/:type" element={<HardwareList />} />
                    <Route path="/admin" element={<Admin_navigation />} />
                    <Route path="/admin/:tab" element={<Admin_navigation />} />
                    <Route path="/admin/users/createuser" element={<CreateUser />} />
                </Routes>
            )}
            <Footer />
        </div>
    );
}

export default App;