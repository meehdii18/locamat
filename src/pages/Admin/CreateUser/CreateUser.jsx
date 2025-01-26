import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {Button, Container, FormControlLabel, FormGroup, Switch, TextField} from "@mui/material";
import { validateForm } from "../../../userFormValidation.js";
import Typography from "@mui/material/Typography";

const CreateUser = () => {
    const navigate = useNavigate();
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
                navigate('/admin/users', { state: { success: 'User created successfully' } });
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
        <Container maxWidth="sm" sx={{ mt: 10, mb: 80 }}>
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
                    color="secondary"
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
                    color="secondary"
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
                    color="secondary"
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    color="secondary"
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
                    color="secondary"
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={formData.admin} onChange={handleChange} name="admin" />}
                        label="Admin"
                        color="secondary"
                    />
                </FormGroup>
                <Button type="submit" variant="contained" color="secondary" fullWidth>
                    Create User
                </Button>
            </form>
        </Container>
    );
};

export default CreateUser;