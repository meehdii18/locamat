import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Box, Typography } from '@mui/material';
import {db} from "../../firebase.js";
import {doc, setDoc} from "firebase/firestore";
import {auth} from "../../firebase.js";
import PropTypes from "prop-types";

const Booking = ({ onClose, hardwareId }) => {
    const [formData, setFormData] = useState({
        startDate: new Date(),
        endDate: new Date(),
        hardware: hardwareId,
        user: auth.currentUser.uid,
    });

    const handleStartDateChange = (date) => {
        setFormData({ ...formData, startDate: date });
    };

    const handleEndDateChange = (date) => {
        setFormData({ ...formData, endDate: date });
    };

    const handleConfirm = async () => {
        // TODO : Ajouter la vérification de la faisabilité de la reservation

        // TODO : Ajouter la création de la réservation dans firebase ici
        try {
            await setDoc(doc(db, "booking", formData.ref), {
                startDate: formData.startDate,
                endDate: formData.endDate,
                hardwareId: 'hardwareId', //TODO : Remplacer par l'id du hardware
                userId: 'userId', //TODO : Remplacer par l'id de l'utilisateur
            });
            alert('Booking confirmed from', formData.startDate, 'to', formData.endDate)
        } catch (error) {
            alert(error.message);
        }
        onClose();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
                Start Date
            </Typography>
            <DatePicker
                showIcon
                selected={formData.startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={formData.startDate}
                endDate={formData.endDate}
                placeholderText="Select start date"
            />
            <Box mt={2}>
                <Typography variant="h6" gutterBottom textAlign="center">
                    End Date
                </Typography>
                <DatePicker
                    showIcon
                    selected={formData.endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    minDate={formData.startDate}
                    placeholderText="Select end date"
                />
            </Box>
            <Button onClick={onClose} color="secondary" variant="outlined" style={{ marginTop: '20px' }}>
                Close
            </Button>
            <Button onClick={handleConfirm} color="secondary" variant="contained" style={{ marginTop: '10px' }}>
                Confirm
            </Button>
        </Box>
    );
};

export default Booking;

Booking.propTypes = {
    onClose: PropTypes.func.isRequired,
    hardwareId: PropTypes.string.isRequired,
}