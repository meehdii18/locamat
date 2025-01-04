import React from 'react';
import {useFirebase} from './FirebaseContext.jsx';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Hardware from './pages/Hardware/Hardware.jsx'

function App() {
    const {db, auth} = useFirebase();

    return (
        <div className="App">
            <Router>

                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/hardware" element={<Hardware/>}/>
                </Routes>

            </Router>
        </div>
    );
}

export default App;