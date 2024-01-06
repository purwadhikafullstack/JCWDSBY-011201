import product from "../models/product.model";
import categories from "../models/categories.model";
import inventory from "../models/inventory.model";
import productImage from "../models/product-image.model";
import { assetsDir } from "../constants/assets";
import { unlink, existsSync } from "fs";

export const getProductData = async () => {
    return await product.findAll({
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
                attributes: ['id', 'productId', 'image'],
            }
        ]
    },);
};

export const findProductById = async (id) => {
    return await product.findOne({
        where: { id },
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
                attributes: ['id', 'productId', 'image'],
            }
        ]
    });
};

export const getInventoryData = async () => {
    return await inventory.findAll({
        include: [
            {
                model: product,
                as: 'product',
                required: true,
                attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']},
                include: [
                    {
                        model: categories,
                        as: 'category',
                        required: true,
                        attributes: ['name'],
                    }
                ],
            }
        ],
        attributes: ['id', 'storeId','discountId', 'stock'],
    });
};

export const createProduct = async (storeId, data) => {
    const result = await product.create(data);
    if (result) {
        await inventory.create({
            storeId,
            productId: result.id,
            stock: 0
        });
        return result;
    }
};

export const updateProduct = async (id, data) => {
    return await product.update(
        data,
        {
            where: { id }
        });
};

export const updateInventory = async (id, stock) => {
    return await inventory.update(
        stock,
        {
            where: { id }
        });
};

export const deleteProduct = async (id) => {
    const deleteProduct = await product.destroy({ 
        where: { id }
    })
    
    if (deleteProduct) {
        await inventory.destroy({
            where: { productId: id }
        });
        const image = await productImage.findAll({
            where: { productId: id }
        });
        if (image.length > 0) {
            image.forEach(image => {
                if(existsSync(assetsDir + image.image)) {
                    return unlink(assetsDir + image.image, (err) => {
                        if (err) throw err;
                    });
                }
            });
        }
        return await productImage.destroy({
            where: { productId: id }
        });
    }
};

export const deleteInventory = async (id) => {
    return await inventory.update(
        {
            stock: 0,
        },
        {
            where: { id }
        }
    );
};