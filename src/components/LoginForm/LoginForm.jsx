import React, { useState } from "react";
import "./LoginForm.css";
import { auth } from "../../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import errorCodes from "../../assets/errorcode.json";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            const errorMessage = errorCodes.authErrors[err.code] || err.message;
            setError(errorMessage);
        }
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="connexionDiv">
            <p className="welcome">Bienvenue !</p>
            <p className="pleaseid">Veuillez vous identifiez</p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="passwordContainer">
                    <input
                        name="password"
                        placeholder="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </div>
    );
}