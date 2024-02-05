import { DB } from '../db';
import resTemplate from '../helper/resTemplate';
import {
  findStoreIdByAdminId,
  getOrdersAdmin,
  getOrdersUser,
  getPagination,
} from '../services/order.service';
import { getStoreByUUIDService } from '../services/store/store.service';
import { addDays, addHours, subDays, subHours } from 'date-fns';
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
    console.log('🚀 ~ getAllTransactions ~ from:', from);
    const to = new Date(subHours(req.query.to ?? addHours(new Date(), 7), 7));
    console.log('🚀 ~ getAllTransactions ~ to:', to);
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
      //   if (!storeData?.id && req.tokenData.role === 'admin') {
      //     throw resTemplate(403, false, 'store data not found');
      //   }
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

export const updateOrderStatusForAdminController = async (req, res, next) => {
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
