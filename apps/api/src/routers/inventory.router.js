import { Router } from "express";
import getAllInventory from "./inventory/getAllInventory";
import createInventory from "./inventory/createInventory";
import { validateToken, validateAdmin, validateSuper } from "../middleware/tokenValidation";

const inventoryRouter = Router();

inventoryRouter.get('/', getAllInventory);
inventoryRouter.post('/', validateToken, validateAdmin, createInventory);

export { inventoryRouter };