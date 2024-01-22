import LoadingSpinner from "../../components/LoadingSpinner";
import TopBar from "../../components/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import API_CALL from "../../helpers/API";
import { MdDelete } from "react-icons/md";
import BoxAddImage from "../../components/BoxAddImage";
import { MAX_SIZE, REGEX_FILE_TYPE } from "../../constants/file";
import { IMG_URL_PRODUCT } from "../../constants/imageURL";
import { toast } from "react-toastify";
import { customTextInputTheme } from "../../constants/flowbiteCustomTheme";

const EditProduct = () => {
    const navigate = useNavigate();
    const hiddenFileInput = useRef(null);
    const params = useParams();
    const [file, setFile] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ size: false, type: false, requiredFieldFile: false });
    const [requiredField, setRequiredField] = useState({ name: false, weight: false, price: false, description: false });
    const [deletedImage, setDeletedImage] = useState(null);
    const [uploadImage, setUploadImage] = useState([]);
    const [prevName, setPrevName] = useState('');
    const [data, setData] = useState({
        id: null,
        name: '',
        price: '',
        description: '',
        weight: '',
        unit: '',
        categoryId: '',
        image: null
    });

    useEffect(() => {
        getCategory();
        getProduct(params.name);
    }, [])

    const getCategory = async () => {
        setIsLoading(true);
        const res = await API_CALL.get('category');
        if (res) {
            setIsLoading(false);
            setCategory(res.data);
        }
    };

    const getProduct = async (name) => {
        setIsLoading(true);
        const res = await API_CALL.get(`product/${name}`);
        if (res) {
            const productData = res.data.result;
            setIsLoading(false);
            setPrevName(productData.name);
            setData({ ...data, id: productData.id, name: productData.name, price: productData.price, description: productData.description, weight: productData.weight, unit: productData.unit, categoryId: productData.category.id });
            setFile(productData.product_images);
        }
    }

    const categoryOptions = () => {
        if (category) {
            return category.map((item, index) => {
                return <option key={index} value={item.id}>{item.name}</option>
            })
        }
    };

    const handleHelperText = () => {
        if (error.size) return <p className='text-xs text-red-500'>Size must be less than 1MB</p>;
        if (error.type) return <p className='text-xs text-red-500'>Only jpg, jpeg, png and gif are allowed</p>;
        if (error.requiredFieldFile) return <p className='text-xs text-red-500'>Image is requiredField</p>;
        return <p className='text-xs'>JPG, JPEG, PNG or GIF (MAX. 1MB)</p>;
    };

    const handleOnChangeFile = (event) => {
        if (event) {
            const value = event.target.files[0];
            if (!value.type.match(REGEX_FILE_TYPE)) {
                return setError({ ...error, type: true, size: false });
            }
            if (value.size > MAX_SIZE) {
                return setError({ ...error, size: true, type: false });
            }
            setError({ size: false, type: false, requiredFieldFile: false });
            setUploadImage([...uploadImage, value])
            return setFile([...file, value])
        }
    };

    const previewImage = () => {
        if (file.length > 0) {
            return file.map((image, index) => {
                if (image.id) {
                    return <div className='border border-black h-24 w-24 overflow-hidden rounded relative' key={index}>
                        <img src={IMG_URL_PRODUCT + image.image} className='h-24 w-24 rounded object-cover' />
                        <div className='absolute bottom-0 right-0 p-1'>
                            <MdDelete color='red' onClick={() => { setDeletedImage(image); setFile(file.filter((item, idx) => idx !== index)) }} />
                        </div>
                    </div>
                }
                if (image.type) {
                    return <div className='border border-black h-24 w-24 overflow-hidden rounded relative' key={index}>
                        <img src={URL.createObjectURL(image)} className='h-24 w-24 rounded object-cover' />
                        <div className='absolute bottom-0 right-0 p-1'>
                            <MdDelete color='red' onClick={() => setFile(file.filter((item, idx) => idx !== index))} />
                        </div>
                    </div>
                }
            })
        }
    }

    const handleSaveButton = async () => {
        if (file.length === 0) return setError({ ...error, requiredFieldFile: true });
        if (!data.name) return setRequiredField({ ...requiredField, name: true });
        if (!data.weight) return setRequiredField({ ...requiredField, weight: true });
        if (!data.price) return setRequiredField({ ...requiredField, price: true });
        if (!data.description) return setRequiredField({ ...requiredField, description: true });
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
            if (error.response.status === 304) return toast.error('Product already exists', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (deletedImage) {
            await API_CALL.delete(`product/image/${deletedImage.id}`);
        }
        if (uploadImage.length) {
            const formdata = new FormData();
            formdata.append('productId', data.id);
            uploadImage.forEach((image) => formdata.append(`productUpload`, image));
            await API_CALL.post('product/image', formdata);
        }
        navigate('/manage/product');

        setIsLoading(false);
    }

    return <>
        <div className='flex flex-col container bg-blue-100 min-w-[360px] h-max min-h-screen'>
            <TopBar title='Edit Product' prevPage={() => navigate('/manage/product')} />
            <LoadingSpinner size={16} isLoading={isLoading} />
            <form className={`p-3 ${isLoading && 'hidden'}`}>
                <div className='grid gap-2 mb-3'>
                    <Label value='Product Name' />
                    <TextInput placeholder='Product Name' value={data.name} onChange={(e) => { setData({ ...data, name: e.target.value }); setRequiredField({ ...requiredField, name: false }) }} color={requiredField.name && 'failure'} helperText={requiredField.name && 'Name is required'} required />
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Category' />
                    <Select value={data.categoryId} onChange={(e) => setData({ ...data, categoryId: e.target.value })} required >
                        {categoryOptions()}
                    </Select>
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Weight' />
                    {/* <TextInput type='number' value={data.weight} placeholder='100g' onChange={(e) => { setData({ ...data, weight: e.target.value }); setRequiredField({ ...requiredField, weight: false }) }} color={requiredField.weight && 'failure'} helperText={requiredField.weight && 'Weight is required'} required /> */}
                    <div className='flex disabled:cursor-not-allowed disabled:opacity-50 ' >
                        <div>
                            <TextInput theme={customTextInputTheme} type='number' value={data.weight} placeholder='100g' onChange={(e) => { setData({ ...data, weight: e.target.value }); setRequiredField({ ...requiredField, weight: false }) }} color={requiredField.weight && 'failure'} helperText={requiredField.weight && 'Weight is required'} required />
                        </div>
                        <div>
                            <select className='border rounded-r-lg bg-gray-400 p-2.5' value={data.unit} onChange={(e) => setData({ ...data, unit: e.target.value })}>
                                <option value={'g'}>g</option>
                                <option value={'ml'}>ml</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Price' />
                    <TextInput type='number' value={data.price} placeholder='Rp.10.000' onChange={(e) => { setData({ ...data, price: e.target.value }); setRequiredField({ ...requiredField, price: false }) }} color={requiredField.price && 'failure'} helperText={requiredField.price && 'Price is required'} required />
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Description' />
                    <Textarea placeholder='Description' value={data.description} className='p-2' rows={4} onChange={(e) => {setData({ ...data, description: e.target.value }); setRequiredField({...requiredField, description: false}) }} color={requiredField.description && 'failure'} helperText={requiredField.description && 'Description is required'} required />
                </div>
                {/* IMAGE */}
                <div className='grid gap-2 mb-3'>
                    <Label value='Images' />
                    <div className='flex-wrap flex gap-8'>
                        <BoxAddImage
                            refImage={hiddenFileInput}
                            onChangeImage={handleOnChangeFile}
                            onClick={() => hiddenFileInput.current.click()}
                            isHidden={file.length === 3}
                        />
                        {previewImage()}
                    </div>
                    {handleHelperText()}
                </div>
                <div className='mt-10 flex gap-16 justify-center'>
                    <Button color='blue' onClick={handleSaveButton}>Save</Button>
                    <Button color='failure' onClick={() => navigate('/manage/product')}>Cancel</Button>
                </div>
            </form>
        </div>
    </>
}

export default EditProduct;