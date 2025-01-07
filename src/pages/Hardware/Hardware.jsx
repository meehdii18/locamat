// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../FirebaseContext.jsx";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Container, Grid, Typography, Paper, Box } from "@mui/material";
import './Hardware.css';

import './Hardware.css';

function Hardware() {

    const { db } = useFirebase();



    const { id } = useParams(); // Fetch the id from the url
    const [hardwareData, setHardwareData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "hardware", id); // Path to the hardware document
                const docSnap = await getDoc(docRef); // Get the document

                if (docSnap.exists()) {
                    setHardwareData({id: docSnap.id, ...docSnap.data()});
                } else {
                    setError("This hardware does not exist.");
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

    if (!hardwareData) {
        return <div>No data found</div>;
    }

    return (
        <Container className="containerHardware">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} className="top-left">
                    <img src={hardwareData.photo} alt="hardwarephoto" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} className="bottom-left">
                    <img src={"https://www.calendriergratuit.fr/images/annuel3/calendrier-2025.jpg"} alt="calendar" />
                </Grid>
                <Grid item xs={12} sm={6} md={4} className="top-right">
                    <Typography variant="h1">{hardwareData.name}</Typography>
                </Grid>
                <Grid item xs={12} className="bottom-right">
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="body1">
                            <strong>Nom :</strong>
                            <span>{hardwareData.name}</span>
                        </Typography>
                        <Typography variant="body1">
                            <strong>Référence :</strong>
                            <span>{hardwareData.ref}</span>
                        </Typography>
                        <Box mt={2}>
                            <Typography variant="h2">Specific attributes</Typography>
                            {hardwareData.details_specifiques ? (
                                <ul>
                                    {Object.entries(hardwareData.details_specifiques).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key} :</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body1">Aucun détail spécifique trouvé.</Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Hardware;