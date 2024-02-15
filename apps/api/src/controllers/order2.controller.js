import { DB } from '../db';
import resTemplate from '../helper/resTemplate';
import {
  getOneTransaction,
  getOneTransactionByResi,
  getTransactionDetails,
  updateProofImgAdmin,
  updateTransactionStatus,
} from '../services/transactionAndOrder/transactions.service';
import fs from 'fs';
import {
  reduceBookedStock,
  reduceStock,
} from '../services/transactionAndOrder/transactions2.service';
import {
  inputResi,
  updateLimitVoucher,
} from '../services/transactionAndOrder/order.service';
import transactions from '../models/transactions.model';

export const updateOrderStatusForAdminTransferController = async (
  req,
  res,
  next,
) => {
  await DB.initialize();
  const dir = './src/assets/proof/';
  try {
    const result = await getOneTransaction(req);
    if (req.body.status === 'rejected') {
      await DB.db.sequelize.transaction(async (t) => {
        await updateProofImgAdmin(req, t, null, 'rejected');
        await updateLimitVoucher('plus', result.discountVoucherId);
      });
      if (result?.paymentProofImg) {
        if (fs.existsSync(dir + result?.paymentProofImg)) {
          fs.unlinkSync(dir + result?.paymentProofImg);
        }
      }
      return res
        .status(200)
        .json(resTemplate(200, true, 'order rejection success'));
    } else if (req.body.status === 'paid') {
      await DB.db.sequelize.transaction(async (t) => {
        await updateTransactionStatus(req, t);
      });
      return res
        .status(200)
        .json(resTemplate(200, true, 'Order Acceptance Success'));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};
export const cancelOrdersForAdminController = async (req, res, next) => {
  await DB.initialize();
  const dir = './src/assets/proof/';
  try {
    const result = await getOneTransaction(req);
    if (!result) {
      throw resTemplate(404, false, 'transaction not found');
    }
    const details = await getTransactionDetails(req, result.id);
    await DB.db.sequelize.transaction(async (t) => {
      await updateProofImgAdmin(req, t, null, req.body.status);
      await reduceBookedStock(req, t, details);
      await updateLimitVoucher('plus', result.discountVoucherId);
    });
    if (result?.paymentProofImg) {
      if (fs.existsSync(dir + result?.paymentProofImg)) {
        fs.unlinkSync(dir + result?.paymentProofImg);
      }
    }
    return res
      .status(200)
      .json(resTemplate(200, true, 'order rejection success'));
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export const userFinishOrders = async (req, res, next) => {
  await DB.initialize();
  try {
    const result = await getOneTransaction(req);
    if (!result) {
      throw resTemplate(404, false, 'order not found');
    }
    if (result.paymentStatus === 'arrived') {
      await DB.db.sequelize.transaction(async (t) => {
        await updateTransactionStatus(req, t);
      });
      return res
        .status(200)
        .json(resTemplate(200, true, 'Order Telah Selesai'));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export const adminSendingOrders = async (req, res, next) => {
  await DB.initialize();
  try {
    const result = await getOneTransaction(req);
    if (!result) {
      throw resTemplate(404, false, 'transaction not found');
    }
    const details = await getTransactionDetails(req, result.id);
    const isStockSufficient = details.every((item) => {
      return (
        item.inventory.stock >
        (item.discount?.term === 'buy 1 get 1' ? item.amount * 2 : item.amount)
      );
    });
    if (!isStockSufficient) {
      throw { rc: 401, message: 'Stock is not sufficient' };
    }
    if (req.body.status !== 'sending') {
      throw resTemplate(401, false, 'forbidden');
    } else if (result?.paymentStatus !== 'paid') {
      throw resTemplate(401, false, 'user has not paid');
    }
    await DB.db.sequelize.transaction(async (t) => {
      await updateTransactionStatus(req, t);
      await inputResi(req, t);
      await reduceStock(req, t, details);
    });
    return res
      .status(200)
      .json(resTemplate(200, true, 'Status Successfully changed to Sending '));
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export const updateCourierOrderArrival = async (req, res, next) => {
  await DB.initialize();
  try {
    const result = await getOneTransactionByResi(req.body.resi);
    if (!result) {
      throw resTemplate(404, false, 'transaction not found');
    }
    if (req.body.status !== 'arrived' || result.paymentStatus !== 'sending') {
      throw resTemplate(401, false, 'Task is not possible');
    }
    await DB.db.sequelize.transaction(async (t) => {
      await transactions.update(
        { paymentStatus: req.body.status },
        { where: { resi: req.body.resi }, transaction: t },
      );
    });
    return res
      .status(200)
      .json(resTemplate(200, true, 'status has been changed to arrived'));
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};
