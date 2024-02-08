// import { findOneProduct } from "../../controllers/product.controller";
// import resTemplate from "../../helper/resTemplate";
// import categories from "../../models/categories.model";
// import productImage from "../../models/product-image.model";

// export default async function (req, res, next) {
//     try {
//         const result = await findOneProduct({
//             where: {
//                 name: req.params.name,
//             },
//             include: [
//                 {
//                     model: categories,
//                     as: 'category',
//                     required: true,
//                     attributes: ['id', 'name'],
//                 },
//                 {
//                     model: productImage,
//                     required: true,
//                     attributes: ['id', 'image'],
//                 },
//             ],
//             attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
//         });

//         return res.status(200).json(resTemplate(200, true, 'Find product by name success', result));
//     } catch (error) {
//         next(error);
//     }
// }