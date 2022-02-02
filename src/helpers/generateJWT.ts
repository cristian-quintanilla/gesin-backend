import jwt from 'jsonwebtoken';

import { DataStoredInToken } from '../interfaces/token';

export default (payload: DataStoredInToken) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, <string>process.env.JWT_SECRET, {
			expiresIn: '24h'
		}, (err, token) => {
			if (err) {
				reject('No se pudo generar el JSON Web Token.');
			}

			resolve(token);
		});
	});
}
