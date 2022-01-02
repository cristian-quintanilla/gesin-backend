"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middlewares/auth"));
class OrdersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', auth_1.default, controllers_1.ordersController.getOrders);
        this.router.post('/new', auth_1.default, [
            (0, express_validator_1.check)('client', 'Customer ID invalid.').isMongoId(),
            (0, express_validator_1.check)('details', 'Details of the order should not be empty').not().isEmpty(),
            (0, express_validator_1.check)('details.*.product', 'ID of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('details.*.product', 'Product ID invalid.').isMongoId(),
            (0, express_validator_1.check)('details.*.quantity', 'Quantity of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('details.*.quantity', 'Quantity of the product should be a number.').isNumeric(),
        ], controllers_1.ordersController.createOrder);
        this.router.put('/cancel/:id', auth_1.default, controllers_1.ordersController.cancelOrder);
        this.router.put('/delivery/:id', auth_1.default, controllers_1.ordersController.deliveryOrder);
    }
}
exports.ordersRoutes = new OrdersRoutes();
