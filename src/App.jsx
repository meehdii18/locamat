import React, { useState } from 'react';
import { useFirebase } from './FirebaseContext.jsx';
import appleLogo from './assets/apple.svg';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './App.css';

function App() {
    const { db, auth } = useFirebase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in:', userCredential.user);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Connexion</button>
            </div>
        </>
    );
}

export default App;