import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import {signOut} from "firebase/auth";
import {auth} from "../../firebase.js";
import {useNavigate} from "react-router-dom";

export default function Header({ currentUser }) {
    const navigate = useNavigate();

    const handleDisconnect = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            navigate("/login");
        } catch (err) {
            console.log("Erreur de déconnexion " + err);
        }
    };
    return (
        <header className="header">
            <nav>
                <ul>
                    {currentUser && <li className="currentUser">Salut, {currentUser.email}</li>}
                    <li><a href="/public">Home</a></li>
                    <li><a onClick={handleDisconnect}>Déconnecter</a></li>
                </ul>
            </nav>
        </header>
    );
}

Header.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
    }),
};
