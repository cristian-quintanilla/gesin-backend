import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middlewares/auth';
import validateFields from '../middlewares/validate';
import { usersController } from '../controllers';

class UsersRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.post('/create',
			authMiddleware,
			[
				check('name', 'The name is required.').not().isEmpty(),
				check('email', 'Invalid email.').isEmail(),
				check('password', 'The password is required.').not().isEmpty(),
				check('password', 'The password must have at least 8 characters.').isLength({ min: 8 }),
				validateFields,
			],
			usersController.createUser
		);
	}
}

export const usersRoutes = new UsersRoutes();
