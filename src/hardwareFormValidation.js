export const validateForm = (formData) => {
    let newErrors = {};

    if (!/^[a-zA-Z0-9- ]{1,30}$/.test(formData.name)) {
        newErrors.name = "Name must be alphanumeric, can include spaces, and be between 1-30 characters";
    }

    if (!/^[a-zA-Z0-9-]{1,30}$/.test(formData.ref)) {
        newErrors.ref = "Reference must be alphanumeric and between 1-30 characters";
    }

    if (!/^[a-zA-Z0-9-]{1,30}$/.test(formData.type)) {
        newErrors.type = "Type must be alphanumeric and between 1-30 characters";
    }

    return newErrors;
};