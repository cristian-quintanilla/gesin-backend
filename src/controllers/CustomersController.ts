import { Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

import { CustomerType } from '../types';
import CustomerModel, { Customer } from '../models/Customer';

class CustomersController {
	//* Get all Customers
	public getCustomers = async (req: Request, res: Response) => {
		try {
			const { page, size } = req.query;

			const customers = await CustomerModel.find({ status: true})
			.limit( Number(size) * 1 )
			.skip(( (Number(page) - 1) * Number(size) ))
			.select('-__v');

			//_  Get total documents
			const count = await CustomerModel.countDocuments();

			res.json({
				customers,
				totalPages: Math.ceil(count / Number(size)),
				currentPage: Number(page)
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: 'Error getting the list of customers.' });
		}
	}

	//* Get Customber by ID
	public getCustomer = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const customer = await CustomerModel.findById(id).select('-__v');

			if ( !customer ){
				return res.status(404).json({ msg: 'Customer not found.' });
			}

			res.json({ customer });
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: 'Error getting customer.' });
		}
	}

	//* Create Customer
	public createCustomer = async (req: Request, res: Response) => {
		//_ Chech if there are errors
		const errors: Result<ValidationError> = validationResult(req);
		if ( !errors.isEmpty() ) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { firstName, lastName, company, email, address, phone } = req.body;

			//_ Check if the Email already exists
			const customer = await CustomerModel.findOne({ email });
			if ( customer ) {
				return res.status(400).json({ msg: 'E-mail is already in use.' });
			}

			//_ Create the customer
			const newCustomer: Customer = new CustomerModel({
				firstName,
				lastName,
				company,
				email,
				address,
				phone
			});

			//_ Insert into the Database
			await newCustomer.save();
			res.status(201).json({ msg: 'Customer created successfully' });
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: 'Error creating the customer.' });
		}
	}

	//* Delete Customber
	public deleteCustomer = async (req: Request, res: Response) => {
		try {
			//_ Check if the Customer is in the Database
			const { id } = req.params;
			const customer = await CustomerModel.findById(id);
			if ( !customer ) {
				return res.status(404).json({ msg: 'Customer not found.' });
			}

			//_ Delete the Customer (Change Status)
			await customer.updateOne({ status: false });
			res.status(200).json({ msg: 'Customer deleted' });
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: 'Error deleting the customer.' });
		}
	}

	//* Update Customer
	public updateCustomer = async (req: Request, res: Response) => {
		//_ Chech if there are errors
		const errors: Result<ValidationError> = validationResult(req);
		if ( !errors.isEmpty() ) {
			return res.status(400).json({ errors: errors.array() });
		}

		//_ Extract Customer information
		const { id } = req.params;
		const { firstName, lastName, company, email, address, phone } = req.body;

		//_ Create a new Object
		const newCustomer: CustomerType = {
			firstName,
			lastName,
			company,
			email,
			address,
			phone,
		};

		try {
			//_ Check if the user exists
			let customer = await CustomerModel.findById(id);
			if ( !customer )
				return res.status(404).json({ msg: 'Customer not found.' });

			//_ Update data
			customer = await CustomerModel.findByIdAndUpdate(
				{ _id: id },
				{ $set: newCustomer },
				{ new: true }
			);

			res.status(200).json({ msg: 'Customer updated successfully.' });
		} catch (err) {
			console.log(err);
			res.status(500).json({ msg: 'Error updating customer data.' });
		}
	}
}

export const customersController = new CustomersController();
