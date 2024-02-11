import { Router } from "express";
import { validateToken, validateAdmin, validateSuper } from "../middleware/tokenValidation";
import { getInventory, getInventoryDetail, createInventory, updateInventory, deleteInventory } from "../controllers/inventory.controller";

const inventoryRouter = Router();

inventoryRouter.get('/', getInventory);
inventoryRouter.get('/:name', getInventoryDetail)
inventoryRouter.post('/', validateToken, validateAdmin, createInventory);
inventoryRouter.patch('/:id', validateToken, validateAdmin, updateInventory);
inventoryRouter.delete('/:id', validateToken, validateAdmin, deleteInventory);

export { inventoryRouter };