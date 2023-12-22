import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { cartRouter } from './routers/carts.router';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);
router.use('/cart', cartRouter);

// add another router here ...

export default router;
