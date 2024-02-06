import { DB } from '../db';
import resTemplate from '../helper/resTemplate';
import {
  findStoreIdByAdminId,
  getOrdersAdmin,
  getOrdersUser,
  getPagination,
} from '../services/order.service';
import { getStoreByUUIDService } from '../services/store/store.service';
import { addDays, subHours } from 'date-fns';
import {
  getOneTransaction,
  updateProofImg,
  updateProofImgAdmin,
  updateTransactionStatus,
} from '../services/transactions.service';
import fs from 'fs';

export const getAllTransactions = async (req, res, next) => {
  try {
    const invoice = req.query.order_id ?? '';
    const status = req.query.status ?? '';
    const payment = req.query.payment ?? '';
    const storeUUID = req.query.store ?? 'bscRVKQHPOlaGshDx8KES';
    const sort =
      req.query.store === 'asc' ? ['createdAt', 'ASC'] : ['createdAt', 'DESC'];
    const { page, size } = req.query;
    const from = new Date(subHours(req.query.from ?? '2000-01-02', 7));
    const to = new Date(subHours(req.query.to ?? addDays(new Date(), 1), 7));
    const { limit, offset } = getPagination(page, size);
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      const storeData = await findStoreIdByAdminId(req, req.tokenData.id);
      if (req.tokenData.role === 'super') {
        const storeForSuper = (await getStoreByUUIDService(storeUUID)).toJSON();
        const SuperOrderList = await getOrdersAdmin(
          req,
          storeForSuper.id,
          limit,
          offset,
          invoice,
          status,
          payment,
          from,
          to,
        );
        const processedList = SuperOrderList.rows.map((val, idx) => {
          return {
            ...val,
            storeName: val.store.name,
            count: SuperOrderList.count,
          };
        });
        return res.status(200).json({
          ...resTemplate(200, true, 'fetching orders success', processedList),
          count: SuperOrderList.count,
        });
      }
      const orderList = await getOrdersAdmin(
        req,
        storeData?.id ?? 2,
        limit,
        offset,
        invoice,
        status,
        payment,
        from,
        to,
      );

      const processedList = orderList.rows.map((val, idx) => {
        return { ...val, storeName: val.store.name, count: orderList.count };
      });
      return res.status(200).json({
        ...resTemplate(200, true, 'fetching orders success', processedList),
        count: orderList.count,
      });
    } else {
      const userOrderList = await getOrdersUser(
        req,
        req.tokenData.id,
        limit,
        offset,
        invoice,
        status,
        payment,
        from,
        to,
      );
      const processedList = userOrderList.rows.map((val, idx) => {
        return {
          ...val,
          storeName: val.store.name,
          count: userOrderList.count,
        };
      });
      return res.status(200).json({
        ...resTemplate(200, true, 'fetching orders success', processedList),
        count: userOrderList.count,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

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
    await DB.db.sequelize.transaction(async (t) => {
      await updateProofImgAdmin(req, t, null, req.body.status);
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
    console.log('🚀 ~ adminSendingOrders ~ result:', result);
    if (req.body.status !== 'sending') {
      throw resTemplate(401, false, 'forbidden');
    } else if (result?.paymentStatus !== 'paid') {
      throw resTemplate(401, false, 'user has not paid');
    }
    await DB.db.sequelize.transaction(async (t) => {
      await updateTransactionStatus(req, t);
    });
    return res
      .status(200)
      .json(resTemplate(200, true, 'Status Successfully changed to Sending '));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
