import { updateInventory } from "../../controllers/inventory.controller";
import resTemplate from "../../helper/resTemplate";

export default async function (req, res, next) {
    try {
        await updateInventory({ stock: req.body.stock, },
            {
                where: { 
                    id: req.params.id 
                },
            },
        );

        res.status(200).json(resTemplate(200, true, 'Inventory updated'));
    } catch (error) {
        next(error);
    }
}