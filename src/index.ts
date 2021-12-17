import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { resolve } from 'path';

import { connectDatabase } from './config/database';
import { customersRoutes, ordersRoutes, productsRoutes } from './routes';

//* Configure Environment Variables
config({ path: resolve(__dirname, '../.env.dev') });

//* Create the Server
const app = express();

//* Connect to the Database
connectDatabase();

//* Enable CORS Option
const corsOptions = {	origin: `${ process.env.FRONTEND_URL }` };
app.use( cors(corsOptions) );

//* Settings
app.set('port', process.env.PORT || 4000);

//* Middlewares
app.use( express.json() );
app.use( express.urlencoded({ extended: false }) );

//* Routes
app.use('/api/v1/customers', customersRoutes.router);
app.use('/api/v1/products', productsRoutes.router);
app.use('/api/v1/orders', ordersRoutes.router);
// TODO
//_ app.use('/api/v1/auth');
//_ app.use('/api/v1/admin');

app.listen(app.get('port'), '0.0.0.0', () => {
	console.log(`Application running on port: ${ app.get('port') }`);
});
