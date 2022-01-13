import { Router } from 'express';
import { check } from 'express-validator';

import { ordersController } from '../controllers';
import authMiddleware from '../middlewares/auth';

class OrdersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.get('/',
			authMiddleware,
			ordersController.getOrders
		);

		this.router.post('/new',
			authMiddleware,
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

		this.router.put('/cancel/:id',
			authMiddleware,
			ordersController.cancelOrder
		);

		this.router.put('/deliver/:id',
			authMiddleware,
			ordersController.deliverOrder
		);
	}
}

export const ordersRoutes = new OrdersRoutes();
