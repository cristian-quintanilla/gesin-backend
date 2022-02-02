import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

import OrderModel, { Order } from '../models/Order';
import { ProductType } from '../types';
import ProductModel from '../models/Product';

class OrdersController {
	//* Get Orders
	public async getOrders (req: Request, res: Response) {
		try {
			const { page, size, delivered } = req.query;
			let orders;
			let filter;

			// Filter or not
			filter = delivered ? { delivered } : {}

			orders = await OrderModel.find(filter)
			.limit(Number(size))
			.skip((Number(page) - 1) * Number(size))
			.populate({ path: 'client' })
			.populate({
				path: 'details',
				populate: { path: 'product', select: 'name price' }
			})
			.sort({ createdAt: 'desc' })
			.select('-__v');

			//  Get total documents
			const count = await OrderModel.countDocuments(filter);

			// Return the orders (with / without filters), total pages and current page
			res.json({
				orders,
				totalPages: Math.ceil(count / Number(size)),
				currentPage: Number(page)
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error getting the orders.' });
		}
	}

	//* Create Order
	public async createOrder (req: Request, res: Response) {
		// Check if there are errors
		const errors: Result<ValidationError> = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { client, details } = req.body;

			// Verify if the quantity is greater than the stock
			// or if the product is available
			const idsArr = details.map((prod: { product: any }) => prod.product);
			let i: number = 0;
			let total: number = 0;

			for (const id in idsArr) {
				try {
					const product = await ProductModel.find({ _id: idsArr[id] });

					if (details[i].quantity > product[0].stock) {
						return res.status(400).json({ msg: `You cannot select that quantity for ${ product[0].name }.` });
					} else if (!product[0].status) {
						return res.status(400).json({ msg: 'The product is not available.' });
					} else {
						// Remove the quantity selected from the stock
						const newProduct: ProductType = {
							name: product[0].name,
							price: product[0].price,
							stock: product[0].stock - details[i].quantity,
						}

						// Total
						total += product[0].price * details[i].quantity;

						await ProductModel.findByIdAndUpdate(
							{ _id: product[0].id },
							{ $set: newProduct },
							{ new: true }
						);
					}
				} catch (err) {
					res.status(500).json({ msg: 'Error creating the order.' });
				}

				i++;
			}

			// Create the new order
			const order: Order = new OrderModel({
				client,
				details,
				total: total.toFixed(2)
			});

			// Insert into the Database
			await order.save();
			res.status(201).json({
				order,
				msg: 'Order saved sucessfully and ready for delivery.'
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error saving the new order.' });
		}
	}

	//* Cancel Order
	public async cancelOrder (req: Request, res: Response) {
		const { id } = req.params;

		try {
			// Check if the order exists
			let order = await OrderModel.findById(id);
			if (!order) return res.status(404).json({ msg: 'Order not found.' });

			// Update the Quantity of the products
			const { details } = order;
			const productsArr = details.map(detail => detail.product);
			let i: number = 0;

			for (const prod in productsArr) {
				try {
					let product = await ProductModel.find({ _id: productsArr[prod] });
					const newProduct: ProductType = {
						name: product[0].name,
						price: product[0].price,
						stock: product[0].stock + details[i].quantity
					}

					await ProductModel.findByIdAndUpdate(
						{ _id: product[0].id },
						{ $set: newProduct },
						{ new: true }
					);
				} catch (err) {
					res.status(500).json({ msg: 'Error canceling the order.' });
				}

				i++;
			}

			// Remove order from the database
			await OrderModel.findByIdAndRemove(id);
			res.status(200).json({ msg: 'Order canceled.' });
		} catch (err) {
			res.status(500).json({ msg: 'Error canceling the order.' });
		}
	}

	//* Delivery Order
	public async deliverOrder (req: Request, res: Response) {
		try {
			// Check if the order exists
			const { id } = req.params;
			let order = await OrderModel.findById(id);

			if (!order) return res.status(404).json({ msg: 'Order not found.' });

			// Mark order as delivered
			await OrderModel.findOneAndUpdate(
				{ _id: id },
				{ delivered: true },
				{ updatedAt: Date.now() }
			);

			res.status(200).json({
				order,
				msg: 'Order delivered successfully'
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error delivering the order.' });
		}
	}
}

export const ordersController = new OrdersController();
