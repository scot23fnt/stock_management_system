const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');

exports.createTransaction = async (req, res) => {
    try {
        const { transactionDate, quantityMoved, transactionType, productCode, warehouseCode } = req.body;

        if (!transactionDate || !quantityMoved || !transactionType || !productCode || !warehouseCode) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (!['IN', 'OUT'].includes(transactionType)) {
            return res.status(400).json({ message: 'Transaction type must be IN or OUT.' });
        }

        const product = await Product.findOne({ productCode });
        if (!product) {
            return res.status(400).json({ message: 'Product not found.' });
        }

        const warehouse = await Warehouse.findOne({ warehouseCode });
        if (!warehouse) {
            return res.status(400).json({ message: 'Warehouse not found.' });
        }

        await Transaction.create({ transactionDate, quantityMoved, transactionType, productCode, warehouseCode });
        res.status(201).json({ message: 'Transaction created successfully.' });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ message: 'Server error creating transaction.' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ transactionDate: -1, _id: -1 });
        const products = await Product.find();
        const warehouses = await Warehouse.find();

        const productMap = {};
        products.forEach((p) => { productMap[p.productCode] = { productName: p.productName, category: p.category }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName }; });

        const enriched = transactions.map((t) => {
            const tObj = t.toObject();
            return {
                ...tObj,
                transactionId: tObj._id.toString(),
                ...(productMap[t.productCode] || {}),
                ...(warehouseMap[t.warehouseCode] || {}),
            };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error fetching transactions.' });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
        res.json(transaction);
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ message: 'Server error fetching transaction.' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { transactionDate, quantityMoved, transactionType, productCode, warehouseCode } = req.body;

        const existingTransaction = await Transaction.findById(req.params.id);
        if (!existingTransaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        if (!['IN', 'OUT'].includes(transactionType)) {
            return res.status(400).json({ message: 'Transaction type must be IN or OUT.' });
        }

        const product = await Product.findOne({ productCode });
        if (!product) {
            return res.status(400).json({ message: 'Product not found.' });
        }

        const warehouse = await Warehouse.findOne({ warehouseCode });
        if (!warehouse) {
            return res.status(400).json({ message: 'Warehouse not found.' });
        }

        await Transaction.findByIdAndUpdate(req.params.id, { transactionDate, quantityMoved, transactionType, productCode, warehouseCode });
        res.json({ message: 'Transaction updated successfully.' });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ message: 'Server error updating transaction.' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const existingTransaction = await Transaction.findById(req.params.id);
        if (!existingTransaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ message: 'Server error deleting transaction.' });
    }
};

exports.getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ message: 'Date parameter is required (YYYY-MM-DD).' });
        }
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const transactions = await Transaction.find({
            transactionDate: { $gte: start, $lte: end },
        }).sort({ _id: -1 });

        const products = await Product.find();
        const warehouses = await Warehouse.find();
        const productMap = {};
        products.forEach((p) => { productMap[p.productCode] = { productName: p.productName, category: p.category }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName }; });

        const enriched = transactions.map((t) => {
            const tObj = t.toObject();
            return { ...tObj, transactionId: tObj._id.toString(), ...(productMap[t.productCode] || {}), ...(warehouseMap[t.warehouseCode] || {}) };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Daily report error:', error);
        res.status(500).json({ message: 'Server error generating daily report.' });
    }
};

exports.getWeeklyReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate parameters are required.' });
        }

        const transactions = await Transaction.find({
            transactionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).sort({ transactionDate: -1, _id: -1 });

        const products = await Product.find();
        const warehouses = await Warehouse.find();
        const productMap = {};
        products.forEach((p) => { productMap[p.productCode] = { productName: p.productName, category: p.category }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName }; });

        const enriched = transactions.map((t) => {
            const tObj = t.toObject();
            return { ...tObj, transactionId: tObj._id.toString(), ...(productMap[t.productCode] || {}), ...(warehouseMap[t.warehouseCode] || {}) };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Weekly report error:', error);
        res.status(500).json({ message: 'Server error generating weekly report.' });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month parameters are required.' });
        }

        const start = new Date(parseInt(year), parseInt(month) - 1, 1);
        const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

        const transactions = await Transaction.find({
            transactionDate: { $gte: start, $lte: end },
        }).sort({ transactionDate: -1, _id: -1 });

        const products = await Product.find();
        const warehouses = await Warehouse.find();
        const productMap = {};
        products.forEach((p) => { productMap[p.productCode] = { productName: p.productName, category: p.category }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName }; });

        const enriched = transactions.map((t) => {
            const tObj = t.toObject();
            return { ...tObj, transactionId: tObj._id.toString(), ...(productMap[t.productCode] || {}), ...(warehouseMap[t.warehouseCode] || {}) };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Monthly report error:', error);
        res.status(500).json({ message: 'Server error generating monthly report.' });
    }
};

exports.getAvailableStockReport = async (req, res) => {
    try {
        const products = await Product.find().sort({ productName: 1 });
        const warehouses = await Warehouse.find();

        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName, warehouseLocation: w.warehouseLocation }; });

        const report = products.map((p) => {
            const pObj = p.toObject();
            const wh = warehouseMap[p.warehouseCode] || {};
            return {
                productCode: pObj.productCode,
                productName: pObj.productName,
                category: pObj.category,
                quantityInStock: pObj.quantityInStock,
                unitPrice: pObj.unitPrice,
                totalValue: pObj.quantityInStock * pObj.unitPrice,
                ...wh,
            };
        });

        res.json(report);
    } catch (error) {
        console.error('Stock report error:', error);
        res.status(500).json({ message: 'Server error generating stock report.' });
    }
};

exports.getStockInReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate parameters are required.' });
        }

        const transactions = await Transaction.find({
            transactionType: 'IN',
            transactionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).sort({ transactionDate: -1 });

        const products = await Product.find();
        const warehouses = await Warehouse.find();
        const productMap = {};
        products.forEach((p) => { productMap[p.productCode] = { productName: p.productName, category: p.category }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName }; });

        const enriched = transactions.map((t) => {
            const tObj = t.toObject();
            return { ...tObj, transactionId: tObj._id.toString(), ...(productMap[t.productCode] || {}), ...(warehouseMap[t.warehouseCode] || {}) };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Stock in report error:', error);
        res.status(500).json({ message: 'Server error generating stock in report.' });
    }
};

exports.getStockOutReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate parameters are required.' });
        }

        const transactions = await Transaction.find({
            transactionType: 'OUT',
            transactionDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).sort({ transactionDate: -1 });

        const products = await Product.find();
        const warehouses = await Warehouse.find();
        const productMap = {};
        products.forEach((p) => { productMap[p.productCode] = { productName: p.productName, category: p.category }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName }; });

        const enriched = transactions.map((t) => {
            const tObj = t.toObject();
            return { ...tObj, transactionId: tObj._id.toString(), ...(productMap[t.productCode] || {}), ...(warehouseMap[t.warehouseCode] || {}) };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Stock out report error:', error);
        res.status(500).json({ message: 'Server error generating stock out report.' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalProducts, totalWarehouses, { stockInTotal, stockOutTotal }] = await Promise.all([
            Product.countDocuments(),
            Warehouse.countDocuments(),
            Transaction.getDashboardStats(),
        ]);
        res.json({ totalProducts, totalWarehouses, stockInTotal, stockOutTotal });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats.' });
    }
};
