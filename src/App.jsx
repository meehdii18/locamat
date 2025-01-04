import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Hardware from './pages/Hardware/Hardware.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx';
import Admin_Users from './pages/Admin/Users/Users.jsx';
import UserPage from "./pages/Admin/UserPage/UserPage.jsx";

function App() {

    return (
        <div className="App">
            <Router>
                <Header/>
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/hardware/:id" element={<Hardware/>}/>
                        <Route path="/admin/users" element={<Admin_Users/>}/>
                        <Route path="/admin/users/:id" element={<UserPage/>}/>
                    </Routes>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;
