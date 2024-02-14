import resTemplate from '../helper/resTemplate';
import {
  findStoreIdByAdminId,
  getOrdersAdmin,
  getOrdersUser,
  getPagination,
} from '../services/transactionAndOrder/order.service';
import { getStoreByUUIDService } from '../services/store/store.service';
import { addDays, subHours } from 'date-fns';
import transactionDetails from '../models/transactionDetails.model';
import inventory from '../models/inventory.model';
import product from '../models/product.model';
import product_image from '../models/product-image.model';

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
          sort,
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
        sort,
      );
      const processedList = orderList.rows.map((val, idx) => {
        return { ...val, storeName: val.store.name, count: orderList.count };
      });
      console.log('🚀 ~ processedList ~ processedList:', processedList);
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
        sort,
      );
      const promise = userOrderList.rows.map(async (val, idx) => {
        return await transactionDetails.findOne({
          where: { transactionId: val.id },
          raw: true,
          nest: true,
          include: [
            {
              model: inventory,
              required: true,
              include: [
                { model: product, required: true, include: [product_image] },
              ],
            },
          ],
        });
      });
      const countPromise = await Promise.all(
        userOrderList.rows.map(async (val, idx) => {
          return await transactionDetails.count({
            where: { transactionId: val.id },
          });
        }),
      );
      const promised = await Promise.all(promise);
      const processedList = userOrderList.rows.map((val, idx) => {
        return {
          ...val,
          storeName: val.store.name,
          firstItem: promised[idx],
          itemCount: countPromise[idx],
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
