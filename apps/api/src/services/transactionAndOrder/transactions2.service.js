import { Op } from 'sequelize';
import { createStockReport } from '../../controllers/stock-report';
import discount from '../../models/discount.model';
import inventory from '../../models/inventory.model';

export const reduceStock = async (req, t, items) => {
  const promiseReduceStock = items.map(async (val, idx) => {
    await createStockReport(
      {
        inventoryId: val.inventory.id,
        userId: req.tokenData.id,
        initialStock: val.inventory.stock,
        stockChange: 0 - val.amount,
        endStock: val.inventory.stock - val.amount,
        detail: 'Sending Item to User',
      },
      { transaction: t },
    );
    await inventory.decrement(
      { stock: Math.abs(val.amount), bookedStock: Math.abs(val.amount) },
      { where: { id: val.inventoryId }, transaction: t },
    );
  });
  return Promise.all(promiseReduceStock);
};

export const reduceBookedStock = async (req, t, items) => {
  const promiseReduceBookedStock = items.map(async (val, idx) => {
    return await inventory.decrement(
      { bookedStock: Math.abs(val.amount) },
      { where: { id: val.inventoryId }, transaction: t },
    );
  });
  return Promise.all(promiseReduceBookedStock);
};

export const findVoucherCode = async (voucherCode) => {
  return await discount.findOne({
    where: { voucherCode, endTime: { [Op.gte]: new Date() } },
    raw: true,
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
  });
};

export const findVoucherById = async (id) => {
  return await discount.findOne({
    where: { id },
    raw: true,
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
  });
};
