import { useState, useEffect } from 'react';
import API from '../api/axios';
import WarehouseForm from '../components/WarehouseForm';

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingWarehouse, setEditingWarehouse] = useState(null);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await API.get('/warehouses');
            setWarehouses(res.data);
        } catch (err) {
            console.error('Failed to fetch warehouses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (code) => {
        if (!window.confirm('Delete this warehouse? All related products and transactions will also be deleted.')) return;
        try {
            await API.delete(`/warehouses/${code}`);
            if (editingWarehouse?.warehouseCode === code) setEditingWarehouse(null);
            fetchWarehouses();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed. Is the backend server running on port 5001?');
        }
    };

    const handleEdit = (wh) => {
        setEditingWarehouse(wh);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => setEditingWarehouse(null);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Warehouse Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your warehouse locations</p>
            </div>

            <div className="mb-6">
                <WarehouseForm onSuccess={fetchWarehouses} editingWarehouse={editingWarehouse} onCancelEdit={handleCancelEdit} />
            </div>

            {/* Desktop table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Warehouse List</h3>
                </div>
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : warehouses.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No warehouses found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-green-200">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {warehouses.map((w) => (
                                    <tr key={w.warehouseCode} className="hover:bg-green-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{w.warehouseCode}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{w.warehouseName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{w.warehouseLocation}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                            <button onClick={() => handleEdit(w)}
                                                className="text-green-600 hover:text-green-900 font-medium">Edit</button>
                                            <button onClick={() => handleDelete(w.warehouseCode)}
                                                className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500 text-sm">Loading...</div>
                ) : warehouses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500 text-sm">No warehouses found.</div>
                ) : (
                    warehouses.map((w) => (
                        <div key={w.warehouseCode} className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{w.warehouseCode}</span>
                                    <h4 className="font-semibold text-gray-900 text-sm mt-1">{w.warehouseName}</h4>
                                    <p className="text-xs text-gray-600 mt-0.5">{w.warehouseLocation}</p>
                                </div>
                                <div className="flex gap-1 ml-2">
                                    <button onClick={() => handleEdit(w)}
                                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Edit</button>
                                    <button onClick={() => handleDelete(w.warehouseCode)}
                                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Warehouse;
