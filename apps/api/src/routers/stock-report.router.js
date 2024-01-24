import { Router } from "express";
import { validateToken, validateAdmin, validateSuper } from "../middleware/tokenValidation";
import getStockReport from "./report/getStockReport";

const stockReportRouter = Router();

stockReportRouter.get('/', validateToken, validateAdmin, getStockReport);

export { stockReportRouter };