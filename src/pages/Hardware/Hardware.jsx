// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../FirebaseContext.jsx";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import './Hardware.css';

function Hardware() {

    const { db } = useFirebase();



    const { id } = useParams(); // Fetch the id from the url
    const [hardwareData, setHardwareData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "hardware", id); // Path to the hardware document
                const docSnap = await getDoc(docRef); // Get the document

                if (docSnap.exists()) {
                    setHardwareData({id: docSnap.id, ...docSnap.data()});
                } else {
                    setError("This hardware does not exist.");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!hardwareData) {
        return <div>No data found</div>;
    }

    return (
        <div className="container">
            <div className="top-left">
                <img src={hardwareData.photo} alt="hardwarephoto" />
            </div>
            <div className="bottom-left">
                <img src={"https://m.media-amazon.com/images/I/61JU8Be5TbL._AC_UF1000,1000_QL80_.jpg"} alt="calendar" />
            </div>
            <div className="top-right">
                <h1>{hardwareData.name}</h1>
            </div>
            <div className="bottom-right">
                <p>Nom: {hardwareData.name}</p>
                <p>Ref: {hardwareData.ref}</p>
                <br/>
                <p>Pavé numérique: {hardwareData.numericPad ? 'oui' : 'non'}</p>
                <br/>

                {/*specific attributes*/}
                <h2>Specific attributes</h2>
                {hardwareData.details_specifiques ? (
                    <ul>
                        {Object.entries(hardwareData.details_specifiques).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key} :</strong> {value}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun détail spécifique trouvé.</p>
                )}
            </div>
        </div>
    );
}

export default Hardware;