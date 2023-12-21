import product from "../models/product.model";
import categories from "../models/categories.model";
import inventory from "../models/inventory.model";

export const getProductData = async () => {
    return await product.findAll({
        include: [
            {
                model: categories,
                as: 'category',
                required: true,
            }
        ]
    },);
};

export const getInventoryData = async () => {
    return await inventory.findAll({
        include: [
            {
                model: product,
                as: 'product',
                required: true,
            }
        ]
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
    return await product.destroy({
        where: { id }
    });
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