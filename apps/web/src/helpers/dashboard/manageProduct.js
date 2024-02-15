import API_CALL from "../API";

export const handleRequiredField = (requiredPrice) => {
  if (requiredPrice) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
  return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
};

export const validationFormProduct = (file, data, setError, error, setRequiredField, requiredField, setIsOpen) => {
  console.log('Data Edit Product :', file);
  if (file.length === 0) return setError({ ...error, requiredFieldFile: true });
  if (!data.name) return setRequiredField({ ...requiredField, name: true });
  if (!data.weight) return setRequiredField({ ...requiredField, weight: true });
  if (!data.price) return setRequiredField({ ...requiredField, price: true });
  if (!data.description) return setRequiredField({ ...requiredField, description: true });
  setIsOpen(true);
};

export const handleEditProduct = async (setIsLoading, data, prevName, customToast, deletedImage, uploadImage, navigate) => {
  setIsLoading(true);
  const product = {
    name: data.name,
    price: parseInt(data.price),
    description: data.description,
    weight: parseInt(data.weight),
    unit: data.unit,
    categoryId: parseInt(data.categoryId)
  }

  if (prevName === data.name) {
    delete product.name;
  }

  try {
    await API_CALL.patch(`product/${data.id}`, product, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
  } catch (error) {
    setIsLoading(false);
    if (error.response.status === 304) return customToast('error', 'Product already exists');
  }
  if (deletedImage) {
    await API_CALL.delete(`product/image/${deletedImage.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
  if (uploadImage.length) {
    const formdata = new FormData();
    formdata.append('productId', data.id);
    uploadImage.forEach((image) => formdata.append(`productUpload`, image));
    await API_CALL.post('product/image', formdata, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
  navigate('/manage/product');
  setIsLoading(false);
}