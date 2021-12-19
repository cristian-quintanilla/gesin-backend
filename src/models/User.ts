import mongoose, { Schema, model } from 'mongoose';

export interface User extends mongoose.Document {
	name: string;
	email: string;
	password: string;
}

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	}
});

export default model<User>('User', UserSchema);
