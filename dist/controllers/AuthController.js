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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateJWT_1 = __importDefault(require("../helpers/generateJWT"));
const User_1 = __importDefault(require("../models/User"));
class AuthController {
    constructor() {
        //* Authenticate User
        this.authenticateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Verify if the user exists
                let user = yield User_1.default.findOne({ email });
                if (!user) {
                    return res.status(400).json({ msg: 'No User with that E-mail.' });
                }
                // Verify if the password is correct
                const passwordCorrect = yield bcryptjs_1.default.compare(password, user.password);
                if (!passwordCorrect) {
                    return res.status(400).json({ msg: 'Password is incorrect.' });
                }
                // Create and assign a token
                const payload = {
                    user: {
                        _id: user.id,
                        name: user.name,
                    }
                };
                const token = yield (0, generateJWT_1.default)(payload);
                res.status(201).json({ token });
            }
            catch (err) {
                res.status(401).json({ msg: 'Unauthorized user.' });
            }
        });
        //* Get Authenticated User
        this.getAuthenticatedUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('-password');
                res.json({ user });
            }
            catch (err) {
                res.status(404).send({ msg: 'User not found.' });
            }
        });
    }
}
exports.authController = new AuthController();
