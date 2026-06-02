const Warehouse = require('../models/Warehouse');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.createWarehouse = async (req, res) => {
    try {
        const { warehouseCode, warehouseName, warehouseLocation } = req.body;
        if (!warehouseCode || !warehouseName || !warehouseLocation) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const existing = await Warehouse.findOne({ warehouseCode });
        if (existing) {
            return res.status(400).json({ message: 'Warehouse code already exists.' });
        }
        await Warehouse.create({ warehouseCode, warehouseName, warehouseLocation });
        res.status(201).json({ message: 'Warehouse created successfully.' });
    } catch (error) {
        console.error('Create warehouse error:', error);
        res.status(500).json({ message: 'Server error creating warehouse.' });
    }
};

exports.getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find().sort({ warehouseName: 1 });
        res.json(warehouses);
    } catch (error) {
        console.error('Get warehouses error:', error);
        res.status(500).json({ message: 'Server error fetching warehouses.' });
    }
};

exports.updateWarehouse = async (req, res) => {
    try {
        const { warehouseName, warehouseLocation } = req.body;
        const warehouse = await Warehouse.findOne({ warehouseCode: req.params.code });
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found.' });
        }
        await Warehouse.findOneAndUpdate(
            { warehouseCode: req.params.code },
            { warehouseName, warehouseLocation }
        );
        res.json({ message: 'Warehouse updated successfully.' });
    } catch (error) {
        console.error('Update warehouse error:', error);
        res.status(500).json({ message: 'Server error updating warehouse.' });
    }
};

exports.deleteWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.findOne({ warehouseCode: req.params.code });
        if (!warehouse) {
            return res.status(404).json({ message: 'Warehouse not found.' });
        }
        await Product.deleteMany({ warehouseCode: req.params.code });
        await Transaction.deleteMany({ warehouseCode: req.params.code });
        await Warehouse.findOneAndDelete({ warehouseCode: req.params.code });
        res.json({ message: 'Warehouse and related data deleted successfully.' });
    } catch (error) {
        console.error('Delete warehouse error:', error);
        res.status(500).json({ message: 'Server error deleting warehouse.' });
    }
};
