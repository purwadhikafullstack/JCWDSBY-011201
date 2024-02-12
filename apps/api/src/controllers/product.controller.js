import { createProductService, deleteProductService, getLatestProductService, getProductDetailService, getProductService, updateProductService } from "../services/product/product.service";
import resTemplate from "../helper/resTemplate";

export const getProduct = async (req, res, next) => {
  try {
    const result = await getProductService(req.query);
    res.status(200).json(resTemplate(200, true, 'Get Product Success', result));
  } catch (error) {
    next(error);
  }
};

export const getProductDetail = async (req, res, next) => {
  try {
    const result = await getProductDetailService(req.params.name);
    res.status(200).json(resTemplate(200, true, 'Get Product Detail Success', result));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const result = await createProductService(req.body);
    res.status(201).json(resTemplate(201, true, 'Create Product Success', result));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const result = await updateProductService(req.params.id, req.body);
    res.status(201).json(resTemplate(201, true, 'Update Product Success'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    res.status(204).json(resTemplate(204, true, 'Delete Product Success'));
  } catch (error) {
    next(error);
  }
};

export const getLatestroduct = async (req, res, next) => {
  try {
    const result = await getLatestProductService(req.query);
    res.status(200).json(resTemplate(200, true, 'Get Latest Product Success', result));
  } catch (error) {
    next(error);
  }
};