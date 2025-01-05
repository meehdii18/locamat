import React, { useState, useEffect } from 'react';
// Firebase Import
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.js';
import { query, where, limit, collection, getDocs } from "firebase/firestore";
// CSS import
import '../../App.css';
import './Home.css';
// Component Import
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

function Home() {
    const [data, setData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        // Récupérer les données de firebase
        const fetchData = async () => {
            try {
                // Récupérer tous les types dynamiquement
                const allDocsSnapshot = await getDocs(collection(db, "hardware"));
                const allTypes = [
                    ...new Set(allDocsSnapshot.docs.map((doc) => doc.data().type)),
                ];

                // À partir des types, on récupère les 4 premiers équipements de chaque type
                const promises = allTypes.map(async (type) => {
                    const q = query(
                        collection(db, "hardware"),
                        where("type", "==", type),
                        limit(4)
                    );
                    // Formater les données pour logique d'affichage
                    const querySnapshot = await getDocs(q);
                    return {
                        type,
                        items: querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })),
                    };
                });

                const results = await Promise.all(promises);

                // Fusionner et mettre à jour l'état
                setData(results.flat());
                console.log(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [data]);

    // Affichage des erreurs pour debug
    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <>
            <Header currentUser={currentUser} />
            <main>
                {currentUser ? (
                    <section className="main-section">
                        <h2>SALUT, {currentUser.email}</h2>
                        <div className="material-content">
                            {data.map((group) => (
                                <div key={group.type} className="material-card">
                                    <div className="top-card">
                                        <h3>Type du matériel : {group.type}</h3>
                                        <a href="#">Voir plus</a>
                                    </div>
                                    <div className="bottom-card">
                                        {group.items.map((item) => (
                                            <div key={item.id}>
                                                <a>
                                                    <img
                                                        src={item.photo}
                                                        alt={`Image de l'équipement ${item.name}`}
                                                    />
                                                </a>
                                                <p>{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <LoginForm />
                )}
            </main>
            <Footer />
        </>
    );
}

export default Home;
