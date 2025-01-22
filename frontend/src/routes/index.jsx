import { Routes, Route } from 'react-router-dom';
import UserLogin from '../pages/UserLogin';
import Start from '../pages/Start';
import UserSignup from '../pages/UserSignup';
import CaptainLogin from '../pages/CaptainLogin';
import CaptainSignup from '../pages/CaptainSignup';
import Home from '../pages/home';
import UserDashboard from '../pages/UserDashboard';
import UserLogout from '../pages/UserLogout';
import CaptainDashboard from '../pages/CaptainDashboard';
import CaptainLogout from '../pages/CaptainLogout';
import Riding from '../pages/Riding';
import CaptainRiding from '../pages/CaptainRiding';
import FinishRidePage from '../pages/FinishRide';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/home" element={<Home />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-signup" element={<UserSignup />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/user-logout" element={<UserLogout />} />
            <Route path="/captain-login" element={<CaptainLogin />} />
            <Route path="/captain-signup" element={<CaptainSignup />} />
            <Route path="/captain-dashboard" element={<CaptainDashboard />} />
            <Route path="/captain-logout" element={<CaptainLogout />} />
            <Route path="/riding" element={<Riding />} />
            <Route path="/captain-riding" element={<CaptainRiding />} />
            <Route path="/finish-ride" element={<FinishRidePage />} />
        </Routes>
    );
};

export default AppRoutes; 