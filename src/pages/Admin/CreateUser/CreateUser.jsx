// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import './CreateUser.css';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({});
    const auth = getAuth();
    const db = getFirestore();

    const validateForm = () => {
        let newErrors = {};

        if (!/^.+@locamat\.fr$/.test(formData.email)) {
            newErrors.email = "Email must be of type xxx@locamat.fr";
        }

        if (!/^[a-zA-Z0-9]{1,30}$/.test(formData.firstName)) {
            newErrors.firstName = "First name must be alphanumeric and between 1-30 characters";
        }

        if (!/^[a-zA-Z0-9]{1,30}$/.test(formData.lastName)) {
            newErrors.lastName = "Last name must be alphanumeric and between 1-30 characters";
        }

        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Phone number must be exactly 10 digits";
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(formData.password)) {
            newErrors.password = "Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character and be 8+ characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // If no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent reloading of the page
        if (validateForm()) {
            try {
                // Firebase Auth Registration
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                // Firestore Registration
                await setDoc(doc(db, "users", user.uid), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email
                });

                alert('User created successfully');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                style={{ borderColor: errors.firstName ? 'red' : 'black' }}
            />
            {errors.firstName && <p>{errors.firstName}</p>}

            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                style={{ borderColor: errors.lastName ? 'red' : 'black' }}
            />
            {errors.lastName && <p>{errors.lastName}</p>}

            <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                style={{ borderColor: errors.phoneNumber ? 'red' : 'black' }}
            />
            {errors.phoneNumber && <p>{errors.phoneNumber}</p>}

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                style={{ borderColor: errors.email ? 'red' : 'black' }}
            />
            {errors.email && <p>{errors.email}</p>}

            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                style={{ borderColor: errors.password ? 'red' : 'black' }}
            />
            {errors.password && <p>{errors.password}</p>}

            <button type="submit">Create User</button>
        </form>
    );
};

export default CreateUser;
