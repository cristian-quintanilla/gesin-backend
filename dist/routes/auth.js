"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const auth_1 = __importDefault(require("../middlewares/auth"));
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/login', [
            (0, express_validator_1.check)('email', 'Invalid email.').isEmail(),
            (0, express_validator_1.check)('password', 'Invalid password.').isLength({ min: 8 })
        ], controllers_1.authController.authenticateUser);
        this.router.get('/me', auth_1.default, controllers_1.authController.getAuthenticatedUser);
    }
}
exports.authRoutes = new AuthRoutes();
