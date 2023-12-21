import { Router } from "express";
import uploader from "../helper/uploader";
import { 
    getProductImage,
    createProductImage,
    updateProductImage, 
    deleteProductImage,
} from "../controllers/product-image.controller";

const productImageRouter = Router();

productImageRouter.get('/:id', async (req, res, next) => {
    try {
        const result = await getProductImage(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

productImageRouter.post('/', uploader('/product').array('productUpload', 3), async (req, res, next) => {
    try {
        const result = await createProductImage(req.body.productId, req.files);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

productImageRouter.patch('/:id', uploader('/product').single('productUpload'), async (req, res, next) => {
    try {
        await updateProductImage(req.params.id, req.file);
        res.status(200).json('Product image updated');
    } catch (error) {
        next(error);
    }
});

productImageRouter.delete('/:id', async (req, res, next) => {
    try {
        await deleteProductImage(req.params.id);
        res.status(200).json('Product image deleted');
    } catch (error) {
        next(error)
    }
});

export { productImageRouter };