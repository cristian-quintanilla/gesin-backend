import { Router } from 'express';
import { check } from 'express-validator';

import { ordersController } from '../controllers';

// TODO: ADD AUTH MIDDLEWARE

class OrdersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.get('/', ordersController.getOrders);

		this.router.post('/new',
			[
				check('client', 'Customer ID invalid.').isMongoId(),
				check('details', 'Details of the order should not be empty').not().isEmpty(),
				check('details.*.product', 'ID of the product is required.').not().isEmpty(),
				check('details.*.product', 'Product ID invalid.').isMongoId(),
				check('details.*.quantity', 'Quantity of the product is required.').not().isEmpty(),
				check('details.*.quantity', 'Quantity of the product should be a number.').isNumeric(),
			],
			ordersController.createOrder
		);

		this.router.put('/cancel/:id', ordersController.cancelOrder);

		this.router.put('/delivery/:id', ordersController.deliveryOrder);
	}
}

export const ordersRoutes = new OrdersRoutes();
