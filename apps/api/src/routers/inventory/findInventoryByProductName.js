import { findOneInventory } from "../../controllers/inventory.controller";
import { Op } from 'sequelize';
import resTemplate from "../../helper/resTemplate";
import categories from "../../models/categories.model";
import productImage from "../../models/product-image.model";
import product from "../../models/product.model";
import stores from "../../models/stores.model";
import users from "../../models/users.model";

export default async function (req, res, next) {
    const storeUUID = req.query.store?? '';

    try {
        const result = await findOneInventory({
            include: [
                {
                    model: product,
                    as: 'product',
                    required: true,
                    where: { name: req.params.name },
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'] },
                    include: [
                        {
                            model: categories,
                            as: 'category',
                            required: true,
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
                    model: stores,
                    as:'store',
                    required: true,
                    attributes: ['UUID', 'name'],
                    where: { UUID: { [Op.substring]: storeUUID } },
                    include: [
                        {
                            model: users,
                            as: 'user',
                            required: true,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            attributes: ['id', 'discountId', 'stock'],
        });

        res.status(200).json(resTemplate(200, true, 'Inventory found', result));
    } catch (error) {
        next(error);
    }
}