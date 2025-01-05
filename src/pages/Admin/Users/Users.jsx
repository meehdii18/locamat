import Admin_navigation from "../Admin_navigation.jsx";
import { useEffect, useState } from "react";
import { db } from "../../../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import "./Users.css";

function Admin_Users() {
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]); // Initialisation de l'état

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users...");
                const allUsers = await getDocs(collection(db, "users"));
                const fetchedUsers = []; // Stockage temporaire
                allUsers.forEach((user) => {
                    fetchedUsers.push(user.data());
                });
                setUsers(fetchedUsers); // Mise à jour immuable de l'état
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUsers().then(() => console.log("Users fetched!"));
    }, []);

    if (error) {
        return <p>Erreur : {error}</p>;
    }

    return (
        <div>
            <Admin_navigation/>
            <div className="table-container">
                <h1>Admin Users</h1>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.email || index}>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.phoneNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Admin_Users;
