import transactions from '../models/transactions.model';
import transactionDetails from '../models/transactionDetails.model';
import user_addresses from '../models/user-addresses.model';
import users from '../models/users.model';
import inventory from '../models/inventory.model';
import stores from '../models/stores.model';
import { Op } from 'sequelize';

export const getPagination = (page, size) => {
  const limit = size ? +size : 10;
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

export const getOrdersAdmin = async (req, storeId, limit, offset, invoice) => {
  return transactions.findAndCountAll({
    limit,
    offset,
    where: { storeId, invoice: { [Op.substring]: invoice } },
    raw: true,
    nest: true,
  });
};

export const getOrdersUser = async (req, userId, limit, offset, invoice) => {
  return transactions.findAndCountAll({
    limit,
    offset,
    where: { userId, invoice: { [Op.substring]: invoice } },
    raw: true,
    nest: true,
  });
};
