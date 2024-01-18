import { Router } from "express";
import getAllInventory from "./inventory/getAllInventory";
import createInventory from "./inventory/createInventory";
import { validateToken, validateAdmin, validateSuper } from "../middleware/tokenValidation";
import findInventoryByProductName from "./inventory/findInventoryByProductName";
import updateStock from "./inventory/updateStock";
import paginationInventory from "./inventory/paginationInventory";

const inventoryRouter = Router();

inventoryRouter.get('/', getAllInventory);
inventoryRouter.get('/pagination', paginationInventory)
inventoryRouter.get('/:name', findInventoryByProductName)
inventoryRouter.post('/', validateToken, validateAdmin, createInventory);
inventoryRouter.patch('/:id', validateToken, validateAdmin, updateStock);

export { inventoryRouter };