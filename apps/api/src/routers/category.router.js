import { Router } from 'express';
import uploader from '../helper/uploader';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoryDetail,
} from '../controllers/category.controller';
import { validateAdmin, validateToken } from '../middleware/tokenValidation';

const categoryRouter = Router();

categoryRouter.post('/', uploader('/category', 1).single('categoryUpload'), createCategory);

categoryRouter.get('/', getCategory);

categoryRouter.get('/:id', getCategoryDetail);

categoryRouter.patch('/:id', validateToken, validateAdmin, uploader('/category', 1).single('categoryUpload'), updateCategory)

categoryRouter.delete('/:id', validateToken, validateAdmin, deleteCategory);

export { categoryRouter };
