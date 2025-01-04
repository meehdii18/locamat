import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { useFirebase } from '../../FirebaseContext.jsx';
import '../../App.css';
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import reactLogo from "../../assets/hypnosis.svg";

function Home() {
    const { db } = useFirebase();
    const [currentUser, setCurrentUser] = useState(null);

    /* Gestion de l'utilisateur courant */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <Header currentUser={currentUser} />
            <main>
                {currentUser ? (
                    <div>
                        <h2>SALUT, {currentUser.email}</h2>
                    </div>
                ) : (
                    <LoginForm />
                )}
            </main>
            <Footer />
        </>
    );
}

export default Home;