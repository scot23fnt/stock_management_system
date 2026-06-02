import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductForm from '../components/ProductForm';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productCode) => {
        if (!window.confirm('Delete this product and all its transactions?')) return;
        try {
            await API.delete(`/products/${productCode}`);
            if (editingProduct?.productCode === productCode) setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed. Is the backend server running on port 5001?');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => setEditingProduct(null);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Products Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your product inventory</p>
            </div>

            <div className="mb-6">
                <ProductForm onSuccess={fetchProducts} editingProduct={editingProduct} onCancelEdit={handleCancelEdit} />
            </div>

            {/* Desktop table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Product List</h3>
                </div>
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading products...</div>
                ) : products.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No products found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-green-200">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Supplier</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Warehouse</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((p) => (
                                    <tr key={p.productCode} className="hover:bg-green-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{p.productCode}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.productName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.category}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.quantityInStock}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.unitPrice?.toLocaleString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.supplierName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.warehouseName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(p.dateReceived).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                            <button onClick={() => handleEdit(p)}
                                                className="text-green-600 hover:text-green-900 font-medium">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(p.productCode)}
                                                className="text-red-600 hover:text-red-900 font-medium">
                                                Delete
                                            </button>
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
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500 text-sm">No products found.</div>
                ) : (
                    products.map((p) => (
                        <div key={p.productCode} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{p.productCode}</span>
                                        <span className="text-xs text-gray-400">{p.warehouseName}</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm truncate">{p.productName}</h4>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-600">
                                        <span>Cat: {p.category}</span>
                                        <span>Qty: <strong>{p.quantityInStock}</strong></span>
                                        <span>Price: <strong>{p.unitPrice?.toLocaleString()}</strong></span>
                                        <span>Supplier: {p.supplierName}</span>
                                        <span>Date: {new Date(p.dateReceived).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 ml-2">
                                    <button onClick={() => handleEdit(p)}
                                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(p.productCode)}
                                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Product;
