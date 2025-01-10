import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Box, Typography } from '@mui/material';

const Booking = ({ onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleConfirm = () => {
        // TODO : Ajouter la vérification de la faisabilité de la reservation
        // TODO : Ajouter la création de la réservation dans firebase ici
        console.log('Booking confirmed from', startDate, 'to', endDate);
        onClose();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" gutterBottom>
                Start Date
            </Typography>
            <DatePicker
                showIcon
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select start date"
            />
            <Box mt={2}>
                <Typography variant="h6" gutterBottom textAlign="center">
                    End Date
                </Typography>
                <DatePicker
                    showIcon
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
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