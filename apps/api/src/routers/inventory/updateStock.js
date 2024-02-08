// import { findByPkInventory, findOneInventory, updateInventory } from "../../controllers/inventory.controller";
// import resTemplate from "../../helper/resTemplate";
// import { DB } from '../../db';
// import { createStockReport } from "../../controllers/stock-report";

// export default async function (req, res, next) {
//     await DB.initialize();
//     const t = await DB.db.sequelize.transaction();
//     try {
//         const prev = await findByPkInventory(req.params.id, { raw:true, transaction: t});
//         await updateInventory({ stock: req.body.stock, },
//             {
//                 where: { 
//                     id: req.params.id 
//                 },
//                 transaction: t,
//             },
//         );
        
//         await createStockReport({
//             inventoryId: req.params.id,
//             userId: req.tokenData.id,
//             initialStock: prev.stock,
//             stockChange: req.body.stock - prev.stock,
//             endStock: req.body.stock,
//             detail: 'Stock adjustment'
//         }, {transaction: t});

//         t.commit();
//         res.status(200).json(resTemplate(200, true, 'Inventory updated'));
//     } catch (error) {
//         await t.rollback();
//         next(error);
//     }
// }