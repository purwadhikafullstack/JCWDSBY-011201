import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { cartRouter } from './routers/carts.router';
import { authRouter } from './routers/auth.router';
import { categoryRouter } from './routers/category.router';
import { productRouter } from './routers/product.router';
import { productImageRouter } from './routers/product-image.router';
import { addressRouter } from './routers/address.router';
import { provinceRouter } from './routers/province.router';
import { cityRouter } from './routers/city.router';
import { districtRouter } from './routers/district.router';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);

// add another router here ...
//Wahyu Widiantoro
router.use('/auth', authRouter);
router.use('/address', addressRouter);
router.use('/province', provinceRouter);
router.use('/city', cityRouter);
router.use('/district', districtRouter);

//Fahmi Ardiansyah
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/product/image', productImageRouter);

//Afra
router.use('/cart', cartRouter);

export default router;
