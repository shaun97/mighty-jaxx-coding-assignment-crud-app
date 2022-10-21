const Product = require("../model/productModel");

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);

        res.status(200).json({
            status: "success",
            product: newProduct,
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

// not working
exports.editProduct = async (req, res) => {
    try {
        const { sku, title, img_url } = req.body;

        if (!sku) {
            throw "Please specify an SKU";
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { sku: sku },
            req.body
        );

        if (!updatedProduct) {
            throw "Please key in a valid SKU";
        }

        res.status(200).json({
            status: "success",
            updatedProduct,
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

exports.getAllProducts = async (req, res) => {
    query = req.query.search ?? "";
    try {
        const products = await Product.find({
            sku: { $regex: query, $options: "i" },
        });

        res.status(200).json({
            status: "success",
            products,
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    let productSku = req.query.sku;
    try {
        const deletedProduct = await Product.deleteOne({ sku: productSku }); //contains the id as well

        if (deletedProduct.deletedCount == 0) {
            throw "Failed to delete the specified product";
        }

        if (!productSku) {
            throw "Please select a product to delete";
        }

        res.status(200).json({
            status: "success",
            deleted_product: deletedProduct,
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};
