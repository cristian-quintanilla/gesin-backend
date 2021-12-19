import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

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
	// headers: IncomingHttpHeaders & {
  //   xAuthToken?: string
  // }
}
