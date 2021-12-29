"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middlewares/auth"));
class ProductsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', auth_1.default, controllers_1.productsController.getProducts);
        this.router.get('/:id', auth_1.default, controllers_1.productsController.getProduct);
        this.router.post('/create', auth_1.default, [
            (0, express_validator_1.check)('name', 'The name of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product is required.').notEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product should be a number.').isNumeric(),
            (0, express_validator_1.check)('price', 'The price of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('price', 'The price of the product should be a number.').isNumeric(),
        ], controllers_1.productsController.createProduct);
        this.router.delete('/delete/:id', auth_1.default, controllers_1.productsController.deleteProduct);
        this.router.put('/edit/:id', auth_1.default, [
            (0, express_validator_1.check)('name', 'The name of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product is required.').notEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product should be a number.').isNumeric(),
            (0, express_validator_1.check)('price', 'The price of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('price', 'The price of the product should be a number.').isNumeric(),
        ], controllers_1.productsController.updateProduct);
    }
}
exports.productsRoutes = new ProductsRoutes();
