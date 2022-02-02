import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import generateJWT from '../helpers/generateJWT';
import UserModel from '../models/User';
import { DataStoredInToken, RequestWithUser } from '../interfaces/token';

class AuthController {
	//* Authenticate User
	public authenticateUser = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		try {
			// Verify if the user exists
			let user = await UserModel.findOne({ email });
			if (!user) {
				return res.status(400).json({ msg: 'No User with that E-mail.' });
			}

			// Verify if the password is correct
			const passwordCorrect = await bcryptjs.compare(password, user.password);
			if (!passwordCorrect) {
				return res.status(400).json({ msg: 'Password is incorrect.' });
			}

			// Create and assign a token
			const payload: DataStoredInToken = {
				user: {
					_id: user.id,
					name: user.name,
				}
			}

			const token = await generateJWT(payload);

			res.status(201).json({ token });
		} catch (err) {
			res.status(401).json({ msg: 'Unauthorized user.' });
		}
	}

	//* Get Authenticated User
	public getAuthenticatedUser = async (req: RequestWithUser, res: Response) => {
		try {
			const user = await UserModel.findById(req.user?._id).select('-password');
			res.json({ user });
		} catch (err) {
			res.status(404).send({ msg: 'User not found.' });
		}
	}
}

export const authController = new AuthController();
