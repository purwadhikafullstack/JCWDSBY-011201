import resTemplate from '../helper/resTemplate';
import {
  findStoreIdByAdminId,
  getOrdersAdmin,
  getOrdersUser,
  getPagination,
} from '../services/order.service';

export const getAdminAllTransactions = async (req, res, next) => {
  try {
    const invoice = req.query.order_id ?? '';
    const { page, size } = req.query;

    const { limit, offset } = getPagination(page, size);
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      const storeData = await findStoreIdByAdminId(req, req.tokenData.id);
      if (!storeData.id) {
        throw resTemplate(403, false, 'store data not found');
      }
      const orderList = await getOrdersAdmin(
        req,
        storeData.id,
        limit,
        offset,
        invoice,
      );
      console.log('🚀 ~ getAdminAllTransactions ~ orderList:', orderList);
      return res.status(200).json(orderList.rows);
    } else {
      const userOrderList = await getOrdersUser(
        req,
        req.tokenData.id,
        limit,
        offset,
        invoice,
      );
      return res.status(200).json(userOrderList.rows)
    }
  } catch (error) {
    console.log(error);
  }
};
