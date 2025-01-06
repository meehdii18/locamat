import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../FirebaseContext.jsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
        <AppBar position="fixed" style={{ background: 'black' }}>
            <Toolbar>
                {currentUser && (
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Salut, {currentUser.email}
                    </Typography>
                )}
                <Button color="inherit" href="/home">Home</Button>
                {isAdmin && (
                    <Button color="inherit" onClick={handleAdminClick}>Admin</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        uid: PropTypes.string,
    }),
};