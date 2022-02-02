import { Router } from 'express';
import { check } from 'express-validator';

import authMiddleware from '../middlewares/auth';
import validateFields from '../middlewares/validate';
import { productsController } from '../controllers';

class ProductsRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.use(authMiddleware);

		this.router.get('/', productsController.getProducts);

		this.router.get('/:id', productsController.getProduct);

		this.router.delete('/delete/:id', productsController.deleteProduct);

		this.router.post('/create',
			[
				check('name', 'The name of the product is required.').not().isEmpty(),
				check('stock', 'The stock of the product is required.').notEmpty(),
				check('stock', 'The stock of the product should be a number.').isNumeric(),
				check('price', 'The price of the product is required.').not().isEmpty(),
				check('price', 'The price of the product should be a number.').isNumeric(),
				validateFields,
			],
			productsController.createProduct
		);

		this.router.put('/edit/:id',
			[
				check('name', 'The name of the product is required.').not().isEmpty(),
				check('stock', 'The stock of the product is required.').notEmpty(),
				check('stock', 'The stock of the product should be a number.').isNumeric(),
				check('price', 'The price of the product is required.').not().isEmpty(),
				check('price', 'The price of the product should be a number.').isNumeric(),
				validateFields,
			],
			productsController.updateProduct
		);
	}
}

export const productsRoutes = new ProductsRoutes();
