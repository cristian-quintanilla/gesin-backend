import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';

import UserModel, { User } from '../models/User';

class UsersController {
	//* Create User
	public createUser = async (req: Request, res: Response) => {
		// Chech if there are errors
		const errors: Result<ValidationError> = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { name, email, password } = req.body;

			// Check if the Email already exists
			const user = await UserModel.findOne({ email });
			if (user) return res.status(400).json({ msg: 'E-mail is already in use.' });

			// Create the user
			const newUser: User = new UserModel({
				name,
				email,
				password,
			});

			// Encrypt the password
			const salt = await bcryptjs.genSalt(10);
			newUser.password = await bcryptjs.hash(password, salt);

			// Save the user
			await newUser.save();
			res.status(201).json({ msg: 'User created successfully.' });
		} catch (err) {
			res.status(500).json({ msg: 'Error creating the user.' });
		}
	}
}

export const usersController = new UsersController();
