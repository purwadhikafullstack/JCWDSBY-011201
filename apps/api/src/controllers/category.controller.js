import { createCategoryService, deleteCategoryService, getCategoryDetailService, getCategoryService, updateCategoryService } from "../services/category/category.service";
import resTemplate from "../helper/resTemplate";

const dir = './src/assets/category/';

export const getCategory = async (req, res, next) => {
  try {
    const result = await getCategoryService(req.query);

    res.status(200).json(resTemplate(201, true, 'Get Category Success', result));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    await createCategoryService(req.body, req.file)
    res.status(201).json(resTemplate(201, true, 'Create Category Success'));
  } catch (error) {
    next(error);
  }
};

export const getCategoryDetail = async (req, res, next) => {
  try {
    const result = await getCategoryDetailService(req.params.id);
    res.status(200).json(resTemplate(200, true, 'Get Category Detail Success', result));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    await updateCategoryService(req.params.id, req.body, req.file);
    res.status(200).json(resTemplate(200, true, 'Update Category Success'));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await deleteCategoryService(req.params.id);
    res.status(204).json(resTemplate(204, true, 'Delete Category Success'));
  } catch (error) {
    next(error);
  }
};
