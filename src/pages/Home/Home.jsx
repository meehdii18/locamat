import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.js';
import { query, where, limit, collection, getDocs } from "firebase/firestore";
import '../../App.css';
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

    console.log("test1");
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
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    type,
                    ...doc.data(),
                }));
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
    console.log(error);
    // Récupérer les données de firebase

    // Formater les données firebase pour les intégrer dans la structure
    let blocks = null;
    /*blocks = data.length === 0 ? data.map((item, index) => {
        return (
            <>
                <div>
                    <h3>Type du matériel</h3>
                    <a href="">Voir plus</a>
                </div>
                <div>
                    <img alt="Image de l'équipement"/>
                    <p>Nom de l'équipement</p>
                </div>
            </>
        );
    });*/

    return (
        <>
            <Header currentUser={currentUser} />
            <main>
                {currentUser ? (
                    <section>
                        <h2>SALUT, {currentUser.email}</h2>
                        <div className="material-content">
                            { blocks }
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
