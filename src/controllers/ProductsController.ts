import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

import ProductModel, { Product } from '../models/Product';
import { ProductType } from '../types';

class ProductsController {
	//* Get all Products
	public async getProducts (req: Request, res: Response) {
		try {
			const products = await ProductModel.find({
				status: true,
				stock: { $gt: 0 }
			}).select('-__v');

			res.status(200).json({ products });
		} catch (err) {
			res.status(500).json({ msg: 'Error getting the list of products' });
		}
	}

	//* Get Product by ID
	public async getProduct (req: Request, res: Response) {
		try {
			const { id } = req.params;
			const product = await ProductModel.findById(id).select('-__v');

			if (!product) return res.status(404).json({ msg: 'Product not found.' });

			res.json({ product });
		} catch (err) {
			res.status(500).json({ msg: 'Error getting the product.' });
		}
	}

	//* Create Product
	public async createProduct (req: Request, res: Response) {
		// Check if there are errors
		const errors: Result<ValidationError> = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { name, stock, price } = req.body;

			// Create the product
			const product: Product = new ProductModel({
				name,
				stock,
				price
			});

			// Intert into the Database
			await product.save();
			res.status(201).json({
				product,
				msg: 'Product added successfully.'
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error creating the product.' });
		}
	}

	//* Delete Product
	public async deleteProduct (req: Request, res: Response) {
		try {
			// Check if the Product is in the Database
			const { id } = req.params;
			const product = await ProductModel.findById(id);
			if (!product) return res.status(404).json({ msg: 'Product not found.' });

			// Delete the Product (Change Status)
			await product.updateOne({ status: false });
			res.status(200).json({ msg: 'Product deleted.' });
		} catch (err) {
			res.status(500).json({ msg: 'Error deleting the product.' });
		}
	}

	//* Update Product
	public async updateProduct (req: Request, res: Response) {
		// Check if there are errors
		const errors: Result<ValidationError> = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		// Extract Product information
		const { id } = req.params;
		const { name, stock, price } = req.body;

		// Create a new Object
		const newProduct: ProductType = {
			name,
			stock,
			price
		};

		try {
			// Check if the product exists
			let product = await ProductModel.findById(id);
			if (!product) return res.status(404).json({ msg: 'Product not found.'});

			// Update data
			product = await ProductModel.findByIdAndUpdate(
				{ _id: id },
				{ $set: newProduct },
				{ new: true }
			);

			res.status(200).json({
				product,
				msg: 'Product updated sucessfully.'
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error updating product data.' });
		}
	}
}

export const productsController = new ProductsController();
