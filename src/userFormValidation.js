// src/validation.js
export const validateForm = (formData) => {
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

    return newErrors;
};