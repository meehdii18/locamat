import './UserPage.css';
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase.js";
import { Button } from "@mui/material";
import { validateForm } from "../../../userFormValidation.js";

function UserPage(props) {
    // eslint-disable-next-line react/prop-types
    const id = props.id; // Fetch the id from the url
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [errors, setErrors] = useState({});

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
    const newErrors = validateForm({ ...userData, [editField]: editValue });
    setErrors(newErrors);
    console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
        try {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, { [editField]: editValue });
            setUserData({ ...userData, [editField]: editValue });
            setEditField(null);
        } catch (err) {
            setError(err.message);
        }
    } else {
        console.log("Validation errors:", newErrors);
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
                    {errors[editField] && <p className="errorMessage">{errors[editField]}</p>} {/* Display the right error message */}
                    <p>Email: {userData.email}</p>
                    {editField && <Button variant="contained" color={"secondary"} onClick={handleSave}>Save</Button>}
                </div>
            </div>
        </div>
    );
}

export default UserPage;