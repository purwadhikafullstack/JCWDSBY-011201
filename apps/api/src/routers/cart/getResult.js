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
      totalPrice: r.inventory.product.price * r.amount,
      productWeight: r.inventory.product.weight,
      productUnit: r.inventory.product.unit,
      imageLink: `${PRODUCT_URL}/${r.inventory.product.product_images.image}`,
    };
  });
};
export const fuseDiscountAndItems = (itemArray, discountsArray) => {
  const fusedArray = itemArray
    .map((item) => {
      const matchingDiscounts = discountsArray.filter(
        (discount) => discount.inventoryId === item.inventoryId,
      );
      if (matchingDiscounts.length > 0) {
        return matchingDiscounts.map((discount) => {
          if (discount?.term === 'buy 1 get 1') {
            return {
              ...item,
              discountId: discount.id,
              discountExist: true,
              discountTerm: discount.term,
              discountType: discount.term,
              // totalDiscount: Math.ceil(item.amount / 2) * item.productPrice,
              finalPrice: item.totalPrice,
            };
          } else if (discount?.term === 'product') {
            if (discount?.type === 'percentage') {
              return {
                ...item,
                discountId: discount.id,
                discountExist: true,
                discountPercentage: discount.percentage,
                discountType: discount.type,
                totalDiscount:
                  item.amount * (item.productPrice * discount.percentage),
                discountedPrice:
                  item.productPrice - item.productPrice * discount.percentage,
                finalPrice:
                  item.totalPrice -
                  item.amount * item.productPrice * discount.percentage,
              };
            } else if (discount?.type === 'nominal') {
              return {
                ...item,
                discountId: discount.id,
                discountExist: true,
                discountType: discount.type,
                discountNominal: discount.nominal,
                totalDiscount: item.amount * discount.nominal,
                discountedPrice: item.productPrice - discount.nominal,
                finalPrice: item.totalPrice - item.amount * discount.nominal,
              };
            }
          }
        });
      } else {
        return {
          ...item,
          discountExist: false,
          finalPrice: item.totalPrice,
        };
      }
    })
    .flat();
  const inventoryIdMap = fusedArray.reduce((acc, item) => {
    acc[item.inventoryId] = [...(acc[item.inventoryId] || []), item];
    return acc;
  }, {});
  Object.values(inventoryIdMap).map((group) => {
    if (group.length > 1) {
      const buy1Get1Item = group.find(
        (item) => item.discountTerm === 'buy 1 get 1',
      );
      if (buy1Get1Item) {
        group.map((item) => {
          if (item !== buy1Get1Item) {
            item.hasFreeItem = true;
          } else {
            item.productPrice = 0;
            item.finalPrice = 0;
            item.totalPrice = 0;
            item.totalDiscount = 0;
          }
        });
      }
    } else if (group.length == 1 && group[0].discountTerm === 'buy 1 get 1') {
      group.push({ ...group[0], hasFreeItem: true,discountId:null });
      group[0].productPrice = 0;
      group[0].finalPrice = 0;
      group[0].totalPrice = 0;
      group[0].totalDiscount = 0;
    }
  });

  // Flatten the groups back to an array
  return Object.values(inventoryIdMap).flat();
};
