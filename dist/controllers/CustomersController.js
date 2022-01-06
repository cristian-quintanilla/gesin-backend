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
exports.customersController = void 0;
const express_validator_1 = require("express-validator");
const Customer_1 = __importDefault(require("../models/Customer"));
class CustomersController {
    constructor() {
        //* Get all Customers
        this.getCustomers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, size } = req.query;
                const customers = yield Customer_1.default.find({ status: true })
                    .limit(Number(size) * 1)
                    .skip(((Number(page) - 1) * Number(size)))
                    .select('-__v');
                //_  Get total documents
                const count = yield Customer_1.default.countDocuments();
                res.json({
                    customers,
                    totalPages: Math.ceil(count / Number(size)),
                    currentPage: Number(page)
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error getting the list of customers.' });
            }
        });
        //* Get Customber by ID
        this.getCustomer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const customer = yield Customer_1.default.findById(id).select('-__v');
                if (!customer) {
                    return res.status(404).json({ msg: 'Customer not found.' });
                }
                res.json({ customer });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error getting customer.' });
            }
        });
        //* Create Customer
        this.createCustomer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //_ Chech if there are errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const { firstName, lastName, company, email, address, phone } = req.body;
                //_ Check if the Email already exists
                const customer = yield Customer_1.default.findOne({ email });
                if (customer) {
                    return res.status(400).json({ msg: 'E-mail is already in use.' });
                }
                //_ Create the customer
                const newCustomer = new Customer_1.default({
                    firstName,
                    lastName,
                    company,
                    email,
                    address,
                    phone
                });
                //_ Insert into the Database
                yield newCustomer.save();
                res.status(201).json({ msg: 'Customer created successfully' });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error creating the customer.' });
            }
        });
        //* Delete Customber
        this.deleteCustomer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //_ Check if the Customer is in the Database
                const { id } = req.params;
                const customer = yield Customer_1.default.findById(id);
                if (!customer) {
                    return res.status(404).json({ msg: 'Customer not found.' });
                }
                //_ Delete the Customer (Change Status)
                yield customer.updateOne({ status: false });
                res.status(200).json({ msg: 'Customer deleted' });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error deleting the customer.' });
            }
        });
        //* Update Customer
        this.updateCustomer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //_ Chech if there are errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //_ Extract Customer information
            const { id } = req.params;
            const { firstName, lastName, company, email, address, phone } = req.body;
            //_ Create a new Object
            const newCustomer = {
                firstName,
                lastName,
                company,
                email,
                address,
                phone,
            };
            try {
                //_ Check if the user exists
                let customer = yield Customer_1.default.findById(id);
                if (!customer)
                    return res.status(404).json({ msg: 'Customer not found.' });
                //_ Update data
                customer = yield Customer_1.default.findByIdAndUpdate({ _id: id }, { $set: newCustomer }, { new: true });
                res.status(200).json({ msg: 'Customer updated successfully.' });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ msg: 'Error updating customer data.' });
            }
        });
    }
}
exports.customersController = new CustomersController();
