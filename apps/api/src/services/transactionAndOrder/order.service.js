import transactions from '../../models/transactions.model';
import transactionDetails from '../../models/transactionDetails.model';
import user_addresses from '../../models/user-addresses.model';
import users from '../../models/users.model';
import inventory from '../../models/inventory.model';
import stores from '../../models/stores.model';
import { Op } from 'sequelize';

export const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

export const findStoreIdByAdminId = (req, userId) => {
  return stores.findOne({
    where: { userId },
    attributes: ['id', 'userId'],
    raw: true,
  });
};

export const getOrdersAdmin = async (
  req,
  storeId,
  limit,
  offset,
  invoice,
  status,
  payment,
  from,
  to,
  sort,
) => {
  return transactions.findAndCountAll({
    limit,
    offset,
    where: {
      paymentStatus: { [Op.substring]: status },
      storeId,
      createdAt: {
        [Op.between]: [from, to],
      },
      [Op.or]: [
        {
          invoice: { [Op.substring]: invoice },
        },
        { paymentMethod: { [Op.substring]: payment } },
      ],
      //   ...(req.tokenData.role === 'admin' ? { storeId } : {}),
    },
    raw: true,
    nest: true,
    order: [sort],
    include: [
      {
        model: stores,
        as: 'store',
        required: true,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
    ],
  });
};

export const getOrdersUser = async (
  req,
  userId,
  limit,
  offset,
  invoice,
  status,
  payment,
  from,
  to,
  sort,
) => {
  return transactions.findAndCountAll({
    limit,
    offset,
    where: {
      userId,
      paymentStatus: { [Op.substring]: status },
      createdAt: {
        [Op.between]: [from, to],
      },
      [Op.or]: [
        {
          invoice: { [Op.substring]: invoice },
        },
        { paymentMethod: { [Op.substring]: payment } },
      ],
    },
    raw: true,
    nest: true,
    order: [sort],
    include: [
      {
        model: stores,
        as: 'store',
        required: true,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
    ],
  });
};

export const inputResi = (req, t) => {
  return transactions.update(
    { resi: req.body.resi },
    {
      where: { invoice: req.params.order_id ?? req.body.invoice },
      transaction: t,
    },
  );
};
