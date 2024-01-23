import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation';
import { DB } from '../db';

const transactionRouter = Router();
//Post
transactionRouter.post('/', validateToken, async (req, res, next) => {
  await DB.initialize();
  try {
  } catch (error) {
    console.log(error);
    next(error)
  }
});

export { transactionRouter };
