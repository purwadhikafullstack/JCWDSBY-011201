import transactions from '../../models/transactions.model';
import transactionDetails from '../../models/transactionDetails.model';
import user_addresses from '../../models/user-addresses.model';
import users from '../../models/users.model';
import inventory from '../../models/inventory.model';
import stores from '../../models/stores.model';
import { Op } from 'sequelize';
import discount from '../../models/discount.model';

export const getPagination = (page, size) => {
  const limit = size ? +size : 7;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

export const findStoreIdByAdminId = async (req, userId) => {
  return await stores.findOne({
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
  return await transactions.findAndCountAll({
    limit,
    offset,
    where: {
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
      ...(storeId && { storeId }),
    },
    raw: true,
    nest: true,
    order: [sort],
    include: [
      {
        model: discount,
        as: 'discount',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: stores,
        as: 'store',
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
  return await transactions.findAndCountAll({
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
    attributes: { exclude: ['userId'] },
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

export const inputResi = async (req, t) => {
  return await transactions.update(
    { resi: req.body.resi },
    {
      where: { invoice: req.params.order_id ?? req.body.invoice },
      transaction: t,
    },
  );
};

export const updateLimitVoucher = async (status, discountId) => {
  if (status === 'plus') {
    return await discount.increment('limit', { where: { id: discountId } });
  } else {
    return await discount.decrement('limit', { where: { id: discountId } });
  }
};
