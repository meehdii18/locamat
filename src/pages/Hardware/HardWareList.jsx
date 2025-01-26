import React, { useEffect, useState } from "react";
import { useFirebase } from "../../FirebaseContext.jsx";
import { useParams } from "react-router-dom";
import { query, where, collection, getDocs } from "firebase/firestore";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import './HardwareList.css';

function HardwareList() {
    const { db } = useFirebase();
    const { type } = useParams();
    const [hardwareData, setHardwareData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                const collectionMateriel = collection(db, "hardware");
                const requete = query(collectionMateriel, where("type", "==", type));
                const resultatRequete = await getDocs(requete);

                if (!resultatRequete.empty) {
                    const donnees = resultatRequete.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setHardwareData(donnees);
                } else {
                    setError("Aucun équipement trouvé pour ce type.");
                }
            } catch (erreur) {
                setError(erreur.message);
            }
        };

        chargerDonnees();
    }, [type, db]);

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!hardwareData) {
        return <div>No data found</div>;
    }

    return (
        <>
            <h2 className="titleType">Équipements du type : {type}</h2>
            <div className="container">
                {hardwareData.map(item => (
                    <Card key={item.id} className="cardHardware">
                        <Link to={"/hardware/" + item.id}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={item.photo}
                                alt={`Image de l'équipement ${item.name}`}
                                style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" color="secondary">{item.name}</Typography>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default HardwareList;