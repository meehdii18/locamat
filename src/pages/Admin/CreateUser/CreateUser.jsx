import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {Button, Container, FormControlLabel, FormGroup, Switch, TextField} from "@mui/material";
import { validateForm } from "../../../userFormValidation.js";
import Typography from "@mui/material/Typography";

const CreateUser = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        admin: false
    });
    const [errors, setErrors] = useState({});
    const auth = getAuth();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    admin: formData.admin
                });
                alert('User created successfully');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create User
            </Typography>
            <form onSubmit={handleSubmit} className={"create-user-form"}>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={formData.admin} onChange={handleChange} name="admin" />}
                        label="Admin"
                    />
                </FormGroup>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create User
                </Button>
            </form>
        </Container>
    );
};

export default CreateUser;