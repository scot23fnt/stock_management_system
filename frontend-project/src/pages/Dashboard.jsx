import { useState, useEffect } from 'react';
import API from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalWarehouses: 0,
        stockInTotal: 0,
        stockOutTotal: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/transactions/reports/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            bgColor: 'bg-gradient-to-br from-green-500 to-green-700',
        },
        {
            title: 'Total Warehouses',
            value: stats.totalWarehouses,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            bgColor: 'bg-gradient-to-br from-teal-500 to-teal-700',
        },
        {
            title: 'Stock In',
            value: stats.stockInTotal,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
            ),
            bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
        },
        {
            title: 'Stock Out',
            value: stats.stockOutTotal,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            ),
            bgColor: 'bg-red-500',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to StockHub Management System</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${card.bgColor} text-white`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <a href="/products" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border-l-4 border-green-500">
                            <p className="font-medium text-green-700">Add New Product</p>
                            <p className="text-sm text-green-500 mt-1">Register a new product in the system</p>
                        </a>
                        <a href="/warehouses" className="block p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border-l-4 border-emerald-500">
                            <p className="font-medium text-emerald-700">Create Warehouse</p>
                            <p className="text-sm text-emerald-500 mt-1">Add a new warehouse location</p>
                        </a>
                        <a href="/transactions" className="block p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors border-l-4 border-teal-500">
                            <p className="font-medium text-teal-700">Record Transaction</p>
                            <p className="text-sm text-teal-500 mt-1">Record stock in or stock out movement</p>
                        </a>
                        <a href="/reports" className="block p-4 bg-lime-50 rounded-lg hover:bg-lime-100 transition-colors border-l-4 border-lime-500">
                            <p className="font-medium text-lime-700">View Reports</p>
                            <p className="text-sm text-lime-500 mt-1">Generate inventory and stock reports</p>
                        </a>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Overview</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Products</span>
                            <span className="font-bold text-gray-800">{stats.totalProducts}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Warehouses</span>
                            <span className="font-bold text-gray-800">{stats.totalWarehouses}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Stock In</span>
                            <span className="font-bold text-green-600">{stats.stockInTotal}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Total Stock Out</span>
                            <span className="font-bold text-red-600">{stats.stockOutTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
