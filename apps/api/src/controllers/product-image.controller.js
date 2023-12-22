import productImage from "../models/product-image.model";
import { unlink } from "fs";

const dir = './src/assets/product/'

export const getProductImage = async (id) => {
    return await productImage.findAll({
        where: {
            productId: id,
        },
    });
};

export const createProductImage = async (productId, image) => {
    const bulkImage = image.map((image) => ({
        productId,
        image: image.filename
    }));

    return await productImage.bulkCreate(bulkImage);
};

export const updateProductImage = async (id, image) => {
    const prevData = await productImage.findByPk(id);
    console.log('prevData', prevData.image);
    const result = await productImage.update(
        {
            image: image.filename
        },
        {
            where: {
                id
            }
        }
    );

    if (result) {
        unlink(dir + prevData.image, (err) => {
            if (err) throw Error(err);
        });
    }
};

export const deleteProductImage = async (id) => {
    const prevData = await productImage.findByPk(id);
    console.log('prevData', prevData.image);
    const result = await productImage.destroy({
        where: {
            id
        }
    });

    if (result) {
        unlink(dir + prevData.image, (err) => {
            if (err) throw Error(err);
        });
    }
};