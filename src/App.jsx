import React from 'react';
import { useFirebase } from './FirebaseContext.jsx';
import appleLogo from './assets/apple.svg';
import './App.css';

function App() {
    const { db, auth } = useFirebase();

    return (
        <>
            <div className="logoDiv">
                <a href="https://react.dev" target="_blank">
                    <img src={appleLogo} className="logo apple" alt="Apple logo" />
                </a>
                <h1>locaMat</h1>
            </div>

            <div className="connexionDiv">
                <p className="welcome">Bienvenue!</p>
                <p className="pleaseid">Veuillez vous identifiez</p>
                <button>Connexion</button>
            </div>
        </>
    );
}

export default App;