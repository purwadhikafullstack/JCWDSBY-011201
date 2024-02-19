import productImage from "../../models/product-image.model";
import { unlink, existsSync } from "fs";
import { assetsDir } from "../../constants/assets";

export const createProductImageService = async (productId, image) => {
  try {
    const bulkImage = image.map((image) => ({
      productId,
      image: image.filename
    }));

    return await productImage.bulkCreate(bulkImage);
  } catch (error) {
    throw error;
  }
};

export const deleteProductImageService = async (id) => {
  try {
    const prevData = await productImage.findByPk(id);
    const result = await productImage.destroy({
        where: {id}
    });

    if (result && existsSync(assetsDir + prevData.image)) {
        unlink(assetsDir + prevData.image, (err) => {
            if (err) throw Error(err);
        });
    }
  } catch (error) {
    throw error;
  }
};