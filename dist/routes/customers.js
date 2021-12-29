"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middlewares/auth"));
class CustomersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', auth_1.default, controllers_1.customersController.getCustomers);
        this.router.get('/:id', auth_1.default, controllers_1.customersController.getCustomer);
        this.router.post('/create', auth_1.default, [
            (0, express_validator_1.check)('firstName', 'The first name is required.').not().isEmpty(),
            (0, express_validator_1.check)('lastName', 'The last name is required.').not().isEmpty(),
            (0, express_validator_1.check)('company', 'The company name is required.').not().isEmpty(),
            (0, express_validator_1.check)('email', 'Invalid email.').isEmail(),
        ], controllers_1.customersController.createCustomer);
        this.router.delete('/delete/:id', auth_1.default, controllers_1.customersController.deleteCustomer);
        this.router.put('/edit/:id', auth_1.default, [
            (0, express_validator_1.check)('firstName', 'The first name is required.').not().isEmpty(),
            (0, express_validator_1.check)('lastName', 'The last name is required.').not().isEmpty(),
            (0, express_validator_1.check)('company', 'The company name is required.').not().isEmpty(),
            (0, express_validator_1.check)('email', 'Invalid email.').isEmail(),
        ], controllers_1.customersController.updateCustomer);
    }
}
exports.customersRoutes = new CustomersRoutes();
