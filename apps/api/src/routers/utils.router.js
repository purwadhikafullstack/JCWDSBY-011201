import { Router } from 'express';
import nearestStore from './utils/nearestStore';

const utilsRouter = Router();

utilsRouter.get('/store/nearest', nearestStore);

export { utilsRouter };
