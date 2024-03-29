import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { resolve } from 'path';

import * as routes from './routes';
import { connectDatabase } from './config/database';

//* Configure Environment Variables
config({ path: resolve(__dirname, '../.env.dev') });

//* Create the Server
const app = express();

//* Connect to the Database
connectDatabase();

//* CORS
app.use(cors());

//* Settings
app.set('port', process.env.PORT || 4000);

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* Routes
app.use('/api/v1/customers', routes.customersRoutes.router);
app.use('/api/v1/products', routes.productsRoutes.router);
app.use('/api/v1/orders', routes.ordersRoutes.router);
app.use('/api/v1/users', routes.usersRoutes.router);
app.use('/api/v1/auth', routes.authRoutes.router);

app.listen(app.get('port'), '0.0.0.0', () => {
	console.log(`Application running on port: ${ app.get('port') }`);
});
