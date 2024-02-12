import { Router } from 'express';
import {
  validateAdmin,
  validateToken,
  validateUser,
} from '../middleware/tokenValidation';

import {
  adminSendingOrders,
  cancelOrdersForAdminController,
  updateCourierOrderArrival,
  updateOrderStatusForAdminTransferController,
  userFinishOrders,
} from '../controllers/order2.controller';
import {
  createTransactionController,
  getTransactionDetailsController,
  handleVoucherCodeController,
  midtransController,
  patchPaymentProofController,
  patchTransactionStatusController,
  patchTransactionSuccess,
} from '../controllers/transactions.controller';
import uploader from '../helper/uploader';
import { getOneTransaction } from '../services/transactionAndOrder/transactions.service';
import { getAllTransactions } from '../controllers/order.controller';

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
  '/success/:order_id',
  validateToken,
  patchTransactionSuccess,
);
transactionRouter.patch('/courier/arrival', updateCourierOrderArrival);
transactionRouter.patch(
  '/:order_id',
  validateToken,
  patchTransactionStatusController,
);
transactionRouter.post(
  '/voucher',
  validateToken,
  validateUser,
  handleVoucherCodeController,
);

export { transactionRouter };
