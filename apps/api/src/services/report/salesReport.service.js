import { Op, col, fn, where } from "sequelize";
import inventory from "../../models/inventory.model";
import stores from "../../models/stores.model";
import transactionDetails from "../../models/transactionDetails.model";
import transactions from "../../models/transactions.model";
import product from "../../models/product.model";

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
          attributes: [],
          include: [
            {
              model: stores,
              attributes: [],
              where: {
                UUID: {
                  [Op.substring]: store
                }
              },
            }
          ]
        },
        {
          model: inventory,
          required:true,
          attributes: [],
          include: [
            {
              model: product,
              distinct: true
            }
          ]
        }
      ],
      attributes: [
        'id',
        [col('inventory.product.name'), 'productName'],
        [col('transaction.store.name'), 'storeName'],
        'amount',
        [fn('sum', col('amount')), 'totalAmount'],
        'price',
        [fn('month', col('transactionDetails.createdAt')), 'month'],
        'createdAt',
      ],
      limit: parseInt(limit),
      group: ['productName'],
      order: [['totalAmount', 'DESC']]
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
        [fn('sum', col('itemTotal')), 'salesTotal'],
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

    const count = await transactions.findAll(queryCount)

    if (limit === 'none') {
      query.limit = count.length;
      delete query.offset;
    }

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