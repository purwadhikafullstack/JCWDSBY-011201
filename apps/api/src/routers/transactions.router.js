import { Router } from 'express';
import {
  validateAdmin,
  validateToken,
  validateUser,
} from '../middleware/tokenValidation';

import {
  adminSendingOrders,
  cancelOrdersForAdminController,
  getAllTransactions,
  updateOrderStatusForAdminTransferController,
  userFinishOrders,
} from '../controllers/order.controller';
import {
  createTransactionController,
  getTransactionDetailsController,
  midtransController,
  patchPaymentProofController,
  patchTransactionStatusController,
} from '../controllers/transactions.controller';
import uploader from '../helper/uploader';
import { getOneTransaction } from '../services/transactions.service';

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
  '/admin/cancel',
  validateToken,
  validateAdmin,
  async (req, res, next) => {
    try {
      const result = await getOneTransaction(req);
      if (result?.paymentStatus === 'sending') {
        throw { rc: 401, message: 'context forbidden' };
      }
      next();
    } catch (error) {
      console.log(error);
    }
  },
  cancelOrdersForAdminController,
);
transactionRouter.patch(
  '/admin/sending',
  validateToken,
  validateAdmin,
  adminSendingOrders,
);

transactionRouter.patch(
  '/proof/update',
  validateToken,
  validateAdmin,
  updateOrderStatusForAdminTransferController,
);
transactionRouter.patch(
  '/orders/finish',
  validateToken,
  validateUser,
  userFinishOrders,
);
transactionRouter.patch(
  '/:order_id',
  validateToken,
  patchTransactionStatusController,
);

export { transactionRouter };
