import { Router } from "express";
import { validateToken, validateAdmin} from "../middleware/tokenValidation";
import { getSalesReport, getSalesReportByCategory, getStockReport, getTopProduct } from "../controllers/report.controller";

const reportRouter = Router();

reportRouter.get('/stock', validateToken, validateAdmin, getStockReport);
reportRouter.get('/sales', validateToken, validateAdmin, getSalesReport);
reportRouter.get('/sales/category', validateToken, validateAdmin, getSalesReportByCategory);
reportRouter.get('/sales/top-product', validateToken, validateAdmin, getTopProduct);

export { reportRouter };