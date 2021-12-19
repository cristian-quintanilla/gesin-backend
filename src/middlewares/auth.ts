import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { DataStoredInToken, RequestWithUser } from '../interfaces/token';

export default (req: RequestWithUser, res: Response, next: NextFunction) => {
	//_ Read token from the header
	const token = <string>req.header('x-auth-token');

	//_ Check if there is a token
	if ( !token ) {
		return res.status(401).json({ msg: 'No token, authorization denied.' });
	}

	//_ Validate the token
	try {
		const decoded = jwt.verify(token, <string>process.env.JWT_SECRET) as DataStoredInToken;
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid.' });
	}
}
