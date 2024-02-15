import { createProductImageService, deleteProductImageService } from "../services/product/product-image.service";
import resTemplate from "../helper/resTemplate";

export const createProductImage = async (req, res, next) => {
  try {
    const result = await createProductImageService(req.body.productId, req.files);
    return res.status(200).json(resTemplate(200, true, 'Create Product Image Success', result));
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (req, res, next) => {
  try {
    await deleteProductImageService(req.params.id);
    res.status(204).json(resTemplate(204, true, 'Delete Product Image Success'));
  } catch (error) {
    next(error);
  }
};