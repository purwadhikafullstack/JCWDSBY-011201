import { IMG_URL_CATEGORY } from "../../constants/imageURL";
import API_CALL from "../API";

export const onCloseModal = (setOpenModal, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setFile, setError) => {
  setOpenModal(false);
  setOnEdit(false);
  setCategoryName('');
  setPrevCategoryName('');
  setCategoryId(null);
  setFile(null);
  setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
};

export const handleEditButton = async (id, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setImageSrc, setOpenModal) => {
  const res = await API_CALL.get(`category/${id}`);
  if (res) {
    setOnEdit(true);
    setCategoryName(res.data.result.name);
    setPrevCategoryName(res.data.result.name);
    setCategoryId(res.data.result.id);
    setImageSrc(res.data.result.image ? IMG_URL_CATEGORY + res.data.result.image : '/defaultImage.jpg');
    setOpenModal(true);
  }
};

export const handleDeleteButton = async (id, getCategory, setCategory, setIsLoading, setTotalPage, queryParams) => {
  await API_CALL.delete(`category/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    }
  });
  getCategory(setCategory, setIsLoading, setTotalPage, queryParams);
};

export const handleAddButton = async (categoryName, setError, error, file, MAX_SIZE, REGEX_FILE_TYPE, setOpenModal, setCategoryName, setFile, getCategory, setCategory, setIsLoading, setTotalPage, queryParams) => {
  try {
    if (categoryName === '') {
      return setError({ ...error, requiredName: true });
    }
    if (file) {
      if (file.size > MAX_SIZE) {
        return setError({ ...error, size: true, requiredName: false });
      }
      if (!file.type.match(REGEX_FILE_TYPE)) {
        return setError({ ...error, ext: true, requiredName: false });
      }
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('categoryUpload', file);
      await API_CALL.post('category', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      return setError({ ...error, requiredFile: true });
    }
    setOpenModal(false);
    setCategoryName('');
    setFile(null);
    setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
    getCategory(setCategory, setIsLoading, setTotalPage, queryParams);
  } catch (error) {
    if (error.response.status === 409) {
      return setError({ ...error, duplicate: true, requiredName: false });
    }
  }
};