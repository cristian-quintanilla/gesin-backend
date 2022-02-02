import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middlewares/auth';
import validateFields from '../middlewares/validate';
import { authController } from '../controllers';

class AuthRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.post('/login',
			[
				check('email', 'Invalid email.').isEmail(),
				check('password', 'Invalid password.').isLength({ min: 8 }),
				validateFields,
			],
			authController.authenticateUser
		);

		this.router.get('/me',
			authMiddleware,
			authController.getAuthenticatedUser
		);
	}
}

export const authRoutes = new AuthRoutes();
