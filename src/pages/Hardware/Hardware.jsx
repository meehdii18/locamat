import React, { useEffect, useState } from "react";
import { useFirebase } from "../../FirebaseContext.jsx";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Container, Grid, Typography, Paper, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import LocalMallIcon from '@mui/icons-material/LocalMall';
import Booking from './Booking';
import './Hardware.css';

function Hardware() {
    const { db } = useFirebase();
    const { id } = useParams();
    const [hardwareData, setHardwareData] = useState(null);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "hardware", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setHardwareData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("This hardware does not exist.");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [id, db]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!hardwareData) {
        return <div>No data found</div>;
    }

    return (
        <Container className="containerHardware" sx={{ mt: 10, mb: 20 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} className="image-container">
                    <img src={hardwareData.photo} alt="hardwarephoto" className="hardware-image" />
                </Grid>
                <Grid item xs={12} className="details-container">
                    <Paper elevation={3} className="details-paper">
                        <Typography variant="h5" className="hardware-name">
                            {hardwareData.name}
                        </Typography>
                        <Typography variant="body1" className="hardware-ref">
                            <strong>Référence :</strong> {hardwareData.ref}
                        </Typography>
                        <Box mt={2}>
                            <Typography variant="h6">Specific attributes</Typography>
                            {hardwareData.details_specifiques ? (
                                <ul className="attributes-list">
                                    {Object.entries(hardwareData.details_specifiques).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key} :</strong> {String(value)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body1">Aucun détail spécifique trouvé.</Typography>
                            )}
                        </Box>
                        <Button variant="contained" color="secondary" startIcon={<LocalMallIcon />} className="book-button" onClick={handleDialogOpen}>
                            Book
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { height: '50vh', width: '20vw' } }}>
                <DialogTitle>Book Hardware</DialogTitle>
                <DialogContent>
                    <Booking onClose={handleDialogClose} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default Hardware;