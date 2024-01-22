import resTemplate from "../../helper/resTemplate";
import { createInventory, findOneInventory } from "../../controllers/inventory.controller";
import { DB } from '../../db';

export default async function (req, res, next) {
    await DB.initialize();
    const t = await DB.db.sequelize.transaction();
    try {
        const duplicateInventory = await findOneInventory({
            where: {
                storeId: req.body.storeId ?? req.tokenData.storeId,
                productId: req.body.productId,
            }
        }, { transaction: t });
        
        if (duplicateInventory) {
            throw resTemplate(409, false, 'Inventory already exists', null);
        }

        if (req.tokenData.role === 'admin') {
            const result = await createInventory({
                storeId: req.tokenData.storeId,
                productId: req.body.productId,
                stock: req.body.stock
            }, { transaction: t });

            await t.commit();
            return res.status(200).json(resTemplate(200, true, 'Inventory created', result));
        }

        const result = await createInventory({
            storeId: req.body.storeId,
            productId: req.body.productId,
            stock: req.body.stock
        }, { transaction: t });

        await t.commit();
        return res.status(200).json(resTemplate(200, true, 'Inventory created', result));
    } catch (error) {
        await t.rollback();
        next(error);
    }
}