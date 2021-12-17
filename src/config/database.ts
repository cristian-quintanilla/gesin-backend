import mongoose from 'mongoose';

export const connectDatabase = async () => {
	try{
		await mongoose.connect(`${ process.env.DB_CONNECTION }`, {});

		console.log('Database connected...');
	} catch (error){
		console.log(error);
		throw new Error('Error initializing Database.');
	}
}
