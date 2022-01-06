import mongoose, { Schema, model } from 'mongoose';

export interface Customer extends mongoose.Document {
	firstName: string;
	lastName: string;
	company: string;
	email: string;
	address?: string;
	phone: string;
	status: boolean;
}

const CustomerSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
	},
	company: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowerCase: true,
		trim: true
	},
	address: {
		type: String,
		trim: true,
	},
	phone: {
		type: String,
		trim: true,
	},
	status: {
		type: Boolean,
		default: true
	}
});

export default model<Customer>('Customer', CustomerSchema);
