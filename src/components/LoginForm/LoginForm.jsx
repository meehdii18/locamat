import * as React from 'react';
import { useState } from 'react';
import "./LoginForm.css";
import { auth } from "../../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import errorCodes from "../../assets/errorcode.json";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { OutlinedInput, InputAdornment, TextField, Button } from "@mui/material";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            const errorMessage = errorCodes.authErrors[err.code] || err.message;
            setError(errorMessage);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="connexionDiv">
            <p className="welcome">Bienvenue !</p>
            <p className="pleaseid">Veuillez vous identifiez</p>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <TextField
                    className="inputText"
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    className="inputText"
                    variant="outlined"
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small"/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    className="submitButton"
                    sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'darkViolet' } }}
                >
                    Connexion
                </Button>
            </form>
        </div>
    );
}
