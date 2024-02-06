import { DB } from '../db';
import {
  createTransaction,
  findStoreByUUID,
  findUserAddressIdForTransaction,
  findUserDataForTransaction,
  getOneTransaction,
  getTransactionDetails,
  handleMidtrans,
  reduceStock,
  transactionDetailsBulkCreate,
  updateProofImg,
  updateTransactionStatus,
} from '../services/transactions.service';
import resTemplate from '../helper/resTemplate';
import fs from 'fs';

export const createTransactionController = async (req, res, next) => {
  await DB.initialize();
  try {
    const result = await DB.db.sequelize.transaction(async (t) => {
      const userAddressData = await findUserAddressIdForTransaction(req);
      const storeData = await findStoreByUUID(req);
      console.log('🚀 ~ result ~ storeData:', storeData);
      const createData = (
        await createTransaction(req, t, userAddressData.id, storeData.id)
      ).toJSON();
      console.log('🚀 ~ result ~ createData:', createData);
      await transactionDetailsBulkCreate(req, t, createData.id);
      //   await reduceStock(req, t);
      req.transactionData = createData;
    });
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const midtransController = async (req, res, next) => {
  try {
    const userData = await findUserDataForTransaction(req);
    console.log('🚀 ~ userData:', userData);
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
          name: val.inventory.product.name,
        };
      });
      return res.status(200).json(
        resTemplate(200, true, 'get transaction Details success', {
          status: transData.paymentStatus,
          invoice: transData.invoice,
          paymentMethod:transData.paymentMethod,
          total:transData.paymentTotal,
          img:transData.paymentProofImg,
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

export const patchTransactionStatusController = async (req, res, next) => {
  try {
    await DB.initialize();
    await DB.db.sequelize.transaction(async (t) => {
      await updateTransactionStatus(req, t);
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
    const dir = './src/assets/proof/';
    if (req.file?.filename) {
      const result = await DB.db.sequelize.transaction(async (t) => {
        const transData = await getOneTransaction(req);
        await updateProofImg(req, t, req.file?.filename,'checking');
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
