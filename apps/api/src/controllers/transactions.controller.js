import { DB } from '../db';
import {
  createTransaction,
  findStoreByUUID,
  findUserAddressIdForTransaction,
  findUserDataForTransaction,
  getOneTransaction,
  getTransactionDetails,
  handleMidtrans,
  transactionDetailsBulkCreate,
} from '../services/transactionAndOrder/transactions.service';
import resTemplate from '../helper/resTemplate';
import { updateLimitVoucher } from '../services/transactionAndOrder/order.service';
import { findVoucherById } from '../services/transactionAndOrder/transactions2.service';

export const createTransactionController = async (req, res, next) => {
  await DB.initialize();
  try {
    const userAddressData = await findUserAddressIdForTransaction(req);
    const storeData = await findStoreByUUID(req);
    const discountData = await findVoucherById(req.body.discountVoucherId);
    if (discountData && discountData?.limit < 1) {
      throw { rc: 401, message: 'Voucher habis' };
    }
    const result = await DB.db.sequelize.transaction(async (t) => {
      const createData = (
        await createTransaction(req, t, userAddressData.id, storeData.id)
      ).toJSON();
      await transactionDetailsBulkCreate(req, t, createData.id);
      await updateLimitVoucher('minus', req.body.discountVoucherId);
      req.transactionData = createData;
    });
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, 'error creating transaction'));
  }
};

export const midtransController = async (req, res, next) => {
  try {
    const userData = await findUserDataForTransaction(req);
    if (userData) {
      const result = await handleMidtrans(req, userData);
      return res.status(200).json(
        resTemplate(200, true, 'Transaction Recorded', {
          ...result,
          invoice: req.transactionData.invoice,
        }),
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTransactionDetailsController = async (req, res, next) => {
  try {
    const transData = await getOneTransaction(req);
    if (transData) {
      const detailsData = await getTransactionDetails(req, transData.id);
      const processedRes = detailsData.map((val, idx) => {
        return {
          amount: val.amount,
          price: val.price,
          name:
            val.price == 0
              ? 'free' + val.inventory.product.name
              : val.inventory.product.name,
        };
      });
      return res.status(200).json(
        resTemplate(200, true, 'get transaction Details success', {
          status: transData.paymentStatus,
          invoice: transData.invoice,
          paymentMethod: transData.paymentMethod,
          resi: transData.resi,
          shipmentName: transData.shipmentName,
          total: transData.paymentTotal,
          img: transData.paymentProofImg,
          discountData: transData.discount,
          items: [
            ...processedRes,
            {
              name: 'ongkos kirim',
              amount: 1,
              price: transData.shipmentTotal,
            },
          ],
        }),
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
