const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionDate: {
        type: Date,
        required: true,
    },
    quantityMoved: {
        type: Number,
        required: true,
        min: 1,
    },
    transactionType: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true,
    },
    productCode: {
        type: String,
        required: true,
    },
    warehouseCode: {
        type: String,
        required: true,
    },
}, { timestamps: true });

transactionSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    obj.transactionId = obj._id.toString();
    return obj;
};

transactionSchema.statics.getDashboardStats = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$transactionType',
                totalQuantity: { $sum: '$quantityMoved' },
            },
        },
    ]);

    let stockInTotal = 0;
    let stockOutTotal = 0;

    stats.forEach((s) => {
        if (s._id === 'IN') stockInTotal = s.totalQuantity;
        if (s._id === 'OUT') stockOutTotal = s.totalQuantity;
    });

    return { stockInTotal, stockOutTotal };
};

module.exports = mongoose.model('Transaction', transactionSchema);
