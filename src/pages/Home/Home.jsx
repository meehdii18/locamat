import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { useFirebase } from '../../FirebaseContext.jsx';
import './Home.css';
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Home() {
    const { db } = useFirebase();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

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
        const fetchData = async () => {
            try {
                const allDocsSnapshot = await getDocs(collection(db, "hardware"));
                const allTypes = [
                    ...new Set(allDocsSnapshot.docs.map((doc) => doc.data().type)),
                ];

                const promises = allTypes.map(async (type) => {
                    const q = query(
                        collection(db, "hardware"),
                        where("type", "==", type),
                        limit(4)
                    );
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
                setData(results.flat());
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [data]);

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
                                        <Typography variant="h5">{group.type}</Typography>
                                        <Button component={Link} to={"/hardware-list/" + group.type} variant="contained"
                                                color="secondary">
                                            Voir plus
                                        </Button>
                                    </div>
                                    <div className="bottom-card card-container">
                                        {group.items.map((item) => (
                                            <Card key={item.id} className="cardHardware">
                                                <Link to={"/hardware/" + item.id}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={item.photo}
                                                        alt={`Image de l'équipement ${item.name}`}
                                                    />
                                                    <CardContent>
                                                        <Typography variant="h6"
                                                                    color="secondary">{item.name}</Typography>
                                                    </CardContent>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <LoginForm/>
                )}
            </main>
            <Footer/>
        </>
    );
}

export default Home;