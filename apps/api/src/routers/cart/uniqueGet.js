export const getResultFilterer = (array) => {
  const uniqueInventoryIds = new Set();
  const uniqueArray = array.filter((item) => {
    if (!uniqueInventoryIds.has(item.inventoryId)) {
      uniqueInventoryIds.add(item.inventoryId);
      return true;
    }
    return false;
  });
  return uniqueArray
};

// Use Array.filter to create a new array with unique inventoryIds
