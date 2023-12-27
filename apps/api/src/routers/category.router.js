import { Router } from 'express';
import uploader from '../helper/uploader';
import {
  getCategoryData,
  getCategoryDataById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.post('/', uploader('/category', 1).single('categoryUpload'), async (req, res, next) => {
  try {
    const result = await createCategory(req.body, req.file);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get('/', async (req, res, next) => {
  try {
    const result = await getCategoryData();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get('/:id', async (req, res, next) => {
  try {
    const result = await getCategoryDataById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

categoryRouter.patch('/:id', uploader('/category', 1).single('categoryUpload'), async (req, res, next) => {
  try {
    await updateCategory(req.params.id, req.body, req.file);
    res.status(200).json('Category updated successfully!');
  } catch (error) {
    next(error);
  }
})

categoryRouter.delete('/:id', async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    res.status(200).json('Category deleted successfully!');
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
