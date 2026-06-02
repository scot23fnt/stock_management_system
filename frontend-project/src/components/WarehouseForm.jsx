import { useState, useEffect } from 'react';
import API from '../api/axios';

const WarehouseForm = ({ onSuccess, editingWarehouse, onCancelEdit }) => {
    const [formData, setFormData] = useState({
        warehouseCode: '',
        warehouseName: '',
        warehouseLocation: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (editingWarehouse) {
            setFormData({
                warehouseCode: editingWarehouse.warehouseCode,
                warehouseName: editingWarehouse.warehouseName,
                warehouseLocation: editingWarehouse.warehouseLocation,
            });
        }
    }, [editingWarehouse]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (editingWarehouse) {
                const { warehouseCode, ...rest } = formData;
                await API.put(`/warehouses/${warehouseCode}`, rest);
                setMessage({ type: 'success', text: 'Warehouse updated successfully!' });
            } else {
                await API.post('/warehouses', formData);
                setMessage({ type: 'success', text: 'Warehouse created successfully!' });
            }
            resetForm();
            if (onSuccess) onSuccess();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot connect to backend. Is the server running on port 5001?' : 'Operation failed.') });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ warehouseCode: '', warehouseName: '', warehouseLocation: '' });
        if (onCancelEdit) onCancelEdit();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
                </h3>
                {editingWarehouse && (
                    <button onClick={resetForm}
                        className="text-sm text-red-600 hover:text-red-800 font-medium">
                        Cancel Edit
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Code</label>
                        <input type="text" name="warehouseCode" value={formData.warehouseCode} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            readOnly={!!editingWarehouse} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
                        <input type="text" name="warehouseName" value={formData.warehouseName} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm">
                        {loading ? 'Saving...' : editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WarehouseForm;
