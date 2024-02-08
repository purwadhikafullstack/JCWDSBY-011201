// import findProductByName from "./findProductByName";
// import { DB } from "../../db";
// import { findOneProduct, updateProduct } from "../../controllers/product.controller";
// import resTemplate from "../../helper/resTemplate";

// export default async function (req, res, next) {
//     await DB.initialize();
//     const t = await DB.db.sequelize.transaction();
//     try {
//         if (Object.hasOwn(req.body, 'name')) {
//             const duplicateName = await findOneProduct({
//                 where: {
//                     name: req.body.name,
//                 }
//             }, { transaction: t });

//             if(duplicateName){
//                 throw resTemplate(304, false, 'Product already exists', null);
//             }
//         }

//         await updateProduct(req.body, {
//             where: {
//                 id: req.params.id
//             },
//             transaction: t
//         });

//         await t.commit();
//         return res.status(200).json(resTemplate(200, true, 'Product updated', null));
//     } catch (error) {
//         await t.rollback();
//         next(error);
//     }
// }