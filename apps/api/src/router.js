import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { categoryRouter } from './routers/category.router';
import { productRouter } from './routers/product.router';
import { productImageRouter } from './routers/product-image.router';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);

// add another router here ...
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/product/image', productImageRouter);

export default router;
