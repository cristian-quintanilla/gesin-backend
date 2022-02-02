import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middlewares/auth';
import validateFields from '../middlewares/validate';
import { customersController } from '../controllers';

class CustomersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.use(authMiddleware);

		this.router.get('/', customersController.getCustomers);

		this.router.get('/:id', customersController.getCustomer);

		this.router.delete('/delete/:id', customersController.deleteCustomer);

		this.router.post('/create',
			[
				check('firstName', 'The first name is required.').not().isEmpty(),
				check('lastName', 'The last name is required.').not().isEmpty(),
				check('company', 'The company name is required.').not().isEmpty(),
				check('email', 'Invalid email.').isEmail(),
				validateFields,
			],
			customersController.createCustomer
		);

		this.router.put('/edit/:id',
			[
				check('firstName', 'The first name is required.').not().isEmpty(),
				check('lastName', 'The last name is required.').not().isEmpty(),
				check('company', 'The company name is required.').not().isEmpty(),
				check('email', 'Invalid email.').isEmail(),
				validateFields,
			],
			customersController.updateCustomer
		);
	}
}

export const customersRoutes = new CustomersRoutes();
