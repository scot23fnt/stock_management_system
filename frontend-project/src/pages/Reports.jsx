import { useState } from 'react';
import API from '../api/axios';
import ReportTable from '../components/ReportTable';

const Reports = () => {
    const [reportType, setReportType] = useState('');
    const [params, setParams] = useState({
        date: '',
        startDate: '',
        endDate: '',
        year: '',
        month: '',
    });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const reportOptions = [
        { value: 'daily', label: 'Daily Report' },
        { value: 'weekly', label: 'Weekly Report' },
        { value: 'monthly', label: 'Monthly Report' },
        { value: 'available-stock', label: 'Available Stock Report' },
        { value: 'stock-in', label: 'Stock In Report' },
        { value: 'stock-out', label: 'Stock Out Report' },
    ];

    const handleReportTypeChange = (value) => {
        setReportType(value);
        setData(null);
        setError('');
        setParams({ date: '', startDate: '', endDate: '', year: '', month: '' });
    };

    const handleParamChange = (e) => {
        setParams({ ...params, [e.target.name]: e.target.value });
    };

    const generateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setData(null);

        try {
            let res;
            switch (reportType) {
                case 'daily':
                    res = await API.get('/transactions/reports/daily', { params: { date: params.date } });
                    break;
                case 'weekly':
                    res = await API.get('/transactions/reports/weekly', { params: { startDate: params.startDate, endDate: params.endDate } });
                    break;
                case 'monthly':
                    res = await API.get('/transactions/reports/monthly', { params: { year: params.year, month: params.month } });
                    break;
                case 'available-stock':
                    res = await API.get('/transactions/reports/available-stock');
                    break;
                case 'stock-in':
                    res = await API.get('/transactions/reports/stock-in', { params: { startDate: params.startDate, endDate: params.endDate } });
                    break;
                case 'stock-out':
                    res = await API.get('/transactions/reports/stock-out', { params: { startDate: params.startDate, endDate: params.endDate } });
                    break;
                default:
                    throw new Error('Invalid report type');
            }
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate report.');
        } finally {
            setLoading(false);
        }
    };

    const getColumns = () => {
        switch (reportType) {
            case 'available-stock':
                return [
                    { header: 'Code', accessor: 'productCode' },
                    { header: 'Product', accessor: 'productName' },
                    { header: 'Category', accessor: 'category' },
                    { header: 'Qty in Stock', accessor: 'quantityInStock' },
                    { header: 'Unit Price', accessor: 'unitPrice' },
                    { header: 'Total Value', render: (row) => (row.totalValue?.toLocaleString()) },
                    { header: 'Warehouse', accessor: 'warehouseName' },
                    { header: 'Location', accessor: 'warehouseLocation' },
                ];
            default:
                return [
                    { header: 'ID', accessor: 'transactionId' },
                    { header: 'Date', render: (row) => new Date(row.transactionDate).toLocaleDateString() },
                    { header: 'Product', accessor: 'productName' },
                    { header: 'Category', accessor: 'category' },
                    { header: 'Warehouse', accessor: 'warehouseName' },
                    { header: 'Type', render: (row) => (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            row.transactionType === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>{row.transactionType}</span>
                    )},
                    { header: 'Quantity', accessor: 'quantityMoved' },
                ];
        }
    };

    const renderParams = () => {
        switch (reportType) {
            case 'daily':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" value={params.date} onChange={handleParamChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required />
                    </div>
                );
            case 'weekly':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="date" name="startDate" value={params.startDate} onChange={handleParamChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="date" name="endDate" value={params.endDate} onChange={handleParamChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required />
                        </div>
                    </div>
                );
            case 'monthly':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input type="number" name="year" value={params.year} onChange={handleParamChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., 2026" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select name="month" value={params.month} onChange={handleParamChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required>
                                <option value="">Select Month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );
            case 'stock-in':
            case 'stock-out':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="date" name="startDate" value={params.startDate} onChange={handleParamChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="date" name="endDate" value={params.endDate} onChange={handleParamChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const reportLabel = reportOptions.find((o) => o.value === reportType)?.label || 'Report';

    const getPlainColumns = () => {
        if (reportType === 'available-stock') {
            return ['Code', 'Product', 'Category', 'Qty in Stock', 'Unit Price', 'Total Value', 'Warehouse', 'Location'];
        }
        return ['ID', 'Date', 'Product', 'Category', 'Warehouse', 'Type', 'Quantity'];
    };

    const getPlainRow = (row) => {
        if (reportType === 'available-stock') {
            return [
                row.productCode, row.productName, row.category, row.quantityInStock,
                row.unitPrice, row.totalValue?.toLocaleString() || (row.quantityInStock * row.unitPrice).toLocaleString(),
                row.warehouseName || '', row.warehouseLocation || '',
            ];
        }
        return [
            row.transactionId || row._id,
            new Date(row.transactionDate).toLocaleDateString(),
            row.productName || '', row.category || '', row.warehouseName || '',
            row.transactionType,
            row.quantityMoved,
        ];
    };

    const printReport = () => {
        const win = window.open('', '_blank');
        const styles = Array.from(document.styleSheets)
            .map((sheet) => {
                try {
                    return Array.from(sheet.cssRules || []).map((r) => r.cssText).join('');
                } catch (e) { return ''; }
            }).join('');

        const rows = data.map((row) =>
            `<tr>${getPlainColumns().map((_, i) => `<td style="border:1px solid #ddd;padding:8px;text-align:left">${getPlainRow(row)[i]}</td>`).join('')}</tr>`
        ).join('');

        win.document.write(`
            <html><head><title>${reportLabel}</title>
            <style>body{font-family:Arial,sans-serif;padding:20px}
            h2{margin-bottom:5px}
            table{border-collapse:collapse;width:100%;margin-top:15px}
            th{background:#1e40af;color:#fff;border:1px solid #1e40af;padding:8px;text-align:left}
            td{border:1px solid #ddd;padding:8px}
            tr:nth-child(even){background:#f9fafb}
            .meta{color:#666;font-size:13px;margin-bottom:15px}
</style></head><body>
            <h2>${reportLabel}</h2>
            <div class="meta">Generated: ${new Date().toLocaleString()} | Records: ${data.length}</div>
            <table><thead><tr>${getPlainColumns().map((c) => `<th>${c}</th>`).join('')}</tr></thead>
            <tbody>${rows}</tbody></table></body></html>`);
        win.document.close();
        win.focus();
        win.print();
    };

    const downloadCSV = () => {
        const headers = getPlainColumns();
        const rows = data.map((row) => getPlainRow(row).map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reportLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                <p className="text-gray-600 mt-1">Generate inventory and stock movement reports</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Report</h3>
                <form onSubmit={generateReport} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                        <select value={reportType} onChange={(e) => handleReportTypeChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required>
                            <option value="">Select Report Type</option>
                            {reportOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {reportType && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            {renderParams()}
                        </div>
                    )}

                    {reportType && (
                        <button type="submit" disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-800 disabled:opacity-50 transition-all shadow-lg shadow-green-500/30">
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    )}
                </form>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {data && (
                <div>
                    <div className="flex justify-end space-x-3 mb-4">
                        <button onClick={printReport}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                        <button onClick={downloadCSV}
                            className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download CSV
                        </button>
                    </div>
                    <ReportTable
                        title={reportOptions.find((o) => o.value === reportType)?.label || 'Report'}
                        data={data}
                        columns={getColumns()}
                    />
                </div>
            )}
        </div>
    );
};

export default Reports;
