import { Router } from 'express';
import { validateAdmin, validateToken } from '../middleware/tokenValidation';

import {
  getAllTransactions,
  updateOrderStatusForAdminController,
} from '../controllers/order.controller';
import {
  createTransactionController,
  getTransactionDetailsController,
  midtransController,
  patchPaymentProofController,
  patchTransactionStatusController,
} from '../controllers/transactions.controller';
import uploader from '../helper/uploader';

const transactionRouter = Router();
//Post
transactionRouter.post(
  '/',
  validateToken,
  createTransactionController,
  midtransController,
);
//Get
transactionRouter.get(
  '/details/:order_id',
  validateToken,
  getTransactionDetailsController,
);

transactionRouter.get('/orders', validateToken, getAllTransactions);

//PAtch
transactionRouter.patch(
  '/proof',
  validateToken,
  uploader('/proof', 1).single('proofUpload'),
  patchPaymentProofController,
);
transactionRouter.patch(
  '/:order_id',
  validateToken,
  patchTransactionStatusController,
);
transactionRouter.patch(
  '/proof/update',
  validateToken,
  validateAdmin,
  updateOrderStatusForAdminController,
);

export { transactionRouter };
