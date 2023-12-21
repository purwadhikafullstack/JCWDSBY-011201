import { Router } from 'express';
import uploader from '../helper/uploader';
import {
  createCategory,
  getCategoryData,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';

const categoryRouter = Router();

categoryRouter.post('/', uploader('/category').single('categoryUpload'), async (req, res, next) => {
  try {
    const result = await createCategory({
      name: req.body.name,
      image: req.file.filename
    });

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

categoryRouter.patch('/:id', uploader('/category').single('categoryUpload'), async (req, res, next) => {
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
