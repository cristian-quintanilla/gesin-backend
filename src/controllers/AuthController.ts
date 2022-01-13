import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User';
import { DataStoredInToken, RequestWithUser } from '../interfaces/token';

class AuthController {
	//* Authenticate User
	public authenticateUser = async (req: Request, res: Response) => {
		//_ Chech if there are errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			//_ Verify if the user exists
			const { email, password } = req.body;
			let user = await UserModel.findOne({ email });
			if (!user) return res.status(400).json({ msg: 'No User with that E-mail.' });

			//_ Verify if the password is correct
			const passwordCorrect = await bcryptjs.compare(password, user.password);
			if (!passwordCorrect) return res.status(400).json({ msg: 'Password is incorrect.' });

			//_ Create and assign a token
			const payload: DataStoredInToken = {
				user: {
					_id: user.id,
					name: user.name,
				}
			}

			//_ Expires in 24 hours
			jwt.sign(payload, <string>process.env.JWT_SECRET, {
				expiresIn: '24h'
			}, (err, token) => {
				if (err) throw err;

				res.json({ token });
			});
		} catch (err) {
			res.status(401).json({ msg: 'Unauthorized user.' });
		}
	}

	//* Get Authenticated User
	public getAuthenticatedUser = async (req: RequestWithUser, res: Response) => {
		try {
			//_ Get the User
			const user = await UserModel.findById(req.user?._id).select('-password');
			res.json({ user });
		} catch (err) {
			res.status(404).send({ msg: 'User not found.' });
		}
	}
}

export const authController = new AuthController();
