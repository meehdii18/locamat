import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { Button, Container, TextField, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { validateForm } from "../../../hardwareFormValidation.js";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const EditHardware = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        photo: '',
        ref: '',
        type: '',
        specificAttributes: {}
    });
    const [errors, setErrors] = useState({});
    const [attributeKeys, setAttributeKeys] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchHardware = async () => {
            const docRef = doc(db, "hardware", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({
                    name: data.name,
                    photo: data.photo,
                    ref: data.ref,
                    type: data.type,
                    specificAttributes: data.details_specifiques || {}
                });
                setAttributeKeys(Object.keys(data.details_specifiques || {}));
            } else {
                console.log("No such document!");
            }
        };

        fetchHardware();
    }, [id, db]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await updateDoc(doc(db, "hardware", id), {
                    name: formData.name,
                    photo: formData.photo,
                    ref: formData.ref,
                    type: formData.type,
                    details_specifiques: formData.specificAttributes
                });
                alert('Hardware updated successfully');
                navigate("/admin/hardware");
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleAttributeChange = (key, e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            specificAttributes: { ...formData.specificAttributes, [key]: value }
        });
    };

    const handleAttributeNameChange = (index, e) => {
        const { value } = e.target;
        const newKeys = [...attributeKeys];
        const oldKey = newKeys[index];
        newKeys[index] = value;
        setAttributeKeys(newKeys);
        const newAttributes = { ...formData.specificAttributes };
        newAttributes[value] = newAttributes[oldKey];
        delete newAttributes[oldKey];
        setFormData({ ...formData, specificAttributes: newAttributes });
    };

    const addAttribute = () => {
        setAttributeKeys([...attributeKeys, '']);
    };

    const removeAttribute = (index) => {
        const key = attributeKeys[index];
        const { [key]: _, ...newAttributes } = formData.specificAttributes;
        setFormData({ ...formData, specificAttributes: newAttributes });
        setAttributeKeys(attributeKeys.filter((_, i) => i !== index));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10, mb: 80 }}>
            <IconButton onClick={() => navigate("/admin/hardware")} color="secondary">
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Hardware
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
                <Typography variant="h6" component="h2" gutterBottom>
                    Specific Attributes
                </Typography>
                {attributeKeys.map((key, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="Attribute Name"
                            value={key}
                            onChange={(e) => handleAttributeNameChange(index, e)}
                            fullWidth
                            margin="normal"
                            color="secondary"
                        />
                        <TextField
                            label="Attribute Value"
                            value={formData.specificAttributes[key] || ''}
                            onChange={(e) => handleAttributeChange(key, e)}
                            fullWidth
                            margin="normal"
                            color="secondary"
                        />
                        <IconButton onClick={() => removeAttribute(index)} color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <Button onClick={addAttribute} variant="contained" color="secondary" startIcon={<AddIcon />}>
                    Add Attribute
                </Button>
                <Button type="submit" variant="contained" color="secondary" fullWidth>
                    Save Hardware
                </Button>
            </form>
        </Container>
    );
}

export default EditHardware;