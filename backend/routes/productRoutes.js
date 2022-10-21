const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/userController");

const {
    createProduct,
    editProduct,
    getAllProducts,
    deleteProduct,
} = require("../controllers/productController");
const { create } = require("../model/userModel");

router
    .route("/")
    .get(protect, getAllProducts)
    .post(protect, createProduct)
    .delete(protect, deleteProduct)
    .patch(protect, editProduct);

module.exports = router;
