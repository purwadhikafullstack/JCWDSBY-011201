import getStockReportService from "../services/report/getStockReport.service";
import resTemplate from "../helper/resTemplate";

export const getStockReport = async (req, res, next) => {
    try {
        let params = {
            query: req.query.q ?? '',
            sort: req.query.sort ?? 'none',
            page: req.query.page ?? 1,
            limit: req.query.limit ?? 5,
            storeUUID: req.query.store ?? '',
            order: [],
        };

        if(req.tokenData.role === 'admin') params.storeUUID = req.tokenData.storeUUID;

        if(params.sort === 'latest' || params.sort === 'none') params.order.push('createdAt', 'DESC');
        if(params.sort === 'earliest') params.order.push('createdAt', 'ASC');
        if (params.sort === 'nameasc') params.order.push(col('product'), 'ASC');
        if (params.sort === 'namedesc') params.order.push(col('product'), 'DESC');

        const result = await getStockReportService(params);
        
        res.status(200).json(resTemplate(200, true, 'Get All Stock Report Success', result));
    } catch (error) {
        next(error);
    }
};