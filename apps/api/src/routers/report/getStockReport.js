import resTemplate from "../../helper/resTemplate";
import { DB } from '../../db';
import { findAndCountAllStockReport } from "../../controllers/stock-report";
import inventory from "../../models/inventory.model";
import users from "../../models/users.model";
import product from "../../models/product.model";
import { Op, col } from "sequelize";
import stores from "../../models/stores.model";
import categories from "../../models/categories.model";

export default async function (req, res, next) {
    try {
        const query = req.query.q ?? '';
        const sort = req.query.sort ?? 'none';
        const page = req.query.page ?? 1;
        const limit = req.query.limit ?? 5;
        let storeUUID = req.query.store ?? '';
        let order = [];

        // console.log('Token Data >>>', req.tokenData.storeUUID);
        if(req.tokenData.role === 'admin') storeUUID = req.tokenData.storeUUID

        if(sort === 'latest' || sort === 'none') order.push('createdAt', 'DESC');
        if(sort === 'earliest') order.push('createdAt', 'ASC');
        if (sort === 'nameasc') order.push(col('product'), 'ASC');
        if (sort === 'namedesc') order.push(col('product'), 'DESC');

        const result = await findAndCountAllStockReport({
            include: [
                {
                    model: inventory,
                    required: true,
                    include: [
                        {
                            model: product,
                            required: true,
                            where: { name: { [Op.substring]: query } },
                            include: [
                                {
                                    model: categories,
                                }
                            ],
                        },
                        {
                            model: stores,
                            required: true,
                            where: { UUID: { [Op.substring]: storeUUID } },
                        },
                    ],
                    attributes: [],
                },
                {
                    model: users,
                    required: true,
                    attributes: [],
                },
            ],
            attributes: [['createdAt', 'date'], [col('inventory.store.UUID'), 'store'], [col('user.email'), 'admin'], [col('inventory.product.name'), 'product'], [col('inventory.product.category.name'), 'category'],'initialStock', 'stockChange', 'endStock', 'detail'],
            limit: parseInt(limit),
            offset: page * parseInt(limit) - parseInt(limit),
            distinct: true,
            order: [order],
        });

        res.status(200).json(resTemplate(200, true, 'Get All Stock Report Success', result));
    } catch (error) {
        next(error);
    }
}