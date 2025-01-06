import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Hardware from './pages/Hardware/Hardware.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx';
import Admin_Hardware from "./pages/Admin/Hardware/Hardware.jsx";
import Admin_navigation from "./pages/Admin/Navigation/Admin_navigation.jsx";
import UserPage from "./pages/Admin/UserPage/UserPage.jsx";
import CreateUser from "./pages/Admin/CreateUser/CreateUser.jsx";

function App() {

    return (
        <div className="App">
            <Router>
                <Header/>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/hardware/:id" element={<Hardware/>}/>
                    <Route path="/admin" element={<Admin_navigation/>}/>
                    <Route path="/admin/:tab" element={<Admin_navigation/>}/>
                    <Route path="/admin/users/:id" element={<UserPage/>}/>
                    <Route path="/admin/users/createuser" element={<CreateUser/>}/>
                </Routes>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;
