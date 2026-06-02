import API from '../api/axios';

const TransactionTable = ({ transactions, onEdit, onRefresh, setMessage }) => {
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await API.delete(`/transactions/${id}`);
            setMessage({ type: 'success', text: 'Transaction deleted successfully!' });
            if (onRefresh) onRefresh();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete transaction.' });
        }
    };

    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No transactions found.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Warehouse</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((t) => (
                            <tr key={t.transactionId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.transactionId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(t.transactionDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.productName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.warehouseName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        t.transactionType === 'IN'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {t.transactionType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.quantityMoved}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => onEdit(t)}
                                        className="text-green-600 hover:text-green-900">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(t.transactionId)}
                                        className="text-red-600 hover:text-red-900">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
