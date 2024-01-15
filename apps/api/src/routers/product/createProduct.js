import { createInventory, findOneInventory } from '../../controllers/inventory.controller';
import { DB } from '../../db';
import product from '../../models/product.model';
import resTemplate from '../../helper/resTemplate';
import { createProduct } from '../../controllers/product.controller';

export default async function (req, res, next) {
    await DB.initialize();
    const t = await DB.db.sequelize.transaction();
    try {
        const duplicateProduct = await findOneInventory({
            include: [
                {
                    model: product,
                    required: true,
                    where: {
                        name: req.body.name,
                    }
                }
            ]
        }, { transaction: t });
        if (duplicateProduct) {
            throw {
                rc: 409,
                success: false,
                message: 'Product already exists',
                result: null,
            }
        }

        const result = await createProduct({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            categoryId: req.body.categoryId,
            weight: req.body.weight,
            unit: req.body.unit,
        }, { transaction: t });

        await t.commit();
        return res.status(201).json(resTemplate(201, true, 'Product created successfully', result));
    } catch (error) {
        await t.rollback();
        next(error);
    }
};