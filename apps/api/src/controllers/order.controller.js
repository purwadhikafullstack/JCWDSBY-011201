import resTemplate from '../helper/resTemplate';
import {
  findStoreIdByAdminId,
  getOrdersAdmin,
  getOrdersUser,
  getPagination,
} from '../services/order.service';

export const getAllTransactions = async (req, res, next) => {
  try {
    const invoice = req.query.order_id ?? '';
    const status = req.query.status ?? '';
    const payment = req.query.payment ?? '';
    const { page, size } = req.query;

    const { limit, offset } = getPagination(page, size);
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      const storeData = await findStoreIdByAdminId(req, req.tokenData.id);
      if (!storeData.id && req.tokenData.role === 'admin') {
        throw resTemplate(403, false, 'store data not found');
      }
      const orderList = await getOrdersAdmin(
        req,
        storeData.id,
        limit,
        offset,
        invoice,
        status,
        payment,
      );
      console.log('🚀 ~ getAdminAllTransactions ~ orderList:', orderList);
      const processedList = orderList.rows.map((val, idx) => {
        return { ...val, storeName: val.store.name, count: orderList.count };
      });
      console.log('🚀 ~ processedList ~ processedList:', processedList);
      return res
        .status(200)
        .json({
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
      );
      const processedList = userOrderList.rows.map((val, idx) => {
        return {
          ...val,
          storeName: val.store.name,
          count: userOrderList.count,
        };
      });
      return res
        .status(200)
        .json({
          ...resTemplate(200, true, 'fetching orders success', processedList),
          count: userOrderList.count,
        });
    }
  } catch (error) {
    console.log(error);
  }
};
