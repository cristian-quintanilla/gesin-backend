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
exports.ordersController = void 0;
const express_validator_1 = require("express-validator");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
// import { queryParams } from '../interfaces/queryParams';
class OrdersController {
    //* Get Orders
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, size, delivered } = req.query;
                let orders;
                let filter;
                //_ Filter or not
                filter = delivered ? { delivered } : {};
                orders = yield Order_1.default.find(filter)
                    .limit(Number(size) * 1)
                    .skip(((Number(page) - 1) * Number(size)))
                    .populate({ path: 'client' })
                    .populate({
                    path: 'details',
                    populate: { path: 'product', select: 'name price' }
                })
                    .select('-__v');
                //_  Get total documents
                const count = yield Order_1.default.countDocuments();
                //_ Return the orders (with / without filters), total pages and current page
                res.json({
                    orders,
                    totalPages: Math.ceil(count / Number(size)),
                    currentPage: Number(page)
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error getting the orders.' });
            }
        });
    }
    //* Create Order
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //_ Check if there are errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { client, details } = req.body;
                //_ Verify if the quantity is greater than the stock
                //_ or if the product is available
                const idsArr = details.map((prod) => prod.product);
                let i = 0;
                let total = 0;
                for (const id in idsArr) {
                    try {
                        const product = yield Product_1.default.find({ _id: idsArr[id] });
                        if (details[i].quantity >= product[0].stock) {
                            return res.status(400).json({ msg: 'You cannot select that quantity.' });
                        }
                        else if (!product[0].status) {
                            return res.status(400).json({ msg: 'The product is not available.' });
                        }
                        else {
                            //_ Remove the quantity selected from the stock
                            const newProduct = {
                                name: product[0].name,
                                price: product[0].price,
                                stock: product[0].stock - details[i].quantity,
                            };
                            //_ Total
                            total += product[0].price * details[i].quantity;
                            yield Product_1.default.findByIdAndUpdate({ _id: product[0].id }, { $set: newProduct }, { new: true });
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                    i++;
                }
                //_ Create the new order
                const order = new Order_1.default({
                    client,
                    details,
                    total: total.toFixed(2)
                });
                //_ Insert into the Database
                yield order.save();
                res.status(201).json({ msg: 'Order saved sucessfully and ready to delivery.' });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error saving the new order.' });
            }
        });
    }
    //* Cancel Order
    cancelOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                //_ Check if the order exists
                let order = yield Order_1.default.findById(id);
                if (!order)
                    return res.status(404).json({ msg: 'Order not found.' });
                //_ Update the Quantity of the products
                const { details } = order;
                const productsArr = details.map(detail => detail.product);
                let i = 0;
                for (const prod in productsArr) {
                    try {
                        let product = yield Product_1.default.find({ _id: productsArr[prod] });
                        const newProduct = {
                            name: product[0].name,
                            price: product[0].price,
                            stock: product[0].stock + details[i].quantity
                        };
                        yield Product_1.default.findByIdAndUpdate({ _id: product[0].id }, { $set: newProduct }, { new: true });
                    }
                    catch (err) {
                        console.log(err);
                    }
                    i++;
                }
                //_ Remove order from the database
                yield Order_1.default.findByIdAndRemove(id);
                res.status(200).json({ msg: 'Order canceled.' });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error canceling the order.' });
            }
        });
    }
    //* Delivery Order
    deliveryOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //_ Check if the order exists
                const { id } = req.params;
                let order = yield Order_1.default.findById(id);
                if (!order)
                    return res.status(404).json({ msg: 'Order not found.' });
                //_ Mark order as delivered
                yield Order_1.default.findOneAndUpdate({ _id: id }, { delivered: true });
                res.status(200).json({ msg: 'Order delivered successfully' });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error delivering the order.' });
            }
        });
    }
}
exports.ordersController = new OrdersController();
