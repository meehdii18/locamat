import { useFirebase } from '../../FirebaseContext.jsx';
import './Login.css';
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
import reactLogo from "../../assets/react.svg";

function Login() {
    const { db, auth } = useFirebase();

    return (
        <div className="containerLogin">
            <div className="logoDiv">
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo" alt="logo"/>
                </a>
                <h1>locaMat</h1>
            </div>
            <LoginForm className="loginForm"/>
        </div>
    );
}

export default Login;