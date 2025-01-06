import './UserPage.css';
import React, {useEffect, useState} from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase.js";
import {useParams} from "react-router-dom";
import { Button } from "@mui/material";
import Admin_navigation from "../Navigation/Admin_navigation.jsx";

function UserPage() {
    const { id } = useParams(); // Fetch the id from the url
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState("");

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

    }, [id]);

    const handleDoubleClick = (field) => {
        setEditField(field);
        setEditValue(userData[field]);
    };

    const handleChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleSave = async () => {
        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, {[editField]: editValue});
            setUserData({...userData, [editField]: editValue});
            setEditField(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>No data found</div>;
    }


    // TODO : Voir pour la modification de l'email si ça a du sens et voir comment le faire avec l'authentification
    return (
        <div>
            <div className="userPage">
                <h1>User id : {id}</h1>
                <div>
                    {["firstName", "lastName", "phoneNumber"].map((field) => (
                        <p key={field} onDoubleClick={() => handleDoubleClick(field)}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                            {editField === field ? (
                                <input type="text" value={editValue} onChange={handleChange}/>
                            ) : (
                                userData[field]
                            )}
                        </p>
                    ))}
                    <p>Email: {userData.email}</p>
                    {editField && <Button variant="contained" onClick={handleSave}>Save</Button>}
                </div>
                <Button variant={"contained"} href={"http://localhost:5173/admin/users"}>retour</Button>
            </div>
        </div>
    );
}

export default UserPage;