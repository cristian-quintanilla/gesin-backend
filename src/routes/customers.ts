import { Router } from 'express';
import { check } from 'express-validator';

import { customersController } from '../controllers';

// TODO: ADD AUTH MIDDLEWARE

class CustomersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.get('/', customersController.getCustomers);

		this.router.get('/:id', customersController.getCustomer);

		this.router.post('/create',
			[
				check('firstName', 'The first name is required.').not().isEmpty(),
				check('lastName', 'The last name is required.').not().isEmpty(),
				check('company', 'The company name is required.').not().isEmpty(),
				check('email', 'Invalid email.').isEmail(),
			],
			customersController.createCustomer
		);

		this.router.delete('/delete/:id', customersController.deleteCustomer);

		this.router.put('/edit/:id',
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
