import { Router } from 'express';
import { check } from 'express-validator';

import { productsController } from '../controllers';

// TODO: ADD AUTH MIDDLEWARE

class ProductsRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.get('/', productsController.getProducts);

		this.router.get('/:id', productsController.getProduct);

		this.router.post('/create',
			[
				check('name', 'The name of the product is required.').not().isEmpty(),
				check('stock', 'The stock of the product is required.').notEmpty(),
				check('stock', 'The stock of the product should be a number.').isNumeric(),
				check('price', 'The price of the product is required.').not().isEmpty(),
				check('price', 'The price of the product should be a number.').isNumeric(),
			],
			productsController.createProduct
		);

		this.router.delete('/delete/:id', productsController.deleteProduct);

		this.router.put('/edit/:id',
			[
				check('name', 'The name of the product is required.').not().isEmpty(),
				check('stock', 'The stock of the product is required.').notEmpty(),
				check('stock', 'The stock of the product should be a number.').isNumeric(),
				check('price', 'The price of the product is required.').not().isEmpty(),
				check('price', 'The price of the product should be a number.').isNumeric(),
			],
			productsController.updateProduct
		);
	}
}

export const productsRoutes = new ProductsRoutes();
