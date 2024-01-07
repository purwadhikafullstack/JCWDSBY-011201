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
import { userRouter } from './routers/user.router';
import { storesRouter } from './routers/stores.router';
import { adminRouter } from './routers/admin.router';

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
router.use('/user', userRouter);
router.use('/store', storesRouter);

//Fahmi Ardiansyah
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/product/image', productImageRouter);
router.use('/admin', adminRouter)

//Afra
router.use('/cart', cartRouter);

export default router;
