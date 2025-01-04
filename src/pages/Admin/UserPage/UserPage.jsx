import './UserPage.css';
import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../../firebase.js";
import {useParams} from "react-router-dom";

function UserPage() {
    const { id } = useParams(); // Fetch the id from the url
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "users", id); // Path to the user document
                const docSnap = await getDoc(docRef); // Get the document

                if (docSnap.exists()) {
                    setUserData({id: docSnap.id, ...docSnap.data()});
                } else {
                    setError("This user does not exist.");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();

    }, [id, db]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>No data found</div>;
    }

    return (
        <div>rien pour l instant</div>
    );
}

export default UserPage;