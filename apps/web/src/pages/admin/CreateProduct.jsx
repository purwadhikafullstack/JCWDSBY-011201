import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import { Button, Label, Select, Spinner, Textarea, TextInput } from 'flowbite-react';
import BoxAddImage from "../../components/BoxAddImage";
import { useState, useRef, useEffect } from "react";
import { MAX_SIZE, REGEX_FILE_TYPE } from "../../constant/file";
import { MdDelete } from "react-icons/md";
import API_CALL from "../../helpers/API";

const CreateProduct = () => {
    const navigate = useNavigate();
    const hiddenFileInput = useRef(null);
    const [file, setFile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState(null);
    const [error, setError] = useState({ size: false, type: false });
    const [data, setData] = useState({
        name: null, 
        price: null,
        description: null, 
        weight: null,
        categoryId: null,
        image: null
    });

    useEffect(() => {
        getCategory();
    }, [])

    const getCategory = async () => {
        setIsLoading(true);
        const res = await API_CALL.get('category');
        if (res) {
            setIsLoading(false);
            setData({...data, categoryId: res.data[0].id})
            setCategory(res.data);
        }
    };

    const handleHelperText = () => {
        if (error.size) return <p className='text-xs text-red-500'>Size must be less than 1MB</p>;
        if (error.type) return <p className='text-xs text-red-500'>Only jpg, jpeg, png and gif are allowed</p>;
        return <p className='text-xs'>JPG, JPEG, PNG or GIF (MAX. 1MB)</p>;
    };

    const handleOnChangeFile = (event) => {
        const value = event.target.files[0];
        if (!value.type.match(REGEX_FILE_TYPE)) {
            return setError({ ...error, type: true });
        }
        if (value.size > MAX_SIZE) {
            return setError({ ...error, size: true });
        }
        // if (onEdit) {
        //     setFile(value);
        //     setImageSrc(URL.createObjectURL(value));
        //     setError({ ...error, size: false, ext: false });
        //     return;
        // }
        setError({ size: false, type: false });
        return setFile([...file, value])
    };

    const previewImage = () => {
        if (file.length > 0) {
            return file.map((image, index) => {
                return <div className='border border-black h-24 w-24 overflow-hidden rounded relative' key={index}>
                    <img src={URL.createObjectURL(image)} className='h-24 w-24 rounded object-cover ' />
                    <div className='absolute bottom-0 right-0 p-1'>
                        <MdDelete color='red' onClick={() => setFile(file.filter((item, idx) => idx !== index))} />
                    </div>
                </div>
            });
        }
    };

    const categoryOptions = () => {
        if (category) {
            return category.map((item, index) => {
                return <option key={index} value={item.id}>{item.name}</option>
            })
        }
    };

    const handleCreateButton = async () => {
        await API_CALL.post('product', { name: data.name, price: data.price, description: data.description, weight: data.weight, categoryId: data.categoryId});
    };

    return <>
        <div className='flex flex-col container bg-slate-200 min-w-[360px] h-max min-h-screen'>
            <TopBar title='Create Product' prevPage={() => navigate('/manage/product')} />
            <div className={`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isLoading ? 'fixed' : 'hidden'}`}>
                <Spinner className="w-16 h-16" />
            </div>
            {/* FORM */}
            <form className={`border border-black p-3 ${isLoading && 'hidden'}`}>
                <div className='grid gap-2 mb-3'>
                    <Label value='Product Name' />
                    <TextInput placeholder='Product Name' onChange={(e) => setData({...data, name: e.target.value})} required />
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Category' />
                    <Select onChange={(e) => setData({...data, categoryId: e.target.value})} required >
                        {categoryOptions()}
                    </Select>
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Weight' />
                    <TextInput type='number' placeholder='100g' onChange={(e) => setData({...data, weight: e.target.value})} />
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Price' />
                    <TextInput type='number' placeholder='Rp.10.000' onChange={(e) => setData({...data, price: e.target.value})} required />
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label value='Description' />
                    <Textarea placeholder='Description' rows={4} onChange={(e) => setData({...data, description: e.target.value})} />
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
                    <Button color='blue' onClick={() => console.log('DATA PRODUCT >>>',data)}>Create</Button>
                    <Button color='failure' onClick={() => navigate('/manage/product')}>Cancel</Button>
                </div>
            </form>
        </div>
    </>
};

export default CreateProduct;