"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middlewares/auth"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const controllers_1 = require("../controllers");
class ProductsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.use(auth_1.default);
        this.router.get('/', controllers_1.productsController.getProducts);
        this.router.get('/:id', controllers_1.productsController.getProduct);
        this.router.delete('/delete/:id', controllers_1.productsController.deleteProduct);
        this.router.post('/create', [
            (0, express_validator_1.check)('name', 'The name of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product is required.').notEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product should be a number.').isNumeric(),
            (0, express_validator_1.check)('price', 'The price of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('price', 'The price of the product should be a number.').isNumeric(),
            validate_1.default,
        ], controllers_1.productsController.createProduct);
        this.router.put('/edit/:id', [
            (0, express_validator_1.check)('name', 'The name of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product is required.').notEmpty(),
            (0, express_validator_1.check)('stock', 'The stock of the product should be a number.').isNumeric(),
            (0, express_validator_1.check)('price', 'The price of the product is required.').not().isEmpty(),
            (0, express_validator_1.check)('price', 'The price of the product should be a number.').isNumeric(),
            validate_1.default,
        ], controllers_1.productsController.updateProduct);
    }
}
exports.productsRoutes = new ProductsRoutes();
