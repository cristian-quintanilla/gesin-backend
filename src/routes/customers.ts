import { Router } from 'express';
import { check } from 'express-validator';

import { customersController } from '../controllers';
import authMiddleware from '../middlewares/auth';

class CustomersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.get('/',
			authMiddleware,
			customersController.getCustomers
		);

		this.router.get('/:id',
			authMiddleware,
			customersController.getCustomer
		);

		this.router.post('/create',
			authMiddleware,
			[
				check('firstName', 'The first name is required.').not().isEmpty(),
				check('lastName', 'The last name is required.').not().isEmpty(),
				check('company', 'The company name is required.').not().isEmpty(),
				check('email', 'Invalid email.').isEmail(),
			],
			customersController.createCustomer
		);

		this.router.delete('/delete/:id',
			authMiddleware,
			customersController.deleteCustomer
		);

		this.router.put('/edit/:id',
			authMiddleware,
			[
				check('firstName', 'The first name is required.').not().isEmpty(),
				check('lastName', 'The last name is required.').not().isEmpty(),
				check('company', 'The company name is required.').not().isEmpty(),
				check('email', 'Invalid email.').isEmail(),
			],
			customersController.updateCustomer
		);
	}
}

export const customersRoutes = new CustomersRoutes();
