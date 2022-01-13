import { Request } from 'express';

export interface DataStoredInToken {
	user: {
		_id: string;
		name: string;
	}
}

export interface RequestWithUser extends Request {
	user?: {
		_id: string;
		name: string;
	},
}
