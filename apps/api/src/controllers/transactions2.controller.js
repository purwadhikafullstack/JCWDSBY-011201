import { DB } from '../db';
import {
  getOneTransaction,
  getTransactionDetails,
  raiseBookedStock,
  updateProofImg,
  updateTransactionStatus,
} from '../services/transactionAndOrder/transactions.service';
import resTemplate from '../helper/resTemplate';
import fs from 'fs';
import {
  blankProofImg,
  findVoucherCode,
} from '../services/transactionAndOrder/transactions2.service';
import { updateLimitVoucher } from '../services/transactionAndOrder/order.service';
import path from 'path';

export const patchTransactionStatusController = async (req, res, next) => {
  try {
    const dir = path.join(__dirname,'./src/assets/proof')
    await DB.initialize();
    const result = await getOneTransaction(req);
    await DB.db.sequelize.transaction(async (t) => {
      await updateTransactionStatus(req, t);
      if (req.body.status === 'canceled') {
        await updateLimitVoucher('minus', result.discountVoucherId);
        await blankProofImg(req, t);
        if (result?.paymentProofImg) {
          fs.unlinkSync(dir + result?.paymentProofImg);
        }
      }
    });
    return res
      .status(200)
      .json(resTemplate(200, true, 'payment status updated successfully'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const patchPaymentProofController = async (req, res, next) => {
  await DB.initialize();
  try {
    const dir = path.join(__dirname,'./src/assets/proof')
    if (req.file?.filename) {
      const result = await DB.db.sequelize.transaction(async (t) => {
        const transData = await getOneTransaction(req);
        await updateProofImg(req, t, req.file?.filename, 'checking');
        if (transData?.paymentProofImg) {
          fs.unlinkSync(dir + transData?.paymentProofImg);
        }
      });
      return res
        .status(200)
        .json(
          resTemplate(200, true, 'payment proof has been uploaded', result),
        );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const patchTransactionSuccess = async (req, res, next) => {
  await DB.initialize();
  try {
    const transaction = await getOneTransaction(req);
    if (!transaction) {
      throw resTemplate(404, false, 'order not found');
    }
    const details = await getTransactionDetails(req, transaction.id);
    const result = await DB.db.sequelize.transaction(async (t) => {
      await updateTransactionStatus(req, t);
      await raiseBookedStock(req, t, details);
    });
    return res.status(200).json(resTemplate(200, true, 'Checkout Success'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const handleVoucherCodeController = async (req, res, next) => {
  try {
    const result = await findVoucherCode(req.body.voucher);
    if (!result) {
      throw { rc: 404, message: 'Voucher not found' };
    }
    if (req.body.itemTotal < result.minTransaction) {
      throw {
        rc: 401,
        message: 'Total belanja Anda tidak mencukupi batas minimal transaksi',
      };
    }
    if (result.limit < 1) {
      throw {
        rc: 401,
        message: 'Voucher telah melewati batas maksimal',
      };
    }
    const { inventoryId, ...voucherData } = result;
    return res
      .status(200)
      .json(
        resTemplate(
          200,
          true,
          'Voucher Applied to Current Transaction',
          voucherData,
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc, false, error.message));
  }
};
