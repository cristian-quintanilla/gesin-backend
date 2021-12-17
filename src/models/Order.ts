import mongoose, { Schema, model, mongo } from 'mongoose';

export interface Order extends mongoose.Document {
	client: string;
	details: { product: string, quantity: number }[];
	total: number;
	delivered: boolean;
}

const OrderSchema = new Schema({
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer'
	},
	details: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
		},
		quantity: Number,
	}],
	total: {
		type: Number,
		required: true,
	},
	delivered: {
		type: Boolean,
		default: false,
	}
});

export default model<Order>('Order', OrderSchema);
