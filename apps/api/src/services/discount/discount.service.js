import { Op, col, literal } from "sequelize";
import { DB } from "../../db";
import discount from "../../models/discount.model";
import inventory from "../../models/inventory.model";
import stores from "../../models/stores.model";
import product from "../../models/product.model";

export const createDiscountService = async (data) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const result = await discount.create({
      storeId: parseInt(data.storeId),
      inventoryId: parseInt(data.inventoryId),
      name: data.name,
      limit: data.limit,
      term: data.term,
      type: data.type,
      minTransaction: parseInt(data.minTransaction),
      nominal: parseInt(data.nominal),
      percentage: parseFloat(data.percentage),
      voucherCode: data.voucherCode,
      startTime: data.startTime,
      endTime: data.endTime,
    }, { transaction: t });

    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const getDiscountService = async (params) => {
  try {
    const limit = params?.limit ?? 'none';
    const page = params?.page ?? 1;
    const UUID = params?.UUID ?? '';

    const query = {
      where: {
        UUID: { [Op.substring]: UUID }
      },
      include: [
        {
          model: stores,
          required: true,
          attributes: [],
        },
        {
          model: inventory,
          attributes: [],
          include: [
            {
              model: product,
              required: true,
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
      distinct: true,
      attributes: ['id', 'UUID', 'name', 'term', [col('store.UUID'), 'storeUUID'], [col('store.name'), 'storeName'], [col('inventory.id'), 'inventoryId'], [col('inventory.product.name'), 'productName'], 'minTransaction', 'type', 'nominal', 'percentage', 'limit', 'voucherCode', 'startTime', 'endTime'],
    }

    if (limit === 'none') {
      delete query.limit;
      delete query.offset;
    }

    let result = await discount.findAndCountAll(query);
    if (limit !== 'none') result.totalPage = Math.ceil(result.count / limit);

    return result
  } catch (error) {
    throw error;
  }
};

export const deleteDiscountService = async (id) => {
  try {
    // console.log('DIscountService delete >>> ', id);
    await discount.destroy({
      where: { id }
    });
  } catch (error) {
    throw error;
  }
};

export const updateDiscountService = async (id, data) => {
  try {
    // console.log('Discount ID:', id);
    // console.log('Discount Data:', data);
    await discount.update(data, {
      where: { id }
    })
  } catch (error) {
    throw error;
  }
}