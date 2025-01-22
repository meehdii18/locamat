import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Box, Typography, Alert } from '@mui/material';
import { db, auth } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { collection, query, where, getDocs } from "firebase/firestore";
import './Booking.css';

const Booking = ({ onClose, hardwareId, onSuccess }) => {
    const [formData, setFormData] = useState({
        startDate: new Date(),
        endDate: new Date(),
        hardware: hardwareId,
        user: auth.currentUser.uid,
    });
    const [error, setError] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);

    useEffect(() => {
        if (auth.currentUser) {
            setFormData((prevData) => ({
                ...prevData,
                user: auth.currentUser.uid,
            }));
        }
        fetchBookedDates();
    }, []);

    const fetchBookedDates = async () => {
        const bookingsRef = collection(db, "booking");
        const q = query(bookingsRef, where("hardwareId", "==", hardwareId));
        const querySnapshot = await getDocs(q);
        const dates = querySnapshot.docs.flatMap(doc => {
            const data = doc.data();
            const startDate = data.startDate.toDate();
            const endDate = data.endDate.toDate();
            const dateArray = [];
            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d));
            }
            return dateArray;
        });
        setBookedDates(dates);
    };

    const handleStartDateChange = (date) => {
        setFormData({ ...formData, startDate: date });
    };

    const handleEndDateChange = (date) => {
        setFormData({ ...formData, endDate: date });
    };

    const checkBookingConflict = async (startDate, endDate, hardwareId) => {
        const bookingsRef = collection(db, "booking");
        const q = query(
            bookingsRef,
            where("hardwareId", "==", hardwareId),
            where("startDate", "<=", endDate),
            where("endDate", ">=", startDate)
        );

        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleConfirm = async () => {
        try {
            const conflict = await checkBookingConflict(formData.startDate, formData.endDate, formData.hardware);
            if (conflict) {
                setError("Booking conflict detected. Please choose different dates.");
                return;
            }

            await setDoc(doc(db, "booking", `${formData.user}_${formData.hardware}_${formData.startDate.getTime()}`), {
                startDate: formData.startDate,
                endDate: formData.endDate,
                hardwareId: formData.hardware,
                userId: formData.user,
            });
            console.log(`Booking confirmed from ${formData.startDate} to ${formData.endDate}`);
            setError(null);
            onSuccess("Booking confirmed successfully!");
        } catch (error) {
            setError(error.message);
        }
        onClose();
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            {error && <Alert severity="error">{error}</Alert>}
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
                excludeDates={bookedDates}
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
                    excludeDates={bookedDates}
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
    hardwareId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onSuccess: PropTypes.func.isRequired,
};