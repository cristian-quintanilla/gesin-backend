"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const routes = __importStar(require("./routes"));
const database_1 = require("./config/database");
//* Configure Environment Variables
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env.dev') });
//* Create the Server
const app = (0, express_1.default)();
//* Connect to the Database
(0, database_1.connectDatabase)();
//* Enable CORS Option
const corsOptions = { origin: `${process.env.FRONTEND_URL}` };
app.use((0, cors_1.default)(corsOptions));
//* Settings
app.set('port', process.env.PORT || 4000);
//* Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//* Routes
app.use('/api/v1/customers', routes.customersRoutes.router);
app.use('/api/v1/products', routes.productsRoutes.router);
app.use('/api/v1/orders', routes.ordersRoutes.router);
app.use('/api/v1/users', routes.usersRoutes.router);
app.use('/api/v1/auth', routes.authRoutes.router);
app.listen(app.get('port'), '0.0.0.0', () => {
    console.log(`Application running on port: ${app.get('port')}`);
});
