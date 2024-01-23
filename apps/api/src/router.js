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
import { utilsRouter } from './routers/utils.router';
import { eventRouter } from './routers/event.router';
import { adminRouter } from './routers/admin.router';
import { inventoryRouter } from './routers/inventory.router';
import { transactionRouter } from './routers/transactions.router';

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
router.use('/utils', utilsRouter);
router.use('/event', eventRouter);

//Fahmi Ardiansyah
router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/product/image', productImageRouter);
router.use('/admin', adminRouter);
router.use('/inventory', inventoryRouter)

//Afra
router.use('/cart', cartRouter);
router.use('/transaction', transactionRouter);

export default router;
