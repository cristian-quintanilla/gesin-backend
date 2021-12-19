import { Router } from 'express';
import { check } from 'express-validator';

import { usersController } from '../controllers';
import authMiddleware from '../middlewares/auth';

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
			],
			usersController.createUser
		);
	}
}

export const usersRoutes = new UsersRoutes();
