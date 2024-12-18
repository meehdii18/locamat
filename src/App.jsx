import React from 'react';
import { useFirebase } from './FirebaseContext.jsx';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

function App() {
    const { db, auth } = useFirebase();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;