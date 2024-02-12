import transactions from '../../models/transactions.model';
import transactionDetails from '../../models/transactionDetails.model';
import user_addresses from '../../models/user-addresses.model';
import users from '../../models/users.model';
import inventory from '../../models/inventory.model';
import { literal } from 'sequelize';
import midtransClient from 'midtrans-client';
import { APP_URL, MIDTRANS_FINISH_URL, MIDTRANS_KEY } from '../../config';
import product from '../../models/product.model';
import stores from '../../models/stores.model';
import { invoiceNamer } from '../../helper/invoiceNamer';
import discount from '../../models/discount.model';

//Get
export const findUserAddressIdForTransaction = async (req) => {
  return await user_addresses.findOne({
    where: { UUID: req.body.addressUUID },
    attributes: ['id'],
    raw: true,
  });
};

export const findStoreByUUID = async (req) => {
  return await stores.findOne({
    where: { UUID: req.body.storeUUID },
    attributes: ['id', 'name'],
    raw: true,
  });
};

//Post Create Transaction & TransactionDetails & Reduce Inventory
export const createTransaction = async (req, t, userAddressId, storeId) => {
  return await transactions.create(
    {
      userId: req.tokenData.id,
      invoice: invoiceNamer(),
      transactionDate: literal('CURRENT_TIMESTAMP'),
      shipmentTotal: req.body.shipmentTotal,
      paymentMethod: req.body.paymentMethod,
      itemTotal: req.body.itemTotal,
      shipmentName: req.body.shipmentName,
      userAddressId,
      storeId,
      paymentTotal: req.body.paymentTotal,
    },
    { transaction: t },
  );
};

export const transactionDetailsBulkCreate = async (req, t, latestTransId) => {
  try {
    const bulkItems = req.body.checkoutItems.map((val, idx) => ({
      transactionId: latestTransId,
      inventoryId: val.inventoryId,
      discountId: val.discountId,
      amount: val.quantity,
      price: val.value,
    }));
    return await transactionDetails.bulkCreate(bulkItems, { transaction: t });
  } catch (error) {
    console.log(error);
  }
};

export const raiseBookedStock = async (req, t, items) => {
  const promiseRaiseBookedStock = items.map(async (val, idx) => {
    return await inventory.increment(
      { bookedStock: Math.abs(val.amount) },
      { where: { id: val.inventoryId }, transaction: t },
    );
  });
  return Promise.all(promiseRaiseBookedStock);
};
export const findUserDataForTransaction = async (req) => {
  return users.findOne({ where: { id: req.tokenData.id }, raw: true });
};
export const handleMidtrans = async (req, userData) => {
  let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: MIDTRANS_KEY,
  });
  const item_details = req.body.checkoutItems.map((val, idx) => {
    return {
      name: val.name,
      price: val.value,
      quantity: val.quantity,
    };
  });
  const totalNetPrice = req.body.checkoutItems.reduce((total, val) => {
    console.log(total, val.value, val.quantity);
    return total + val.value * val.quantity;
  }, 0);
  let parameter = {
    transaction_details: {
      order_id: req.transactionData.invoice,
      gross_amount: req.transactionData.paymentTotal,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: userData.name,
      email: userData.email,
    },
    item_details: [
      ...item_details,
      {
        name: 'Misc Fee',
        price: req.transactionData.paymentTotal - totalNetPrice,
        quantity: 1,
      },
    ],
    enabled_payments: [req.body.paymentMethod],
    callbacks: {
      finish: MIDTRANS_FINISH_URL,
      //   unfinish: `${APP_URL}`,
      //   pending: `${APP_URL}`,
    },
  };

  const snapTransaction = await snap.createTransaction(parameter);
  console.log('🚀 ~ handleMidtrans ~ snapTransaction:', snapTransaction);
  return snapTransaction;
};

export const getOneTransaction = async (req) => {
  return await transactions.findOne({
    where: { invoice: req.params.order_id ?? req.body.invoice },
    raw: true,
  });
};

export const getTransactionDetails = async (req, transactionId) => {
  return await transactionDetails.findAll({
    where: { transactionId },
    raw: true,
    nest: true,
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    include: [
      {
        model: discount,
        as: 'discount',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: inventory,
        as: 'inventory',
        required: true,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          {
            model: product,
            as: 'product',
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
        ],
      },
      {
        model: discount,
        as: 'discount',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
    ],
  });
};

export const updateTransactionStatus = async (req, t) => {
  return await transactions.update(
    { paymentStatus: req.body.status },
    {
      where: { invoice: req.params.order_id ?? req.body.invoice },
      transaction: t,
    },
  );
};

export const updateProofImg = async (req, t, filename, status) => {
  return await transactions.update(
    { paymentProofImg: filename, paymentStatus: status },
    {
      where: { invoice: req.body.invoice, userId: req.tokenData.id },
      transaction: t,
    },
  );
};
export const updateProofImgAdmin = async (req, t, filename, status) => {
  return await transactions.update(
    { paymentProofImg: filename, paymentStatus: status },
    {
      where: { invoice: req.body.invoice },
      transaction: t,
    },
  );
};
export const getOneTransactionByResi = async (resi) => {
  return await transactions.findOne({
    where: { resi },
    raw: true,
  });
};
