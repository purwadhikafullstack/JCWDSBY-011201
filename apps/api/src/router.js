import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { categoryRouter } from './routers/category.router';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);

// add another router here ...
router.use('/category', categoryRouter);

export default router;
