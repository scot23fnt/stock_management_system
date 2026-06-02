import { useState, useEffect } from 'react';
import API from '../api/axios';

const TransactionForm = ({ onSuccess, editingTransaction, onCancelEdit }) => {
    const [formData, setFormData] = useState({
        transactionDate: '',
        quantityMoved: '',
        transactionType: 'IN',
        productCode: '',
        warehouseCode: '',
    });
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProducts();
        fetchWarehouses();
    }, []);

    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                transactionDate: editingTransaction.transactionDate?.split('T')[0] || '',
                quantityMoved: editingTransaction.quantityMoved,
                transactionType: editingTransaction.transactionType,
                productCode: editingTransaction.productCode,
                warehouseCode: editingTransaction.warehouseCode,
            });
        }
    }, [editingTransaction]);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const res = await API.get('/warehouses');
            setWarehouses(res.data);
        } catch (err) {
            console.error('Failed to fetch warehouses:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (editingTransaction) {
                await API.put(`/transactions/${editingTransaction.transactionId}`, formData);
                setMessage({ type: 'success', text: 'Transaction updated successfully!' });
            } else {
                await API.post('/transactions', formData);
                setMessage({ type: 'success', text: 'Transaction created successfully!' });
            }
            resetForm();
            if (onSuccess) onSuccess();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            transactionDate: '',
            quantityMoved: '',
            transactionType: 'IN',
            productCode: '',
            warehouseCode: '',
        });
        if (onCancelEdit) onCancelEdit();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                        <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                        <select name="transactionType" value={formData.transactionType} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                            <option value="IN">Stock In</option>
                            <option value="OUT">Stock Out</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                        <select name="productCode" value={formData.productCode} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                            <option value="">Select Product</option>
                            {products.map((p) => (
                                <option key={p.productCode} value={p.productCode}>
                                    {p.productName} ({p.productCode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                        <select name="warehouseCode" value={formData.warehouseCode} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                            <option value="">Select Warehouse</option>
                            {warehouses.map((w) => (
                                <option key={w.warehouseCode} value={w.warehouseCode}>
                                    {w.warehouseName} ({w.warehouseCode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Moved</label>
                        <input type="number" name="quantityMoved" value={formData.quantityMoved} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            min="1" required />
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    {editingTransaction && (
                        <button type="button" onClick={resetForm}
                            className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                    )}
                    <button type="submit" disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                        {loading ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Create Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
