import React, { useEffect, useState } from "react";
import { useFirebase } from "../../FirebaseContext.jsx";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.js';
import { query, where, limit, collection, getDocs } from "firebase/firestore";

import './Hardware.css';

function Hardware() {
    const { db } = useFirebase();
    const [hardwareData, setHardwareData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const allDocsSnapshot = await getDocs(collection(db, 'hardware'));
            /*
            const docRef = db.collection('hardware').doc('hardware_test_1');
            const doc = await docRef.get();
            if (doc.exists) {
                setHardwareData(doc.data());
                alert("doc exists");
            } else {
                alert('No such document!!!!');
            }
            */
        };

        fetchData();
    }, [db]);

    if (!hardwareData) {
        return <div>No data found</div>;
    }

    return (
        <div className="container">
            <div className="top-left">
                <img src={hardwareData.topLeftImage} alt="Top Left" />
            </div>
            <div className="bottom-left">
                <img src={hardwareData.bottomLeftImage} alt="Bottom Left" />
            </div>
            <div className="top-right">
                <h1>{hardwareData.name}</h1>
            </div>
            <div className="bottom-right">
                <p>Nom: {hardwareData.name}</p>
                <p>Ref: {hardwareData.ref}</p>
                <br/>
                <p>Pavé numérique: {hardwareData.numericPad ? 'oui' : 'non'}</p>
            </div>
        </div>
    );
}

export default Hardware;