const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const Transaction = require('../models/Transaction');

exports.createProduct = async (req, res) => {
    try {
        const { productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived, warehouseCode } = req.body;

        if (!productCode || !productName || !category || !unitPrice || !supplierName || !dateReceived || !warehouseCode) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingProduct = await Product.findOne({ productCode });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product code already exists.' });
        }

        const warehouse = await Warehouse.findOne({ warehouseCode });
        if (!warehouse) {
            return res.status(400).json({ message: 'Warehouse not found.' });
        }

        await Product.create({
            productCode,
            productName,
            category,
            quantityInStock: quantityInStock || 0,
            unitPrice,
            supplierName,
            dateReceived,
            warehouseCode
        });

        res.status(201).json({ message: 'Product created successfully.' });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error creating product.' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productName, category, quantityInStock, unitPrice, supplierName, dateReceived, warehouseCode } = req.body;
        const product = await Product.findOne({ productCode: req.params.code });
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        await Product.findOneAndUpdate(
            { productCode: req.params.code },
            { productName, category, quantityInStock, unitPrice, supplierName, dateReceived, warehouseCode }
        );
        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error updating product.' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ productCode: req.params.code });
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        await Transaction.deleteMany({ productCode: req.params.code });
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error deleting product.' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ productName: 1 });
        const warehouses = await Warehouse.find();

        const warehouseMap = {};
        warehouses.forEach((w) => {
            warehouseMap[w.warehouseCode] = { warehouseName: w.warehouseName, warehouseLocation: w.warehouseLocation };
        });

        const enriched = products.map((p) => {
            const pObj = p.toObject();
            const wh = warehouseMap[p.warehouseCode] || {};
            return { ...pObj, ...wh };
        });

        res.json(enriched);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error fetching products.' });
    }
};
