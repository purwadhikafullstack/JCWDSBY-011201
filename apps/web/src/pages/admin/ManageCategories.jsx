import { useEffect, useState, useRef } from 'react';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import { IoMdAdd } from "react-icons/io";
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
import { handleAddCategory, handleDeleteCategory, handleEditButton, handleEditCategory, onCloseModal, validationFormCategory } from '../../helpers/dashboard/manageCategory';
import { onPageChange } from '../../helpers/pagination';
import ModalConfirm from '../../components/modal/ModalConfirm';

const ManageCategories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState({ add: false, edit: false, delete: false });
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
  const queryParam = { limit: 4, page: searchParams.get('page') }

  useEffect(() => {
    getCategory(setCategory, setIsLoading, setTotalPage, queryParam);
  }, [searchParams.get('page'), setCategory]);

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

  const handleConfirmButton = () => {
    if (showConfirm.add) return handleAddCategory(categoryName, setError, file, setOpenModal, setShowConfirm, setCategoryName, setFile, getCategory, setCategory, setIsLoading, setTotalPage, queryParam);
    if (showConfirm.edit) return handleEditCategory(categoryName, setError, file, setOpenModal, setShowConfirm, setCategoryName, setFile, getCategory, setCategory, setIsLoading, setTotalPage, queryParam, prevCategoryName, categoryId, setOnEdit);
    if (showConfirm.delete) return handleDeleteCategory(categoryId, getCategory, setCategory, setIsLoading, setTotalPage, queryParam, setShowConfirm, searchParams, setSearchParams);
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
            onClose={() => onCloseModal(setOpenModal, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setFile, setError, showConfirm)}
            onEdit={onEdit}
            onEditImage={() => hiddenFileInput.current.click()}
            refImage={hiddenFileInput}
            src={imageSrc}
            error={error}
            categoryName={categoryName}
            onChangeCategory={(event) => { setCategoryName(event.target.value); setError({ ...error, requiredName: false }) }}
            onChangeFile={handleOnChangeFile}
            onAdd={() => { validationFormCategory(categoryName, setError, error, file, setShowConfirm, showConfirm) }}
            onSave={() => { validationFormCategory(categoryName, setError, error, file, setShowConfirm, showConfirm, true) }}
          />
          <div className='mb-5'>
            <ManageCategoryTable
              data={category}
              onEdit={(id) => handleEditButton(id, setOnEdit, setCategoryName, setPrevCategoryName, setCategoryId, setImageSrc, setOpenModal, setIsLoading)}
              onDelete={(id) => { setCategoryId(id); setShowConfirm({ ...showConfirm, delete: true }) }}
              page={(searchParams.get('page') || 1)}
            />
          </div>
          <ResponsivePagination
            currentPage={Number(searchParams.get('page')) || 1}
            totalPages={totalPage}
            onPageChange={(page) => onPageChange(page, setSearchParams)}
          />
        </div>
        <ModalConfirm
          show={showConfirm.add || showConfirm.edit || showConfirm.delete}
          header={showConfirm.add ? 'Add Category' : showConfirm.edit ? 'Edit Category' : 'Delete Category'}
          message={showConfirm.add ? 'Are you sure want to add category?' : showConfirm.edit ? 'Are you sure want to edit category?' : 'Are you sure want to delete category?'}
          onClose={() => setShowConfirm({ add: false, edit: false, delete: false })}
          onConfirm={handleConfirmButton}
        />
      </LayoutPageAdmin>
    </LayoutDashboard>
  </>
};

export default ManageCategories;