export const validateForm = (formData) => {
    let newErrors = {};

    if (!/^[a-zA-Z0-9-]{1,30}$/.test(formData.name)) {
        newErrors.name = "Name must be alphanumeric and between 1-30 characters";
    }

    if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(formData.photo)) {
        newErrors.photo = "Photo URL must be a valid URL and end with .jpg, .jpeg, .png, or .gif";
    }

    if (!/^[a-zA-Z0-9-]{1,30}$/.test(formData.ref)) {
        newErrors.ref = "Reference must be alphanumeric and between 1-30 characters";
    }

    if (!/^[a-zA-Z0-9-]{1,30}$/.test(formData.type)) {
        newErrors.type = "Type must be alphanumeric and between 1-30 characters";
    }

    return newErrors;
};