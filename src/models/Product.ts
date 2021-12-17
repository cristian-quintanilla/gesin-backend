import mongoose, { Schema, model } from 'mongoose';

export interface Product extends mongoose.Document {
	name: string;
	stock: number;
	price: number;
	status: boolean;
}

const ProductSchema = new Schema({
	name:  {
		type: String,
		required: true,
		trim: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	status: {
		type: Boolean,
		default: true
	}
});

export default model<Product>('Product', ProductSchema);
