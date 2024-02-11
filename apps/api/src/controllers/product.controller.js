import { createProductService, deleteProductService, getProductDetailService, getProductService, updateProductService } from "../services/product/product.service";
import resTemplate from "../helper/resTemplate";

export const getProduct = async (req, res, next) => {
  try {
    const result = await getProductService(req.query);
    res.status(200).json(resTemplate(200, true, 'Get Product Success', result));
  } catch (error) {
    next(error);
  }
};

export const getProductDetail = async (req, res, next) => {
  try {
    const result = await getProductDetailService(req.params.name);
    res.status(200).json(resTemplate(200, true, 'Get Product Detail Success', result));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const result = await createProductService(req.body);
    res.status(201).json(resTemplate(201, true, 'Create Product Success', result));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const result = await updateProductService(req.params.id, req.body);
    res.status(201).json(resTemplate(201, true, 'Update Product Success'));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductService(req.params.id);
    res.status(204).json(resTemplate(204, true, 'Delete Product Success'));
  } catch (error) {
    next(error);
  }
};

// =====================================//
// export const findAllProducts = async (pointer) => {
//     return await product.findAll(pointer);
// };

// export const findOneProduct = async (pointer) => {
//   return await product.findOne(pointer);
// };

// export const createProduct = async (data) => {
//   return await product.create(data);
// };

// export const updateProduct = async (data, pointer) => {
//   return await product.update(data, pointer);
// };

// export const updateInventory = async (id, stock) => {
//   return await inventory.update(
//     stock,
//     {
//       where: { id }
//     });
// };

// export const deleteProduct = async (id) => {
//   const deleteProduct = await product.destroy({
//     where: { id }
//   })

//   if (deleteProduct) {
//     await inventory.destroy({
//       where: { productId: id }
//     });
//     const image = await productImage.findAll({
//       where: { productId: id }
//     });
//     if (image.length > 0) {
//       image.forEach(image => {
//         if (existsSync(assetsDir + image.image)) {
//           return unlink(assetsDir + image.image, (err) => {
//             if (err) throw err;
//           });
//         }
//       });
//     }
//     return await productImage.destroy({
//       where: { productId: id }
//     });
//   }
// };

// export const deleteInventory = async (id) => {
//   return await inventory.update(
//     {
//       stock: 0,
//     },
//     {
//       where: { id }
//     }
//   );
// };