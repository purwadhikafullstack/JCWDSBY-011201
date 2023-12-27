import { useEffect, useState, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LayoutPageAdmin from '../../components/LayoutPageAdmin';
import BoxAddItem from '../../components/BoxAddItem';
import CardCategory from '../../components/CardCategory';
import API_CALL from '../../helpers/API';
import ModalCategory from '../../components/ModalCategory';
import { MAX_SIZE, REGEX_FILE_TYPE } from '../../constant/file';
import { Spinner } from 'flowbite-react';

const ManageCategories = () => {
    const [openModal, setOpenModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState({ size: false, requiredName: false, requiredFile: false, ext: false });
    const [category, setCategory] = useState(null);
    const [onEdit, setOnEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const hiddenFileInput = useRef(null);

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {
        setIsLoading(true);
        const res = await API_CALL.get('category');
        if(res){
            setIsLoading(false);
            setCategory(res.data);
        }
    };

    const onCloseModal = () => {
        setOpenModal(false);
        setOnEdit(false);
        setCategoryName('');
        setCategoryId(null);
        setFile(null);
        setError({ size: false, requiredName: false, requiredFile: false, ext: false });
    };

    const handleSaveButton = async () => {
        if (!categoryName) {
            setError({ ...error, requiredName: true });
            return;
        }
        if (file) {
            if (file.size > MAX_SIZE) {
                setError({ ...error, size: true });
                return;
            }
            if (!file.type.match(REGEX_FILE_TYPE)) {
                setError({ ...error, ext: true });
                return;
            }
            const formData = new FormData();
            formData.append('name', categoryName);
            formData.append('categoryUpload', file);
            await API_CALL.patch('category/' + categoryId, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        await API_CALL.patch('category/' + categoryId, { name: categoryName });
        setOpenModal(false);
        setCategoryName('');
        setFile(null);
        setError({ ...error, size: false, requiredName: false, ext: false });
        getCategory();
    };

    const handleAddButton = async () => {
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
            await API_CALL.post('category', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
            return setError({ ...error, requiredFile: true });
        }
        setOpenModal(false);
        setCategoryName('');
        setFile(null);
        setError({ size: false, requiredName: false, requiredFile: false, ext: false });
        getCategory();
    };

    const handleDeleteButton = async (id) => {
        await API_CALL.delete(`category/${id}`);
        getCategory();
    };

    const handleEditButton = async (id) => {
        const res = await API_CALL.get(`category/${id}`);
        if (res) {
            setOnEdit(true);
            setCategoryName(res.data.name);
            setCategoryId(res.data.id);
            setImageSrc(res.data.image ? `${import.meta.env.VITE_IMG_URL}/category/${res.data.image}` : '/defaultImage.jpg');
            setOpenModal(true);
        }
    };

    const handleOnChangeFile = (event) => {
        const value = event.target.files[0];
        if (!value.type.match(REGEX_FILE_TYPE)) {
            return setError({ ...error, ext: true });
        }
        if (value.size > MAX_SIZE) {
            return setError({ ...error, size: true });
        }
        if (onEdit) {
            setFile(value);
            setImageSrc(URL.createObjectURL(value));
            setError({ ...error, size: false, ext: false });
            return;
        }
        setError({ ...error, size: false, ext: false });
        setFile(value)
    };

    return <>
        <div className='flex flex-row container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <AdminSidebar />
            <LayoutPageAdmin title='Manage Categories'>
                <div className={`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isLoading ? 'fixed' : 'hidden'}`}>
                    <Spinner className="w-16 h-16" />
                </div>
                <div className='flex flex-wrap justify-between gap-y-5'>
                    <BoxAddItem title='Add Category' onClick={() => setOpenModal(true)} />
                    <ModalCategory
                        show={openModal}
                        onClose={onCloseModal}
                        onEdit={onEdit}
                        onEditImage={() => hiddenFileInput.current.click()}
                        refImage={hiddenFileInput}
                        src={imageSrc}
                        errorRequiredName={error.requiredName}
                        errorRequiredFile={error.requiredFile}
                        errorSize={error.size}
                        errorExt={error.ext}
                        categoryName={categoryName}
                        onChangeCategory={(event) => setCategoryName(event.target.value)}
                        onChangeFile={handleOnChangeFile}
                        onAdd={handleAddButton}
                        onSave={handleSaveButton}
                    />
                    {category && category.map((item, index) => {
                        return (
                            <CardCategory
                                key={index}
                                src={item.image ? `${import.meta.env.VITE_IMG_URL}/category/${item.image}` : '/defaultImage.jpg'}
                                name={item.name}
                                onEdit={() => handleEditButton(item.id)}
                                onDelete={() => handleDeleteButton(item.id)}
                            />
                        )
                    })}
                </div>
            </LayoutPageAdmin>
        </div>
    </>
};

export default ManageCategories;