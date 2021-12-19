import { Router } from 'express';
import { check } from 'express-validator';

import { authController } from '../controllers';
import authMiddleware from '../middlewares/auth';

class AuthRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.post('/login',
			[
				check('email', 'Invalid email.').isEmail(),
				check('password', 'Invalid password.').isLength({ min: 8 })
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
