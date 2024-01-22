import { findAllProducts } from "../../controllers/product.controller";
import resTemplate from "../../helper/resTemplate";
import categories from "../../models/categories.model";
import productImage from "../../models/product-image.model";

export default async function (req, res, next) {
    try {
        const result = await findAllProducts({
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
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        });
        res.status(200).json(resTemplate(200, true, 'Get all products success', {count: result.length, data: result}));
    } catch (error) {
        next(error);
    }
};