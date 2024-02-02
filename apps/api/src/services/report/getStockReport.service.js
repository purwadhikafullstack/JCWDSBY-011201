import stockReport from "../../models/stock-report";
import inventory from "../../models/inventory.model";
import users from "../../models/users.model";
import product from "../../models/product.model";
import stores from "../../models/stores.model";
import categories from "../../models/categories.model";
import { Op, col } from "sequelize";

export default async function (params) {
    try {
        const result = await stockReport.findAndCountAll({
            include: [
                {
                    model: inventory,
                    required: true,
                    include: [
                        {
                            model: product,
                            required: true,
                            where: { name: { [Op.substring]: params.query } },
                            include: [
                                {
                                    model: categories,
                                }
                            ],
                        },
                        {
                            model: stores,
                            required: true,
                            where: { UUID: { [Op.substring]: params.storeUUID } },
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
            limit: parseInt(params.limit),
            offset: params.page * parseInt(params.limit) - parseInt(params.limit),
            distinct: true,
            order: [params.order],
        });

        return result;
        
    } catch (error) {
        throw error;
    }
}