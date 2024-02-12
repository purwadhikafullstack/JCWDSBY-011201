export const discountPrice = (data) => {
  // console.log(data);
  if (data?.discounts.length) {
    if (data.discounts.find((val) => val.term === 'product')) {
      if (data.discounts.find((val) => val.type === 'nominal')) return data.productPrice - data.discounts[0].nominal;
      if (data.discounts.find((val) => val.type === 'percentage')) return data.productPrice - data.productPrice * data.discounts[0].percentage;
    }
  }
  return false
};

export const promo = (data) => {
  if (data?.discounts.length) {
    if (data.discounts.find((val) => val.term === 'buy 1 get 1')) return true
    // if (data.discounts.find((val) => val.term === 'buy 1 get 1')) return true
  }
  return false
};

