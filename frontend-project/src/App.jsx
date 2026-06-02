import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import Warehouse from './pages/Warehouse';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            {isAuthenticated && <Sidebar />}
            <div className="flex-1 flex flex-col overflow-hidden">
                {isAuthenticated && <Navbar />}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="w-full mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
                        <Routes>
                            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/products" element={<ProtectedRoute><Product /></ProtectedRoute>} />
                            <Route path="/warehouses" element={<ProtectedRoute><Warehouse /></ProtectedRoute>} />
                            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
