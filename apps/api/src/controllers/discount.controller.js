import resTemplate from "../helper/resTemplate";
import { createDiscountService, deleteDiscountService, getDiscountService } from "../services/discount/discount.service";

export const createDiscount = async (req, res, next) => {
    try {
        if(req.tokenData.role === 'admin') req.body.storeId = req.tokenData.storeId

        const result = await createDiscountService(req.body)

        return res.status(201).json(resTemplate(201, true, 'Discount created successfully', result));
    } catch (error) {
        if(error.message === 'Validation error') return next({ rc: 409, message: error.message, stack: error.stack});
        next(error);
    }
};

export const getDiscount = async (req, res, next) => {
    try {
        const result = await getDiscountService(req.query);

        return res.status(200).json(resTemplate(201, true, 'Get discount success', result));
    } catch (error) {
        next(error);
    }
};

export const deleteDiscount = async (req, res, next) => {
    try {
        await deleteDiscountService(req.params.id);
        
        return res.status(204).json(resTemplate(201, true, 'Discount deleted successfully'));
    } catch (error) {
        next(error);
    }
};