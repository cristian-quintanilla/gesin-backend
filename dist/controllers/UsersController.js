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
exports.usersController = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
class UsersController {
    constructor() {
        //* Create User
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Chech if there are errors
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });
            try {
                const { name, email, password } = req.body;
                // Check if the Email already exists
                const user = yield User_1.default.findOne({ email });
                if (user)
                    return res.status(400).json({ msg: 'E-mail is already in use.' });
                // Create the user
                const newUser = new User_1.default({
                    name,
                    email,
                    password,
                });
                // Encrypt the password
                const salt = yield bcryptjs_1.default.genSalt(10);
                newUser.password = yield bcryptjs_1.default.hash(password, salt);
                // Save the user
                yield newUser.save();
                res.status(201).json({ msg: 'User created successfully.' });
            }
            catch (err) {
                res.status(500).json({ msg: 'Error creating the user.' });
            }
        });
    }
}
exports.usersController = new UsersController();
