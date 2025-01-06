// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../FirebaseContext.jsx";
import { useParams } from "react-router-dom";
import { query, where, collection, getDocs } from "firebase/firestore";

import './HardwareList.css';

function HardwareList() {

    const { db } = useFirebase();
    // Fetch the type from the url
    const { type } = useParams();
    const [hardwareData, setHardwareData] = useState(null);
    const [error, setError] = useState(null);
    console.log("test");
    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                // Référence la collection "hardware" dans Firestore
                const collectionMateriel = collection(db, "hardware");
                // Requête pour obtenir les équipements selon le type
                const requete = query(collectionMateriel, where("type", "==", type));
                const resultatRequete = await getDocs(requete);

                // Vérifier si des données ont été trouvés et sont pas vides
                if (!resultatRequete.empty) {
                    // Transformer les documents en un tableau d'objets
                    const donnees = resultatRequete.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    //console.log(donnees);
                    // Met à jour l'état avec les données
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
                    <div className="cardHardware">
                        <a href={"/hardware/" + item.id}>
                            <img
                                src={item.photo}
                                alt={`Image de l'équipement ${item.name}`}
                                className="imgHardware"
                            />
                            {item.name}
                        </a>
                    </div>
                ))}
            </div>
            </>
    );
}

export default HardwareList;
