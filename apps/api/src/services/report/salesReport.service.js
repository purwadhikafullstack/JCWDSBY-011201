import { Op, col, fn, literal, where } from "sequelize";
import inventory from "../../models/inventory.model";
import stores from "../../models/stores.model";
import transactionDetails from "../../models/transactionDetails.model";
import transactions from "../../models/transactions.model";
import product from "../../models/product.model";
import categories from "../../models/categories.model";

export const getTopProductService = async (params, tokenData) => {
  try {
    const date = new Date().getMonth() + 1;
    let store = params?.store ?? '';
    const limit = params?.limit ?? 'none';
    if (tokenData.role === 'admin') store = tokenData.storeUUID;
    
    const query = {
      where: where(fn('month', col('transactionDetails.createdAt')), '=', date),
      include: [
        {
          model: transactions,
          required: true,
          include: [
            {
              model: stores,
              where: {
                UUID: {
                  [Op.substring]: store
                }
              },
            }
          ]
        }
      ],
      attributes: [
        'id',
        'amount',
        'price',
        [fn('month', col('transactionDetails.createdAt')), 'month'],
        'createdAt',
      ],
      limit: parseInt(limit),
      order: [['amount', 'DESC']]
    }

    if (limit === 'none') delete query.limit;

    const result = await transactionDetails.findAll(query);
    return result
  } catch (error) {
    throw error;
  }
};

export const getSalesReportService = async (params, tokenData) => {
  try {
    let store = params?.store ?? '';
    const limit = params?.limit ?? 'none';
    const page = params?.page ?? 1;

    if (tokenData.role === 'admin') store = tokenData.storeUUID;

    const query = {
      where: {
        paymentStatus: 'finished'
      },
      include: [
        {
          model: transactionDetails,
          required: true,
        },
        {
          model: stores,
          where: {
            UUID: {
              [Op.substring]: store
            }
          }
        }
      ],
      attributes: [
        [fn('sum', col('paymentTotal')), 'salesTotal'],
        [fn('month', col('transactions.transactionDate')), 'month'],
        'transactionDate',
        [col('store.name'), 'storeName']
      ],
      group: ['month'],
      limit: parseInt(limit),
      offset: page * parseInt(limit) - parseInt(limit),
    }

    let queryCount = { ...query };
    delete queryCount.limit;
    delete queryCount.offset;

    if (limit === 'none') {
      delete query.limit;
      delete query.offset;
    }


    const count = await transactions.findAll(queryCount)

    const result = await transactions.findAll(query);

    if (limit !== 'none') {
      return {
        count: count.length,
        rows: result,
        totalPage: Math.ceil(count.length / limit)
      };
    }

    return {
      count: count.length,
      rows: result
    };
  } catch (error) {
    throw error;
  }
};