import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-green-200">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center">
                    <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                    <h2 className="text-xl font-semibold text-green-900">Stock Management System</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-sm">
                        Welcome, <span className="font-medium text-gray-800">{user?.username}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
