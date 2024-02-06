import { useEffect, useState, useRef } from 'react';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { IoMdAdd } from "react-icons/io";
import API_CALL from '../../helpers/API';
import ModalCategory from '../../components/modal/ModalCategory';
import { MAX_SIZE, REGEX_FILE_TYPE } from '../../constants/file';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useSelector } from 'react-redux';
import LayoutDashboard from '../../components/LayoutDashboard';
import { Button } from 'flowbite-react';
import { customButton } from '../../helpers/flowbiteCustomTheme';
import ManageCategoryTable from '../../components/table/ManageCategoryTable';
import { getCategory } from '../../helpers/queryData';
import ResponsivePagination from '../../components/ResponsivePagination';
import { useSearchParams } from 'react-router-dom';
import { handleAddButton, handleDeleteButton, handleEditButton, onCloseModal } from '../../helpers/dashboard/manageCategory';

const ManageCategories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [prevCategoryName, setPrevCategoryName] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState({ size: false, requiredName: false, requiredFile: false, ext: false, duplicate: false });
  const [category, setCategory] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hiddenFileInput = useRef(null);
  const currentUserRole = useSelector((reducer) => reducer.userReducer.role);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState(1);
  const queryParam = { 
    limit: 4, 
    page: searchParams.get('page') 
  }

  useEffect(() => {
    getCategory(setCategory, setIsLoading, setTotalPage, queryParam);
  }, [searchParams.get('page'), setCategory]);

  const onPageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
  };

  const handleSaveButton = async () => {
    try {
      if (!categoryName) {
        setError({ ...error, requiredName: true });
        return;
      }
      if (file) {
        if (file.size > MAX_SIZE) {
          setError({ ...error, size: true, ext: false });
          return;
        }
        if (!file.type.match(REGEX_FILE_TYPE)) {
          setError({ ...error, ext: true, size: false });
          return;
        }
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
      setOpenModal(false);
      setCategoryName('');
      setFile(null);
      setError({ ...error, size: false, requiredName: false, ext: false, duplicate: false });
      getCategory(setCategory, setIsLoading, setTotalPage, queryParam);
    } catch (error) {
      if (error.response.status === 409) {
        return setError({ ...error, duplicate: true });
      }
    }

  };

  const handleOnChangeFile = (event) => {
    const value = event.target.files[0];
    if (!value.type.match(REGEX_FILE_TYPE)) {
      return setError({ ...error, ext: true, size: false });
    }
    if (value.size > MAX_SIZE) {
      return setError({ ...error, size: true, ext: false });
    }
    if (onEdit) {
      setFile(value);
      setImageSrc(URL.createObjectURL(value));
      setError({ ...error, size: false, ext: false });
      return;
    }
    setError({ ...error, size: false, ext: false, requiredFile: false });
    setFile(value)
  };

  return <>
    <LayoutDashboard>
      <LoadingSpinner size={16} isLoading={isLoading} />
      <LayoutPageAdmin title='Manage Categories'>
        <div className='my-5'>
          {currentUserRole === 'super' && <Button theme={customButton} size={'responsive'} color='secondary' onClick={() => setOpenModal(true)}> <IoMdAdd className='mr-1 w-4 h-4' /> Add Category</Button>}
        </div>
        <div className='grid grid-cols-1 mb-24'>
          <ModalCategory
            show={openModal}
            onClose={() => onCloseModal(setOpenModal, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setFile, setError)}
            onEdit={onEdit}
            onEditImage={() => hiddenFileInput.current.click()}
            refImage={hiddenFileInput}
            src={imageSrc}
            errorRequiredName={error.requiredName}
            errorRequiredFile={error.requiredFile}
            errorSize={error.size}
            errorExt={error.ext}
            errorDuplicate={error.duplicate}
            categoryName={categoryName}
            onChangeCategory={(event) => { setCategoryName(event.target.value); setError({ ...error, requiredName: false }) }}
            onChangeFile={handleOnChangeFile}
            onAdd={() => handleAddButton(categoryName, setError, error, file, MAX_SIZE, REGEX_FILE_TYPE, setOpenModal, setCategoryName, setFile, getCategory, setCategory, setIsLoading, setTotalPage, queryParam)}
            onSave={handleSaveButton}
          />
          <div className='mb-5'>
            <ManageCategoryTable
              data={category}
              onEdit={(id) => handleEditButton(id, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setImageSrc, setOpenModal)}
              onDelete={(id) => handleDeleteButton(id, getCategory, setCategory, setIsLoading, setTotalPage, queryParam)}
            />
          </div>
          <ResponsivePagination
            currentPage={Number(searchParams.get('page')) || 1}
            totalPages={totalPage}
            onPageChange={onPageChange}
          />
        </div>
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default ManageCategories;