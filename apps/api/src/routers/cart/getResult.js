import { PRODUCT_URL } from '../../config';

export const processedCartGetData = (result) => {
  return result.map((r, idx) => {
    return {
      id: r.id,
      inventoryId: r.inventoryId,
      amount: r.amount,
      checked: r.checked,
      storeId: r.inventory.storeId,
      productId: r.inventory.productId,
      stock: r.inventory.stock,
      productName: r.inventory.product.name,
      productPrice: r.inventory.product.price,
      productWeight: r.inventory.product.weight,
      productUnit: r.inventory.product.unit,
      imageLink: `${PRODUCT_URL}/${r.inventory.product.product_images.image}`,
    };
  });
};
export const fuseDiscountAndItems = (itemArray, discountsArray) => {
  return itemArray.map((item) => {
    const discount = discountsArray.find(
      (discount) => discount.inventoryId === item.inventoryId,
    );
    if (discount.type === 'percentage') {
      return {
        ...item,
        discountExist: true,
        discountType:discount.type,
        discountedPrice:
          item.amount * (item.productPrice * discount.percentage),
      };
    } else if (discount.type === 'nominal') {
      return {
        ...item,
        discountExist: true,
        discountType: discount.type,
        totalDiscount: item.amount * discount.nominal,
      };
    } else if (discount.term === 'buy 1 get 1' && item.amount > 1) {
      return {
        ...item,
        discountExist: true,
        discountType: discount.term,
        totalDiscount: Math.floor(item.amount / 2) * item.productPrice,
      };
    } else {
      return {
        ...item,
        discountExist: false,
      };
    }
  });
};
