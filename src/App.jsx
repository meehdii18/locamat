import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Hardware from './pages/Hardware/Hardware.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx';
import Admin_navigation from "./pages/Admin/Navigation/Admin_navigation.jsx";
import CreateUser from "./pages/Admin/CreateUser/CreateUser.jsx";
import HardwareList from "./pages/Hardware/HardWareList.jsx";
import CreateHardware from "./pages/Admin/CreateHardware/CreateHardware.jsx";
import EditHardware from "./pages/Admin/EditHardware/EditHardware.jsx";


function App() {

    return (
        <div className="App">
            <Router>
                <Header/>
                <Routes classname="routes">
                    <Route path="/" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/hardware/:id" element={<Hardware/>}/>
                    <Route path="/hardware-list/:type" element={<HardwareList/>}/>
                    <Route path="/admin" element={<Admin_navigation/>}/>
                    <Route path="/admin/:tab" element={<Admin_navigation/>}/>
                    <Route path="/admin/users/createuser" element={<CreateUser/>}/>
                    <Route path="/admin/hardware/createhardware" element={<CreateHardware/>}/>
                    <Route path="/admin/hardware/edithardware/:id" element={<EditHardware/>}/>
                </Routes>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;
