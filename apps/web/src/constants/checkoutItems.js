export const checkoutItemsFilterer = (cartItems) => {
    return cartItems
       ?.filter((item) => item.checked === 1)
       .map(
         ({
           productName,
           productPrice,
           productWeight,
           discountedPrice,
           amount,
           ...rest
         }) => ({
           name: productName,
           value: discountedPrice ?? productPrice,
           weight: productWeight,
           quantity: amount,
           ...rest,
         }),
       );
   };