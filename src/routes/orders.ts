import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middlewares/auth';
import validateFields from '../middlewares/validate';
import { ordersController } from '../controllers';

class OrdersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.use(authMiddleware);

		this.router.get('/', ordersController.getOrders);

		this.router.put('/cancel/:id', ordersController.cancelOrder);

		this.router.put('/deliver/:id', ordersController.deliverOrder);

		this.router.post('/new',
			[
				check('client', 'Customer ID invalid.').isMongoId(),
				check('details', 'Details of the order should not be empty').not().isEmpty(),
				check('details.*.product', 'ID of the product is required.').not().isEmpty(),
				check('details.*.product', 'Product ID invalid.').isMongoId(),
				check('details.*.quantity', 'Quantity of the product is required.').not().isEmpty(),
				check('details.*.quantity', 'Quantity of the product should be a number.').isNumeric(),
				validateFields,
			],
			ordersController.createOrder
		);
	}
}

export const ordersRoutes = new OrdersRoutes();
