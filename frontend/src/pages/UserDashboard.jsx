import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/user-login');
    };

    return (
        <div className="relative">
            <div className='h-screen'>
                <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                    <img className='w-16' 
                        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
                        alt="uber-logo" 
                    />
                    <button
                        onClick={handleLogout}
                        className='h-10 w-10 bg-white flex items-center justify-center rounded-full'
                    >
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </button>
                </div>
                <div className='h-3/5'>
                    <img 
                        className='h-full w-full object-cover' 
                        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" 
                        alt="map" 
                    />
                </div>
                <div className='h-2/5 p-6'>
                    <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <h3 className="text-lg font-semibold mb-2">Recent Rides</h3>
                        <p className="text-gray-600">No recent rides</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 