import { PRODUCT_URL } from "../../config";

export const processedCartGetData = (result) => {
   return result.map((r, idx) => {
        return {
          id:r.id,
          inventoryId:r.inventoryId,
          amount:r.amount,
          checked:r.checked,
          storeId:r.inventory.storeId,
          discountId:r.inventory.discountId,
          productId:r.inventory.productId,
          stock:r.inventory.stock,
          productName:r.inventory.product.name,
          productPrice:r.inventory.product.price,
          productWeight:r.inventory.product.weight,
          imageLink: `${PRODUCT_URL}/${r.inventory.product.product_images.image}`,
        };
      });
}
