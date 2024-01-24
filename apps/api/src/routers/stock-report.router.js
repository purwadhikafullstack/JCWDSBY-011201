import { Router } from "express";
import { validateToken, validateAdmin} from "../middleware/tokenValidation";
import { getStockReport } from "../controllers/stock-report.controller";

const stockReportRouter = Router();

stockReportRouter.get('/', validateToken, validateAdmin, getStockReport);

export { stockReportRouter };