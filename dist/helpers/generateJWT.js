"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (payload) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el JSON Web Token.');
            }
            resolve(token);
        });
    });
};
