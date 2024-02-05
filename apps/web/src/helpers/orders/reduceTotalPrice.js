export const reduceTotalPrice = (order) => {
  return order?.items.reduce(
    (total, items) => total + items.price * items.amount,
    0,
  );
};
