"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const Product_1 = __importDefault(require("../models/Product"));
class ProductsController {
    //* Get all Products
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield Product_1.default.find({
                    status: true,
                    stock: { $gt: 0 }
                }).select('-__v');
                res.status(200).json({ products });
            }
            catch (err) {
                res.status(500).json({ msg: 'Error getting the list of products' });
            }
        });
    }
    //* Get Product by ID
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield Product_1.default.findById(id).select('-__v');
                if (!product) {
                    return res.status(404).json({ msg: 'Product not found.' });
                }
                res.json({ product });
            }
            catch (err) {
                res.status(500).json({ msg: 'Error getting the product.' });
            }
        });
    }
    //* Create Product
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, stock, price } = req.body;
                // Create the product
                const product = new Product_1.default({
                    name,
                    stock,
                    price
                });
                // Intert into the Database
                yield product.save();
                res.status(201).json({
                    product,
                    msg: 'Product added successfully.'
                });
            }
            catch (err) {
                res.status(500).json({ msg: 'Error creating the product.' });
            }
        });
    }
    //* Delete Product
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the Product is in the Database
                const { id } = req.params;
                const product = yield Product_1.default.findById(id);
                if (!product) {
                    return res.status(404).json({ msg: 'Product not found.' });
                }
                // Delete the Product (Change Status)
                yield product.updateOne({ status: false });
                res.status(200).json({ msg: 'Product deleted.' });
            }
            catch (err) {
                res.status(500).json({ msg: 'Error deleting the product.' });
            }
        });
    }
    //* Update Product
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract Product information
            const { id } = req.params;
            const { name, stock, price } = req.body;
            // Create a new Object
            const newProduct = {
                name,
                stock,
                price
            };
            try {
                // Check if the product exists
                let product = yield Product_1.default.findById(id);
                if (!product) {
                    return res.status(404).json({ msg: 'Product not found.' });
                }
                // Update data
                product = yield Product_1.default.findByIdAndUpdate({ _id: id }, { $set: newProduct }, { new: true });
                res.status(200).json({
                    product,
                    msg: 'Product updated sucessfully.'
                });
            }
            catch (err) {
                res.status(500).json({ msg: 'Error updating product data.' });
            }
        });
    }
}
exports.productsController = new ProductsController();
