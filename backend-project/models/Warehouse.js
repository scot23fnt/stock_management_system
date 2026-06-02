const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    warehouseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    warehouseName: {
        type: String,
        required: true,
        trim: true,
    },
    warehouseLocation: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

warehouseSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Warehouse', warehouseSchema);
