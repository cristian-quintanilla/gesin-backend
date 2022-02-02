import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

export default (req: Request, res: Response, next: NextFunction) => {
	// Error handling
	const errors: Result<ValidationError> = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			ok: false,
			errors: errors.mapped(),
		});
	}

	next();
};
