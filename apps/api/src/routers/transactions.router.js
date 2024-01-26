import { Router } from 'express';
import { validateToken } from '../middleware/tokenValidation';
import { DB } from '../db';
import {
  createTransaction,
  findUserAddressIdForTransaction,
  findUserDataForTransaction,
  handleMidtrans,
  reduceStock,
  transactionDetailsBulkCreate,
} from '../controllers/transactions.controller';
import resTemplate from '../helper/resTemplate';

const transactionRouter = Router();
//Post
transactionRouter.post(
  '/',
  validateToken,
  async (req, res, next) => {
    await DB.initialize();
    try {
      const result = await DB.db.sequelize.transaction(async (t) => {
        const userAddressData = await findUserAddressIdForTransaction(req);
        console.log('🚀 ~ result ~ userAddressData:', userAddressData);
        const createData = (
          await createTransaction(req, t, userAddressData.id)
        ).toJSON();
        console.log('🚀 ~ result ~ createData:', createData);
        await transactionDetailsBulkCreate(req, t, createData.id);
        //   await reduceStock(req, t);
        req.transactionData = createData;
      });
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async (req, res, next) => {
    try {
      const userData = await findUserDataForTransaction(req);
      console.log("🚀 ~ userData:", userData)
      if (userData) {
        const result = await handleMidtrans(req, userData);
        return res
          .status(200)
          .json(resTemplate(200, true, 'Transaction Recorded', result));
      }
    } catch (error) {
      console.log(error);
    }
  },
);

export { transactionRouter };
