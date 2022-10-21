const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        // index: { unique: true },
    },
    title: {
        type: String,
        required: true,
    },
    img_url: {
        type: String,
        required: true,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
