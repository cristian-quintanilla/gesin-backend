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
        this.router.use(auth_1.default);
        this.router.get('/', controllers_1.ordersController.getOrders);
        this.router.put('/cancel/:id', controllers_1.ordersController.cancelOrder);
        this.router.put('/deliver/:id', controllers_1.ordersController.deliverOrder);
        this.router.post('/new', [
            (0, express_validator_1.check)('client', 'Customer ID invalid.').isMongoId(),
            (0, express_validator_1.check)('details', 'Details of the order should not be empty').not().isEmpty(),
            (0, express_validator_1.check)('details.*.product', 'ID of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('details.*.product', 'Product ID invalid.').isMongoId(),
            (0, express_validator_1.check)('details.*.quantity', 'Quantity of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('details.*.quantity', 'Quantity of the product should be a number.').isNumeric(),
        ], controllers_1.ordersController.createOrder);
    }
}
exports.ordersRoutes = new OrdersRoutes();
