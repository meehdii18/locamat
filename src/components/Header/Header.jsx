import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../FirebaseContext.jsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import './Header.css';
import {signOut} from "firebase/auth";
import {auth} from "../../firebase.js";
import {useNavigate} from "react-router-dom";

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
                <IconButton color="inherit" href="/home"
                            sx={{
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: '#747bff',
                                },
                            }}>
                    <HomeIcon/>
                    Home
                </IconButton>
                <li><a onClick={handleDisconnect}>Déconnecter</a></li>

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
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
    }),
};