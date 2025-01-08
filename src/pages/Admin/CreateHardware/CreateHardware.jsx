import {useState} from "react";
import {doc, getFirestore, setDoc} from "firebase/firestore";
import {Button, Container, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {validateForm} from "../../../hardwareFormValidation.js";


const CreateHardware = () => {
    const [formData, setFormData] = useState({
        name: '',
        photo: '',
        ref: '',
        type: ''
    });

    const [errors, setErrors] = useState({});
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await setDoc(doc(db, "hardware", formData.ref), {
                    name: formData.name,
                    photo: formData.photo,
                    ref: formData.ref,
                    type: formData.type
                });
                alert('Hardware created successfully');
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
                Create Hardware
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    color="secondary"
                />
                <TextField
                    label="Photo URL"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.photo}
                    helperText={errors.photo}
                    color="secondary"
                />
                <TextField
                    label="Reference"
                    name="ref"
                    value={formData.ref}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.ref}
                    helperText={errors.ref}
                    color="secondary"
                />
                <TextField
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.type}
                    helperText={errors.type}
                    color="secondary"
                />
                <Button type="submit" variant="contained" color="secondary" fullWidth>
                    Create Hardware
                </Button>
            </form>
        </Container>
    );
}

export default CreateHardware;