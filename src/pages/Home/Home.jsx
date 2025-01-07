import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { useFirebase } from '../../FirebaseContext.jsx';
import './Home.css';
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { getDocs, collection, query, where, limit } from 'firebase/firestore';

function Home() {
    const { db } = useFirebase();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

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

    /* Collecter les données sur les équipements  */
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
                    // Requête pour récupérer les éléments de la collection "hardware"
                    const q = query(
                        collection(db, "hardware"),
                        where("type", "==", type),
                        limit(4)
                    );
                    // Formater les données pour affichage
                    const querySnapshot = await getDocs(q);
                    return {
                        type,
                        items: querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })),
                    };
                });
                /* Attend que toutes les requêtes Firebase pour les types soient terminées
                   et rassemble leurs résultats dans un tableau unique */
                const results = await Promise.all(promises);

                // Fusionner et mettre à jour l'état
                setData(results.flat());
                //console.log(data);
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
                        <div className="material-content">
                            {data.map((group) => (
                                <div key={group.type} className="material-card">
                                    <div className="top-card">
                                        <h3>Type du matériel : {group.type}</h3>
                                        <a href={"/hardware-list/" + group.type}>Voir plus</a>
                                    </div>
                                    <div className="bottom-card">
                                        {group.items.map((item) => (
                                            <div key={item.id}>
                                                <a href={"/hardware/" + item.id}>
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