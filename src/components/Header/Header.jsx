import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../FirebaseContext.jsx';
import './Header.css';

export default function Header({ currentUser }) {
    const { db } = useFirebase();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setIsAdmin(userDoc.data().admin);
                }
            }
        };

        fetchUserData();
    }, [currentUser, db]);

    const handleAdminClick = () => {
        navigate('/admin');
    };

    return (
        <header className="header">
            <nav>
                <ul>
                    {currentUser && <li className="currentUser">Salut, {currentUser.email}</li>}
                    <li><a href="/home">Home</a></li>
                    {isAdmin && (
                        <li>
                            <button onClick={handleAdminClick}>Admin</button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

Header.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        uid: PropTypes.string,
    }),
};