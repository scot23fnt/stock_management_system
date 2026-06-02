const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    quantityInStock: {
        type: Number,
        default: 0,
        min: 0,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    supplierName: {
        type: String,
        required: true,
        trim: true,
    },
    dateReceived: {
        type: Date,
        required: true,
    },
    warehouseCode: {
        type: String,
        required: true,
    },
}, { timestamps: true });

productSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Product', productSchema);
