import { createStockReport } from '../../controllers/stock-report';
import inventory from '../../models/inventory.model';

export const reduceStock = async (req, t, items) => {
  const promiseReduceStock = items.map(async (val, idx) => {
    await createStockReport(
      {
        inventoryId: val.inventory.id,
        userId: req.tokenData.id,
        initialStock: val.inventory.stock,
        stockChange: 0-val.amount,
        endStock: val.inventory.stock-val.amount,
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

export const reduceBookedStock = (req,t,items) => {
    const promiseReduceBookedStock = items.map(async (val, idx) => {
       return await inventory.decrement(
          { bookedStock: Math.abs(val.amount) },
          { where: { id: val.inventoryId }, transaction: t },
        );
      });
      return Promise.all(promiseReduceBookedStock);
}
