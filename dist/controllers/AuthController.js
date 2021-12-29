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
exports.authController = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
class AuthController {
    constructor() {
        //* Authenticate User
        this.authenticateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //_ Chech if there are errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                //_ Verify if the user exists
                const { email, password } = req.body;
                let user = yield User_1.default.findOne({ email });
                if (!user) {
                    return res.status(400).json({ msg: 'No User with that E-mail.' });
                }
                //_ Verify if the password is correct
                const passwordCorrect = yield bcryptjs_1.default.compare(password, user.password);
                if (!passwordCorrect) {
                    return res.status(400).json({ msg: 'Password is incorrect.' });
                }
                //_ Create and assign a token
                const payload = {
                    user: {
                        _id: user.id,
                        name: user.name,
                    }
                };
                //_ Expires in 24 hours
                jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '24h'
                }, (err, token) => {
                    if (err)
                        throw err;
                    res.json({ token });
                });
            }
            catch (err) {
                console.error(err);
            }
        });
        //* Get Authenticated User
        this.getAuthenticatedUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                //_ Get the User
                const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('-password');
                res.json({ user });
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
        });
    }
}
exports.authController = new AuthController();
