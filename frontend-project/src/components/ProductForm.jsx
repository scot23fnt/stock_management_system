import { useState, useEffect } from 'react';
import API from '../api/axios';

const ProductForm = ({ onSuccess, editingProduct, onCancelEdit }) => {
    const [formData, setFormData] = useState({
        productCode: '',
        productName: '',
        category: '',
        quantityInStock: 0,
        unitPrice: '',
        supplierName: '',
        dateReceived: '',
        warehouseCode: '',
    });
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                productCode: editingProduct.productCode,
                productName: editingProduct.productName,
                category: editingProduct.category,
                quantityInStock: editingProduct.quantityInStock,
                unitPrice: editingProduct.unitPrice,
                supplierName: editingProduct.supplierName,
                dateReceived: editingProduct.dateReceived?.split('T')[0] || '',
                warehouseCode: editingProduct.warehouseCode,
            });
        }
    }, [editingProduct]);

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
            if (editingProduct) {
                const { productCode, ...rest } = formData;
                await API.put(`/products/${productCode}`, rest);
                setMessage({ type: 'success', text: 'Product updated successfully!' });
            } else {
                await API.post('/products', formData);
                setMessage({ type: 'success', text: 'Product created successfully!' });
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
        setFormData({
            productCode: '',
            productName: '',
            category: '',
            quantityInStock: 0,
            unitPrice: '',
            supplierName: '',
            dateReceived: '',
            warehouseCode: '',
        });
        if (onCancelEdit) onCancelEdit();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                {editingProduct && (
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                        <input type="text" name="productCode" value={formData.productCode} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            readOnly={!!editingProduct}
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" name="productName" value={formData.productName} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input type="number" name="quantityInStock" value={formData.quantityInStock} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            min="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                        <input type="number" step="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Received</label>
                        <input type="date" name="dateReceived" value={formData.dateReceived} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                        <select name="warehouseCode" value={formData.warehouseCode} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            required>
                            <option value="">Select Warehouse</option>
                            {warehouses.map((w) => (
                                <option key={w.warehouseCode} value={w.warehouseCode}>
                                    {w.warehouseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm">
                        {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
