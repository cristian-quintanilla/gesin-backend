"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middlewares/auth"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const controllers_1 = require("../controllers");
class UsersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', auth_1.default, [
            (0, express_validator_1.check)('name', 'The name is required.').not().isEmpty(),
            (0, express_validator_1.check)('email', 'Invalid email.').isEmail(),
            (0, express_validator_1.check)('password', 'The password is required.').not().isEmpty(),
            (0, express_validator_1.check)('password', 'The password must have at least 8 characters.').isLength({ min: 8 }),
            validate_1.default,
        ], controllers_1.usersController.createUser);
    }
}
exports.usersRoutes = new UsersRoutes();
