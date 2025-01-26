import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../FirebaseContext.jsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js";
import LogoutIcon from '@mui/icons-material/Logout';
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

    const handleDisconnect = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.log("Erreur de déconnexion " + err);
        }
    };

    const handleAdminClick = () => {
        navigate('/admin');
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    return (
        <AppBar position="fixed" style={{ background: 'black' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {currentUser && (
                    <Typography variant="h6" component="div" sx={{ marginRight: 'auto' }}>
                        Bonjour, {currentUser.email}
                    </Typography>
                )}
                <IconButton color="inherit" onClick={handleHomeClick}
                            sx={{
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: '#747bff',
                                },
                            }}>
                    <HomeIcon/>
                    Home
                </IconButton>

                {isAdmin && (
                    <IconButton
                        color="inherit"
                        onClick={handleAdminClick}
                        sx={{
                            transition: 'color 0.3s ease',
                            '&:hover': {
                                color: '#747bff',
                            },
                        }}
                    >
                        <AdminPanelSettingsIcon/>
                        Admin
                    </IconButton>
                )}

                {currentUser && (
                    <IconButton color="inherit" onClick={handleDisconnect}
                                sx={{
                                    transition: 'color 0.3s ease',
                                    '&:hover': {
                                        color: '#747bff',
                                    },
                                }}>
                        <LogoutIcon/>
                        Disconnect
                    </IconButton>
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