import product from "../models/product.model";
import categories from "../models/categories.model";
import inventory from "../models/inventory.model";
import productImage from "../models/product-image.model";
import { assetsDir } from "../constants/assets";
import { unlink, existsSync } from "fs";

export const findAllProducts = async (pointer) => {
    return await product.findAll(pointer);
};

export const findOneProduct = async (pointer) => {
    return await product.findOne(pointer);
};

export const createProduct = async (data) =>{
    return await product.create(data);
};

export const updateProduct = async (data, pointer) => {
    return await product.update(data, pointer);
};

export const findProductByCategory = async (category) => {
    return await inventory.findAll({
        include: [
            {
                model: product,
                as: 'product',
                required: true,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'categoryId'] },
                include: [
                    {
                        model: categories,
                        as: 'category',
                        where: { name: category },
                        required: true,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: productImage,
                        required: true,
                        attributes: ['id', 'image'],
                    },
                ],
            }
        ],
        attributes: ['id', 'storeId', 'discountId', 'stock'],
    });
};

export const getInventoryData = async () => {
    return await inventory.findAll({
        include: [
            {
                model: product,
                as: 'product',
                required: true,
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
            }
        ],
        attributes: ['id', 'storeId', 'discountId', 'stock'],
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
                if (existsSync(assetsDir + image.image)) {
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