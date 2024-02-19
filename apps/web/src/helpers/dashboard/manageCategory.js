import { IMG_URL_CATEGORY } from "../../constants/imageURL";
import API_CALL from "../API";
import { MAX_SIZE, REGEX_FILE_TYPE } from '../../constants/file';
import customToast from "../../utils/toast";

export const onCloseModal = (setOpenModal, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setFile, setError, showConfirm) => {
  if (!showConfirm.add && !showConfirm.edit && !showConfirm.delete) {
    setOpenModal(false);
    setOnEdit(false);
    setCategoryName('');
    setPrevCategoryName('');
    setCategoryId(null);
    setFile(null);
    setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
  }
};

export const handleEditButton = async (id, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setImageSrc, setOpenModal, setIsLoading) => {
  setIsLoading(true);
  const res = await API_CALL.get(`category/${id}`);
  if (res) {
    setOnEdit(true);
    setCategoryName(res.data.result.name);
    setPrevCategoryName(res.data.result.name);
    setCategoryId(res.data.result.id);
    setImageSrc(res.data.result.image ? IMG_URL_CATEGORY + res.data.result.image : '/defaultImage.jpg');
    setOpenModal(true);
    setIsLoading(false);
  }
  setIsLoading(false);
};

export const handleDeleteCategory = async (id, getCategory, setCategory, setIsLoading, setTotalPage, queryParams, setShowConfirm, searchParams, setSearchParams) => {
  setShowConfirm({ add: false, edit: false, delete: false });
  await API_CALL.delete(`category/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    }
  });
  getCategory(setCategory, setIsLoading, setTotalPage, queryParams);
  searchParams.set('page', 1);
  setSearchParams(searchParams);
};

export const handleAddCategory = async (categoryName, setError, file, setOpenModal, setShowConfirm, setCategoryName, setFile, getCategory, setCategory, setIsLoading, setTotalPage, queryParams) => {
  try {
    setIsLoading(true);
    setShowConfirm({ add: false, edit: false, delete: false });
    setOpenModal(false);
    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('categoryUpload', file);
    await API_CALL.post('category', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    setCategoryName('');
    setFile(null);
    setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
    getCategory(setCategory, setIsLoading, setTotalPage, queryParams);
    setIsLoading(false);
  } catch (error) {
    if (error.response.status === 409) {
      setCategoryName('');
      setFile(null);
      setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
      setIsLoading(false);
      return customToast('error', 'Category Already Exist!')
    }
  }
};

export const handleEditCategory = async (categoryName, setError, file, setOpenModal, setShowConfirm, setCategoryName, setFile, getCategory, setCategory, setIsLoading, setTotalPage, queryParams, prevCategoryName, categoryId, setOnEdit) => {
  try {
    setIsLoading(true);
    setOpenModal(false);
    setOnEdit(false);
    setShowConfirm({ add: false, edit: false, delete: false });
    if (file) {
      if (prevCategoryName == categoryName) {
        const formData = new FormData();
        formData.append('categoryUpload', file);
        await API_CALL.patch('category/' + categoryId, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('categoryUpload', file);
        await API_CALL.patch('category/' + categoryId, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
    } else {
      await API_CALL.patch('category/' + categoryId, { name: categoryName }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    setCategoryName('');
    setFile(null);
    setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
    getCategory(setCategory, setIsLoading, setTotalPage, queryParams);
    setIsLoading(false);
  } catch (error) {
    if (error.response.status === 409) {
      setCategoryName('');
      setFile(null);
      setError({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
      setIsLoading(false);
      return customToast('error', 'Category Already Exist!')
    }
  }
};

export const validationFormCategory = (categoryName, setError, error, file, setShowConfirm, showConfirm, isEdit) => {
  if (categoryName === '') return setError({ ...error, requiredName: true });
  if (!file && !isEdit) return setError({ ...error, requiredFile: true });
  if (file && file?.size > MAX_SIZE) return setError({ ...error, size: true, requiredName: false });
  if (file && !file?.type.match(REGEX_FILE_TYPE)) return setError({ ...error, ext: true, requiredName: false });
  if (isEdit) return setShowConfirm({ ...showConfirm, edit: true })
  setShowConfirm({ ...showConfirm, add: true })
};