import { Request, Response } from 'express';

import { CustomerType } from '../types';
import CustomerModel, { Customer } from '../models/Customer';

class CustomersController {
	//* Get all Customers
	public getCustomers = async (req: Request, res: Response) => {
		try {
			const customers = await CustomerModel.find({
				status: true
			}).select('-__v');

			res.status(200).json({ customers });
		} catch (err) {
			res.status(500).json({ msg: 'Error getting the list of customers.' });
		}
	}

	//* Get Customber by ID
	public getCustomer = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const customer = await CustomerModel.findById(id).select('-__v');

			if (!customer) {
				return res.status(404).json({ msg: 'Customer not found.' });
			}

			res.json({ customer });
		} catch (err) {
			res.status(500).json({ msg: 'Error getting customer.' });
		}
	}

	//* Create Customer
	public createCustomer = async (req: Request, res: Response) => {
		try {
			const { firstName, lastName, company, email, address, phone } = req.body;

			// Check if the Email already exists
			const customer = await CustomerModel.findOne({ email });
			if (customer) {
				return res.status(400).json({ msg: 'E-mail is already in use.' });
			}

			// Create the customer
			const newCustomer: Customer = new CustomerModel({
				firstName,
				lastName,
				company,
				email,
				address,
				phone
			});

			// Insert into the Database
			await newCustomer.save();
			res.status(201).json({
				customer: newCustomer,
				msg: 'Customer created successfully'
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error creating the customer.' });
		}
	}

	//* Delete Customber
	public deleteCustomer = async (req: Request, res: Response) => {
		try {
			// Check if the Customer is in the Database
			const { id } = req.params;
			const customer = await CustomerModel.findById(id);
			if (!customer) {
				return res.status(404).json({ msg: 'Customer not found.' });
			}

			// Delete the Customer (Change Status)
			await customer.updateOne({ status: false });
			res.status(200).json({ msg: 'Customer deleted' });
		} catch (err) {
			res.status(500).json({ msg: 'Error deleting the customer.' });
		}
	}

	//* Update Customer
	public updateCustomer = async (req: Request, res: Response) => {
		// Extract Customer information
		const { id } = req.params;
		const { firstName, lastName, company, email, address, phone } = req.body;

		// Create a new Object
		const newCustomer: CustomerType = {
			firstName,
			lastName,
			company,
			email,
			address,
			phone,
		};

		try {
			// Check if the user exists
			let customer = await CustomerModel.findById(id);
			if (!customer) {
				return res.status(404).json({ msg: 'Customer not found.' });
			}

			// Update data
			customer = await CustomerModel.findByIdAndUpdate(
				{ _id: id },
				{ $set: newCustomer },
				{ new: true }
			);

			res.status(200).json({
				customer,
				msg: 'Customer updated successfully.'
			});
		} catch (err) {
			res.status(500).json({ msg: 'Error updating customer data.' });
		}
	}
}

export const customersController = new CustomersController();
