import { DB } from '../../db';
import resTemplate from '../../helper/resTemplate';
import inventory from '../../models/inventory.model';
import stock_report from '../../models/stock-report';

export const createInventoryService = async (data, tokenData) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const duplicateInventory = await inventory.findOne({
      where: {
        storeId: data.storeId ?? tokenData.storeId,
        productId: data.productId,
      }
    }, { transaction: t });

    if (duplicateInventory) {
      throw resTemplate(409, false, 'Inventory already exists', null);
    }

    if (tokenData.role === 'admin') {
      const result = await inventory.create({
        storeId: tokenData.storeId,
        productId: data.productId,
        stock: data.stock
      }, { transaction: t });

      await stock_report.create({
        inventoryId: result.id,
        userId: tokenData.id,
        initialStock: 0,
        stockChange: data.stock,
        endStock: data.stock,
        detail: 'Add new inventory'
      }, { transaction: t });

      await t.commit();
      return result;
    }

    const result = await inventory.create({
      storeId: data.storeId,
      productId: data.productId,
      stock: data.stock
    }, { transaction: t });

    await stock_report.create({
      inventoryId: result.id,
      userId: tokenData.id,
      initialStock: 0,
      stockChange: data.stock,
      endStock: data.stock,
      detail: 'Add new inventory'
    }, { transaction: t });

    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateInventoryService = async (id, data, tokenData) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const prev = await inventory.findByPk(id, { raw: true, transaction: t });
    await inventory.update({ stock: data.stock, },
      {
        where: { id },
        transaction: t,
      },
    );

    await stock_report.create({
      inventoryId: id,
      userId: tokenData.id,
      initialStock: prev.stock,
      stockChange: data.stock - prev.stock,
      endStock: data.stock,
      detail: 'Stock adjustment'
    }, { transaction: t });

    t.commit();
    return resTemplate(200, true, 'Update Inventory Success');
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteInventoryService = async (id, tokenData) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const prev = await inventory.findByPk(id, { raw: true, transaction: t });
    await inventory.destroy({
      where: { id }
    }, { transaction: t });

    await stock_report.create({
      inventoryId: prev.id,
      userId: tokenData.id,
      initialStock: prev.stock,
      stockChange: -Math.abs(prev.stock),
      endStock: 0,
      detail: 'Delete inventory'
    }, { transaction: t });

    

    t.commit();
    return resTemplate(204, true, 'Delete Inventory Success');
  } catch (error) {
    await t.rollback();
    throw error;
  }
};