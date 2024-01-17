import { findAllInventory } from "../../controllers/inventory.controller";
import { Op } from 'sequelize';
import resTemplate from "../../helper/resTemplate";
import product from "../../models/product.model";
import categories from "../../models/categories.model";
import productImage from "../../models/product-image.model";
import store from "../../models/stores.model";
import users from "../../models/users.model";

export default async function (req, res, next) {
    try {
        const query = req.query.q ?? '';
        const category = req.query.category ?? '';
        const sort = req.query.sort ?? 'none';
        const email = req.query.admin ?? '';
        const storeUUID = req.query.store ?? '';
        const page = req.query.page ?? 1;
        let order = [];

        if (sort === 'lowest') order.push(product ,'price', 'ASC');
        if (sort === 'highest') order.push(product ,'price', 'DESC');
        if (sort === 'nameasc' || sort === 'none') order.push(product ,'name', 'ASC');
        if (sort === 'namedesc') order.push(product ,'name', 'DESC');

        const result = await findAllInventory({
            include: [
                {
                    model: product,
                    as: 'product',
                    required: true,
                    where: { name: { [Op.substring]: query } },
                    order: [order],
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'] },
                    include: [
                        {
                            model: categories,
                            as: 'category',
                            required: true,
                            where: { name: { [Op.substring]: category } },
                            attributes: ['id', 'name'],
                        },
                        {
                            model: productImage,
                            required: true,
                            attributes: ['id', 'image'],
                        },
                    ],
                },
                {
                    model: store,
                    as:'store',
                    required: true,
                    where: { UUID: { [Op.substring]: storeUUID } },
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: users,
                            as: 'user',
                            required: true,
                            where: { email: { [Op.substring]: email } },
                            attributes: ['name'],
                        },
                    ]
                }
            ],
            limit: 5,
            offset: page * 5 - 5,
            attributes: ['id', 'discountId', 'stock'],
        });
        const rawData = await findAllInventory({
            include: [
                {
                    model: product,
                    as: 'product',
                    required: true,
                    where: { name: { [Op.substring]: query } },
                    order: [order],
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'] },
                    include: [
                        {
                            model: categories,
                            as: 'category',
                            required: true,
                            where: { name: { [Op.substring]: category } },
                            attributes: ['id', 'name'],
                        },
                        {
                            model: productImage,
                            required: true,
                            attributes: ['id', 'image'],
                        },
                    ],
                },
                {
                    model: store,
                    as:'store',
                    required: true,
                    where: { UUID: { [Op.substring]: storeUUID } },
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: users,
                            as: 'user',
                            required: true,
                            where: { email: { [Op.substring]: email } },
                            attributes: ['name'],
                        },
                    ]
                }
            ],
            attributes: ['id', 'discountId', 'stock'],
        });
        res.status(200).json(resTemplate(200, true, 'Get All Inventory Success', {count: rawData.length, data: result, raw: rawData}));
    } catch (error) {
        next(error);
    }
};