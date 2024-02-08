import { DB } from '../db';
import resTemplate from '../helper/resTemplate';
import {
  getOneTransaction,
  getTransactionDetails,
  updateProofImgAdmin,
  updateTransactionStatus,
} from '../services/transactionAndOrder/transactions.service';
import fs from 'fs';
import { reduceBookedStock, reduceStock } from '../services/transactionAndOrder/transactions2.service';
import { inputResi } from '../services/transactionAndOrder/order.service';

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
    next(resTemplate(error.status, true, error.message));
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
    const details = await getTransactionDetails(req,result.id)
    await DB.db.sequelize.transaction(async (t) => {
      await updateProofImgAdmin(req, t, null, req.body.status);
      await reduceBookedStock(req,t,details)
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
    next(resTemplate(error.status, true, error.message));
  }
};

export const userFinishOrders = async (req, res, next) => {
  await DB.initialize();
  try {
    const result = await getOneTransaction(req);
    console.log('🚀 ~ userFinishOrders ~ result:', result);
    if (!result) {
      throw resTemplate(404, false, 'order not found');
    }
    if (
      result.paymentStatus === 'sending' ||
      result.paymentStatus === 'arrived'
    ) {
      await DB.db.sequelize.transaction(async (t) => {
        await updateTransactionStatus(req, t);
      });
      return res
        .status(200)
        .json(resTemplate(200, true, 'Order Telah Selesai'));
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

export const adminSendingOrders = async (req, res, next) => {
  await DB.initialize();
  try {
    const result = await getOneTransaction(req);
    if (!result) {
      throw resTemplate(404, false, 'transaction not found');
    }
    console.log('🚀 ~ adminSendingOrders ~ result:', result);
    const details = await getTransactionDetails(req, result.id);
    console.log("🚀 ~ adminSendingOrders ~ details:", details)
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
    next(error);
  }
};