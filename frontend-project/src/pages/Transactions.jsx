import { useState, useEffect } from 'react';
import API from '../api/axios';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await API.get('/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Stock Transactions</h1>
                <p className="text-gray-600 mt-1">Record and manage stock movements</p>
            </div>

            {message.text && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="mb-8">
                <TransactionForm
                    onSuccess={() => { fetchTransactions(); setMessage({ type: '', text: '' }); }}
                    editingTransaction={editingTransaction}
                    onCancelEdit={handleCancelEdit}
                />
            </div>

            <div className="px-6 py-4 bg-white rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">Loading transactions...</div>
            ) : (
                <TransactionTable
                    transactions={transactions}
                    onEdit={handleEdit}
                    onRefresh={fetchTransactions}
                    setMessage={setMessage}
                />
            )}
        </div>
    );
};

export default Transactions;
